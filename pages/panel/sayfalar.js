import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper,Pagination, Table, Tooltip,TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, Checkbox, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, DialogActions } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { API_ROUTES } from '../../utils/constants';
import {TextEditor} from '../../compenent/Editor';







export default function Sayfalar() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [uyariMesaji, setUyariMesaji] = useState("");
    const [isSaving, setIsSaving] = useState(false);


    const user = useSelector((state) => state.user);
    const router = useRouter();






    const getData = async () => {
      setIsLoading(true); // Veri yükleme başlamadan önce
      setHasError(false);
      try {
        const response = await axios.get(API_ROUTES.SAYFALAR_PAGINATIONS.replace("currentPage",currentPage))
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
    
      
      const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
        console.log("item:",item)
      };
      const handleClose = () => {
        setOpen(false);
        setSaveError("")
        setUyariMesaji("");
      };
    
    
    
      const handleSave = (editedItem) => {
  
        if (!editedItem.img ) {
          setUyariMesaji("Lütfen kapak fotoğrafı alanını doldurunuz.");
          return;
        }
        setUyariMesaji("");

        const formData = new FormData();

        // Kapak fotoğrafı için orijinal dosyayı kullan
        if (editedItem["img_file"]) {
          formData.append('img', editedItem["img_file"]);
        }



        formData.append("renk", editedItem["renk"]);
        formData.append("icerik", editedItem["icerik"]);

        // PDF dosyası
        
        
        setIsSaving(true);
        axios.put(API_ROUTES.SAYFALAR_DETAIL.replace("id",editedItem.id), formData)
          .then(response => {
            // Mevcut sayfayı yeniden yüklüyoru
            return axios.get(API_ROUTES.SAYFALAR_PAGINATIONS.replace("currentPage",currentPage))
          })
          .then(response => {

            setData(response.data.results);
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
          if (fieldName === "img") {
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




      function truncateText(text, maxLength) {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
      }



    return(
        <>
             <>
             <Container maxWidth="lg" style={{  position: 'relative' }}>
                <Paper elevation={2} style={{ padding: '15px', overflowX: 'auto', backgroundColor: 'white' }}>
                  
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#1976d2' }}> 
                        
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sayfa İsmi</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Kapak Fotoğrafı</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Açıklama Metni</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Başlık Rengi</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Detaylar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map(row => (
                        <TableRow key={row.id}>
                          
                          <TableCell style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Tooltip title={row.name} placement="top">
                              <span>{truncateText(row.name, 30)}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>{row.img ? 'Mevcut' : 'Mevcut Değil'}</TableCell>
                          <TableCell style={{ fontSize: '0.75rem' }}>
                            {row.icerik_var ? (row.icerik ? 'Mevcut' : 'Mevcut Değil') : 'Bu Özellik Kullanılmıyor'}
                          </TableCell>

                          <TableCell style={{ fontSize: '0.75rem' }}>{row.renk.charAt(0).toUpperCase() + row.renk.slice(1)}</TableCell>
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
                label="Sayfa İsmi"
                value={selectedItem ? selectedItem.name : ''}
                //onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
            />

            
            <div style={{ textAlign: 'center', marginBottom: '20px' , marginTop:"10px"}}>
                <div style={{ border: '2px dashed grey', width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {selectedItem && selectedItem.img ? (
                        <>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                Kapak Fotoğrafı:
                            </Typography>
                            <img
                                src={selectedItem.img}
                                alt="img"
                                style={{ maxWidth: '50%', maxHeight: '100px', position: 'relative' }}
                            />
                            {/* X simgesi */}
                            <IconButton
                                style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'red', position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveImage("img")}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (<>
                        <Typography variant="subtitle1" style={{ marginBottom: '10px', position: 'absolute', top: 0, left: 10 }}>
                                Kapak Fotoğrafı:
                        </Typography>
                        <label htmlFor="imgInput">
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
                    id="imgInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, "img")}
                />
            </div>
          
            {selectedItem && selectedItem.icerik_var && (
              <>
                <Typography variant="subtitle1" style={{ marginBottom: '10px', marginTop:'10px'}}>
                  Açıklama Metni:
                </Typography>
                <TextEditor selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
              </>
            )}

           


            <div style={{ marginTop: "20px", marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
              <FormControl component="fieldset">
                  <FormLabel component="legend" style={{ marginBottom: "5px" , color: '#222222' }}>Başlık Rengi:</FormLabel>
                  <RadioGroup
                      row
                      aria-label="renk"
                      name="renk"
                      value={selectedItem?.renk || ""}
                      onChange={(e) => setSelectedItem({ ...selectedItem, renk: e.target.value })}
                  >
                      <FormControlLabel value="beyaz" control={<Radio />} label="Beyaz" />
                      <FormControlLabel value="siyah" control={<Radio />} label="Siyah" />
                  </RadioGroup>
              </FormControl>
          </div>



            
            
          </DialogContent>
          {saveError && <p style={{ color: 'red', marginLeft: '25px' }}>{saveError}</p>}
          {uyariMesaji && <p style={{ color: 'red', marginLeft: '25px' }}>{uyariMesaji}</p>}

          <DialogActions>
              <Button onClick={() => handleSave(selectedItem)} color="primary">
                {isSaving ? <CircularProgress size={24} /> : "Kaydet"}
              </Button>
          </DialogActions>
      </Dialog>


      
    </>


        </>
    )
}