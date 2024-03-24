import React from 'react';
import { Container, Paper, Typography, Button, Grid, Link } from '@mui/material';
import { API_ROUTES } from '../../../utils/constants';
import axios from 'axios';
import { useState,useEffect } from 'react';
import PhotoGalleryViewer from '../../../compenent/PhotoGalleryViewer';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import Head from 'next/head'

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
  '@media (max-width: 768px)': {
    fontSize: '15px',
  },
  marginBottom: 2,
};

const speakerStyle = {
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

const placeStyle = {
  fontSize: '15px', // Font boyutunu küçült
  fontFamily: 'sans-serif',
  color: '#343434',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: 1,
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

const Konferans = () => {
  const [konferans, setKonferans] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [message, setMessage] = useState(false);
  const [errorAlbum, setErrorAlbum] = useState(false);
  const [error,setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state

  const router = useRouter();
  const asPath = router.asPath;
  const nidMatch = asPath.match(/-(\d+)$/); // Regex ile URL'den id'yi çıkarma
  const nid = nidMatch ? nidMatch[1] : null;

  const formatDateWithoutTimeZone = (dateString) => {
      const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', options).format(date);
  };

  useEffect(() => {
      const fetchKonferans = async () => {
        if (!router.isReady) return; // Router henüz hazır değilse bekleyin
        setIsLoading(true);
        try {
          const apiRoute = API_ROUTES.KONFERANSLAR_DETAIL.replace('id', nid); 
          const response = await axios.get(apiRoute);
          setKonferans(response.data);
          setError(null);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setError("Aradığınız konferans bulunamadı.");
          } else {
            setError("Bir şeyler ters gitti. Daha sonra tekrar deneyiniz.");
          }
          console.error('Konferans detayları yüklenirken hata:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchKonferans();
    }, [router.asPath]); 

  
  

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


  if (isLoading) {
    return (
      <>
      <Head>
        <title>Konferans | Kuramer</title>
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
        <title>Konferans | Kuramer</title>
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
        {error}
      </div>
      </>
      
    );
  }


  if (!konferans) {
    return (
      <>

      <Head>
        <title>Konferans | Kuramer</title>
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
        Konferans bulunamadı.
      </div>
      
      </>
      
    );
  }
  

  return (
    <>

      <Head>
        <title>Konferans | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>
    
    <Container maxWidth="md" style={{ marginTop: 40, marginBottom: 40 }}>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Grid container spacing={3}>
          {/* Sol tarafta görsel */}
          <Grid item xs={12} md={6}>
            <img
              src={konferans.kapak_fotografi}
              alt={konferans.baslik}
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>

          {/* Sağ tarafta detaylar */}
          <Grid item xs={12} md={6} container direction="column" justifyContent="center">
            <Typography variant="h6" sx={titleStyle}>
              {konferans.baslik}
            </Typography>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/icons/speaker.png" alt="Tarih" style={iconStyle} />
              <Typography variant="subtitle1" sx={speakerStyle}>
                {konferans.konusmaci}
              </Typography>
            </div>
            

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/icons/calendar.png" alt="Tarih" style={iconStyle} />
              <Typography variant="subtitle1" sx={dateStyle}>
                {formatDateWithoutTimeZone(konferans.tarih)}
              </Typography>
            </div>

            {konferans.konum && (

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <img src="/icons/location.png" alt="Yer" style={iconStyle} />
                <Typography variant="subtitle1" sx={placeStyle}>
                  {konferans.konum}
                </Typography>
              </div>

            )}

            
          </Grid>

          {/* Butonlar */}
          <Grid item xs={12} container direction="column" justifyContent="center">
            {konferans.pdf_dosya && (
              <Button
                variant="text"
                color="primary"
                sx={buttonStyle}
                href={konferans.pdf_dosya}
                target="_blank"
              >
                Programı İndir
              </Button>
            )}

            {konferans.album && (
              <div onClick={() => handleAlbumClick(konferans.album)}>
                <Button variant="text" color="primary" sx={buttonStyle} component="a">
                  Albümü Görüntüle
                </Button>
              </div>
            )}

            {konferans.yayin && (
              <Button
                variant="text"
                color="primary"
                sx={buttonStyle}
                href={konferans.yayin.url} 
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
  );
};



export default Konferans;
