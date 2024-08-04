import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Grid, Paper, CircularProgress } from '@mui/material';
import Head from 'next/head';
import { API_ROUTES } from '../../../../utils/constants';
import { useRouter } from 'next/router';
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
  fontSize: '16px',
  color: '#000',
  whiteSpace: 'pre-line',
};

const readMoreStyle = {
  marginTop: '8px',
  fontSize: '16px',
  color: '#007BFF',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const paperStyles = {
  padding: 3,
  display: 'flex',
  flexDirection: 'column',
};

function PersonellerDetay() {
  const [kitap, setKitap] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [isPagesLoading, setIsPagesLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(null);
  const [catgoriItem, setcatgoriItem] = useState({});
  const router = useRouter();
  const { asPath, isReady } = router;
  const nidMatch = asPath.match(/-(\d+)$/);
  const nid = nidMatch ? nidMatch[1] : null;
  
  const [detayItems,setDetayItems] = useState({})



  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const apiRoute1 = API_ROUTES.PERSONELLER_DETAIL.replace('id', nid);
      const response = await axios.get(apiRoute1);
      setKitap(response.data);
      //console.log(response.data)
      
      const cleanedPath = asPath.split('?')[0];
      const pathSegments = cleanedPath.split('/').filter(Boolean);
      const fixedPart = `/${pathSegments.slice(0, 2).join('/')}`;
      const sonPart = `/${pathSegments.slice(2, 3).join('/')}`;
      const cleanPart = sonPart.replace(/\//g, '');
  
      setcatgoriItem({ name: response.data.personel_turu.name, url: `${fixedPart}?tab=${cleanPart}` });
      setDetayItems({ name:`${response.data.ad} ${response.data.soyad}`, url: asPath})
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Böyle bir sayfa bulunmamaktadır.');
      } else {
        console.error('Veri yükleme sırasında bir hata oluştu:', error);
        setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      }
    } finally {
      setIsLoading(false);
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

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };



  if (error || errorPage) {
    return <div className={styles.errorMessage || errorPage}>{error}</div>;
  }

  const shouldShowToggle = kitap?.icerik && kitap?.icerik.length > 800;
  const displayText = isCollapsed && shouldShowToggle ? kitap?.icerik.slice(0, 800) + '...' : kitap?.icerik;

  return (
    <div>
      <Head>
        <title>{kitap?.baslik} | Kuramer</title>
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
                <img
                  src={kitap.img}
                  alt={kitap.baslik}
                  style={{ width: "100%", height: "auto" }}
                />
              </Grid>
  
              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={titleStyle}>
                  {kitap.unvan} {kitap.ad} {kitap.soyad}
                </Typography>
  
                {kitap.icerik && (
                  <div>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={summaryStyle}
                    >
                      <span
                        dangerouslySetInnerHTML={{ __html: displayText }}
                      />
                      {shouldShowToggle && (
                        <Typography
                          component="span"
                          sx={readMoreStyle}
                          onClick={handleToggleCollapse}
                        >
                          {isCollapsed
                            ? " Daha Fazla Göster"
                            : " Daha Az Göster"}
                        </Typography>
                      )}
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Container>
        </>
      )}
    </div>
  );  
}

export default PersonellerDetay;
