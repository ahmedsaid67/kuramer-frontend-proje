// egitimDetay.js

import React from 'react';
import { Container, Paper, Typography, Button, Grid, Link } from '@mui/material';
import { API_ROUTES } from '../../../utils/constants';
import axios from 'axios';
import PhotoGalleryViewer from '../../../compenent/PhotoGalleryViewer';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import { useState,useEffect } from 'react';
import Head from 'next/head'
import BaslikGorselCompenent from '../../../compenent/BaslikGorselCompenentDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFeather, faPenNib, faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from "../../../styles/Arastirmalar.module.css"

const iconStyle = {
  fontSize: '17x',
  fontWeight:'bold',
  marginRight: '8px',
  verticalAlign: 'middle',
  color: '#333',
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
}
const titleStyle = {
  
}



const authorStyle = {
  fontSize: '15px', // Font boyutunu küçült
  fontFamily: 'sans-serif',
  color: '#343434',
  display: 'flex',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: '5px',
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
};

// Hata mesajları için stil
const errorMessageStyle = {
  color: '#f44336', // Kırmızı tonu, hata mesajları için genel bir renk
  backgroundColor: '#ffebee', // Çok hafif kırmızı arka plan rengi, okunabilirliği artırır
  padding: '10px', // İç boşluk
  borderRadius: '5px', // Hafif yuvarlak köşeler
  border: '1px solid #f44336', // Hata renginde bir sınır
  margin: '10px 0', // Üst ve altta boşluk
  fontSize: '14px', // Okunabilir font boyutu
  textAlign: 'center', // Metni ortala
};

// Bilgilendirme mesajları için stil
const infoMessageStyle = {
  color: '#ffffff', // Beyaz metin rengi, koyu arka plan üzerinde okunabilirliği artırır
  backgroundColor: '#2e5077', // Önerilen koyu mavi arka plan rengi
  padding: '10px', // İç boşluk
  borderRadius: '5px', // Hafif yuvarlak köşeler
  border: '1px solid #2e5077', // Arka plan rengiyle aynı sınır rengi
  margin: '10px 0', // Üst ve altta boşluk
  fontSize: '14px', // Okunabilir font boyutu
  textAlign: 'center', // Metni ortala
};

const dateStyle = {
  fontSize: '15px', // Font boyutunu küçült
  fontFamily: 'sans-serif',
  color: '#333',  
  display: 'flex',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: '5px',
  marginTop: 1,
  marginBottom: 1,
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
};


const Egitim = () => {
  const [egitim, setEgitim] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [message, setMessage] = useState(false);
  const [errorAlbum, setErrorAlbum] = useState(false);
  const [error,setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state

  const router = useRouter();
  const nid = router.query.nid
  const { asPath, isReady } = router;

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
  
  const formatDateWithoutTimeZone = (dateString) => {
      const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', options).format(date);
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
          const apiRoute = API_ROUTES.EGITIMLER_DETAIL.replace('slug', nid);
          const response = await axios.get(apiRoute);
          setEgitim(response.data);
          setDetayItems({ name:response.data.baslik, url: asPath})
          setError(null)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setError("Aradığınız sayfa bulunamadı. Bir hata oluşmuş olabilir veya sayfa kaldırılmış olabilir.")
          }else{
          setError("Bir şeyler ters gitti. Daha sonra tekrar deneyiniz.")}
          console.error('Eğitim detayları yüklenirken hata:', error);
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
        setMessage(false)
      } else {
        setMessage(true);
      }
      setErrorAlbum(false);
      
    } catch (error) {
      setErrorAlbum(true);
    }
  };


  

  if (error || errorPage) {
    
    return (
      <>
      <Head>
        <title>Eğitim | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#343434',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
      }}>
        {error || errorPage}
      </div>
      </>
      
    );
  }




  return (
    <>
    <Head>
        <title>Eğitim | Kuramer</title>
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
                {/* Sol tarafta görsel */}
                <Grid item xs={12} md={6} container direction="column" justifyContent="center">
                  <img
                    src={egitim.kapak_fotografi}
                    alt={egitim.baslik}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Grid>

                {/* Sağ tarafta detaylar */}
                <Grid item xs={12} md={6} container direction="column" justifyContent="flex-start">
  
                  <div className={styles.content}>
                    <h1>
                      {egitim.baslik}
                    </h1>
                  </div>

                  <Grid mt={2}> 
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faFeather} style={iconStyle} />
                      <Typography variant="subtitle1" sx={authorStyle}>
                        {egitim.egitmen}
                      </Typography>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={dateStyle}>
                      <FontAwesomeIcon icon={faCalendar} style={iconStyle} />
                        {formatDateWithoutTimeZone(egitim.tarih)}
                      </Typography>
                    
                    </div>

                  </Grid>

                  <Grid mt={2}>
                    {egitim.pdf_dosya && (
                      <a href={egitim.pdf_dosya} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faSearch} style={iconStyle} />
                        <span style={pStyle}>Programı İncele</span>
                      </a>
                    )}
                    {egitim.album && (
                      <a href="#" onClick={(e) => { e.preventDefault(); handleAlbumClick(egitim.album); }} style={linkStyle}>
                        <FontAwesomeIcon icon={faSearch} style={iconStyle} />
                        <span>Albümü Görüntüle</span>
                      </a>
                    )}
                    {egitim.yayin && (
                      <a href={egitim.yayin.url} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faSearch} style={iconStyle} />
                        <span>Etkinlik Kaydını İzle</span>
                      </a>
                    )}
                    </Grid>

                </Grid>

                
              </Grid>
                  
              {egitim.icerik && (

              <Grid item xs={12} container direction="column" justifyContent="center">
                {egitim.icerik && (
                  <div style={{ marginTop: '20px'}}>
                    {renderContent(egitim.icerik)}
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




export default Egitim;
