import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Checkbox, Typography, Button, Alert, IconButton, TextField, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { API_ROUTES } from "../../utils/constants";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import {TextEditor} from '../../compenent/Editor';


const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [changes, setChanges] = useState({});
  const [apiError, setApiError] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [expandedMenus, setExpandedMenus] = useState({});
  const [images, setImages] = useState({}); // Mapping from heading ID to image URL
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stateValue, setStateValue] = useState('');
  const [selectedMainHeading, setSelectedMainHeading] = useState(null);
  const [icerik, setIcerik] = useState('');
  const [icerikVar, setIcerikVar] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const user = useSelector((state) => state.user);
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState(null); // Başlangıçta beyaz seçili
  
  const handleChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ROUTES.MENU);
      const newItems = response.data.sort((a, b) => a.order - b.order);
      setMenuItems(newItems);
      const firstMainItem = newItems.find(item => item.parent === null);
      if (firstMainItem) {
        if (firstMainItem) {
          setSelectedMainHeading(firstMainItem);
          
          fetchItemDetails(firstMainItem.id); // Fetch details when an item is selected
        }
      }
    } catch (error) {
      setApiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  

  const fetchItemDetails = async (id) => {
    try {
      const response = await axios.get(`${API_ROUTES.SAYFALAR_GET_FILTER.replace('id', id)}`);
      const data = response.data;
      console.log(data);
  
      setStateValue(data.name || '');
      setImages(prevImages => ({
        ...prevImages,
        [id]: data.img || null
      }));
      setImagePreview(data.img); // İlk yüklemede resmi gösterir
      setIcerikVar(data.icerik_var || false); // Update icerik_var state
      if(data.icerik_var){
        setIcerik(data.icerik || ''); // Update icerik state
      }
      setSelectedColor(data.renk);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };
  


  useEffect(() => {
    if (!user.id) {
      router.push({
        pathname: "/login",
        query: { from: router.pathname },
      });
    } else {
      getData();
    }
  }, [user]);

  const handleCheck = (id, checked) => {
    setChanges(prevChanges => ({
      ...prevChanges,
      [id]: checked
    }));
  
    const updateChildItems = (parentId, checkedStatus) => {
      const childItems = menuItems.filter(item => item.parent && item.parent.id === parentId);
      childItems.forEach(childItem => {
        setChanges(prevChanges => ({
          ...prevChanges,
          [childItem.id]: checkedStatus
        }));
        updateChildItems(childItem.id, checkedStatus);
      });
    };
  
    updateChildItems(id, checked);
  };
  
  

  const handleMenuToggle = (id) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  
    // Eğer ID 30'dan büyükse bir azalt
    const adjustedId = id > 30 ? id - 1 : id;
  
    const item = menuItems.find(item => item.id === adjustedId);
    if (item && adjustedId !== 30) {
      setSelectedMainHeading(item);
      console.log(item.id);
      
      // Yeni öğe seçildiğinde eski state değerlerini sıfırla
      setIcerik('');
      setIcerikVar(false);
      setImagePreview(null);
      
      fetchItemDetails(item.id); // Fetch details when an item is selected
    }
  };
  
  

  const handleSave = () => {
    const updatedChanges = {};
    Object.keys(changes).forEach(id => {
      const originalStatus = menuItems.find(item => item.id === parseInt(id))?.durum;
      if (originalStatus !== changes[id]) {
        updatedChanges[id] = changes[id];
      }
    });
    if (Object.keys(updatedChanges).length === 0) {
      setAlert({ show: true, type: 'warning', message: 'Hiçbir değişiklik yapmadınız.' });
      return;
    }

    setIsSaving(true);
    axios.patch(API_ROUTES.MENU_UPDATE, updatedChanges)
      .then(response => {
        setAlert({ show: true, type: 'success', message: 'Değişiklikler başarıyla kaydedildi.' });
        setMenuItems(prevItems => prevItems.map(item => ({
          ...item,
          durum: changes[item.id] !== undefined ? changes[item.id] : item.durum
        })));
        setChanges({});
      })
      .catch(error => {
        setAlert({ show: true, type: 'error', message: 'Değişiklikleri kaydederken bir hata oluştu.' });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSaveRight = async () => {
    if (!selectedMainHeading) {
      setAlert({ show: true, type: 'warning', message: 'Bir ana başlık seçilmedi.' });
      return;
    }
  
    const { id } = selectedMainHeading;
  
  
    const formData = new FormData();
    formData.append('name', stateValue);
  
    let imageFile = images[id];
    if (typeof imageFile === 'string') {
      try {
        // Convert URL to File object
        const filename = 'image.jpg'; // Replace with appropriate filename
        const mimeType = 'image/jpeg'; // Replace with appropriate MIME type
        imageFile = await urlToFile(imageFile, filename, mimeType);
      } catch (error) {
        console.error('Error converting URL to File:', error);
      }
    }
  
    if (imageFile instanceof File) {
      formData.append('img', imageFile);
    } else {
      console.warn('Image is not a valid File object:', images[id]);
    }
  
    if (icerikVar) {
      formData.append('icerik', icerik);
    }

    formData.append('renk', selectedColor);
  
    setIsSaving(true);
    try {
      const response = await axios.put(`${API_ROUTES.SAYFALAR_DETAIL.replace('id', id)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const responsenew = await axios.get(API_ROUTES.MENU);
      const newItems = responsenew.data.sort((a, b) => a.order - b.order);
      setMenuItems(newItems);
     
      setAlert({ show: true, type: 'success', message: 'Sağ taraftaki veriler başarıyla kaydedildi.' });
    } catch (error) {
      console.error('Error during save:', error.response ? error.response.data : error.message);
      console.log(error);
      setAlert({ show: true, type: 'error', message: 'Verileri kaydederken bir hata oluştu.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  
  
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  


  
  
  

  const handleImageChangee = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImages(prevImages => ({
        ...prevImages,
        [selectedMainHeading.id]: previewUrl
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prevImages => ({
        ...prevImages,
        [selectedMainHeading.id]: file
      }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // This function should be called to convert the Blob URL back to a File object
  const urlToFile = async (url, filename, mimeType) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };
  
  
  
  

  const handleImageRemove = () => {
    if (selectedMainHeading) {
      setImages(prevImages => ({
        ...prevImages,
        [selectedMainHeading.id]: null
      }));
    }
  };

  

  const renderMenuItems = (items, parentId = null, level = 0) => {
    return items
    .filter(item => (item.parent && item.parent.id === parentId) || (parentId === null && !item.parent))
    .map(item => (
        <React.Fragment key={item.id}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              mt: 2,
              px: 1,
              pl: `${level * 20}px`, // Girintiyi ayarlamak için padding sol kullan
              backgroundColor: expandedMenus[item.id] ? '#f5f5f5' : 'transparent',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: expandedMenus[item.id] ? '#e0e0e0' : 'transparent',
              },
              // Tıklama alanını büyütmek için minimum yükseklik ve genişlik
              minHeight: '40px', // Tıklama alanı yüksekliği
              minWidth: '100%',  // Tıklama alanı genişliği
            }}
          >
            <Typography
              onClick={() => handleMenuToggle(item.id)}
              sx={{ 
                flexGrow: 1, 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                fontSize: '0.75rem', 
                ml: 1, 
                display: 'flex',
                alignItems: 'center' // İçerikleri dikey olarak ortalamak için
              }}
            >
              {item.title}
            </Typography>
            {items.some(subItem => subItem.parent?.id === item.id) && (
              <IconButton onClick={() => handleMenuToggle(item.id)}>
                {expandedMenus[item.id] ? '-' : '+'}
              </IconButton>
            )}
          </Box>
          {expandedMenus[item.id] && renderMenuItems(items, item.id, level + 1)} {/* Alt menü başlıklarını render et ve girintiyi artır */}
        </React.Fragment>
      ));
};


  

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (apiError) {
    return (
      <Container>
        <Alert severity="error">
          Menü öğeleri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex' }}>
        {/* Sol Taraf: Menü Başlıkları */}
        <Box sx={{ width: '30%', height: 'auto' }}>
          <Box sx={{ width: '100%', height: '620px', overflowY: 'auto', borderRight: '1px solid #ddd', pr: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Menü Başlıkları</Typography>
            {renderMenuItems(menuItems)}
          </Box>
          
        </Box>

        <Box  sx={{ display: 'flex', width:'70%',flexDirection: 'column', height: '700px'}}>
          <Box 
            sx={{ 
              width: '100%', 
              flex: 1, 
              overflowY: 'auto', 
              p: 2 
            }}
          >
            {selectedMainHeading && (
              <>
                <TextField
                  fullWidth
                  label="Sayfa İsmi"
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                  placeholder={`Başlık: ${selectedMainHeading.title}`}
                />
                <Box 
                  sx={{ 
                    mb: 2, 
                    position: 'relative', 
                    border: '1px solid #ddd', 
                    borderRadius: 1, 
                    height: '240px', 
                    overflow: 'hidden',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    cursor: 'pointer'
                  }}
                  onClick={() => document.getElementById('image-input').click()}
                >
                  {images[selectedMainHeading.id] ? (
                    <img
                      src={imagePreview} // Use the preview URL
                      alt="Selected"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <PhotoCameraIcon fontSize="large" sx={{ fontSize: '3em' }} />
                  )}
                  {images[selectedMainHeading.id] && (
                    <IconButton 
                      onClick={handleImageRemove}
                      sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
                <input 
                  id="image-input" 
                  type="file" 
                  accept="image/*"
                  style={{ display: 'none' }} 
                  onChange={handleImageChange}
                />

                

              {icerikVar && (
                <>
                  <Typography variant="subtitle1" style={{ marginBottom: '10px', marginTop: '10px' }}>
                    İçerik Başlığı
                  </Typography>
                  <TextEditor selectedItem={{ icerik }} setSelectedItem={(data) => setIcerik(data.icerik)} />
                </>
              )}

              </>
            )}
            <Container>
                      <Box sx={{ display: 'flex', justifyContent: 'center',mt:2, alignItems: 'center',textAlign:'center', p: 2 }}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend" sx={{fontWeight:'bold', color:'black', mb:1}}>Renk Seçimi</FormLabel>
                          <RadioGroup
                            row
                            value={selectedColor}
                            onChange={handleChange}
                            sx={{ display: 'flex', flexDirection: 'row' }}
                          >
                            <FormControlLabel
                              value="beyaz"
                              control={<Radio />}
                              label="Beyaz"
                              sx={{ mx: 2 }} // Butonlar arasında boşluk için
                            />
                            <FormControlLabel
                              value="siyah"
                              control={<Radio />}
                              label="Siyah"
                              sx={{ mx: 2 }} // Butonlar arasında boşluk için
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Container>
          </Box>
          <Box 
            sx={{ 
              p: 2, 
              borderTop: '1px solid #ddd', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center' 
            }}
          >
            <Button
            variant="contained"
            color="primary"
            onClick={handleSaveRight}
            fullWidth
            sx={{ position: 'sticky', bottom: 0, width: '90%', marginTop: '2em' }}
          >
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MenuPage;
