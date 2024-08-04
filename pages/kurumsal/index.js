import React, { useState, useEffect } from 'react';
import {Tab, Tabs, Typography,Pagination } from '@mui/material';
import TabPanel from '../../compenent/TabPanel';
import styles from '../../styles/Kurumsal.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import KamuoyuDuyurulariCardOge from '../../compenent/KamuoyuDuyurulariCardOge';
import { API_ROUTES } from '../../utils/constants';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'; // Yükleme göstergesi için ekleyin
import BaslikGorselCompenent from '../../compenent/BaslikGorselCompenent';


function Index() {
  
  const router = useRouter();

  const [orientation, setOrientation] = useState('vertical'); // Default olarak 'vertical'
  const [isScrolTab, setIsScrolTab] = useState(false);
  const [kamuoyuDuyurulari,setKamuoyuDuyurulari] = useState([])

  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state
  const [isPagesLoading, setPagesIsLoading] = useState(true); // Yükleme durumu için state
  const [error, setError] = useState(null);
  const [errorPage, setErrorPage] = useState(null);
  const currentPage = parseInt(router.query.page || '1', 10);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const path = router.asPath;

  const [tab1,setTab1]=useState({})
  const [tab2,setTab2]=useState({})
  const [tab3,setTab3]=useState({})
  const [tab4,setTab4]=useState({})


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
      } else if (url === items[3].url) {
        // Check if tab3 has data, otherwise fetch it
        if (!Object.keys(tab3).length > 0) {
          const response3 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab3(response3.data); // Store the fetched data in tab3
        }
      } else if (url === items[5].url) {
        // Check if tab4 has data, otherwise fetch it
        if (!Object.keys(tab4).length > 0) {
          const response4 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab4(response4.data); // Store the fetched data in tab4
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
      case items[3].url:
        return tab3;
      case items[5].url:
        return tab4;
      default:
        return {};
    }
  };


  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response1 = await axios.get(API_ROUTES.KAMUOYU_DUYURULARI_ACTIVE.replace('currentPage', page));
      setKamuoyuDuyurulari(response1.data.results); // Değişken adını güncelle
      setTotalPages(Math.ceil(response1.data.count / 10));
      setError(null);
    } catch (error) {
      console.error("Veri yükleme sırasında bir hata oluştu:", error);
      if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
        // 'Invalid page' detayını kontrol eden ve buna göre hata mesajı döndüren koşul
        setError('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
      } else {
        setError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    } finally {
      setIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };


  useEffect(() => {
    if (items.length>0) {
      const urls = items.map(item => item.url);
      if (!urls.includes(path.replace(/&page=\d+/, ''))) {
        router.push('/hata-sayfasi');
      }else{
        pagesFetchData();
        if (path.replace(/&page=\d+/, '')==items[5].url){
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1100) {
        setOrientation('horizontal');
      } else {
        setOrientation('vertical');
      }

      const checkIsScrollTab = () => typeof window !== "undefined" && window.innerWidth <= 900;
  
      setIsScrolTab(checkIsScrollTab());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const handleDownloadPDF = (pdfData) => {
    window.open(pdfData.url, '_blank');
  };



  


  return (
    <>
      <Head>
        <title>Kurumsal | Kuramer</title>
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
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}>{kategori.title}</Typography>} value={kategori.url} />
              ))}
            </Tabs>
          </div>


          <div className={styles.rightContainer}>
            <div className={styles.verticalTabsContent}>
              <TabPanel value={path} index={items[0].url}>
                
                {isPagesLoading  ? (
                  <div className={styles.loader}>
                    <CircularProgress />
                  </div>
                ) : errorPage ? (
                  <div className={styles.errorMessage}>
                    {errorPage}
                  </div>
                ) :  (
                  <div className={styles.icerik} dangerouslySetInnerHTML={{ __html: tab1?.icerik }} />
                ) 
                }
              </TabPanel>


              <TabPanel value={path} index={items[1].url}>

                {isPagesLoading ? (
                  <div className={styles.loader}>
                    <CircularProgress />
                  </div>
                ) : errorPage ? (
                  <div className={styles.errorMessage}>
                    {errorPage}
                  </div>
                ) : (
                  <div className={styles.icerik} dangerouslySetInnerHTML={{ __html: tab2?.icerik }} />
                ) 
                }
              </TabPanel>
              
              
              <TabPanel value={path} index={items[2].url}>
              </TabPanel>

              <TabPanel value={path} index={items[3].url}>

                {isPagesLoading ? (
                  <div className={styles.loader}>
                    <CircularProgress />
                  </div>
                ) : errorPage ? (
                  <div className={styles.errorMessage}>
                    {errorPage}
                  </div>
                ) : (
                  <div className={styles.icerik} dangerouslySetInnerHTML={{ __html: tab3?.icerik }} />
                ) 
                }
              </TabPanel>

              <TabPanel value={path} index={items[4].url}>
              </TabPanel>


              <TabPanel value={path.replace(/&page=\d+/, '')} index={items[5].url}>

                {isLoading ? (
                  <div className={styles.loader}>
                    <CircularProgress />
                  </div>
                ) : error || errorPage  ? (
                  <div className={styles.errorMessage}>
                    {error || errorPage}
                  </div>
                ) : kamuoyuDuyurulari.length > 0 ? ( 
                  <div className={styles.cardContainer}>
                    {kamuoyuDuyurulari.map((yayin, index) => (
                      <KamuoyuDuyurulariCardOge key={index} yayin={yayin} handleDownloadPDF={handleDownloadPDF} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noDataMessage}>
                    Kayıtlı veri bulunmamaktadır.
                  </div>
                )}
                {!isLoading && !error && totalPages > 0 && (
                  <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                    <Pagination 
                      count={totalPages} 
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