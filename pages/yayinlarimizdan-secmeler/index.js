import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import CardOge from '../../compenent/YayinlarimizdanSecmelerCardOge';
import styles from '../../styles/YayinlarimizdanSecmeler.module.css';
import Head from 'next/head';
import BaslikGorselCompenent from '../../compenent/BaslikGorselCompenent';
import { API_ROUTES } from '../../utils/constants';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'; // Yükleme göstergesi için ekleyin

function YayinlarimizdanSecmeler() {
  const [secmeYayinlar, setSecmeYayinlar] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state
  const [error, setError] = useState(null);
  const router = useRouter();
  const currentPage = parseInt(router.query.page || '1', 10);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const path = router.asPath;

  const [errorPage, setErrorPage] = useState(null);
  const [isPagesLoading, setPagesIsLoading] = useState(true); // Yükleme durumu için state
  const [pages,setPages] = useState([])



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
    try {
      const response1 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: page });
      setPages(response1.data); // Değişken adını güncelle
      setErrorPage(null)
    } catch (error) {
      setErrorPage('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      console.log("error:",error)
    } finally {
      setPagesIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };

  useEffect(()=>{
    if (items.length>0) {
      getData(currentPage)
    }
  },[items,path])

  useEffect(()=>{
    if (items.length>0) {
      pagesFetchData(path.split('?')[0])
    }
  },[items])


    const getData = async (currentPage) => {
      setIsLoading(true); // Yükleme işlemi başladığında
      try {
        const response = await axios.get(API_ROUTES.YAYINLARIMIZDAN_SECMELER_ACTIVE.replace("currentPage", currentPage));
        setSecmeYayinlar(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
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


    const handlePageChange = (event, value) => {
      // Sayfayı yukarı kaydır
      scrollToTop(() => {
        // Kaydırma işlemi tamamlandıktan sonra sayfayı değiştir
        router.push(`${path.split('?')[0]}?page=${value}`, undefined, { shallow: true });
      });
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
    






  return (
    <>
      <Head>
        <title>Yayınlarımızdan Seçmeler | Kuramer</title>
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
          <BaslikGorselCompenent data={pages} altPage={false} dinamicPage={{}} isPagesLoading={isPagesLoading} />
  
          {isLoading || isPagesLoading ? (
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          ) : error || errorPage ? (
            <div className={styles.errorMessage}>{error || errorPage}</div>
          ) : (
            <>
              <div className={styles.Container}>
                <div className={styles.textContainer}>
                  <div dangerouslySetInnerHTML={{ __html: pages?.icerik }} />
                </div>
                <div className={styles.cardContainer}>
                {secmeYayinlar.length > 0 && (
                  
                  secmeYayinlar.map((yayin, index) => (
                    
                    <CardOge path={path} key={index} yayin={yayin} />
                   
                  ))
                  
                )
              }
                </div>

                {secmeYayinlar.length === 0 && (
                   <div className={styles.noDataMessage}>Yayınlarımızdan Seçemlere dair mevcut bir içerik bulunmamaktadır.</div> // Veri yoksa bu mesaj gösterilir
                )}
  
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
              </div>
            </>
          )}
        </>
      ) : (
        <div className={styles.noDataMessage}>Kayıtlı Öge verisi bulunmamaktadır.</div>
      )}
    </>
  );
  
}  

export default YayinlarimizdanSecmeler;
