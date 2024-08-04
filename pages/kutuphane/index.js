
import React, { useState, useEffect } from 'react';
import { Button, Tab, Tabs, Typography } from '@mui/material';
import TabPanel from '../../compenent/TabPanel';
import styles from '../../styles/Kutuphane.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BaslikGorselCompenent from '../../compenent/BaslikGorselCompenent';
import CircularProgress from '@mui/material/CircularProgress'; 
import { API_ROUTES } from '../../utils/constants';
import axios from 'axios';

function Index() {
  const [kutuphaneGorseller, setKutuphaneGorseller] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const router = useRouter();
  const [orientation, setOrientation] = useState('vertical'); // Default olarak 'vertical'

  const [isScrolTab, setIsScrolTab] = useState(false);
  const [variant, setVariant] = useState('fullWidth');

  const [errorPage, setErrorPage] = useState(null);
  const [isPagesLoading, setPagesIsLoading] = useState(true); // Yükleme durumu için state


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
      default:
        return {};
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // public klasöründeki görselleri al
        const files = [
          '/static/gorseller/kutupFoto1.jpg',
          '/static/gorseller/kutupFoto2.jpg',
          '/static/gorseller/kutupFoto3.jpg',
          '/static/gorseller/kutupFoto4.jpg',
        ];
        setKutuphaneGorseller(files);
      } catch (error) {
        console.error('Hata oluştu:', error);
      }
    };

    fetchData();
  }, []);



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


  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
    setModalOpen(false);
    document.body.style.overflow = 'auto';
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
        <title>Kütüphane | Kuramer</title>
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
                <>
                <div className={styles.icerik} dangerouslySetInnerHTML={{ __html: tab2?.icerik }} />

                <div className={styles.imageGallery}>
                  {kutuphaneGorseller.map((image, index) => (
                    <div key={index} className={styles.thumbnailContainer} onClick={() => handleImageClick(index)}>
                      <img src={`${image}`} alt={`Kutuphane-${index}`} />
                    </div>
                  ))}
                </div>
                {isModalOpen && selectedImageIndex !== null && (
                  <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent}>
                    <img
                        src={kutuphaneGorseller[selectedImageIndex]}
                        alt={`Kutuphane-${selectedImageIndex}`}
                        style={{ width: "100%", height: 'auto' }}
                      />
                    </div>
                  </div>
                )}
              </>
              ) 
              }
            
            </TabPanel>


            <TabPanel value={path} index={items[2].url}>
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
                <div className={styles.icerik} dangerouslySetInnerHTML={{ __html: tab4?.icerik }} />
              ) 
              }
              
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