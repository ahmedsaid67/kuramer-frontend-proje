// TemelKonuKavramlar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Tab, Tabs, Typography, Pagination} from '@mui/material';
import TabPanel from '../../compenent/TabPanel';
import styles from '../../styles/TemelKonularKavram.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { API_ROUTES } from '../../utils/constants';
import SempozyumCard from '../../compenent/SempozyumCard';
import CalistayCard from '../../compenent/CalistayCard';
import KonferansCard from '../../compenent/KonferansCard';
import ArastirmaCard from '../../compenent/ArastirmaCard';
import EgitimCard from '../../compenent/EgitimlerCard';

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'; // Yükleme göstergesi için ekleyin
import BaslikGorselCompenent from '../../compenent/BaslikGorselCompenent';


function Index() {
  const [sempozyumlar, setSempozyumlar] = useState([]);
  const [calistay, setCalistay] = useState([]);
  const [konferanslar, setKonferanslar] = useState([]);
  const [arastirmalar, setArastirmalar] = useState([]);
  const [egitimler, setEgitimler] = useState([]);

  const router = useRouter();
  const [orientation, setOrientation] = useState('vertical'); // Default olarak 'vertical'


  const [totalPagesSempozyumlar, setTotalPagesSempozyumlar] = useState(0);
  const [totalPagesCalistay, setTotalPagesCalistay] = useState(0);
  const [totalPagesKonferanslar, setTotalPagesKonferanslar] = useState(0);
  const [totalPagesArastirmalar, setTotalPagesArastirmalar] = useState(0);
  const [totalPagesEgitimler, setTotalPagesEgitimler] = useState(0);
  const [error, setError] = useState(null);
  
  const [isLoadingSempozyumlar,setIsLoadingSempozyumlar] = useState(true)
  const [isLoadingCalistaylar,setIsLoadingCalistaylar] = useState(true)
  const [isLoadingKonferanslar,setIsLoadingKonferanslar] = useState(true)
  const [isLoadingArastirmalar,setIsLoadingArastirmalar] = useState(true)
  const [isLoadingEgitimler,setIsLoadingEgitimler] = useState(true)

  const [isScrolTab, setIsScrolTab] = useState(false);
  const [variant, setVariant] = useState('fullWidth');

  const [errorPage, setErrorPage] = useState(null);
  const [isPagesLoading, setPagesIsLoading] = useState(true); // Yükleme durumu için state
  const currentPage = parseInt(router.query.page || '1', 10);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const path = router.asPath;


  const [tab1,setTab1]=useState({})
  const [tab2,setTab2]=useState({})
  const [tab3,setTab3]=useState({})
  const [tab4,setTab4]=useState({})
  const [tab5,setTab5]=useState({})
  const [tab6,setTab6]=useState({})


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
      } else if (url === items[2].url) {
        // Check if tab3 has data, otherwise fetch it
        if (!Object.keys(tab3).length > 0) {
          const response3 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab3(response3.data); // Store the fetched data in tab3
        }
      } else if (url === items[3].url) {
        // Check if tab4 has data, otherwise fetch it
        if (!Object.keys(tab4).length > 0) {
          const response4 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab4(response4.data); // Store the fetched data in tab4
        }
      }else if (url === items[4].url) {
        // Check if tab3 has data, otherwise fetch it
        if (!Object.keys(tab5).length > 0) {
          const response5 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab5(response5.data); // Store the fetched data in tab3
        }
      } else if (url === items[5].url) {
        // Check if tab4 has data, otherwise fetch it
        if (!Object.keys(tab6).length > 0) {
          const response6 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: url });
          setTab6(response6.data); // Store the fetched data in tab4
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
      case items[3].url:
        return tab4;
      case items[4].url:
        return tab5;
      case items[5].url:
        return tab6;
      default:
        return {};
    }
  };

    const fetchData = async (currentPage) => {
      setIsLoadingSempozyumlar(true);
      setIsLoadingCalistaylar(true)
      setIsLoadingKonferanslar(true)
      setIsLoadingArastirmalar(true)
      setIsLoadingEgitimler(true)
      try {
        let response;
        if (path.replace(/&page=\d+/, '') === items[1].url) {
          const sempozyumlarUrl = API_ROUTES.SEMPOZYUMLAR_ACTIVE.replace('currentPage', currentPage);
          response = await axios.get(sempozyumlarUrl);
          setSempozyumlar(response.data.results);
          setTotalPagesSempozyumlar(Math.ceil(response.data.count / 10));
          setIsLoadingSempozyumlar(false)
        } else if (path.replace(/&page=\d+/, '') === items[2].url) {
          const calistayUrl = API_ROUTES.CALISTAYLAR_ACTIVE.replace('currentPage', currentPage);
          response = await axios.get(calistayUrl);
          setCalistay(response.data.results);
          setTotalPagesCalistay(Math.ceil(response.data.count / 10));
          setIsLoadingCalistaylar(false)
        } else if (path.replace(/&page=\d+/, '') === items[3].url) {
          const konferanslarUrl = API_ROUTES.KONFERANSLAR_ACTIVE.replace('currentPage', currentPage);
          response = await axios.get(konferanslarUrl);
          setKonferanslar(response.data.results);
          setTotalPagesKonferanslar(Math.ceil(response.data.count / 10));
          setIsLoadingKonferanslar(false)
        } else if (path.replace(/&page=\d+/, '') === items[4].url) {
          const arastirmalarUrl = API_ROUTES.ARASTIRMALAR_ACTIVE.replace('currentPage', currentPage);
          response = await axios.get(arastirmalarUrl);
          setArastirmalar(response.data.results);
          setTotalPagesArastirmalar(Math.ceil(response.data.count / 10));
          setIsLoadingArastirmalar(false)
        }
        else if (path.replace(/&page=\d+/, '') === items[5].url) {
          const egitimlerUrl = API_ROUTES.EGITIMLER_ACTIVE.replace('currentPage', currentPage);
          response = await axios.get(egitimlerUrl);
          setEgitimler(response.data.results);
          setTotalPagesEgitimler(Math.ceil(response.data.count / 10));
          setIsLoadingEgitimler(false)
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
          if (items.slice(1, 6).some(item => path.replace(/&page=\d+/, '') === item.url)) {
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

      const checkIsScrollTab = () => typeof window !== "undefined" && window.innerWidth <= 1100;
  
      setIsScrolTab(checkIsScrollTab());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  





  useEffect(() => {
    const calculateTabWidths = () => {
      const containerWidth = window.innerWidth; 
      const maxTabWidth = 200; 
      const minTabWidth = 100;
      const tabPadding = 30; 
    
      let tabWidth = Math.max(containerWidth / 5 - tabPadding, minTabWidth);
      

      if (tabWidth > maxTabWidth) {
        tabWidth = maxTabWidth;
      }
      

      const totalTabsWidth = 5 * (tabWidth + tabPadding);
  


      if (totalTabsWidth > containerWidth) {
        setVariant('scrollable');
      } else {
        setVariant('fullWidth');
      }
    };
  
    calculateTabWidths();
    window.addEventListener('resize', calculateTabWidths);
  
    return () => {
      window.removeEventListener('resize', calculateTabWidths);
    };
  }, []);
  
  


  return (
    <>
      <Head>
        <title>Faaliyetler | Kuramer</title>
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

              <TabPanel value={path.replace(/&page=\d+/, '')} index={items[1].url}>
                  {isLoadingSempozyumlar ? (
                    <div className={styles.loader}>
                      <CircularProgress />
                    </div>
                  ) : error || errorPage  ? (
                    <div className={styles.errorMessage}>
                      {error || errorPage }
                    </div>
                  ) : sempozyumlar.length > 0 ? (
                    <div className={styles.cardContainer}>
                      {sempozyumlar.map((yayin, index) => (
                        <SempozyumCard key={index} data={yayin} path={path} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noDataMessage}>
                      Kayıtlı veri bulunmamaktadır.
                    </div> 
                  )}
                  {!isLoadingSempozyumlar && !error && totalPagesSempozyumlar > 0 && (
                    <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                      <Pagination 
                        count={totalPagesSempozyumlar} 
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
                {isLoadingCalistaylar ? (
                    <div className={styles.loader}>
                      <CircularProgress />
                    </div>
                  ) : error || errorPage ? (
                    <div className={styles.errorMessage}>
                      {error || errorPage}
                    </div>
                  ) : calistay.length > 0 ? (
                    <div className={styles.cardContainer}>
                      {calistay.map((yayin, index) => (
                        <CalistayCard path={path} key={index} data={yayin}/>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noDataMessage}>
                      Kayıtlı veri bulunmamaktadır.
                    </div> 
                  )}
                  {!isLoadingCalistaylar && !error && totalPagesCalistay > 0 && (
                    <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                      <Pagination 
                        count={totalPagesCalistay} 
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

              <TabPanel value={path.replace(/&page=\d+/, '')} index={items[3].url}>
                {isLoadingKonferanslar ? (
                    <div className={styles.loader}>
                      <CircularProgress />
                    </div>
                  ) : error || errorPage ? (
                    <div className={styles.errorMessage}>
                      {error || errorPage}
                    </div>
                  ) : konferanslar.length > 0 ? (
                    <div className={styles.cardContainer}>
                      {konferanslar.map((yayin, index) => (
                        <KonferansCard path={path} key={index} data={yayin} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noDataMessage}>
                      Kayıtlı veri bulunmamaktadır.
                    </div> 
                  )}
                  {!isLoadingKonferanslar && !error && totalPagesKonferanslar > 0 && (
                    <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                      <Pagination 
                        count={totalPagesKonferanslar} 
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

              <TabPanel value={path.replace(/&page=\d+/, '')} index={items[4].url}>
                {isLoadingArastirmalar ? (
                    <div className={styles.loader}>
                      <CircularProgress />
                    </div>
                  ) : error || errorPage ? (
                    <div className={styles.errorMessage}>
                      {error || errorPage}
                    </div>
                  ) : arastirmalar.length > 0 ? (
                    <div className={styles.cardContainer}>
                      {arastirmalar.map((yayin, index) => (
                        <ArastirmaCard path={path} key={index} data={yayin}  />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noDataMessage}>
                      Kayıtlı veri bulunmamaktadır.
                    </div> 
                  )}
                  {!isLoadingArastirmalar && !error && totalPagesArastirmalar > 0 && (
                    <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                      <Pagination 
                        count={totalPagesArastirmalar} 
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
              
              <TabPanel value={path.replace(/&page=\d+/, '')} index={items[5].url}>
                {isLoadingEgitimler ? (
                    <div className={styles.loader}>
                      <CircularProgress />
                    </div>
                  ) : error || errorPage ? (
                    <div className={styles.errorMessage}>
                      {error || errorPage}
                    </div>
                  ) : egitimler.length > 0 ? (
                    <div className={styles.cardContainer}>
                      {egitimler.map((yayin, index) => (
                        <EgitimCard path={path} key={index} data={yayin} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noDataMessage}>
                      Kayıtlı veri bulunmamaktadır.
                    </div> 
                  )}
                  {!isLoadingEgitimler && !error && totalPagesEgitimler > 0 && (
                    <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                      <Pagination 
                        count={totalPagesEgitimler} 
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