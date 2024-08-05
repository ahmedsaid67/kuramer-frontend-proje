import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Grid, Paper } from '@mui/material';
import CardSlider from '../../../../compenent/CardSlider';
import Head from 'next/head';
import { API_ROUTES } from '../../../../utils/constants';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress'; 
import styles from '../../../../styles/Kitaplar.module.css';
import EbookPopup from '../../../../compenent/EbookPopup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  padding: '10px 5px',
  backgroundColor: '#fff',
  boxShadow: 'none',
  lineHeight: '1.5', // Metin yüksekliğini ayarlayarak boşlukları kontrol edin
  '&:hover': {
    color: '#007bff',
  },
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
};

const pStyle = {
  fontWeight:'bold',
}


const iconStyle = {
  fontSize: '16px',
  fontWeight:'bold',
  marginRight: '8px',
  verticalAlign: 'middle',
};

const getContent = async (slug) => {
  try {
    const url = API_ROUTES.CONTENT_IMAGE_KATEGORI_FILTER.replace("seciliKategori", slug);
    const contentResponse = await axios.get(url);
    return contentResponse;
  } catch (error) {
    console.error("Veri yükleme sırasında bir hata oluştu:", error);
    if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
      console.log('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
    } else {
      console.log('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
    }
    throw error;
  }
};

const containerStyles = {
  paddingTop: 4,
  paddingBottom: 4,
};

const titleStyle = {
  fontSize: '28px',
  fontFamily: 'sans-serif',
  fontWeight: 550,
  color: 'black',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  '@media (max-width: 768px)': {
    fontSize: '20px',
  },
  marginBottom: 2,
};

const summaryStyle = {
  marginTop: '16px',
  fontSize: '15px',
  color: '#000',
  whiteSpace: 'pre-line',
};

const readMoreStyle = {
  marginTop: '8px',
  fontSize: '14px',
  color: '#007BFF',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const paperStyles = {
  padding: 3,
  display: 'flex',
  flexDirection: 'column',
};

function KitapDetay() {
  const [kitap, setKitap] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();
  const slug = router.asPath.split('/').pop();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [images, setImages] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleImageClick = () => {
    if (images.length > 0) {
      setIsPopupOpen(true);
      setCurrentPage(1);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (images.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [images]);

  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady) return; 
  
      setIsLoading(true);
      setError(null);
  
      try {
        const apiRoute1 = API_ROUTES.KITAPLAR_DETAIL.replace('slug', slug);
        const kitapResponse = await axios.get(apiRoute1);
        const kitap = kitapResponse.data;
        const resultContent = await getContent(kitap.id);
        setImages(resultContent.data);
        setKitap(kitap);
        setIsLoading(false);
        if (kitap.ozet.length > 1200) {
          setIsCollapsed(true);
        }

        

      } catch (error) {
        if ( error.response.status === 404) {
          console.log(error.response.status);
          console.error("Aradığınız sayfa bulunamadı. Bir hata oluşmuş olabilir veya sayfa kaldırılmış olabilir.", error);
          setError('Aradığınız sayfa bulunamadı. Bir hata oluşmuş olabilir veya sayfa kaldırılmış olabilir.');
          setIsLoading(false);
      } else {
          console.error("Veri yükleme sırasında bir hata oluştu:", error);
          setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
          setIsLoading(false);
      }
      
      }
    };
  
    fetchData();
  }, [router.isReady, router.query]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        {error}
      </div>
    );
  }
  
  return (
    <div>
      <Head>
        <title>{kitap?.ad} | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>

      <Container sx={containerStyles} maxWidth="lg">
        <Paper elevation={3} sx={paperStyles}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <div 
                style={{ maxWidth: '100%', position: 'relative', textAlign: 'center', cursor: images.length > 0 ? 'pointer' : 'default' }}
                
                onClick={handleImageClick}
              >
                {images.length > 0 && (
                  <div
                    className={`${styles.banner} ${isVisible ? styles.visible : ''}`}
                  >
                    Kitap içeriğine bakmak için resime tıklayınız
                  </div>
                )}
                <img
                  src={kitap.kapak_fotografi}
                  alt={kitap.baslik}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h10" sx={titleStyle}>
                {kitap.ad}
              </Typography>
              <Typography variant="subtitle1" color="body1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: 'black' }}>Yazar:</span> {kitap.yazar}
              </Typography>
              <Typography id='ozetRef' variant="subtitle1" color="body1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: 'black' }}>Yayın Tarihi: </span>
                {kitap.yayin_tarihi}
              </Typography>
              <Typography variant="subtitle1" color="body1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: 'black' }}>Sayfa Sayısı: </span>
                {kitap.sayfa_sayisi}
              </Typography>
              <Typography variant="subtitle1" color="body1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: 'black' }}>ISBN:</span> {kitap.isbn}
              </Typography>

             

              <Typography variant="body2" color="text.secondary" sx={summaryStyle}>
                <span style={{ fontWeight: 'bold' }}>Özet:</span>
                {isCollapsed ? kitap.ozet.slice(0, 1200) + '...' : kitap.ozet}
                {kitap.ozet.length > 1200 && (
                  <Typography component="span" sx={readMoreStyle} onClick={handleToggleCollapse}>
                    {isCollapsed ? ' Daha Fazla Göster' : ' Daha Az Göster'}
                  </Typography>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <CardSlider id={kitap.kitap_kategori.id} kitapId={kitap.id} />

      {images.length > 0 && (
        <EbookPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          bookTitle={kitap.ad}
          pageCount={images.length}
          images={images}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default KitapDetay;
