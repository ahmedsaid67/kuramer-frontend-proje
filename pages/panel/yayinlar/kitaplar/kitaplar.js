import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper,Pagination, Table,Tooltip, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, Checkbox, FormControlLabel, DialogActions ,Box} from '@mui/material';
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
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr'; // Türkçe yerelleştirme için
import { parseISO } from 'date-fns';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {API_ROUTES} from "../../../../utils/constants"


const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  });
  
  const StyledTableRow = styled(TableRow)({
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  });

const CustomPopper = styled('div')({
    // Özelleştirilmiş stil tanımlamaları
    width: '250px',
    height: '300px',
});




export default function Mushaflar() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({
      ad: '',
      yazar: '',
      yayinTarihi:'',
      sayfaSayisi:0,
      isbn:'',
      kapakFotografi: null,
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
    const [kitapKategoriler, setKitapKategoriler] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [warningDialogOpen, setWarningDialogOpen] = useState(false);

    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [displayedData, setDisplayedData] = useState([]);

    

    const [albumImages, setAlbumImages] = useState([]);
    const [removedImageIds, setRemovedImageIds] = useState([]);
    const [createImageAlbum, setCreateImageAlbum] = useState([]);
    const imagesCount = useMemo(() => {
      return albumImages.length + (createImageAlbum ? createImageAlbum.length : 0);
  }, [albumImages, createImageAlbum]);


    const user = useSelector((state) => state.user);
    const router = useRouter();


    const imgAlbumRemove = (imageId) => {
      // Yeni dizi, seçilen ID'ye sahip olmayan tüm görselleri içerecek şekilde oluşturulur
      const updatedImages = albumImages.filter(image => image.id !== imageId);
      // albumImages state'ini güncelle
      setAlbumImages(updatedImages);
      setRemovedImageIds(prevIds => [...prevIds, imageId]);
    };




    const getResData = async () => {

      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.KITAP_KATEGORI_LIST)
        setKitapKategoriler(response.data);
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

    useEffect(() => {
      const filtered = data.filter(item => item.ad.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredData(filtered);
      // Sayfa numarasına göre kesme işlemi
      const newDisplayedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setDisplayedData(newDisplayedData);

      // Toplam sayfa sayısını güncelle
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    }, [searchQuery, data, currentPage, itemsPerPage]);

    const handleSearchChange = (event) => {
      const { value } = event.target;
      setSearchQuery(value);
    };
  
    const handleItemsPerPageChange = async (event) => {
      const newItemsPerPage = event.target.value;
      setItemsPerPage(newItemsPerPage);
    
      // Verileri güncelle
      try {
        const response = await axios.get(API_ROUTES.KITAPLAR_GETFULL);
        const totalCount = response.data.length || 0;
        const totalPages = Math.ceil(totalCount / newItemsPerPage);
    
        // Mevcut sayfayı kontrol et ve uygun sayfayı ayarla
        let updatedPage = currentPage;
        if (totalPages < currentPage) {
          updatedPage = totalPages > 0 ? totalPages : 1;
        }
    
        // Verileri güncellenmiş sayfadan al
        await fetchData(updatedPage);
        
        // Toplam sayfa sayısını güncelle
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
  
    

    const getData = async () => {
      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.KITAPLAR_GETFULL)
        setData(response.data);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
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




    const handlePageChange = (event, newPage) => {
      setCurrentPage(newPage);
      
      // Sayfayı yumuşak bir şekilde yukarı kaydır
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
      const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
      };
      const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewItem({
            ad: '',
            yazar: '',
            yayinTarihi:'',
            sayfaSayisi:0,
            isbn:'',
            kapakFotografi: null,
            ozet:'',
            durum: true
        }); // newItem durumunu sıfırla
        setUyariMesajiEkle("");
        setSaveError(""); 
        setSelectedKategori("")
      };
      
      const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
        if (item.kitap_kategori){
          setSelectedKategori(item.kitap_kategori.id)
        }

        axios.get(API_ROUTES.CONTENT_IMAGE_KATEGORI_FILTER.replace("seciliKategori", item.id)) 
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
      };
    
    
    
      const handleSave = async (editedItem, kategoriId) => {
        if (!editedItem.ad || !editedItem.kapak_fotografi || !editedItem.yazar || !editedItem.yayin_tarihi || !editedItem.sayfa_sayisi || !editedItem.isbn || !editedItem.ozet || !kategoriId) {
          setUyariMesaji("Lütfen tüm alanları doldurunuz.");
          return;
        }
        setUyariMesaji("");
      
        const formData = new FormData();
      
        // Kapak fotoğrafı için orijinal dosyayı kullan
        if (editedItem["kapak_fotografi_file"]) {
          formData.append('kapak_fotografi', editedItem["kapak_fotografi_file"]);
        }
      
        formData.append("ad", editedItem["ad"]);
        formData.append("yazar", editedItem["yazar"]);
        formData.append("yayin_tarihi", editedItem["yayin_tarihi"]);
        formData.append("sayfa_sayisi", editedItem["sayfa_sayisi"]);
        formData.append("isbn", editedItem["isbn"]);
        formData.append("ozet", editedItem["ozet"]);
        formData.append("durum", editedItem["durum"]);
        formData.append("kitap_kategori_id", kategoriId);
      
        setIsSaving(true);
      
        try {
          // PUT isteği ile kitabı güncelle
          const response = await axios.put(API_ROUTES.KITAPLAR_DETAIL.replace("slug", editedItem.slug), formData);
      
          const updatedData = data.map(item => item.id === editedItem.id ? response.data : item);
          setData(updatedData);
          handleClose();
          setSaveError("");  // Hata mesajını temizle
      
          // Görselleri yükle
          if (createImageAlbum.length > 0) {
            const imagePromises = createImageAlbum.map((item) => {
              const albumFormData = new FormData();
              albumFormData.append("kitap_id", editedItem.id); // newKitapId yerine editedItem.id kullanabilirsiniz
              albumFormData.append("image", item.backFile);
      
              for (let pair of albumFormData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
              }
      
              return axios.post(API_ROUTES.CONTENT_IMAGE, albumFormData);
            });
            await Promise.all(imagePromises);
          }
      
          // Silinmiş görselleri işleme
          if (removedImageIds.length > 0) {
            const stringIds = removedImageIds.map(id => id.toString());
            await axios.post(API_ROUTES.CONTENT_IMAGE_DELETE, { ids: stringIds });
          }
      
        } catch (error) {
          console.error('Güncelleme sırasında hata oluştu:', error);
          setSaveError("Veri güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.");  // Hata mesajını ayarla
        } finally {
          setIsSaving(false); // İşlem tamamlandığında veya hata oluştuğunda
        }
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
    
    

    
    const handleAddNewItem = async (kategoriId) => {
  if (!newItem.ad || !newItem.kapakFotografi || !newItem.yazar || !newItem.yayinTarihi || !newItem.sayfaSayisi || !newItem.isbn || !newItem.ozet || !kategoriId) {
    setUyariMesajiEkle("Lütfen tüm alanları doldurunuz.");
    return;
  }

  setUyariMesajiEkle("");

  const formData = new FormData();
  formData.append('kapak_fotografi', newItem["kapakFotografi_file"]);
  formData.append("ad", newItem["ad"]);
  formData.append("yazar", newItem["yazar"]);
  formData.append("yayin_tarihi", newItem["yayinTarihi"]);
  formData.append("sayfa_sayisi", newItem["sayfaSayisi"]);
  formData.append("isbn", newItem["isbn"]);
  formData.append("ozet", newItem["ozet"]);
  formData.append("durum", newItem["durum"]);
  formData.append("kitap_kategori_id", kategoriId);

  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  setIsSaving(true);

  try {
    const response = await axios.post(API_ROUTES.KITAPLAR, formData);

    const newKitapId = response.data.id;
    console.log("New Kitap ID:", newKitapId);

    const paginationResponse = await axios.get(API_ROUTES.KITAPLAR_PAGINATIONS.replace("currentPage", currentPage));
    setData(paginationResponse.data.results);
    setTotalPages(Math.ceil(paginationResponse.data.count / 10));

    if (createImageAlbum.length > 0) {
      const imagePromises = createImageAlbum.map((item) => {
        const albumFormData = new FormData();
        albumFormData.append("kitap_id", newKitapId);
        albumFormData.append("image", item.backFile);

        for (let pair of albumFormData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        return axios.post(API_ROUTES.CONTENT_IMAGE, albumFormData);
      });
      await Promise.all(imagePromises);
    }

    // handleCloseAddDialog();
  } catch (error) {
    console.error('Yeni veri eklerken hata oluştu:', error);
    setSaveError("Yeni veri eklemesi sırasında bir hata meydana geldi. Lütfen işleminizi tekrar gerçekleştirmeyi deneyiniz.");
  } finally {
    setIsSaving(false);
    handleCloseAddDialog();
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

    const handleConfirmDelete = async () => {
      setDeleteError('');
      try {
        // Seçilen kitapları sil
        await axios.post(API_ROUTES.KITAPLAR_DELETE, { ids: selectedIds });
    
        // Güncellenmiş verileri al
        const response = await axios.get(API_ROUTES.KITAPLAR_GETFULL);
        const totalCount = response.data.length || 0;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
    
        // Mevcut sayfayı kontrol et ve uygun sayfayı ayarla
        let updatedPage = currentPage;
        if (totalPages < currentPage) {
          // Eğer mevcut sayfa toplam sayfadan büyükse, son sayfaya geç
          updatedPage = totalPages > 0 ? totalPages : 1;
        }
    
        // Güncellenmiş sayfanın verilerini al
        await fetchData(updatedPage);
    
      } catch (error) {
        console.error('Error deleting data:', error);
        setDeleteError('Veriler silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setDeleteConfirmOpen(false);
      }
    };
    
    
    const fetchData = async (page) => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_ROUTES.KITAPLAR_GETFULL);
        const dataItems = response.data || [];
        const totalCount = dataItems.length || 0;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
    
        // Verileri ve toplam sayfa sayısını güncelle
        setData(dataItems);
        setTotalPages(totalPages);
    
        // Mevcut sayfayı kontrol et ve ayarla
        if (page > totalPages) {
          setCurrentPage(totalPages > 0 ? totalPages : 1);
        } else {
          setCurrentPage(page);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
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

      function truncateText(text, maxLength) {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
      }





    return(
        <>
             <>
             <Container maxWidth="lg" style={{ position: 'relative' }}>
                {deleteError && (
                  <div style={{ color: '#f44336', textAlign: 'center', marginBottom: '10px', fontSize: '0.75rem' }}>
                    {deleteError}
                  </div>
                )}
                <Paper elevation={2} style={{ padding: '15px', overflowX: 'auto', backgroundColor: 'white' }}>
                  {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
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
                      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                        <TextField
                          variant="outlined"
                          size="small"
                          label="Kitap Arama"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          fullWidth
                        />
                        <FormControl variant="outlined" size="small" style={{ minWidth: 120, marginLeft: '10px' }}>
                          <InputLabel>Sayfa Başına</InputLabel>
                          <Select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            label="Sayfa Başına"
                          >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
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
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Kitap Adı</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Yazar</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Yayın Tarihi</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Sayfa Sayısı</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Isbn</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Kapak Fotoğrafı</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Özet</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Kitap Serisi</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Durum</TableCell>
                            <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Detaylar</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {displayedData.map(row => (
                            <TableRow key={row.id}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedRows[row.id] || false}
                                  onChange={() => handleSelectRow(row.id)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={row.ad} placement="top">
                                  <span>{truncateText(row.ad, 6)}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={row.yazar} placement="top">
                                  <span>{truncateText(row.yazar, 4)}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell style={{ fontSize: '0.75rem' }}>{row.yayin_tarihi}</TableCell>
                              <TableCell style={{ fontSize: '0.75rem' }}>{row.sayfa_sayisi}</TableCell>
                              <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={row.isbn} placement="top">
                                  <span>{truncateText(row.isbn, 4)}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell style={{ fontSize: '0.75rem' }}>{row.kapak_fotografi ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                              <TableCell style={{ fontSize: '0.75rem' }}>{row.ozet ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                              <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={row.kitap_kategori ? row.kitap_kategori.baslik : 'Mevcut Değil'} placement="top">
                                  <span>{truncateText(row.kitap_kategori ? row.kitap_kategori.baslik : 'Mevcut Değil', 9)}</span>
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
                    </>
                  )}
                </Paper>
               
              </Container>

{/* detaylar düzenleme */}
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
                label="Kitap Adı"
                value={selectedItem ? selectedItem.ad : ''}
                onChange={(e) => setSelectedItem({ ...selectedItem, ad: e.target.value })}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Yazar"
                value={selectedItem ? selectedItem.yazar : ''}
                onChange={(e) => setSelectedItem({ ...selectedItem, yazar: e.target.value })}
                fullWidth
                margin="normal"
            />


            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                  <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <DatePicker
                          label="Yayın Tarihi"
                          value={selectedItem && selectedItem.yayin_tarihi ? parseISO(selectedItem.yayin_tarihi) : null}
                          onChange={(newValue) => {
                            // newValue'nin geçerli bir tarih olup olmadığını kontrol et
                            const isValidDate = newValue && !isNaN(new Date(newValue).getTime());
                            const formattedDate = isValidDate ? format(newValue, "yyyy-MM-dd") : '';
                            setSelectedItem({ ...selectedItem, yayin_tarihi: formattedDate });
                        }}
                          format="dd.MM.yyyy"
                      />
                  </div>
            </LocalizationProvider>

            <TextField
                label="Sayfa Sayisi"
                value={selectedItem ? selectedItem.sayfa_sayisi : 0}
                onChange={(e) => {
                    // Kullanıcıdan alınan değeri kontrol et
                    const sayfaSayisi = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                    // Eğer sayı geçerliyse (NaN değilse) veya boş bir stringse, değeri ayarla
                    if (!isNaN(sayfaSayisi) || e.target.value === '') {
                        setSelectedItem({ ...selectedItem, sayfa_sayisi: sayfaSayisi });
                    }
                }}
                fullWidth
                margin="normal"
            />
                <TextField
                    label="ISBN"
                    value={selectedItem ? selectedItem.isbn : ''}
                    onChange={(e) => setSelectedItem({ ...selectedItem, isbn: e.target.value })}
                    fullWidth
                    margin="normal"
                />
            {/* Kapak Fotoğrafı */}
            <div style={{ textAlign: 'center', marginBottom: '20px',marginTop:"20px" }}>
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



            <FormControl fullWidth margin='normal'>
                <InputLabel style={{ marginBottom: '8px', marginTop: '-10px' }}>Kitap Serisi</InputLabel>
                <Select
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value)}
                >
                    {kitapKategoriler.map((kategori) => (
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

{/* kitap ekleme yeni */}

      <DialogContent>
        <TextField
          label="Kitap Adı"
          value={newItem.ad}
          onChange={(e) => setNewItem({ ...newItem, ad: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Yazar"
          value={newItem.yazar}
          onChange={(e) => setNewItem({ ...newItem, yazar: e.target.value })}
          fullWidth
          margin="normal"
        />

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <DatePicker
                    label="Yayın Tarihi"
                    value={newItem.yayinTarihi ? parseISO(newItem.yayinTarihi) : null}
                    onChange={(newValue) => {
                      // Yeni değerin geçerli bir tarih objesi olup olmadığını kontrol et
                      const isValidDate = newValue && !isNaN(new Date(newValue).getTime());
                      const formattedDate = isValidDate ? format(newValue, "yyyy-MM-dd") : '';
                      setNewItem({ ...newItem, yayinTarihi: formattedDate });
                    }}
                    PopperProps={{
                        component: CustomPopper
                    }}
                    format="dd.MM.yyyy" 
                />
            </div>
        </LocalizationProvider>

        <TextField
            label="Sayfa Sayısı"
            type="number"
            value={newItem.sayfaSayisi}
            onChange={(e) => {
                // Kullanıcıdan alınan değeri tam sayıya dönüştür
                const sayfaSayisi = parseInt(e.target.value, 10);
                // Eğer sayı geçerliyse (NaN değilse) veya boş bir stringse, değeri ayarla
                if (!isNaN(sayfaSayisi)) {
                    setNewItem({ ...newItem, sayfaSayisi: sayfaSayisi });
                } else if (e.target.value === '') {
                    setNewItem({ ...newItem, sayfaSayisi: '' });
                }
            }}
            fullWidth
            margin="normal"
            inputProps={{ min: "0" }} // Negatif değerlerin girilmesini engelle
        />
        <TextField
          label="ISBN"
          value={newItem.isbn}
          onChange={(e) => setNewItem({ ...newItem, isbn: e.target.value })}
          fullWidth
          margin="normal"
        />



         <div style={{ textAlign: 'center', marginBottom: '20px', marginTop:"20px" }}>
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
                            <IconButton onClick={() => imgAlbumRemove(index)} style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}>
                            <CloseIcon />
                            </IconButton>
                        </div>
                        ))}
                    </div>
                    
                </div>
                
            </div>


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


            <FormControl fullWidth margin='normal'>
                <InputLabel style={{ marginBottom: '8px', marginTop: '-10px' }}>Kitap Serisi</InputLabel>
                <Select
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value)}
                >
                    {kitapKategoriler.map((kategori) => (
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