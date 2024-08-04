import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Grid, Paper } from '@mui/material';
import CardSlider from '../../../../compenent/CardSlider';
import Head from 'next/head';
import { API_ROUTES } from '../../../../utils/constants';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress'; 
import styles from '../../../../styles/Kitaplar.module.css';
import BaslikGorselCompenent from '../../../../compenent/BaslikGorselCompenentDetail';

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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state
  const router = useRouter();
  const slug = router.asPath.split('/').pop();
  const { asPath, isReady } = router;
  const nidMatch = asPath.match(/-(\d+)$/);
  const nid = nidMatch ? nidMatch[1] : null;

  const [pages, setPages] = useState([]);
  const [isPagesLoading, setIsPagesLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(null);
  const [detayItems,setDetayItems] = useState({})
  const [catgoriItem, setcatgoriItem] = useState({});
  


  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

    const fetchData = async () => {
      if (!router.isReady) return; // Router henüz hazır değilse bekleyin
  
      setIsLoading(true);
      setError(null);
  
      try {
        const apiRoute1 = API_ROUTES.KITAPLAR_DETAIL.replace('slug', slug);
        const kitapResponse = await axios.get(apiRoute1);
        const kitap = kitapResponse.data;
        setKitap(kitap);
      
        const cleanedPath = asPath.split('?')[0];
        const pathSegments = cleanedPath.split('/').filter(Boolean);
        const fixedPart = `/${pathSegments.slice(0, 2).join('/')}`;
        const sonPart = `/${pathSegments.slice(2, 3).join('/')}`;
        const cleanPart = sonPart.replace(/\//g, '');
        
        setcatgoriItem({ name: kitap.kitap_kategori.baslik, url: `${fixedPart}?tab=${cleanPart}` });
        setDetayItems({ name:kitap.ad, url: asPath})
        
        setIsLoading(false);
        
        
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('Böyle bir sayfa bulunmamaktadır.');
        } else {
          console.error('Veri yükleme sırasında bir hata oluştu:', error);
          setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
        }
        
      }
    };
  


  const pagesFetchData = async () => {
    setIsPagesLoading(true);
    try {
      const cleanedPath = asPath.split('?')[0];
      const pathSegments = cleanedPath.split('/').filter(Boolean);
      const fixedPart = `/${pathSegments.slice(0, 2).join('/')}`;


      const response1 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: fixedPart });
      setPages(response1.data);
      setErrorPage(null);
    } catch (error) {
      setErrorPage('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      console.log("error:", error);
    } finally {
      setIsPagesLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    fetchData();
    pagesFetchData();
  }, [isReady, nid]);





  if (error || errorPage) {
    return (
      <div className={styles.errorMessage}>
        {error || errorPage}
      </div>
    );
  }
  

  return (
    <div>
      <Head>
        <title>{kitap?.ad} | Kuramer</title>
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
        <Container sx={containerStyles} maxWidth="lg">
          <Paper elevation={3} sx={paperStyles}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <img src={kitap.kapak_fotografi} alt={kitap.baslik} style={{ width: '100%', height: 'auto' }} />
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h10" sx={titleStyle}>
                  {kitap.ad}
                </Typography>
                <Typography variant="subtitle1" color="body1" gutterBottom>
                  <span style={{ fontWeight: 'bold', color: 'black' }}>Yazar:</span> {kitap.yazar}
                </Typography>
                <Typography variant="subtitle1" color="body1" gutterBottom>
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
                  {kitap.ozet.length > 500 && (
                    <Typography component="span" sx={readMoreStyle} onClick={handleToggleCollapse}>
                      {isCollapsed ? ' Daha Fazla Göster' : ' Daha Az Göster'}
                    </Typography>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        <CardSlider id={kitap.kitap_kategori.id} kitapId={kitap.id} path={asPath.split('/').filter(Boolean).slice(0, 3).join('/')}/>

        </>
      )}
    </div>
  );  
}

export default KitapDetay;