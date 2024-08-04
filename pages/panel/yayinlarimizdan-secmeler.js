import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper,Pagination, Table, TableBody, TableCell,Tooltip ,TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, Checkbox, FormControlLabel, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PdfViewer from '../../compenent/PdfViewer';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {API_ROUTES} from "../../utils/constants"




export default function YayinlarimizdanSecmeler() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({
      baslik: '',
      kapakFotografi: null,
      pdfDosya: null,
      ozet:'',
      durum: true
    });
    const [selectedRows, setSelectedRows] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [deleteError, setDeleteError] = useState('');
    const [uyariMesaji, setUyariMesaji] = useState("");
    const [uyariMesajiEkle, setUyariMesajiEkle] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [warningDialogOpen, setWarningDialogOpen] = useState(false);


    const user = useSelector((state) => state.user);
    const router = useRouter();

    
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [showPdfViewerEkle, setShowPdfViewerEkle] = useState(false);

    const handleClick = () => {
      
      if (selectedItem.pdf_dosya && typeof selectedItem.pdf_dosya === 'string' && selectedItem.pdf_dosya.startsWith('http')) {
        window.open(selectedItem.pdf_dosya);
      } else {

        setShowPdfViewer(true);
      }
      
    };

    

    const getData = async () => {
      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.YAYINLARIMIZDAN_SECMELER_PAGINATIONS.replace("currentPage",currentPage))
        setData(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (error) {
        setHasError(true);
        // Opsiyonel: Hata detaylarını loglayabilir veya kullanıcıya gösterebilirsiniz.
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
        setNewItem({
          baslik: '',
          kapakFotografi: null,
          pdfDosya: null,
          ozet:'',
          durum: true
        }); // newItem durumunu sıfırla
        setUyariMesajiEkle("");
        setSaveError(""); 
      };
      
      const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
        setSaveError("")
        setUyariMesaji("");
      };
    
    
    
      const handleSave = (editedItem) => {
  
        if (!editedItem.baslik || !editedItem.kapak_fotografi || !editedItem.pdf_dosya || !editedItem.ozet ) {
          setUyariMesaji("Lütfen tüm alanları doldurunuz.");
          return;
        }
        setUyariMesaji("");

        const formData = new FormData();

        // Kapak fotoğrafı için orijinal dosyayı kullan
        if (editedItem["kapak_fotografi_file"]) {
          formData.append('kapak_fotografi', editedItem["kapak_fotografi_file"]);
        }

        if (typeof editedItem["pdf_dosya"] === "object") {
          formData.append("pdf_dosya", editedItem["pdf_dosya"]);
        }

        formData.append("ozet", editedItem["ozet"]);
        formData.append("durum", editedItem["durum"]);
        formData.append("baslik", editedItem["baslik"]);

        // PDF dosyası
        
        setIsSaving(true);
        axios.put(API_ROUTES.YAYINLARIMIZDAN_SECMELER_DETAIL.replace("id",editedItem.id), formData)
          .then(response => {
            const updatedData = data.map(item => item.id === editedItem.id ? response.data : item);
            setData(updatedData);
            handleClose();
            setSaveError("");  // Hata mesajını temizle
          })
          .catch(error => {
            console.error('Güncelleme sırasında hata oluştu:', error);
            setSaveError("Veri güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.");  // Hata mesajını ayarla
          })
          .finally(() => {
            setIsSaving(false); // İşlem tamamlandığında veya hata oluştuğunda
          });
      };
    
    
    
    
      const handleAddNewItem = () => {

        if (!newItem.baslik || !newItem.kapakFotografi || !newItem.pdfDosya || !newItem.ozet) {
          setUyariMesajiEkle("Lütfen tüm alanları doldurunuz.");
          return;
        }
        setUyariMesajiEkle("");

        const formData = new FormData();
        formData.append('kapak_fotografi', newItem["kapakFotografi_file"]);
        formData.append("durum", newItem["durum"]);
        formData.append("baslik", newItem["baslik"]);
        formData.append("pdf_dosya", newItem["pdfDosya"]);
        formData.append("ozet", newItem["ozet"]);

        setIsSaving(true); 
        axios.post(API_ROUTES.YAYINLARIMIZDAN_SECMELER, formData)
          .then(response => {
            // Mevcut sayfayı yeniden yüklüyoru
            return axios.get(API_ROUTES.YAYINLARIMIZDAN_SECMELER_PAGINATIONS.replace("currentPage",currentPage))
          })
          .then(response => {
            setData(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
      
            
            
            handleCloseAddDialog();

            
          })
          .catch(error => {
            console.error('Yeni veri eklerken hata oluştu:', error);
            setSaveError("Yeni veri eklemesi sırasında bir hata meydana geldi. Lütfen işleminizi tekrar gerçekleştirmeyi deneyiniz."); 
          })
          .finally(() => {
            setIsSaving(false); // İşlem tamamlandığında veya hata oluştuğunda
          })
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

    const handleCloseWarningDialog = () => {
      setWarningDialogOpen(false);
    };


    const handleOpenDeleteConfirm = () => {
      const ids = Object.keys(selectedRows).filter(id => selectedRows[id]);
      if (ids.length === 0) {
        // Hiçbir öğe seçilmemişse uyarı diyalogunu aç
        setWarningDialogOpen(true);
      } else {
        // Seçili öğeler varsa onay penceresini aç
        setSelectedIds(ids);
        setDeleteConfirmOpen(true);
      }
    };
  
    const handleCloseDeleteConfirm = () => {
      setDeleteConfirmOpen(false);
    };



    const handleConfirmDelete = () => {
      setDeleteError('');
      axios.post(API_ROUTES.YAYINLARIMIZDAN_SECMELER_DELETE, { ids: selectedIds })
        .then(() => {
          return axios.get(API_ROUTES.YAYINLARIMIZDAN_SECMELER);
        })
        .then((response) => {
          const newTotalCount = response.data.count;
          const newTotalPages = Math.ceil(newTotalCount / 10);
          setTotalPages(newTotalPages);
    
          let updatedPage = currentPage;
          if (newTotalPages < currentPage) {
            updatedPage = newTotalPages;
          }
    
          if (newTotalPages === 0) {
            setCurrentPage(1);
            setData([]);
            setSelectedRows({});
            setDeleteConfirmOpen(false);
          } else {
            setCurrentPage(updatedPage);
            return axios.get(API_ROUTES.YAYINLARIMIZDAN_SECMELER_PAGINATIONS.replace('currentPage', updatedPage));
          }
        })
        .then((response) => {
          if (response) {
            setData(response.data.results);
          }
          setSelectedRows({});
          setDeleteConfirmOpen(false);
        })
        .catch((error) => {
          console.error('Toplu silme işlemi sırasında hata oluştu:', error);
          setDeleteError('Veriler silinirken bir hata oluştu. Lütfen tekrar deneyin.');
          setDeleteConfirmOpen(false);
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

    

    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
      
        if (file) {

          // file binary bir veri base64 ile metin tabanlı dosya haline getiriyoruz bu sayede
          // fronten tarafında bu dosyayı sunma imkanı buluyoruz.
          // binary dosya doğrudan backende gönderilebilir. oradan kaydedilip apiden çekildiğinde
          // veri tarayıcı yolu ile geldiğinden binary olsa da gösterimi mümkün.
          // bu tantana js nin çalışma prensiplerinden ötürüdür.
          // biz burada dosyayı evvele hemen backende atmadan ön yüzde göstermek istediğimizden
          // base64 e çeviririz.
          if (fieldName === "kapak_fotografi") {
            const reader = new FileReader();
            reader.onload = (e) => {
              setSelectedItem((prevItem) => ({
                ...prevItem,
                [fieldName]: e.target.result,
                [fieldName + '_file']: file,
              }));
            };
            reader.readAsDataURL(file);
            event.target.value = '';

          } else {

                

                setSelectedItem((prevItem) => ({
                    ...prevItem,
                    [fieldName]: file,
                }));

                event.target.value = '';
 
          
          }
                }
    };

      const handleRemoveImage = (fieldName) => {
        setSelectedItem((prevItem) => ({
          ...prevItem,
          [fieldName]: null,
        }));
      

      };


      const handleFileChangeEkle = (event, fieldName) => {
        const file = event.target.files[0];
        if (fieldName === "kapakFotografi") {
          const reader = new FileReader();
          reader.onload = (e) => {
            setNewItem((prevItem) => ({
              ...prevItem,
              [fieldName]: e.target.result,
              [fieldName + '_file']: file,
            }));
          };
          reader.readAsDataURL(file);
          event.target.value = '';

        } else {
          setNewItem((prevItem) => ({
                  ...prevItem,
                  [fieldName]: file,
              }));

              event.target.value = '';     
        }
      };
    
      const handleRemoveImageEkle = (fieldName) => {
        setNewItem(prevItem => ({
          ...prevItem,
          [fieldName]: null
        }));
      };

      const handleClickEkle = () =>{
        setShowPdfViewerEkle(true);
      }

      function truncateText(text, maxLength) {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
      }



    return(
        <>
             <>
             <Container maxWidth="lg" style={{ position: 'relative' }}>
        {deleteError && <div style={{ color: '#f44336', textAlign: 'center', marginBottom: '10px', fontSize: '0.75rem' }}>{deleteError}</div>}
        <Paper elevation={2} style={{ padding: '15px', overflowX: 'auto', backgroundColor: 'white' }}>
          {data.length > 0 && (
            <Button
              variant="contained"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDeleteConfirm}
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
                <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Başlık</TableCell>
                <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Kapak Fotoğrafı</TableCell>
                <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>PDF Dosya</TableCell>
                <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Özet</TableCell>
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
                  <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Tooltip title={row.baslik} placement="top">
                      <span>{truncateText(row.baslik, 40)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell style={{ fontSize: '0.75rem' }}>{row.kapak_fotografi ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                  <TableCell style={{ fontSize: '0.75rem' }}>{row.pdf_dosya ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                  <TableCell style={{ fontSize: '0.75rem' }}>{row.ozet ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                  <TableCell style={{ fontSize: '0.75rem' }}>{row.durum ? 'Aktif' : 'Pasif'}</TableCell>
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

            <TextField
                label="Başlık"
                value={selectedItem ? selectedItem.baslik : ''}
                onChange={(e) => setSelectedItem({ ...selectedItem, baslik: e.target.value })}
                fullWidth
                margin="normal"
            />
            {/* Kapak Fotoğrafı */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ border: '2px dashed grey', width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {selectedItem && selectedItem.kapak_fotografi ? (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                Kapak Fotoğrafı:
                            </Typography>
                            <img
                                src={selectedItem.kapak_fotografi}
                                alt="Kapak Fotoğrafı"
                                style={{ maxWidth: '50%', maxHeight: '100px', position: 'relative' }}
                            />
                            {/* X simgesi */}
                            <IconButton
                                style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveImage("kapak_fotografi")}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (<>
                        <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                Kapak Fotoğrafı:
                        </Typography>
                        <label htmlFor="kapak_fotografiInput">
                            <IconButton
                                style={{ fontSize: '50px', color: 'green', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                component="span"
                            >
                                <AddPhotoAlternateIcon />
                            </IconButton>
                        </label>
                        </>
                    )}
                </div>

                {/* Dosya Ekleme Input */}
                <input
                    type="file"
                    id="kapak_fotografiInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, "kapak_fotografi")}
                />
            </div>

            {/* PDF Dosyası */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ border: '2px dashed grey', width: '100%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {selectedItem && selectedItem.pdf_dosya ? (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                PDF Dosyası:
                            </Typography>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                }}
                                onClick={handleClick}
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseUp={(e) => {/* Tıklandığında olacaklar */ }}
                            >
                                <PictureAsPdfIcon
                                    style={{
                                        fontSize: '80px',
                                        color: 'red',
                                        marginRight: '5px',
                                        transition: 'color 0.2s',
                                    }}
                                    
                                />
                            </div>
                            {/* X simgesi */}
                            <IconButton
                                style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveImage("pdf_dosya")}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                        <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                PDF Dosyası:
                        </Typography>
                        <label htmlFor="pdf_dosyaInput">
                            <IconButton
                                style={{ fontSize: '50px', color: 'green', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                component="span"
                            >
                                <AddIcon />
                            </IconButton>
                        </label>
                        </>
                    )}
                </div>

                {/* Dosya Ekleme Input */}
                <input
                    type="file"
                    id="pdf_dosyaInput"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, "pdf_dosya")}
                />
            </div>


            <TextField
              label="Özet"
              multiline
              rows={6}  // Bu varsayılan satır sayısını artırır, ancak minHeight ile kombinlenmelidir.
              value={selectedItem ? selectedItem.ozet : ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, ozet: e.target.value })}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                style: {
                  minHeight: '400px', // Çerçevenin minimum yüksekliğini artırır
                },
                inputProps: {
                  style: {
                    height: '380px', // textarea'nın yüksekliğini direkt olarak ayarlar
                  }
                }
              }}
            />



            <FormControlLabel control={<Checkbox checked={selectedItem ? selectedItem.durum : false} onChange={(e) => setSelectedItem({ ...selectedItem, durum: e.target.checked })} />} label="Aktif" />
          </DialogContent>
          {saveError && <p style={{ color: 'red', marginLeft: '25px' }}>{saveError}</p>}
          {uyariMesaji && <p style={{ color: 'red', marginLeft: '25px' }}>{uyariMesaji}</p>}

          <DialogActions>
              <Button onClick={() => handleSave(selectedItem)} color="primary">
                {isSaving ? <CircularProgress size={24} /> : "Kaydet"}
              </Button>
          </DialogActions>
      </Dialog>
      {(showPdfViewer && <PdfViewer pdfDataFile={selectedItem?.pdf_dosya} setShowPdfViewer={setShowPdfViewer} showPdfViewer={showPdfViewer}  />)}
      
      


      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
      <DialogTitle>
        Yeni Ekle
        <IconButton
            onClick={handleCloseAddDialog}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
        </IconButton>

      </DialogTitle>
      <DialogContent>
        <TextField
          label="Başlık"
          value={newItem.baslik}
          onChange={(e) => setNewItem({ ...newItem, baslik: e.target.value })}
          fullWidth
          margin="normal"
        />
        <div style={{ textAlign: 'center', marginBottom: '20px',marginTop:"20px"  }}>
          <div style={{ border: '2px dashed grey', width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {!newItem.kapakFotografi ? (
            <>
             <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
               Kapak Fotoğrafı:
             </Typography>
            <label htmlFor="kapak_fotografiInput">
              <IconButton
                style={{ fontSize: '50px', color: 'green' }}
                component="span"
              >
                <AddPhotoAlternateIcon />
              </IconButton>
            </label>
            </>
          ) : (
            <>
                <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                    Kapak Fotoğrafı:
                </Typography>
                
                    <img
                        src={newItem.kapakFotografi}
                        alt="Kapak Fotoğrafı"
                        style={{ maxWidth: '50%', maxHeight: '100px', position: 'relative' }}
                    />
                    <IconButton
                        onClick={() => handleRemoveImageEkle('kapakFotografi')}
                        style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                    >
                        <CloseIcon />
                    </IconButton>
            </>

          )}
          </div>
        </div>
        <input
          type="file"
          id="kapak_fotografiInput"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileChangeEkle(e, "kapakFotografi")}
        />
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ border: '2px dashed grey', width: '100%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {!newItem.pdfDosya ? (
            <>
            <Typography variant="subtitle1"  style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                    PDF Dosyası:
            </Typography>
            <label htmlFor="pdf_dosyaInput">
              <IconButton
                style={{ fontSize: '50px', color: 'green', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                component="span"
              >
                <PictureAsPdfIcon />
              </IconButton>
            </label>
            </>
          ) : (
            <>
            <Typography variant="subtitle1"  style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                    PDF Dosyası:
            </Typography>
            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                }}
                                onClick={handleClickEkle}
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseUp={(e) => {/* Tıklandığında olacaklar */ }}
                            >
                                <PictureAsPdfIcon
                                    style={{
                                        fontSize: '80px',
                                        color: 'red',
                                        marginRight: '5px',
                                        transition: 'color 0.2s',
                                    }}

                                />
                            </div>
                            {/* X simgesi */}
                            <IconButton
                                style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveImageEkle("pdfDosya")}
                            >
                                <CloseIcon />
                            </IconButton>
            </>
          )}
        </div>
        </div>
        <input
          type="file"
          id="pdf_dosyaInput"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleFileChangeEkle(e, "pdfDosya")}
        />


        <TextField
            label="Özet"
            multiline
            rows={6} // Satır sayısını artırarak yüksekliği artırın
            value={newItem.ozet}
            onChange={(e) => setNewItem({ ...newItem, ozet: e.target.value })}
            fullWidth
            margin="normal"
              variant="outlined"
              InputProps={{
                style: {
                  minHeight: '400px', // Çerçevenin minimum yüksekliğini artırır
                },
                inputProps: {
                  style: {
                    height: '380px', // textarea'nın yüksekliğini direkt olarak ayarlar
                  }
                }
              }}
        />





        <FormControlLabel
          control={<Checkbox checked={newItem.durum || false} onChange={(e) => setNewItem({ ...newItem, durum: e.target.checked })} />}
          label="Aktif"
        />
      </DialogContent>
      {(showPdfViewerEkle && <PdfViewer pdfDataFile={newItem?.pdfDosya} setShowPdfViewer={setShowPdfViewerEkle} showPdfViewer={showPdfViewerEkle}  />)}

      {uyariMesajiEkle && <p style={{ color: 'red', marginLeft: '25px' }}>{uyariMesajiEkle}</p>}
      {saveError && <p style={{ color: 'red', marginLeft: '25px' }}>{saveError}</p>}

        <DialogActions>
          <Button onClick={handleAddNewItem} color="primary">
            {isSaving ? <CircularProgress size={24} /> : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <Typography>Seçili öğeleri silmek istediğinizden emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            İPTAL
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            SİL
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={warningDialogOpen}
        onClose={handleCloseWarningDialog}
      >
        <DialogTitle>Uyarı</DialogTitle>
        <DialogContent>
          <Typography>Silmek için önce bir öğe seçmelisiniz.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarningDialog} color="primary">
            Tamam
          </Button>
        </DialogActions>
      </Dialog>

    </>


    </>
    )
}