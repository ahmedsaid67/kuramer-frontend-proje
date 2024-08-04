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

const iconStyle = {
  width: '20px',
  height: '20px',
  marginRight: '5px',
};

const buttonStyle = {
  fontSize: '14px',
  width: '100%',
  borderRadius: 0, // Köşelerin kavisini kaldır
  borderBottom: '1px solid #ccc', // Butonlar arasına çizgi ekle
  textTransform: 'none',
  '@media (max-width: 768px)': {
    fontSize: '12px',
  },
};

const titleStyle = {
  fontSize: '16px', // Font boyutunu küçült
  fontFamily: 'sans-serif',
  fontWeight: 550,
  color: '#343434',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  marginLeft: '5px',
  '@media (max-width: 768px)': {
    fontSize: '15px',
  },
  marginBottom: 2,
};

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
  color: '#343434',
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
          <Container maxWidth="md" style={{ marginTop: 40, marginBottom: 40 }}>
            <Paper elevation={3} style={{ padding: 20 }}>
              <Grid container spacing={3}>
                {/* Sol tarafta görsel */}
                <Grid item xs={12} md={6}>
                  <img
                    src={egitim.kapak_fotografi}
                    alt={egitim.baslik}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Grid>

                {/* Sağ tarafta detaylar */}
                <Grid item xs={12} md={6} container direction="column" justifyContent="center">
                  <Typography variant="h6" sx={titleStyle}>
                    {egitim.baslik}
                  </Typography>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/icons/quill.png" alt="Tarih" style={iconStyle} />
                    <Typography variant="subtitle1" sx={authorStyle}>
                      {egitim.egitmen}
                    </Typography>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/icons/calendar.png" alt="Tarih" style={iconStyle} />
                    <Typography variant="subtitle1" sx={dateStyle}>
                    {formatDateWithoutTimeZone(egitim.tarih)}
                    </Typography>
                  </div>

                </Grid>

                {/* Butonlar */}
                <Grid item xs={12} container direction="column" justifyContent="center">
                  {egitim.pdf_dosya && (
                    <Button
                      variant="text"
                      color="primary"
                      sx={buttonStyle}
                      href={egitim.pdf_dosya}
                      target="_blank"
                    >
                      Programı İncele
                    </Button>
                  )}

                  {egitim.album && (
                    <div onClick={() => handleAlbumClick(egitim.album)}>
                      <Button variant="text" color="primary" sx={buttonStyle} component="a">
                        Albümü Görüntüle
                      </Button>
                    </div>
                  )}

                  {egitim.yayin && (
                    <Button
                      variant="text"
                      color="primary"
                      sx={buttonStyle}
                      href={egitim.yayin.url}
                      target="_blank"
                    >
                      Etkinlik Kaydını İzle
                    </Button>
                  )}
                </Grid>
              </Grid>
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
