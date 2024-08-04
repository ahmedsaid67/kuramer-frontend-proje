import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { API_ROUTES } from '../../../../utils/constants';
import styles from '../../../../styles/FotoGaleriKategori.module.css';
import Head from 'next/head'
import BaslikGorselCompenent from '../../../../compenent/BaslikGorselCompenent';

export default function Kategori() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [errorPage, setErrorPage] = useState(null);
  const [isPagesLoading, setPagesIsLoading] = useState(true); // Yükleme durumu için state
  const [pages,setPages] = useState([])
  
  const path = router.asPath;
  const [menuItems, setmenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);

  useEffect(() => {
    const menuFetch = async () => {
      setLoading(true); // Yükleniyor durumunu başlat
      setItemsError(null); // Hata durumunu sıfırla

      try {
        
        const parts = path.split('?');
        const firstPart = `${parts[0]}`; // Bu, '/kurumsal' ya da '/kuran-i-kerim' olacaktır
        const response = await axios.post(API_ROUTES.MENU_ALT_OGE, { url: firstPart });
        setmenuItems(response.data.items);
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
    if (menuItems.length>0) {
      pagesFetchData(path.split('?')[0])
    }
  },[menuItems])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.FOTO_GALERI_KATEGORI_ACTIVE);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  const handleNavigate = (item) => {
    router.push({
      pathname: `${path}/${item.slug}`,
    });
  };

  return (
    <>

      <Head>
        <title>Fotoğraf Galeri Kategorisi | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>


      {loading ? (
        <div className={styles.loaderMain}>
          <CircularProgress />
        </div>
      ) : itemsError || errorPage ? (
        <div className={styles.errorMessage}>{itemsError || errorPage}</div>
      ) : menuItems.length > 0 ? (
        <>
          <BaslikGorselCompenent data={pages} altPage={false} dinamicPage={{}} isPagesLoading={isPagesLoading} />
          <div className={styles.kategoriContainer}>
            {isLoading ? (
              <div className={styles.loader}>
                <CircularProgress />
              </div>
            ) : error || errorPage  ? (
                <div className={styles.errorMessage}>
                      {error || errorPage }
                </div>
            ) : items.length > 0 ? (
              items.map((item, orderIndex) => (
                <div key={item.id} className={styles.card} >
                  <div className={styles.cardImageContainer}  onClick={() => handleNavigate(item)}>
                  <Image src={item.kapak_fotografi} alt={item.baslik} width={266} height={150} priority={orderIndex === 0} />
                  </div>
                  
                  <div onClick={() => handleNavigate(item)} className={styles.cardText}>{item.baslik}</div>
                </div>
              ))
            ) : (
              <div className={styles.noDataMessage}>
                      Kayıtlı veri bulunmamaktadır.
              </div>
            )}
          </div>
        </>
  ) : (
    <div className={styles.noDataMessage}>Kayıtlı Öge verisi bulunmamaktadır.</div>
  )}
  </>
  );

  }  