import React from 'react';
import { Container, Paper, Typography, Button, Grid, Link } from '@mui/material';
import { API_ROUTES } from '../../../utils/constants';
import axios from 'axios';
import PhotoGalleryViewer from '../../../compenent/PhotoGalleryViewer';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import { useState,useEffect } from 'react';
import Head from 'next/head'
import styles from "../../../styles/Arastirmalar.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLocation, faSearch } from '@fortawesome/free-solid-svg-icons';



const buttonStyle = {
  fontSize: '16px',
  width: '100%',
  borderRadius: '0',
  borderBottom: '1px solid #ccc',
  boxshadow:'0',
  textTransform: 'none',
  margin: '10px 0',
  padding: '10px 20px',
  color: '#333',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#fff',
  },
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
};
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

const titleStyle = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#333',
  marginBottom: '15px',
  overflow: 'hidden', // Prevents overflow
  textOverflow: 'ellipsis', // Adds ellipsis if text overflows
  whiteSpace: 'nowrap', // Prevents text wrapping
  '@media (max-width: 768px)': {
    fontSize: '20px',
  },
};


const dateStyle = {
  fontSize: '16px',
  color: '#666',
  marginBottom: '10px',
};

const placeStyle = {
  fontSize: '16px',
  color: '#666',
  marginBottom: '10px',
};





const Arastirma = () => {
  const [arastirma, setArastirma] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [message, setMessage] = useState(false);
  const [errorAlbum, setErrorAlbum] = useState(false);
  const [error,setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state
  const [isExpanded, setIsExpanded] = useState(false);


  const router = useRouter();
  const nid = router.query.nid

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderContent = (content) => {
    if (content.length <= 500 || isExpanded) {
      return (
        <div>
          <div className={styles.content}  dangerouslySetInnerHTML={{ __html: content }} />
          {content.length > 500 && (
            <div  onClick={handleToggleExpanded} className={styles.dahaFazla} style={{ textTransform: 'none',  color:"#1976d2", cursor: 'pointer'  }} >
              {isExpanded ? 'Daha Az Göster' : 'Daha Fazla Göster'}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: content.substring(0, 500) + '...' }} />
          <div  onClick={handleToggleExpanded} className={styles.dahaFazla}  style={{ textTransform: 'none' , color:"#1976d2" , cursor: 'pointer' }} >
            Daha Fazla Göster
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    const fetchKonferans = async () => {
      if (!router.isReady) return; // Router henüz hazır değilse bekleyin
      setIsLoading(true);
      try {
        const apiRoute = API_ROUTES.ARASTIRMALAR_DETAIL.replace('slug', nid);
        const response = await axios.get(apiRoute);
        setArastirma(response.data); 
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Aradığınız araştırma bulunamadı.");
        } else {
          setError("Bir şeyler ters gitti. Daha sonra tekrar deneyiniz.");
        }
        console.error('Araştırma detayları yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchKonferans(); 
  }, [nid]); 
  

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  const handleAlbumClick = async (selectedAlbum) => {
    try {
      const response = await axios.get(API_ROUTES.ALBUM_IMAGES_KATEGORI_FILTER.replace("seciliKategori", selectedAlbum.id));
      const images = response.data;
      if (images.length > 0) {
        setSelectedAlbum({ images });
        setViewerOpen(true);
        setMessage(false);
      } else {
        setMessage(true);
      }
      setErrorAlbum(false);
    } catch (error) {
      setErrorAlbum(true);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Araştırmalar | Kuramer</title>
          <link rel="icon" href="/kuramerlogo.png" />
        </Head>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Araştırma | Kuramer</title>
          <link rel="icon" href="/kuramerlogo.png" />
        </Head>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', color: '#343434', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>
          {error}
        </div>
      </>
    );
  }

  if (!arastirma) {
    return (
      <>
        <Head>
          <title>Araştırma | Kuramer</title>
          <link rel="icon" href="/kuramerlogo.png" />
        </Head>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', color: '#343434', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>
          Araştırma bulunamadı.
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Araştırma | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>
      <Container maxWidth="lg" style={{ marginTop: 40, marginBottom: 40 }}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <img
                src={arastirma.kapak_fotografi}
                alt={arastirma.baslik}
                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
              />
            </Grid>
            <Grid item xs={12} md={6} container direction="column" justifyContent="space-evenly">
            <Typography variant="h6" sx={titleStyle}>
              {arastirma.baslik}
            </Typography>
              
              <Grid>
              {arastirma.pdf_dosya && (
                <a href={arastirma.pdf_dosya} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faSearch} style={iconStyle} />
                  <span style={pStyle}>Programı İncele</span>
                </a>
              )}
              {arastirma.album && (
                <a href="#" onClick={(e) => { e.preventDefault(); handleAlbumClick(arastirma.album); }} style={linkStyle}>
                  <FontAwesomeIcon icon={faSearch} style={iconStyle} />
                  <span>Albümü Görüntüle</span>
                </a>
              )}
              {arastirma.yayin && (
                <a href={arastirma.yayin.url} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faSearch} style={iconStyle} />
                  <span>Etkinlik Kaydını İzle</span>
                </a>
              )}
              </Grid>
              
            </Grid>
          </Grid>

          {arastirma.icerik && (

<Grid item xs={12} container direction="column" justifyContent="center">
  {arastirma.icerik && (
    <div className={styles.icerik} style={{ marginTop: '20px'}}>
      {renderContent(arastirma.icerik)}
    </div>
  )}
</Grid>

)}
          
        </Paper>
        {message && (
          <div style={infoMessageStyle}>
            Albümde herhangi bir resim bulunmamaktadır.
          </div>
        )}
        {errorAlbum && (
          <div style={errorMessageStyle}>
            Albüm resimleri yüklenirken bir hata oluştu.
          </div>
        )}
        {viewerOpen && (
          <PhotoGalleryViewer images={selectedAlbum?.images || []} onClose={handleCloseViewer} />
        )}
      </Container>
    </>
  );
};


export default Arastirma;
