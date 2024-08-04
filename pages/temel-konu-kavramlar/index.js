import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, Typography, Pagination } from '@mui/material';
import CardOge from '../../compenent/CardOge';
import TabPanel from '../../compenent/TabPanel';
import styles from '../../styles/TemelKonularKavram.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { API_ROUTES } from '../../utils/constants';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'; // Yükleme göstergesi için ekleyin
import BaslikGorselCompenent from '../../compenent/BaslikGorselCompenent';

function Index() {
  const [temelKonular, setTemelKonular] = useState([]);
  const [temelKavramlar, setTemelKavramlar] = useState([]);
  const router = useRouter();
  const [orientation, setOrientation] = useState('vertical');
  const [isScrolTab, setIsScrolTab] = useState(false);
  const [totalPagesKonu, setTotalPagesKonu] = useState(0);
  const [totalPagesKavram, setTotalPagesKavram] = useState(0);
  const [error, setError] = useState(null);
  const [isLoadingTemelKonular,setIsLoadingTemelKonular] = useState(true)
  const [isLoadingTemelKavramlar,setIsLoadingTemelKavramlar] = useState(true)
  


  const [errorPage, setErrorPage] = useState(null);
  const [isPagesLoading, setPagesIsLoading] = useState(true); 
  const currentPage = parseInt(router.query.page || '1', 10);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const path = router.asPath;


  const [tab1,setTab1]=useState({})
  const [tab2,setTab2]=useState({})
  const [tab3,setTab3]=useState({})


  useEffect(() => {
    const menuFetch = async () => {
      setLoading(true); // Yükleniyor durumunu başlat
      setItemsError(null); // Hata durumunu sıfırla

      try {
        
        const parts = path.split('?');
        const firstPart = `${parts[0]}`; // Bu, '/kurumsal' ya da '/kuran-i-kerim' olacaktır
        const response = await axios.post(API_ROUTES.MENU_ALT_OGE, { url: firstPart });
        setItems(response.data.items);
      } catch (error) {
        setItemsError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Error fetching menu items:', error); // Hata detayını konsola yazdır
      } finally {
        setLoading(false); // Yükleme tamamlandı
      }
    };

    menuFetch();
  }, []);



  const pagesFetchData = async (page) => {
    setPagesIsLoading(true);
    setErrorPage(null);
  
    try {
      const url = path.split('&')[0];

      if (url === items[0].url) {
        // Check if tab1 has data, otherwise fetch it
        if (!Object.keys(tab1).length > 0) {
          const response1 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab1(response1.data); // Store the fetched data in tab1

        }
      } else if (url === items[1].url) {
        // Check if tab2 has data, otherwise fetch it
        if (!Object.keys(tab2).length > 0) {
          const response2 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab2(response2.data); // Store the fetched data in tab2
        }
      }else if (url === items[2].url) {
        // Check if tab3 has data, otherwise fetch it
        if (!Object.keys(tab3).length > 0) {
          const response2 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab3(response2.data); // Store the fetched data in tab2
        }
      }
  
    } catch (error) {
      setErrorPage('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      console.log("error:", error);
    } finally {
      setPagesIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };

  
  const getDataForBaslikGorsel = () => {
    const url = path.split('&')[0];
    switch (url) {
      case items[0].url:
        return tab1;
      case items[1].url:
        return tab2;
      case items[2].url:
        return tab3;
      default:
        return {};
    }
  };

  // Veri alma işlemini yapan fonksiyon
  const fetchData = async (currentPage) => {

    setIsLoadingTemelKonular(true);
    setIsLoadingTemelKavramlar(true);

    try {
      let response;
      if (path.replace(/&page=\d+/, '') === items[1].url) {
        const temelKonularUrl = API_ROUTES.TEMEL_KONULAR_ACTIVE.replace('currentPage', currentPage);
        response = await axios.get(temelKonularUrl);
        setTemelKonular(response.data.results);
        setTotalPagesKonu(Math.ceil(response.data.count / 10));
        setIsLoadingTemelKonular(false);
      } else if (path.replace(/&page=\d+/, '') === items[2].url) {
        const temelKavramlarUrl = API_ROUTES.TEMEL_KAVRAMLAR_ACTIVE.replace('currentPage', currentPage);
        response = await axios.get(temelKavramlarUrl);
        setTemelKavramlar(response.data.results);
        setTotalPagesKavram(Math.ceil(response.data.count / 10));
        setIsLoadingTemelKavramlar(false);
      }
      setError(null);
    } catch (error) {
      console.error("Veri yükleme sırasında bir hata oluştu:", error);
      if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
        // 'Invalid page' detayını kontrol eden ve buna göre hata mesajı döndüren koşul
        setError('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
      } else {
        setError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    } 
  };



  useEffect(() => {
    if (items.length>0) {
      const urls = items.map(item => item.url);
      if (!urls.includes(path.replace(/&page=\d+/, ''))) {
        router.push('/hata-sayfasi');
      }else{
        pagesFetchData();
        if (items.slice(1, 3).some(item => path.replace(/&page=\d+/, '') === item.url)) {
          fetchData(currentPage);
        }
        
      }
      
    }
  }, [items,path]);



  const handleTabChange = (event, newValue) => {
    router.push(newValue, undefined, { shallow: true });
  };



  const handleChangePage = (event, value) => {
    scrollToTop(() => {
      router.push(`${path.replace(/&page=\d+/, '')}&page=${value}`, undefined, { shallow: true });
    })
  };

  const scrollToTop = (callback) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Kaydırmanın tamamlanması için yaklaşık süre
    setTimeout(() => {
      if (callback) {
        callback();
      }
    }, 500); // 500 milisaniye kaydırmanın tamamlanması için varsayılan süre
  };



  // Ekran boyutuna göre sekme yönünü ayarlama
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1100) {
        setOrientation('horizontal');
      } else {
        setOrientation('vertical');
      }
      const checkIsScrollTab = () => typeof window !== "undefined" && window.innerWidth <= 1100;
  
      setIsScrolTab(checkIsScrollTab());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownloadPDF = (pdfData) => {
    window.open(pdfData.url, '_blank');
  };



  return (
    <>
      <Head>
        <title>Temel Konu ve Kavramlar | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>

      { loading   ? (
          <div className={styles.loaderMain}>
          <CircularProgress /> 
          </div>)
          : itemsError || errorPage  ? (
          <div className={styles.errorMessage}>{itemsError || errorPage}</div>
        )
        : items.length > 0 ? (
        
        <>

        <BaslikGorselCompenent data={getDataForBaslikGorsel()} altPage={false} dinamicPage={{}} isPagesLoading={isPagesLoading}/>

        <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
              <Tabs
              orientation={orientation}
              variant={isScrolTab ? "scrollable" : "standard"}
              scrollButtons={isScrolTab ? "auto" : false}
              value={path.replace(/&page=\d+/, '')}
              onChange={handleTabChange}
              className={styles.verticalTabs}
              aria-label="Vertical tabs example"
              centered={!isScrolTab}
              >
                {items.map((kategori,key) => (
                  <Tab sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    color: 'black',
                    '&.Mui-selected': {
                      color: 'black', 
                    },
                  }} key={key} label={<Typography component="span" sx={{
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}>{kategori.title}</Typography>} value={kategori.url} />
                ))}
              </Tabs>
            </div>
        <div className={styles.rightContainer}>
          <div className={styles.verticalTabsContent}>
            <TabPanel value={path} index={items[0].url}>
            {isPagesLoading ? (
                <div className={styles.loader}>
                  <CircularProgress />
                </div>
              ) : errorPage ? (
                <div className={styles.errorMessage}>
                  {errorPage}
                </div>
              ) : (
                <div className={styles.icerik} dangerouslySetInnerHTML={{ __html: tab1?.icerik }} />
              ) 
              }
            </TabPanel>
              <TabPanel value={path.replace(/&page=\d+/, '')} index={items[1].url}>
              {isLoadingTemelKonular ? (
                <div className={styles.loader}>
                  <CircularProgress />
                </div>
              ) : error || errorPage  ? (
                <div className={styles.errorMessage}>
                  {error || errorPage }
                </div>
              ) : temelKonular.length > 0 ? (
                <div className={styles.cardContainer}>
                  {temelKonular.map((yayin, index) => (
                    <CardOge key={index} yayin={yayin} handleDownloadPDF={handleDownloadPDF} />
                  ))}
                </div>
              ) : (
                <div className={styles.noDataMessage}> Kayıtlı veri bulunmamaktadır. </div> 
              )}
              {!isLoadingTemelKonular && !error && totalPagesKonu > 0 && (
                <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                  <Pagination 
                    count={totalPagesKonu} 
                    page={currentPage} 
                    onChange={handleChangePage} 
                    variant="outlined" 
                    shape="rounded" 
                    sx={{
                      '& .MuiPaginationItem-root': { color: 'inherit' },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: '#2e5077',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#1a365d',
                        },
                      },
                    }}
                  />
                </Stack>
              )}
            </TabPanel>
            <TabPanel value={path.replace(/&page=\d+/, '')} index={items[2].url}>
              {isLoadingTemelKavramlar ? (
                <div className={styles.loader}>
                  <CircularProgress />
                </div>
              ) : error || errorPage  ? (
                <div className={styles.errorMessage}>
                  {error || errorPage }
                </div>
              ) : temelKavramlar.length > 0 ? (
                <div className={styles.cardContainer}>
                  {temelKavramlar.map((yayin, index) => (
                    <CardOge key={index} yayin={yayin} handleDownloadPDF={handleDownloadPDF} />
                  ))}
                </div>
              ) : (
                <div className={styles.noDataMessage}>
                  Kayıtlı veri bulunmamaktadır.
                </div>
              )}
              {!isLoadingTemelKavramlar && !error && totalPagesKavram > 0 && (
                <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                  <Pagination 
                    count={totalPagesKavram} 
                    page={currentPage} 
                    onChange={handleChangePage} 
                    variant="outlined" 
                    shape="rounded" 
                    sx={{
                      '& .MuiPaginationItem-root': { color: 'inherit' },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: '#2e5077',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#1a365d',
                        },
                      },
                    }}
                  />
                </Stack>
              )}
            </TabPanel>
          </div>
        </div>
      </div>
      </>
      ): (
        <div className={styles.noDataMessage}>Kayıtlı Öge verisi bulunmamaktadır.</div>
      )
    }
    </>
  );
}

export default Index;
