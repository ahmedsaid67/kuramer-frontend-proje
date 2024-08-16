import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper,Pagination, Table, TableBody,Tooltip, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, Checkbox, FormControlLabel, DialogActions } from '@mui/material';
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
import PdfViewer from '../../../compenent/PdfViewer';
import { LocalizationProvider, DatePicker,DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr'; // Türkçe yerelleştirme için
import { parseISO } from 'date-fns';
import { format } from 'date-fns';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { API_ROUTES } from '../../../utils/constants';
import { formatISO } from 'date-fns';
import {TextEditor} from '../../../compenent/Editor';




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

export default function Sempozyumlar() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({
      baslik: '',
      tarih:"",
      konum:"",
      kapakFotografi: null,
      pdfDosya: null,
      icerik:"",
      yayin: null,
      album:null,
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
    const [videoGaleri, setVideoGaleri] = useState([]);
    const [fotoGaleri, setFotoGaleri] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [openDuzenlemeYayinSecDialog, setDuzenlemeOpenYayinSecDialog] = useState(false);
    const [openYayinSecDialog, setOpenYayinSecDialog] = useState(false); // Yayın seçim dialogunun açık/kapalı durumu
    const [secilenYayinId, setSecilenYayinId] = useState(null);
    const [ekleSecilenYayinId, setEkleSecilenYayinId] = useState(null);

    const [openAlbumSecDialog,setOpenAlbumSecDialog] = useState(false)


    const [secilenAlbumId, setSecilenAlbumId] = useState(null);
    const [openDuzenlemeAlbumSecDialog, setDuzenlemeOpenAlbumSecDialog] = useState(false);
    const [ekleSecilenAlbumId, setEkleSecilenAlbumId] = useState(null);

    const [warningDialogOpen, setWarningDialogOpen] = useState(false);

    
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [showPdfViewerEkle, setShowPdfViewerEkle] = useState(false);

    const user = useSelector((state) => state.user);
    const router = useRouter();

    const handleClick = () => {
      
      if (selectedItem.pdf_dosya && typeof selectedItem.pdf_dosya === 'string' && selectedItem.pdf_dosya.startsWith('http')) {
        window.open(selectedItem.pdf_dosya);
      } else {

        setShowPdfViewer(true);
      }
      
    };


    const normalizeText = (text) => {
      return text
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o');
    };
    
        const [searchTerm, setSearchTerm] = useState(''); // Arama terimi için state
    
        // Arama sonucunu filtreleme
        const filteredAlbums = fotoGaleri.filter((album) =>
          normalizeText(album.baslik).includes(normalizeText(searchTerm))
        );
    
        const [yayinSearchTerm, setYayinSearchTerm] = useState('');
    
        // Arama sonucunu filtreleme
        const filteredYayinlar = videoGaleri.filter((yayin) =>
          normalizeText(yayin.baslik).includes(normalizeText(yayinSearchTerm))
        );
    


    const getResData = async () => {

      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.VIDEO_GALERI_LIST)
        setVideoGaleri(response.data);
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






  const getResponseData = async () => {

    setIsLoading(true); // Veri yükleme başlamadan önce
    setHasError(false);
    try {
      const response = await axios.get(API_ROUTES.FOTO_GALERI_LIST)
      setFotoGaleri(response.data);
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
      getResponseData()
    }
  }, [user]);
    


    const getData = async () => {
      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.SEMPOZYUMLAR_PAGINATIONS.replace("currentPage",currentPage))
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
            tarih:"",
            konum:"",
            icerik:"",
            kapakFotografi: null,
            pdfDosya: null,
            yayin:null,
            album:null,
            durum: true
        }); // newItem durumunu sıfırla
        setUyariMesajiEkle("");
        setSaveError(""); 
        setEkleSecilenYayinId(null)
        setEkleSecilenAlbumId(null)
      };
      
      const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
        setSaveError("")
        setUyariMesaji("");
        setSecilenYayinId(null)
        setSecilenAlbumId(null)
      };
    
    
    
      const handleSave = (editedItem) => {
  
        if (!editedItem.baslik || !editedItem.kapak_fotografi || !editedItem.tarih || !editedItem.konum ) {
          setUyariMesaji("Lütfen tüm alanları doldurunuz.");
          return;
        }
        setUyariMesaji("");

        const formData = new FormData();

        // Kapak fotoğrafı için orijinal dosyayı kullan
        if (editedItem["kapak_fotografi_file"]) {
          formData.append('kapak_fotografi', editedItem["kapak_fotografi_file"]);
        }

        if ( editedItem["pdf_dosya"] &&  typeof editedItem["pdf_dosya"] === "object") {
          formData.append("pdf_dosya", editedItem["pdf_dosya"]);

        }else if (!editedItem["pdf_dosya"]){
          formData.append("delete_pdf", true);
        }

        formData.append("durum", editedItem["durum"]);
        formData.append("baslik", editedItem["baslik"]);
        formData.append("icerik", editedItem["icerik"]);
        formData.append("tarih", editedItem["tarih"]);
        formData.append("konum", editedItem["konum"]);

        if (editedItem.yayin){
          formData.append("yayin_id", editedItem.yayin.id);
        }

        if (editedItem.album){
          formData.append("album_id", editedItem.album.id);
        }
        

  
        
        
        setIsSaving(true);
        axios.put(API_ROUTES.SEMPOZYUMLAR_DETAIL.replace("id",editedItem.id), formData)
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

        if (!newItem.baslik || !newItem.kapakFotografi || !newItem.tarih || !newItem.konum ) {

          setUyariMesajiEkle("Lütfen tüm alanları doldurunuz.");
          return;
        }
        setUyariMesajiEkle("");

        const formData = new FormData();
        formData.append('kapak_fotografi', newItem["kapakFotografi_file"]);
        formData.append("durum", newItem["durum"]);
        formData.append("baslik", newItem["baslik"]);
        formData.append("tarih", newItem["tarih"]);
        formData.append("konum", newItem["konum"]);
        formData.append("icerik", newItem["icerik"]);

        if (newItem.pdfDosya){
          formData.append("pdf_dosya", newItem["pdfDosya"]);
          }

        if (newItem.yayin){
          formData.append("yayin_id", newItem.yayin.id);
        }

        if (newItem.album){
          formData.append("album_id", newItem.album.id);
        }
        
        setIsSaving(true); 
        axios.post(API_ROUTES.SEMPOZYUMLAR, formData)
          .then(response => {
            // Mevcut sayfayı yeniden yüklüyoru
            return axios.get(API_ROUTES.SEMPOZYUMLAR_PAGINATIONS.replace("currentPage",currentPage))
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
      axios.post(API_ROUTES.SEMPOZYUMLAR_DELETE, { ids: selectedIds })
        .then(() => {
          return axios.get(API_ROUTES.SEMPOZYUMLAR);
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
            return axios.get(API_ROUTES.SEMPOZYUMLAR_PAGINATIONS.replace('currentPage', updatedPage));
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




    const handleOpenYayinSecDialog = () => {
      setOpenYayinSecDialog(true);
    };

    const handleCloseYayinSecDialog = () => {
      setOpenYayinSecDialog(false);
    };

    const handleDuzenlemeOpenYayinSecDialog = () => {
      setDuzenlemeOpenYayinSecDialog(true);
    };

    const handleDuzenlemeCloseYayinSecDialog = () => {
      setDuzenlemeOpenYayinSecDialog(false);
    };


    const handleYayinSec = () => {
      const secilenYayin = videoGaleri.find(yayin => yayin.id === secilenYayinId);
      setSelectedItem({ ...selectedItem, yayin: secilenYayin });
      handleDuzenlemeCloseYayinSecDialog();
    };



    const removeSelectedYayin = () => {
      setSelectedItem({ ...selectedItem, yayin: null });
      setSecilenYayinId(null)
    };

    const removeEkleSelectedYayin = () => {
      setNewItem({ ...newItem, yayin: null });
      setEkleSecilenYayinId(null)
    };



      const handleYayinSecimi = () => {
        const secilenYayin = videoGaleri.find(yayin => yayin.id === ekleSecilenYayinId);
        setNewItem({ ...newItem, yayin: secilenYayin });
        handleCloseYayinSecDialog();
      };






      const removeSelectedAlbum = () => {
        setSelectedItem({ ...selectedItem, album: null });
        setSecilenAlbumId(null)
      };

      const handleDuzenlemeOpenAlbumSecDialog = () => {
        setDuzenlemeOpenAlbumSecDialog(true);
      };
  
      const handleDuzenlemeCloseAlbumSecDialog = () => {
        setDuzenlemeOpenAlbumSecDialog(false);
      };
      
      const handleAlbumSec = () => {
        const secilenAlbum = fotoGaleri.find(album => album.id === secilenAlbumId);
        setSelectedItem({ ...selectedItem, album: secilenAlbum });
        handleDuzenlemeCloseAlbumSecDialog();
      };



      const handleOpenAlbumSecDialog = () => {
        setOpenAlbumSecDialog(true);
      };

      const handleCloseAlbumSecDialog = () => {
        setOpenAlbumSecDialog(false);
      };

      const handleAlbumSecimi = () => {
        const secilenAlbum = fotoGaleri.find(album => album.id === ekleSecilenAlbumId);
        setNewItem({ ...newItem, album: secilenAlbum });
        handleCloseAlbumSecDialog();
      };

      const removeEkleSelectedAlbum = () => {
        setNewItem({ ...newItem, album: null });
        setEkleSecilenAlbumId(null)
      };
  





    
      const ItemContainer = styled('div')(({ theme }) => ({
        position: 'relative',
        marginBottom: theme.spacing(2),
        padding: '16px 16px 0', // Üst, sağ ve sol taraftan iç boşluk
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
        },
      }));
      
      const InfoContainer = styled('div')({
        display: 'flex',
        width: '100%', // Konteynerin tam genişliği
        justifyContent: 'space-between', // Başlık ve checkbox arasında boşluk bırakır
        height:"80px"
      });
      
      const Title = styled(Typography)({
        fontWeight: 600,
        color: '#333',
        padding: '8px 0', // Üst ve alt padding
        // Metin tek satırda gösterilecek ve taşma durumunda "..." ile kısaltılacak
        whiteSpace: 'nowrap', // Metni tek satırda tutar
        overflow: 'hidden', // Ekstra metni gizler
        textOverflow: 'ellipsis', // Gizlenen metnin sonuna "..." ekler
        width: '320px' // Varsayılan genişlik. Gerekirse ayarlayabilirsiniz
        // Sağ taraftan da bir miktar boşluk eklemek isterseniz marginRight özelliğini kullanabilirsiniz.
      });
      
      
      const StyledCheckbox = styled(Checkbox)({
        position: 'absolute',
        top: 16,
        right: 16,
        color: '#3c648c', // Önceden belirlenen renk
        '&:hover': {
          backgroundColor: 'rgba(60, 100, 140, 0.2)', // Hafif tonuyla hover arka planı
        },
        '&.Mui-checked': {
          color: '#3c648c', // İşaretli durumda aynı renk
          boxShadow: '0 0 0 2px #3c648c', // Dışa doğru gölge efekti, renkle aynı
        },
        zIndex: 1, // Diğer öğelerin üzerinde görünmesini sağlar
      });

      const StyledImage = styled('img')({
        width: '320px', // Konteyner genişliğini doldur
        height: '180px', // Sabit bir yükseklik ayarla
      });


      function truncateText(text, maxLength) {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
      }


      const formatDateWithoutTimeZone = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', options).format(date);
      };


      const isContentEmpty = (content) => {
        // Geçerli bir içerik olup olmadığını kontrol etmek için bir DOMParser kullanıyoruz
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        // İçeriği temizle ve boş olup olmadığını kontrol et
        const textContent = doc.body.textContent || '';
        return textContent.trim().length === 0;
      };




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
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Tarih</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Konum</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Kapak Fotoğrafı</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>PDF Dosya</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Yayın</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Albüm</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>İçerik</TableCell>
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
                              <span>{truncateText(row.baslik, 10)}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{formatDateWithoutTimeZone(row.tarih)}</TableCell>
                          <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Tooltip title={row.konum} placement="top">
                              <span>{truncateText(row.konum, 10)}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.kapak_fotografi ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.pdf_dosya ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.yayin ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.album ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>
                            {row.icerik && !isContentEmpty(row.icerik) ? 'Mevcut' : 'Mevcut Değil'}
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
                value={selectedItem && selectedItem.baslik ? selectedItem.baslik : null}
                onChange={(e) => setSelectedItem({ ...selectedItem, baslik: e.target.value })}
                fullWidth
                margin="normal"
            />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                <DateTimePicker
                  label="Tarih ve Saat"
                  value={selectedItem && selectedItem.tarih ? new Date(selectedItem.tarih) : null}
                  onChange={(newValue) => {
                    // Check if newValue is a valid date
                    const isValidDate = newValue && !isNaN(new Date(newValue).getTime());
                    const formattedDateTime = isValidDate ? newValue.toISOString() : '';
                    setSelectedItem({ ...selectedItem, tarih: formattedDateTime });
                  }}                  
                  inputFormat="dd MMMM yyyy HH:mm"
                  slotProps={{
                    textField: { // TextField için slotProps kullanılıyor
                      variant: 'outlined', // TextField özelleştirmeleri
                      fullWidth: true,
                      margin: 'normal',
                      // Diğer TextField propsları burada belirtilebilir
                    },
                  }}
                />
              </LocalizationProvider>
            


            <TextField
                label="Konum"
                value={selectedItem ? selectedItem.konum : ''}
                onChange={(e) => setSelectedItem({ ...selectedItem, konum: e.target.value })}
                fullWidth
                margin="normal"
            />


            
            {/* Kapak Fotoğrafı */}
            <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: "20px" }}>
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


            {/* Yayın */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ border: '2px dashed grey', width: '100%', height: '200px', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {selectedItem && selectedItem.yayin ? (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                              Yayın (isteğe bağlı):
                            </Typography>
                            <img
                                src={selectedItem.yayin.kapak_fotografi}
                                alt="Yayın Kapak Fotoğrafı"
                                style={{ maxWidth: '50%', maxHeight: '100px', position: 'relative' }}
                            />
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                              {selectedItem.yayin.baslik}
                            </Typography>
                            <IconButton
                                onClick={removeSelectedYayin}
                                style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                Yayın (isteğe bağlı):
                            </Typography>
                            <label htmlFor="yayinInput">
                                <IconButton
                                    onClick={handleDuzenlemeOpenYayinSecDialog}
                                    style={{ fontSize: '50px', color: 'green', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                    component="span"
                                >
                                    <AddPhotoAlternateIcon />
                                </IconButton>
                            </label>
                        </>
                    )}
                </div>
            </div>



            {/* Albüm */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ border: '2px dashed grey', width: '100%', height: '200px', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {selectedItem && selectedItem.album ? (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                              Albüm (isteğe bağlı):
                            </Typography>
                            <img
                                src={selectedItem.album.kapak_fotografi}
                                alt="Album Kapak Fotoğrafı"
                                style={{ maxWidth: '50%', maxHeight: '100px', position: 'relative' }}
                            />
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                              {selectedItem.album.baslik}
                            </Typography>
                            <IconButton
                                onClick={removeSelectedAlbum}
                                style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                Albüm (isteğe bağlı):
                            </Typography>
                            <label htmlFor="yayinInput">
                                <IconButton
                                    onClick={handleDuzenlemeOpenAlbumSecDialog}
                                    style={{ fontSize: '50px', color: 'green', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                    component="span"
                                >
                                    <AddPhotoAlternateIcon />
                                </IconButton>
                            </label>
                        </>
                    )}
                </div>
            </div>

            {/* icerik*/}
            {selectedItem && (
              <>
                <Typography variant="subtitle1" style={{ marginBottom: '10px', marginTop:'10px'}}>
                  İçerik (isteğe bağlı) :
                </Typography>
                <TextEditor selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
              </>
            )}

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


      {/* Yayın */}
      <Dialog open={openDuzenlemeYayinSecDialog} onClose={handleDuzenlemeCloseYayinSecDialog} fullWidth maxWidth="md">
           
        
            <DialogTitle>
              Yayın Seç
              <IconButton
                onClick={handleDuzenlemeCloseYayinSecDialog}
                style={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <TextField
              label="Yayın Ara"
              variant="outlined"
              fullWidth
              value={yayinSearchTerm}
              onChange={(e) => setYayinSearchTerm(e.target.value)} // Arama terimini güncelle
              style={{ marginBottom: '16px', zIndex: '10200', width: '95%', margin: '0 auto' }}
            />
            <DialogContent style={{
                      height:'600px',
                      overflowY: 'auto', // İçerik fazla olursa kaydırma sağlar
                    }}
            >
              <Grid container spacing={2}>
                {filteredYayinlar.map((yayin) => (
                  <Grid item xs={12} md={6} key={yayin.id}>
                    <ItemContainer>
                      <img src={yayin.kapak_fotografi} alt={yayin.baslik} />
                      <StyledCheckbox
                        checked={secilenYayinId === yayin.id}
                        onChange={() => {
                          if (secilenYayinId === yayin.id) {
                            setSecilenYayinId(null); // Eğer zaten seçili ise, seçimi kaldır
                          } else {
                            setSecilenYayinId(yayin.id); // Değilse, seçimi yap
                          }
                        }}
                      />
                      <InfoContainer>
                        <Title variant="subtitle1">{yayin.baslik}</Title>
                      </InfoContainer>
                    </ItemContainer>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleYayinSec} color="primary">Seç</Button>
            </DialogActions>
      </Dialog>

      {/* Albüm */}
      <Dialog open={openDuzenlemeAlbumSecDialog} onClose={handleDuzenlemeCloseAlbumSecDialog} fullWidth maxWidth="md">
        
            <DialogTitle>
              Albüm Seç
              <IconButton
                onClick={handleDuzenlemeCloseAlbumSecDialog}
                style={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <TextField
              label="Albüm Ara"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Arama terimini güncelle
              style={{ marginBottom: '16px', zIndex: '10200', width: '95%', margin: '0 auto' }}
            />
            <DialogContent style={{
                      height:'600px',
                      overflowY: 'auto', // İçerik fazla olursa kaydırma sağlar
                    }}
            >
              <Grid container spacing={2}>
                {filteredAlbums.map((album) => (
                  <Grid item xs={12} md={6} key={album.id}>
                    <ItemContainer>
                      <StyledImage src={album.kapak_fotografi} alt={album.baslik} />
                      <StyledCheckbox
                        checked={secilenAlbumId === album.id}
                        onChange={() => {
                          if (secilenAlbumId === album.id) {
                            setSecilenAlbumId(null); // Eğer zaten seçili ise, seçimi kaldır
                          } else {
                            setSecilenAlbumId(album.id); // Değilse, seçimi yap
                          }
                        }}
                      />
                      <InfoContainer>
                        <Title variant="subtitle1">{album.baslik}</Title>
                      </InfoContainer>
                    </ItemContainer>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={ handleAlbumSec} color="primary">Seç</Button>
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


        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <DateTimePicker
                    label="Tarih ve Saat"
                    value={newItem.tarih ? new Date(newItem.tarih) : null}
                    onChange={(newValue) => {
                      // Check if newValue is a valid date
                      const isValidDate = newValue && !isNaN(new Date(newValue).getTime());
                      const formattedDateTime = isValidDate ? format(newValue, "yyyy-MM-dd'T'HH:mm:ss") : '';
                      setNewItem({ ...newItem, tarih: formattedDateTime });
                    }}
                    slotProps={{
                      textField: { // TextField için slotProps kullanılıyor
                        variant: 'outlined', // TextField özelleştirmeleri
                        fullWidth: true,
                        margin: 'normal',
                        // Diğer TextField propsları burada belirtilebilir
                      },
                    }}
                    inputFormat="dd MMMM yyyy HH:mm"
                />
            </div>
        </LocalizationProvider>


        <TextField
          label="Konum"
          value={newItem.konum}
          onChange={(e) => setNewItem({ ...newItem, konum: e.target.value })}
          fullWidth
          margin="normal"
        />



         <div style={{ textAlign: 'center', marginBottom: '20px' ,marginTop:"20px"}}>
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




        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ border: '2px dashed grey', width: '100%', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>            
            {newItem && newItem.yayin ? (
              <>

                <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                  Yayın (isteğe bağlı):
                </Typography>
                <img
                  src={newItem.yayin.kapak_fotografi}
                  alt="Yayın Kapak Fotoğrafı"
                  style={{ maxWidth: '50%', maxHeight: '100px', position: 'relative' }}
                />
                <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                  {newItem.yayin.baslik}
                </Typography>
                <IconButton
                  onClick={() => removeEkleSelectedYayin()}
                  style={{ position: 'absolute', top: 0, right: 0 ,color: 'red'}}
                >
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
              <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                Yayın (isteğe bağlı):
              </Typography>
              <IconButton
                onClick={handleOpenYayinSecDialog}
                style={{ fontSize: '50px', color: 'green' }}
              >
                <AddPhotoAlternateIcon />
              </IconButton>
              </>
            )}
            
          </div>
        </div>


        {/* Albüm */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ border: '2px dashed grey', width: '100%', height: '200px', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {newItem && newItem.album ? (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                              Albüm (isteğe bağlı):
                            </Typography>
                            <img
                                src={newItem.album.kapak_fotografi}
                                alt="Album Ekle Kapak Fotoğrafı"
                                style={{ maxWidth: '50%', maxHeight: '100px', position: 'relative' }}
                            />
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                              {newItem.album.baslik}
                            </Typography>
                            <IconButton
                                onClick={removeEkleSelectedAlbum}
                                style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                Albüm (isteğe bağlı):
                            </Typography>
                            <label htmlFor="yayinInput">
                                <IconButton
                                    onClick={handleOpenAlbumSecDialog}
                                    style={{ fontSize: '50px', color: 'green', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                    component="span"
                                >
                                    <AddPhotoAlternateIcon />
                                </IconButton>
                            </label>
                        </>
                    )}
                </div>
            </div>


            {newItem && (
              <>
                <Typography variant="subtitle1" style={{ marginBottom: '10px', marginTop:'10px'}}>
                  İçerik (isteğe bağlı):
                </Typography>
                <TextEditor selectedItem={newItem} setSelectedItem={setNewItem}/>
              </>
            )}


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
    </>

    <Dialog open={openYayinSecDialog} onClose={handleCloseYayinSecDialog} fullWidth maxWidth="md">    
            <DialogTitle>
              Yayın Seç
              <IconButton
                onClick={handleCloseYayinSecDialog}
                style={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <TextField
              label="Yayın Ara"
              variant="outlined"
              fullWidth
              value={yayinSearchTerm}
              onChange={(e) => setYayinSearchTerm(e.target.value)} // Arama terimini güncelle
              style={{ marginBottom: '16px', zIndex: '10200', width: '95%', margin: '0 auto' }}
            />
            <DialogContent style={{
                      height:'600px',
                      overflowY: 'auto', // İçerik fazla olursa kaydırma sağlar
                    }}
            >
              <Grid container spacing={2}>
                {filteredYayinlar.map((yayin) => (
                  <Grid item xs={12} md={6} key={yayin.id}>
                    <ItemContainer>
                      <img src={yayin.kapak_fotografi} alt={yayin.baslik} />
                      <StyledCheckbox
                        checked={ekleSecilenYayinId === yayin.id}
                        onChange={() => {
                          if (ekleSecilenYayinId === yayin.id) {
                            setEkleSecilenYayinId(null); // Eğer zaten seçili ise, seçimi kaldır
                          } else {
                            setEkleSecilenYayinId(yayin.id); // Değilse, seçimi yap
                          }
                        }}
                      />
                      <InfoContainer>
                        <Title variant="subtitle1">{yayin.baslik}</Title>
                      </InfoContainer>
                    </ItemContainer>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleYayinSecimi} color="primary">Seç</Button>
            </DialogActions>
      </Dialog>



      <Dialog open={openAlbumSecDialog} onClose={handleCloseAlbumSecDialog} fullWidth maxWidth="md">    
            <DialogTitle>
              Album Seç
              <IconButton
                onClick={handleCloseAlbumSecDialog}
                style={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <TextField
              label="Albüm Ara"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Arama terimini güncelle
              style={{ marginBottom: '16px', zIndex: '10200', width: '95%', margin: '0 auto' }}
            />
            <DialogContent style={{
                      height:'600px',
                      overflowY: 'auto', // İçerik fazla olursa kaydırma sağlar
                    }}
            >
              <Grid container spacing={2}>
                {filteredAlbums.map((album) => (
                  <Grid item xs={12} md={6} key={album.id}>
                    <ItemContainer>
                      <StyledImage src={album.kapak_fotografi} alt={album.baslik} />
                      <StyledCheckbox
                        checked={ekleSecilenAlbumId === album.id}
                        onChange={() => {
                          if (ekleSecilenYayinId === album.id) {
                            setEkleSecilenAlbumId(null); // Eğer zaten seçili ise, seçimi kaldır
                          } else {
                            setEkleSecilenAlbumId(album.id); // Değilse, seçimi yap
                          }
                        }}
                      />
                      <InfoContainer>
                        <Title variant="subtitle1">{album.baslik}</Title>
                      </InfoContainer>
                    </ItemContainer>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAlbumSecimi} color="primary">Seç</Button>
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
    )
}