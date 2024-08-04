import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Grid, Paper } from '@mui/material';
import Head from 'next/head';
import { API_ROUTES } from '../../utils/constants';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress'; 
import styles from '../../styles/Kitaplar.module.css';
import { fontSize, fontWeight } from '@mui/system';
import BaslikGorselCompenent from '../../compenent/BaslikGorselCompenentDetail';
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

const readMoreDocumentStyle = {
    marginTop: '8px',
    fontSize: '18px',
    color: '#007BFF',
    cursor: 'pointer',
    fontWeight:"bold"
    
  };

const paperStyles = {
  padding: 3,
  display: 'flex',
  flexDirection: 'column',
};



function YayinlarimizdanSecmelerDetay() {
    const [kitap, setKitap] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const asPath = router.asPath;
    const nidMatch = asPath.match(/-(\d+)$/);
    const nid = nidMatch ? nidMatch[1] : null;

    const [detayItems,setDetayItems] = useState({})
    const [catgoriItem, setcatgoriItem] = useState({});;

    const [pages, setPages] = useState([]);
    const [isPagesLoading, setIsPagesLoading] = useState(true);
    const [errorPage, setErrorPage] = useState(null);


  
   
  


    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
    
        try {
          const apiRoute1 = API_ROUTES.YAYINLARIMIZDAN_SECMELER_DETAIL.replace('id', nid);
          const response = await axios.get(apiRoute1);
          setDetayItems({ name:response.data.baslik, url: asPath})
          setKitap(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Veri yükleme sırasında bir hata oluştu:", error);
          if (error.response && error.response.status === 404) {
            setError("Aradığınız sayfa bulunamadı. Bir hata oluşmuş olabilir veya sayfa kaldırılmış olabilir");
          } else {
            setError("Bir şeyler ters gitti. Daha sonra tekrar deneyiniz.");
          }
          setIsLoading(false);
        }
    };

    const pagesFetchData = async () => {
      setIsPagesLoading(true);
      try {
        const cleanedPath = asPath.split('?')[0];
        const pathSegments = cleanedPath.split('/').filter(Boolean);
        const fixedPart = `/${pathSegments.slice(0, 1).join('/')}`;

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
      if (!router.isReady) return;
    
      fetchData();
      pagesFetchData()
    }, [router.isReady, router.query]);


    const handleDownloadPDF = (pdfData) => {
        window.open(pdfData.url, '_blank');
      };

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
  

  
    if (error || errorPage) {
      return (
        <div className={styles.errorMessage}>
          {error || errorPage}
        </div>
      );
    }
  
    const shouldShowToggle = kitap?.ozet && kitap.ozet.length > 1400;
    const displayText = isCollapsed && shouldShowToggle ? kitap?.ozet.slice(0, 1400) + '...' : kitap?.ozet;
  
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
                <img src={kitap.kapak_fotografi} alt={kitap.baslik} style={{ width: '100%', height: 'auto' }} />
              </Grid>
  
              <Grid item xs={12} md={8}>
                <Typography variant="h10" sx={titleStyle}>
                  {kitap.baslik}
                </Typography>
  
                <Typography variant="span" sx={readMoreDocumentStyle} onClick={() => handleDownloadPDF({ url: kitap.pdf_dosya, title: kitap.baslik })}>
                  Dökümanı incele
                </Typography>
  
                {kitap.ozet && (
                  <Typography variant="body2" color="text.secondary" sx={summaryStyle}>
                  <span style={{ fontWeight: 'bold' }}>Özet:</span>
                  {displayText}
                  {shouldShowToggle && (
                    <Typography component="span" sx={readMoreStyle} onClick={handleToggleCollapse}>
                      {isCollapsed ? ' Daha Fazla Göster' : ' Daha Az Göster'}
                    </Typography>
                  )}
                  </Typography>
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
  
  export default YayinlarimizdanSecmelerDetay;
  