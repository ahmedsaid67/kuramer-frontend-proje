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
import BaslikGorselCompenent from '../../../compenent/BaslikGorselCompenentDetail';


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
  lineHeight: '1.5',
  '&:hover': {
    color: '#007bff',
  },
  '@media (maxWidth: 768px)': {
    fontSize: '14px',
  },
};
const pStyle = {
  fontWeight:'bold',
  color: '#333',
}


const iconStyle = {
  color: '#333',
  fontSize: '17x',
  fontWeight:'bold',
  marginRight: '8px',
  verticalAlign: 'middle',
};





const Arastirma = () => {
  const [arastirma, setArastirma] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [message, setMessage] = useState(false);
  const [errorAlbum, setErrorAlbum] = useState(false);
  const [error,setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state

  const router = useRouter();
  const { asPath, isReady } = router;
  const nidMatch = asPath.match(/-(\d+)$/); // Regex ile URL'den id'yi çıkarma
  const nid = router.query.nid;

  const [detayItems,setDetayItems] = useState({})
  const [catgoriItem, setcatgoriItem] = useState({});
  const [pages, setPages] = useState([]);
  const [isPagesLoading, setIsPagesLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderContent = (content) => {
    
      return (
        <div>
          <div className={styles.content}  dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    
  };

  const pagesFetchData = async () => {
    setIsPagesLoading(true);
    try {
      const cleanedPath = asPath.split('?')[0];
      const pathSegments = cleanedPath.split('/').filter(Boolean);
      const categoriPart = `${pathSegments.slice(0, 1).join('/')}`;
      const lastPart = `${pathSegments.slice(1, 2).join('/')}`;
      const url= `/${categoriPart}?tab=${lastPart}`

      const response1 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
      //console.log("res:",response1)
      setPages(response1.data);
      setErrorPage(null);
    } catch (error) {
      setErrorPage('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      console.log("error:", error);
    } finally {
      setIsPagesLoading(false);
    }
  };

  const fetchKonferans = async () => {
    setIsLoading(true);
    try {
      const apiRoute = API_ROUTES.ARASTIRMALAR_DETAIL.replace('slug', nid); 
      const response = await axios.get(apiRoute);
      setArastirma(response.data);
      setError(null);

      //console.log("res:",response.data)

      
      setDetayItems({ name:response.data.baslik, url: asPath})
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Aradığınız sayfa bulunamadı. Bir hata oluşmuş olabilir veya sayfa kaldırılmış olabilir.");
      } else {
        setError("Bir şeyler ters gitti. Daha sonra tekrar deneyiniz.");
      }
      console.error('Sempozyum detayları yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    fetchKonferans();
    pagesFetchData();
  }, [isReady, nid]);
  

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

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
        <BaslikGorselCompenent data={pages} catgoriItem={catgoriItem} detayItems={detayItems} isPagesLoading={isPagesLoading}/>


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
            <Grid item xs={12} md={6} container direction="column" justifyContent="flex-start">
              <div className={styles.content}>
                <h1>
                  {arastirma.baslik}
                </h1>
              </div>
              
              <Grid mt={2}>
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
      )}
    </>
  );
};


export default Arastirma;
