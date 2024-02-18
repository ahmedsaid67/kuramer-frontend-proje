import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper,Pagination, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, Checkbox, FormControlLabel, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {API_ROUTES} from "../../../utils/constants"


const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

export default function PersonelTuru() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', status: true });
  const [selectedRows, setSelectedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isNameError, setIsNameError] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const user = useSelector((state) => state.user);
  const router = useRouter();





  const getData = async () => {
    setIsLoading(true); // Veri yükleme başlamadan önce
    setHasError(false);
    try {
      const response = await axios.get(API_ROUTES.PERSONEL_TURU_PAGINATIONS.replace("currentPage",currentPage))
      setData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false); // Veri yükleme tamamlandığında veya hata oluştuğunda
    }
  }


  useEffect(() => {
    if (!user.id) {
      router.push({
        pathname: "/login",
        query: {from: router.pathname},
      });
    }else{
      getData()
    }
  }, [user,currentPage]);
  
  
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewItem({ name: '', status: true }); // newItem durumunu sıfırla
    setIsNameError(false); // Hata durumunu sıfırla
  };
  
  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSaveError("")
    setIsNameError(false); // Hata durumunu sıfırla
  };



  const handleSave = (editedItem) => {

    if (!editedItem.name.trim()) {
      setIsNameError(true);
      return;  // Eğer isim boşsa, işlemi burada sonlandır
    }
    axios.put(API_ROUTES.PERSONEL_TURU_DETAIL.replace("id",editedItem.id), editedItem)
      .then(response => {
        const updatedData = data.map(item => item.id === editedItem.id ? response.data : item);
        setData(updatedData);
        handleClose();
        setSaveError("");  // Hata mesajını temizle
      })
      .catch(error => {
        console.error('Güncelleme sırasında hata oluştu:', error);
        setSaveError("Veri güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.");  // Hata mesajını ayarla
      });
  };




  const handleAddNewItem = () => {

    if (!newItem.name.trim()) {
      setIsNameError(true);
      return;  // Eğer isim boşsa, işlemi burada sonlandır
    }
    axios.post(API_ROUTES.PERSONEL_TURU, newItem)
      .then(response => {
        // Mevcut sayfayı yeniden yüklüyoru
        return axios.get(API_ROUTES.PERSONEL_TURU_PAGINATIONS.replace("currentPage",currentPage))
      })
      .then(response => {
        setData(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
  
        
        setNewItem({ name: '', status: true });
        handleCloseAddDialog();
      })
      .catch(error => {
        console.error('Eklem sırasında hata oluştu:', error);
        setSaveError("Veri eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.");  // Hata mesajını ayarla
      });
  };
  
  
  
  const handleSelectRow = (id) => {
    setSelectedRows(prevSelectedRows => ({
      ...prevSelectedRows,
      [id]: !prevSelectedRows[id]
    }));
  };
  const handleSelectAllRows = (event) => {
    if (event.target.checked) {
      const newSelectedRows = {};
      data.forEach(row => newSelectedRows[row.id] = true);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows({});
    }
  };
  const handleDeleteSelected = () => {
    setDeleteError('');
    console.log("deleted:", selectedRows);
    const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
  
    axios.post(API_ROUTES.PERSONEL_TURU_DELETE, { ids: selectedIds })
      .then(() => axios.get(API_ROUTES.PERSONEL_TURU))
      .then(response => {
        const newTotalCount = response.data.count;
        const newTotalPages = Math.ceil(newTotalCount / 10);
        setTotalPages(newTotalPages);
  
        let updatedPage = currentPage;
        if (currentPage > newTotalPages) {
          updatedPage = Math.max(newTotalPages, 1); // Eğer yeni toplam sayfa sayısı 0 ise, 1'e ayarla
        } else if (currentPage === newTotalPages && response.data.results.length === 0 && currentPage > 1) {
          updatedPage = currentPage - 1; // Son sayfada veri kalmadıysa bir önceki sayfaya git
        }
  
        setCurrentPage(updatedPage);
  
        if (updatedPage !== currentPage) {
          return axios.get(API_ROUTES.PERSONEL_TURU_PAGINATIONS.replace("currentPage",updatedPage))
        } else {
          return response;
        }
      })
      .then(response => {
        setData(response.data.results);
        setSelectedRows({});
      })
      .catch(error => {
        console.error('Toplu silme işlemi sırasında hata oluştu:', error);
        setDeleteError('Veriler silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      });
  };


  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
      </div>
    );
  }


  if (hasError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', marginLeft:'50px' }}>
        <Typography variant="h6">Veri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz.</Typography>
        
      </div>
    );
  }
  

  
  
  

  return (
    <>
      <Container maxWidth="lg" style={{  position: 'relative' }}>
                {deleteError && <div style={{ color: '#f44336', textAlign: 'center', marginBottom: '10px', fontSize: '0.75rem' }}>{deleteError}</div>}
                <Paper elevation={2} style={{ padding: '15px', overflowX: 'auto', backgroundColor: 'white' }}>
                  {data.length > 0 && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteSelected}
                      style={{ backgroundColor: "#d32f2f", color: '#fff', marginBottom: "10px", textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      Sil
                    </Button>
                  )}
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#1976d2' }}> 
                        <TableCell padding="checkbox">
                          <Checkbox
                            onChange={handleSelectAllRows}
                            checked={Object.keys(selectedRows).length > 0 && Object.keys(selectedRows).length === data.length}
                            indeterminate={Object.keys(selectedRows).length > 0 && Object.keys(selectedRows).length < data.length}
                            size="small"
                            style={{ color: '#fff' }}  
                          />
                        </TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>İsim</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Durum</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Detaylar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map(row => (
                        <TableRow key={row.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows[row.id] || false}
                              onChange={() => handleSelectRow(row.id)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.name}</TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.status ? 'Aktif' : 'Pasif'}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<InfoIcon />}
                              onClick={() => handleOpen(row)}
                              style={{ backgroundColor: '#1976d2', color: '#fff', textTransform: 'none', fontSize: '0.75rem' }}
                            >
                              Detaylar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <Button
                      variant="contained"
                      size="small"
                      style={{ backgroundColor: '#388e3c', color: '#fff', textTransform: 'none', fontSize: '0.75rem' }}
                      onClick={handleOpenAddDialog}
                      startIcon={<AddIcon />}
                    >
                      Ekle
                    </Button>
                  </div>
                  {data.length > 0 && (
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      variant="outlined"
                      size="small"
                      style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}
                    />
                  )}
                </Paper>
              </Container>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Düzenleme
          <IconButton
            onClick={handleClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField label="İsim" value={selectedItem ? selectedItem.name : ''} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} fullWidth margin="normal" error={isNameError} helperText={isNameError ? 'İsim alanı boş bırakılamaz' : ''}  />
          <FormControlLabel control={<Checkbox checked={selectedItem ? selectedItem.status : false} onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.checked })} />} label="Durum" />
        </DialogContent>
        {saveError && <p style={{ color: 'red',marginLeft:"25px" }}>{saveError}</p>} 
        <DialogActions>
          <Button onClick={() => handleSave(selectedItem)} color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Yeni Personel Türü Ekle
          <IconButton
            onClick={handleCloseAddDialog}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          
          </DialogTitle>
        <DialogContent>
        <TextField
          label="İsim"
          value={newItem.name}
          onChange={(e) => {
            setIsNameError(false);  // Kullanıcı metni değiştirdiğinde hata durumunu sıfırla
            setNewItem({ ...newItem, name: e.target.value });
          }}
          fullWidth
          margin="normal"
          error={isNameError} // Hata durumuna göre hata göster
          helperText={isNameError ? 'İsim alanı boş bırakılamaz' : ''} // Hata mesajını göster
        />
          <FormControlLabel control={<Checkbox checked={newItem.status} onChange={(e) => setNewItem({ ...newItem, status: e.target.checked })} />} label="Durum" />
        </DialogContent>
        {saveError && <p style={{ color: 'red',marginLeft:"25px" }}>{saveError}</p>} 
        <DialogActions>
          <Button onClick={handleAddNewItem} color="primary">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
