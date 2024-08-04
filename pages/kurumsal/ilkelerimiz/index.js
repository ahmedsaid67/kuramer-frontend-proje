// TemelKonuKavramlar.js
import React, { useState, useEffect } from 'react';
import {Tab, Tabs, Typography } from '@mui/material';
import TabPanel from '../../../compenent/TabPanel';
import styles from '../../../styles/Ilkelerimiz.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BaslikGorselCompenent from '../../../compenent/BaslikGorselCompenent';
import { API_ROUTES } from '../../../utils/constants';
import CircularProgress from '@mui/material/CircularProgress'; // Yükleme göstergesi için ekleyin
import axios from 'axios';

function Index() {
  

  const router = useRouter();
  const [orientation, setOrientation] = useState('vertical'); // Default olarak 'vertical'
  const [pages,setPages] = useState({})
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const path = router.asPath;
  const [errorPage, setErrorPage] = useState(null);

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
        //console.log("items:",response.data.items)
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
    setIsLoading(true);
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
      }
      
  
    } catch (error) {
      setErrorPage('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      console.log("error:", error);
    } finally {
      setIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
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

  
  useEffect(() => {
    if (items.length>0) {
      const urls = items.map(item => item.url);
      if (!urls.includes(path.replace(/&page=\d+/, ''))) {
        router.push('/hata-sayfasi');
      }else{
        pagesFetchData();
    
      }
      
    }
  }, [items,path]);
  
  const handleTabChange = (event, newValue) => {
    router.push(newValue, undefined, { shallow: true });
  };




useEffect(() => {
    // Ekran genişliğine bağlı olarak orientation'ı ayarla
    const handleResize = () => {
      if (window.innerWidth <= 1100) {
        setOrientation('horizontal');
      } else {
        setOrientation('vertical');
      }
    };
  
    // Sayfa yüklendiğinde ve pencere boyutu değiştiğinde kontrol et
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 

  return (
    <>
    <Head>
      <title>İlkelerimiz | Kuramer</title>
      <link rel="icon" href="/kuramerlogo.png" />
    </Head>

    {loading ? (
      <div className={styles.loaderMain}>
        <CircularProgress />
      </div>
    ) : itemsError || errorPage ? (
      <div className={styles.errorMessage}>{itemsError || errorPage}</div>
    ) : items.length > 0 ? (
      <>
        <BaslikGorselCompenent
          data={getDataForBaslikGorsel()}
          altPage={true}
          dinamicPage={{}}
          isLoading={isLoading}
        />

        <div className={styles.mainContainer}>
          <div className={styles.leftContainer}>
            <Tabs
                orientation={orientation}
                variant="fullWidth"
                value={path.replace(/&page=\d+/, '')}
                onChange={handleTabChange}
                className={styles.verticalTabs}
                aria-label="Vertical tabs example"
                centered
            >
              {items.map((kategori, key) => (
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
                }}>{kategori.title}
                    </Typography>
                  }
                  value={kategori.url}
                />
              ))}
            </Tabs>
          </div>

          <div className={styles.rightContainer}>
            <div className={styles.verticalTabsContent}>
            <TabPanel value={path} index={items[0].url}>
                
                {isLoading ? (
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


              <TabPanel value={path} index={items[1].url}>

                {isLoading ? (
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
                {isLoading ? (
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
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className={styles.noDataMessage}>Kayıtlı Öge verisi bulunmamaktadır.</div>
    )}
  </>
);

}

export default Index;