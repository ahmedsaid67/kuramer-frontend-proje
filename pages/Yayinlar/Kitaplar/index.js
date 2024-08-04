import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Typography, Pagination } from '@mui/material';
import TabPanel from '../../../compenent/TabPanel';
import styles from '../../../styles/Kitaplar.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import KitapCard from '../../../compenent/KitapCard';
import KitapCardMobile from '../../../compenent/KitapCardMobile';
import Head from 'next/head';
import { API_ROUTES } from '../../../utils/constants';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'; 
import BaslikGorselCompenent from '../../../compenent/BaslikGorselCompenent';

const convertToUrlFriendly = (text) => {
  if (text && typeof text === 'string') {
    // Öncelikle metinden tek tırnak işaretlerini çıkar
    const textWithoutApostrophes = text.replace(/'/g, '');
    // Türkçe karakterler ve URL dostu hale getirme kuralları
    const turkishCharacters = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
    const cleanedText = textWithoutApostrophes.trim().toLowerCase();
    const urlFriendlyText = Array.from(cleanedText).map(char => turkishCharacters[char] || char).join('');
    // Boşlukları '-' ile değiştir
    return urlFriendlyText.replace(/\s+/g, '-');
  }
  return '';
};


function Kitaplar() {
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [kitaplar, setKitaplar] = useState([]);
  const [orientation, setOrientation] = useState('vertical');
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolTab, setIsScrolTab] = useState(false);
  const [variant, setVariant] = useState('fullWidth');
  const [categoriesError, setCategoriesError] = useState(null)
  const [categoriesLoading,setCategoriesLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0);


   const currentPage = parseInt(router.query.page || '1', 10);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const [pages,setPages] = useState({})
  const [isPagesLoading,setIsPagesLoading] = useState(true)
  const [errorPage, setErrorPage] = useState(null);
  const [dinamicPage,setDinamicPage] = useState({})

  const path = router.asPath;


  const pagesFetchData = async (page) => {
    setIsPagesLoading(true);
    try {
      const ampersandIndex = path.indexOf('?');
      const extractedPath = ampersandIndex !== -1 ? path.slice(0, ampersandIndex) : path;
      //console.log("extractedPath:",extractedPath)
      const response1 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: extractedPath });
      setPages(response1.data); // Değişken adını güncelle
      //console.log("response1:",response1.data)
      setErrorPage(null)
    } catch (error) {
      setErrorPage('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      console.log("error:",error)
    } finally {
      setIsPagesLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };

  useEffect(() => {
    const fetchCategoriesAndValidateTab = async () => {
      if (!router.isReady) return;
  
      setCategoriesLoading(true);
      try {
        const response = await axios.get(API_ROUTES.KITAP_KATEGORI_ACTIVE);
        const categories = response.data;
        setKategoriler(categories);
  
        const tabUrlFriendly = router.query.tab ? convertToUrlFriendly(router.query.tab) : null;
  
        const isValidTab = categories.some(category => convertToUrlFriendly(category.baslik) === tabUrlFriendly);
  
        if (tabUrlFriendly && !isValidTab) {
          router.push('/hata-sayfasi');
          const fakeInitialTab = categories.length > 0 ? convertToUrlFriendly(categories[0].baslik) : '';
          setActiveTab(fakeInitialTab);
        } else {
          if (tabUrlFriendly) {
            setActiveTab(tabUrlFriendly);
            // Kategori adını doğru şekilde ayarla
            const matchingCategory = categories.find(category => convertToUrlFriendly(category.baslik) === tabUrlFriendly);
            if (matchingCategory) {
              pagesFetchData()
              setDinamicPage({name: matchingCategory.baslik, url: path});
              
            }
          } else {
            // İlk kategoriye varsayılan olarak dön
            const initialTab = convertToUrlFriendly(categories[0]?.baslik);
            setActiveTab(initialTab);
            pagesFetchData()
            setDinamicPage({name:categories[0]?.baslik , url: `${path}?tab=${initialTab}`});
          }
        }
  
        setCategoriesError(null);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        setCategoriesError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setCategoriesLoading(false);
      }
    };
  
    fetchCategoriesAndValidateTab();
  }, [router.isReady]);


  const fetchBooks = async (kategoriId,page) => {
    setIsLoading(true);
    try {
      const kitapResponse = await axios.get(API_ROUTES.KITAPLAR_KATEGORI_FILTER.replace("seciliKategori", kategoriId).replace("currentPage",page));
      setKitaplar(kitapResponse.data.results);
      setTotalPages(Math.ceil(kitapResponse.data.count / 10));
      setError(null);
    } catch (error) {
      console.error("Veri yükleme sırasında bir hata oluştu:", error);
      if (error.response && error.response.status === 404 && error.response.data.detail === "Invalid page.") {
        // 'Invalid page' detayını kontrol eden ve buna göre hata mesajı döndüren koşul
        setError('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen sayfa numarasını kontrol edin.');
      } else {
        setError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }finally {
      setIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };
  
  
  useEffect(() => {
    if (activeTab && kategoriler.length > 0) {
      const selectedKategori = kategoriler.find(k => convertToUrlFriendly(k.baslik) === activeTab);
      if (selectedKategori) {
        fetchBooks(selectedKategori.id,currentPage);
        pagesFetchData()
        const newPath = path.includes('?tab=') ? path : `${path}?tab=${activeTab}`;
        setDinamicPage({ name: selectedKategori.baslik, url: newPath });
      }
    }
  }, [kategoriler]);

  useEffect(() => {
    if (router.query.tab && kategoriler.length > 0) {
      setActiveTab(router.query.tab)
      const selectedKategori = kategoriler.find(k => convertToUrlFriendly(k.baslik) === router.query.tab);
      if (selectedKategori) {
        fetchBooks(selectedKategori.id,currentPage);

        pagesFetchData()
        setDinamicPage({name:selectedKategori.baslik , url: `${path}`});
      }
    }else if (router && kategoriler.length > 0){
      const initialTab = convertToUrlFriendly(kategoriler[0]?.baslik);
      setActiveTab(initialTab);
      const selectedKategori = kategoriler[0];
      fetchBooks(selectedKategori.id,currentPage);
      pagesFetchData()
      setDinamicPage({name:selectedKategori.baslik , url: `${path}`});
    }
  }, [router]);


  
  const handleTabChange = (event, newValue) => {
    const basePath = path.includes('?') ? path.split('?')[0] : path;
    router.push(`${basePath}?tab=${newValue}`, undefined, { shallow: true });

  };


  const handlePageChange = (event, value) => {
    const basePath = path.includes('?') ? path.split('?')[0] : path;
    router.push(`${basePath}?tab=${activeTab}&page=${value}`);
  };



  useEffect(() => {
    const calculateTabWidths = () => {
      const containerWidth = window.innerWidth; 
      const maxTabWidth = 200; 
      const minTabWidth = 100;
      const tabPadding = 30; 
    
      let tabWidth = Math.max(containerWidth / kategoriler.length - tabPadding, minTabWidth);
      

      if (tabWidth > maxTabWidth) {
        tabWidth = maxTabWidth;
      }
      
      const totalTabsWidth = kategoriler.length * (tabWidth + tabPadding);

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
  }, [kategoriler]); 



  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth <= 1100 ? 'horizontal' : 'vertical');
      setIsMobile(window.innerWidth <= 480);

      const checkIsScrollTab = () => typeof window !== "undefined" && window.innerWidth <= 1100;
  
      setIsScrolTab(checkIsScrollTab());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);




  return (
    <>
      <Head>
        <title>Kitaplar | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>



      { categoriesLoading ? (
        <div className={styles.loaderMain}>
        <CircularProgress /> 
        </div>)
        : categoriesError || errorPage ? (
        <div className={styles.errorMessage}>{categoriesError || errorPage}</div>
      )
      : kategoriler.length > 0 ? (

      <>

      <BaslikGorselCompenent data={pages} altPage={true} dinamicPage={dinamicPage} isPagesLoading={isPagesLoading}/>
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <Tabs
            orientation={orientation}
            variant={isScrolTab ? variant : "standard"}
            scrollButtons={isScrolTab ? "auto" : false}
            value={activeTab}
            onChange={handleTabChange}
            className={styles.verticalTabs}
            aria-label="Vertical tabs example"
            centered={!isScrolTab}
          >
            {kategoriler.map(kategori => (
              <Tab  sx={{
                borderBottom: 1,
                borderColor: 'divider',
                color: 'black',
                '&.Mui-selected': {
                  color: 'black', // Seçili Tab için de metin rengi siyah olarak ayarlanır
                },
               
              }} key={kategori.id} label={<Typography  component="span" sx={{
                fontWeight: 'bold',
                textTransform: 'none',
              }}>{kategori.baslik}</Typography>} value={convertToUrlFriendly(kategori.baslik)} />
            ))}
          </Tabs>
        </div>

          <div className={styles.rightContainer}>
            <div className={styles.verticalTabsContent}>
              {kategoriler.map(kategori => (
                <TabPanel key={kategori.id} value={activeTab} index={convertToUrlFriendly(kategori.baslik)}>
                  {isLoading ? (
                    <div className={styles.loader}>
                      <CircularProgress />
                    </div>
                    ) : error ? (
                      <div className={styles.errorMessage}>{error}</div>
                    ) : kitaplar.length > 0 ? (
                      <div className={styles.cardContainer}>
                        {isMobile
                        ? kitaplar.map((kitap, index) => (
                            <KitapCardMobile key={index} kitap={kitap }path={path} activeTab={activeTab} />
                          ))
                        : kitaplar.map((kitap, index) => (
                            <KitapCard key={index} kitap={kitap} path={path} activeTab={activeTab}/>
                          ))
                        }
                      </div>
                    ) : (
                      <div className={styles.noDataMessage}>Kayıtlı veri bulunmamaktadır.</div> // Veri yoksa bu mesaj gösterilir
                    )
                    
                    }

                  {!isLoading && !error && totalPages > 0 && (
                    <Stack spacing={2} alignItems="center" className={styles.paginationContainer}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
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
              ))}
            </div>
          </div>
        </div>
        </>
      ): (
        <div className={styles.noDataMessage}>Kayıtlı Kitap Kategorisi bulunmamaktadır.</div>)
      }
    </>
  );
}

export default Kitaplar;