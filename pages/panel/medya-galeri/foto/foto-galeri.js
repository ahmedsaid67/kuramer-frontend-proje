import React, { useEffect, useState,useMemo } from 'react';
import { Container, Typography, Paper,Pagination, Table,Tooltip, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, Checkbox, FormControlLabel, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { API_ROUTES } from '../../../../utils/constants';


const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  });
  
  const StyledTableRow = styled(TableRow)({
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  });

export default function FotoGaleri() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({
      baslik: '',
      kapakFotografi: null,
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
    const [fotoGaleriKategoriler, setFotoGaleriKategoriler] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [warningDialogOpen, setWarningDialogOpen] = useState(false);


    const user = useSelector((state) => state.user);
    const router = useRouter();

    const [albumImages, setAlbumImages] = useState([]);
    const [removedImageIds, setRemovedImageIds] = useState([]);
    const [createImageAlbum, setCreateImageAlbum] = useState([]);
    const imagesCount = useMemo(() => {
        return albumImages.length + (createImageAlbum ? createImageAlbum.length : 0);
    }, [albumImages, createImageAlbum]);




    const getResData = async () => {

      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.FOTO_GALERI_KATEGORI_LIST)
        setFotoGaleriKategoriler(response.data);
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
        getResData()
      }
    }, [user]);



    const getData = async () => {
      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.FOTO_GALERI_PAGINATIONS.replace("currentPage",currentPage))
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
          durum: true
        }); // newItem durumunu sıfırla
        setUyariMesajiEkle("");
        setSaveError(""); 
        setSelectedKategori("")

        setCreateImageAlbum([])
      };
      
      const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
        if(item.fotogaleri_kategori){
          setSelectedKategori(item.fotogaleri_kategori.id)
        }
        

        axios.get(API_ROUTES.ALBUM_IMAGES_KATEGORI_FILTER.replace("seciliKategori", item.id)) 
        .then(response => {
            setAlbumImages(response.data);
        })
        .catch(error => setSaveError("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz."));
  
      };
      const handleClose = () => {
        setOpen(false);
        setSaveError("")
        setUyariMesaji("");
        setSelectedKategori("")
        setRemovedImageIds([])
        setCreateImageAlbum([])
        setAlbumImages([])
      };
    
    
    
      const handleSave = async (editedItem, kategoriId) => {
        if (!editedItem.baslik || !editedItem.kapak_fotografi || !kategoriId) {
          setUyariMesaji("Lütfen tüm alanları doldurunuz.");
          return;
        }
        setUyariMesaji("");
      
        try {
          const formData = new FormData();
      
          if (editedItem["kapak_fotografi_file"]) {
            formData.append('kapak_fotografi', editedItem["kapak_fotografi_file"]);
          }
      
          formData.append("durum", editedItem["durum"]);
          formData.append("baslik", editedItem["baslik"]);
          formData.append("fotogaleri_kategori_id", kategoriId);

          setIsSaving(true);
      
          const response = await axios.put(API_ROUTES.FOTO_GALERI_DETAIL.replace("id",editedItem.id), formData)
          const updatedData = data.map(item => item.id === editedItem.id ? response.data : item);
          setData(updatedData);
      
          if (removedImageIds.length > 0) {
            const stringIds = removedImageIds.map(id => id.toString());
            await axios.post(API_ROUTES.ALBUM_IMAGES_DELETE, { ids: stringIds });
          }
      
          if (createImageAlbum.length > 0) {
            const promises = createImageAlbum.map((item) => {
              const albumFormData = new FormData();
              albumFormData.append("album_id", editedItem["id"]);
              albumFormData.append("image", item.backFile);
      
              return axios.post(API_ROUTES.ALBUM_IMAGES, albumFormData)
                         .catch(error => console.error('Resim yükleme sırasında hata oluştu:', error));
            });
      
            await Promise.all(promises);
          }
      
          handleClose(); // İşlemler tamamlandıktan sonra pencereyi kapat
        } catch (error) {
          console.error('Güncelleme sırasında hata oluştu:', error);
          setSaveError("Veri güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.");  // Hata mesajını ayarla
        }finally{
          setIsSaving(false);
        }
      };
      
      
    
    
    
    
      const handleAddNewItem = async (kategoriId) => {
        if (!newItem.baslik || !newItem.kapakFotografi || !kategoriId ) {
          setUyariMesajiEkle("Lütfen tüm alanları doldurunuz.");
          return;
        }
        setUyariMesajiEkle("");
      
        const formData = new FormData();
        formData.append('kapak_fotografi', newItem["kapakFotografi_file"]);
        formData.append("durum", newItem["durum"]);
        formData.append("baslik", newItem["baslik"]);
        formData.append("fotogaleri_kategori_id", kategoriId);

        setIsSaving(true);
      
        try {
          const fotogaleriResponse = await axios.post(API_ROUTES.FOTO_GALERI, formData);
          const newAlbumId = fotogaleriResponse.data.id;
      
          const listResponse = await axios.get(API_ROUTES.FOTO_GALERI_PAGINATIONS.replace("currentPage",currentPage))
          setData(listResponse.data.results);
          setTotalPages(Math.ceil(listResponse.data.count / 10));
      
          if (createImageAlbum.length > 0) {
            const promises = createImageAlbum.map((item) => {
              const albumFormData = new FormData();
              albumFormData.append("album_id", newAlbumId);
              albumFormData.append("image", item.backFile);
      
              return axios.post(API_ROUTES.ALBUM_IMAGES, albumFormData);
            });
      
            await Promise.all(promises);
          }
      
          handleCloseAddDialog();
        } catch (error) {
          console.error('İşlem sırasında hata oluştu:', error);
          setSaveError("Yeni veri eklemesi sırasında bir hata meydana geldi. Lütfen işleminizi tekrar gerçekleştirmeyi deneyiniz."); 
        }finally{
          setIsSaving(false);
        }
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
      axios.post(API_ROUTES.FOTO_GALERI_DELETE, { ids: selectedIds })
        .then(() => {
          return axios.get(API_ROUTES.FOTO_GALERI);
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
            return axios.get(API_ROUTES.FOTO_GALERI_PAGINATIONS.replace('currentPage', updatedPage));
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

        }
      };
    
      const handleRemoveImageEkle = (fieldName) => {
        setNewItem(prevItem => ({
          ...prevItem,
          [fieldName]: null
        }));
      };

      const imgAlbumRemove = (imageId) => {
        // Yeni dizi, seçilen ID'ye sahip olmayan tüm görselleri içerecek şekilde oluşturulur
        const updatedImages = albumImages.filter(image => image.id !== imageId);
        // albumImages state'ini güncelle
        setAlbumImages(updatedImages);
        setRemovedImageIds(prevIds => [...prevIds, imageId]);
      };


      const handleFileAlbum = (event) => {
        const file = event.target.files[0];
      
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCreateImageAlbum(prevItem => ([
                    ...prevItem,
                    {frontFile: e.target.result, backFile: file}

                    
                ]));


            };
            reader.readAsDataURL(file);
            event.target.value = '';

        } 

    };

    const imgCreateAlbumRemove = (uiIndex) => {
      // UI'da görseller ters sıralı gösteriliyorsa, gerçek index'i hesapla
      const realIndex = createImageAlbum.length - 1 - uiIndex;
    
      // Güncellenmiş album dizisini oluştur
      const updatedAlbum = createImageAlbum.filter((_, index) => index !== realIndex);
    
      // Album state'ini güncelle
      setCreateImageAlbum(updatedAlbum);
    };
    

    function truncateText(text, maxLength) {
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }




    return(
        <>
             <>
             <Container maxWidth="lg" style={{  position: 'relative' }}>
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
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Kategori Adı</TableCell>
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
                              <span>{truncateText(row.baslik, 20)}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.kapak_fotografi ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
    
                          <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Tooltip title={row.fotogaleri_kategori ? row.fotogaleri_kategori.baslik : 'Mevcut Değil'} placement="top">
                              <span>
                                {truncateText(row.fotogaleri_kategori ? row.fotogaleri_kategori.baslik : 'Mevcut Değil', 20)}
                              </span>
                            </Tooltip>
                          </TableCell>
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

            {/* Görsel Galerisi */}
            <div style={{ border: '2px dashed grey', margin: '20px 0', overflowX: 'auto', height: '300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                    Galeri:
                </Typography>
                <div style={{ 
                    display: 'flex',
                    gap: '20px', // Öğeler arasındaki boşluk
                    alignItems: 'center', 
                    paddingLeft: imagesCount <= 2 ? 0 : "40px", 
                    minWidth: imagesCount <= 2 ? 'fit-content' : '100%' 
                }}>

                    <div>
                        {/* Gizli Dosya Input */}
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e)=>handleFileAlbum(e)}
                        />

                        {/* Görsel Ekleme Butonunu Çevreleyen Stil */}
                        <div style={{ border: '2px dashed grey', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '120px', height: '150px'}}>
                            <label htmlFor="imageInput">
                            <IconButton
                                style={{ color: 'green' }} // Yeşil renkli ikon
                                component="span"
                            >
                                <AddPhotoAlternateIcon />
                            </IconButton>
                            </label>
                        </div>
                    </div>


                    {/* createImageAlbum'dan Gelen Görseller */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {createImageAlbum.length > 0 && [...createImageAlbum].reverse().map((item, index) => (
                        <div key={index} style={{ border: '2px dashed grey', padding: '5px', width: '120px', height: '150px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={item.frontFile} alt={`Albüm Görseli ${index}`} style={{ maxWidth: '100px', height: 'auto', maxHeight: '80px' }} />
                            {/* Kapatma (Silme) İkonu */}
                            <IconButton onClick={() => imgCreateAlbumRemove(index)} style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}>
                            <CloseIcon />
                            </IconButton>
                        </div>
                        ))}
                    </div>

                    {albumImages.length > 0 &&  albumImages.map(image => (
                    <div key={image.id} style={{ border: '2px dashed grey', padding: '5px', width: '120px', height: '150px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img key={image.id} src={image.image} alt={`Görsel ${image.id}`} style={{ maxWidth: '100px', height: 'auto', maxHeight: '80px' }} />
                        <IconButton onClick={()=>{imgAlbumRemove(image.id)}} style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}>
                          <CloseIcon />
                        </IconButton>
                    </div>
                    ))}
                    
                </div>
                
            </div>





            <FormControl fullWidth margin='normal'>
                <InputLabel style={{ marginBottom: '8px', marginTop: '-10px' }}>Kategori</InputLabel>
                <Select
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value)}
                >
                    {fotoGaleriKategoriler.map((kategori) => (
                    <MenuItem key={kategori.id} value={kategori.id}>
                        {kategori.baslik}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel control={<Checkbox checked={selectedItem ? selectedItem.durum : false} onChange={(e) => setSelectedItem({ ...selectedItem, durum: e.target.checked })} />} label="Aktif" />
          </DialogContent>
          {saveError && <p style={{ color: 'red', marginLeft: '25px' }}>{saveError}</p>}
          {uyariMesaji && <p style={{ color: 'red', marginLeft: '25px' }}>{uyariMesaji}</p>}

          <DialogActions>
              <Button onClick={() => handleSave(selectedItem,selectedKategori)} color="primary">
                {isSaving ? <CircularProgress size={24} /> : "Kaydet"}
              </Button>
          </DialogActions>
      </Dialog>


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



         <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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


        {/* Görsel Galerisi */}
        <div style={{ border: '2px dashed grey', margin: '20px 0', overflowX: 'auto', height: '300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                    Galeri:
                </Typography>
                <div style={{ 
                    display: 'flex',
                    gap: '20px', // Öğeler arasındaki boşluk
                    alignItems: 'center', 
                    paddingLeft: imagesCount <= 2 ? 0 : "40px", 
                    minWidth: imagesCount <= 2 ? 'fit-content' : '100%' 
                }}>

                    <div>
                        {/* Gizli Dosya Input */}
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e)=>handleFileAlbum(e)}
                        />

                        {/* Görsel Ekleme Butonunu Çevreleyen Stil */}
                        <div style={{ border: '2px dashed grey', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '120px', height: '150px'}}>
                            <label htmlFor="imageInput">
                            <IconButton
                                style={{ color: 'green' }} // Yeşil renkli ikon
                                component="span"
                            >
                                <AddPhotoAlternateIcon />
                            </IconButton>
                            </label>
                        </div>
                    </div>


                    {/* createImageAlbum'dan Gelen Görseller */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {createImageAlbum.length > 0 && [...createImageAlbum].reverse().map((item, index) => (
                        <div key={index} style={{ border: '2px dashed grey', padding: '5px', width: '120px', height: '150px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={item.frontFile} alt={`Albüm Görseli ${index}`} style={{ maxWidth: '100px', height: 'auto', maxHeight: '80px' }} />
                            {/* Kapatma (Silme) İkonu */}
                            <IconButton onClick={() => imgCreateAlbumRemove(index)} style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}>
                            <CloseIcon />
                            </IconButton>
                        </div>
                        ))}
                    </div>
                    
                </div>
                
            </div>


       
        

            <FormControl fullWidth margin='normal'>
                <InputLabel style={{ marginBottom: '8px', marginTop: '-10px' }}>Kategori</InputLabel>
                <Select
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value)}
                >
                    {fotoGaleriKategoriler.map((kategori) => (
                    <MenuItem key={kategori.id} value={kategori.id}>
                        {kategori.baslik}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>



        <FormControlLabel
          control={<Checkbox checked={newItem.durum || false} onChange={(e) => setNewItem({ ...newItem, durum: e.target.checked })} />}
          label="Aktif"
        />
      </DialogContent>

      {uyariMesajiEkle && <p style={{ color: 'red', marginLeft: '25px' }}>{uyariMesajiEkle}</p>}
      {saveError && <p style={{ color: 'red', marginLeft: '25px' }}>{saveError}</p>}

        <DialogActions>
          <Button onClick={()=>{handleAddNewItem(selectedKategori)}} color="primary">
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