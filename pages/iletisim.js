import Head from 'next/head'
import styles from "../styles/Iletisim.module.css"
import BaslikGorselCompenent from '../compenent/BaslikGorselCompenent';
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress'; 
import { API_ROUTES } from '../utils/constants';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Iletisim() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const router = useRouter();
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
      pagesFetchData(path.split('?')[0])
    }
  },[items])

  return (
    <div>
      <Head>
        <title>İletişim | Kuramer</title>
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
            data={pages}
            altPage={false}
            dinamicPage={{}}
            isPagesLoading={isPagesLoading}
          />

          {errorPage ? (
            <div className={styles.errorMessage}>{errorPage}</div>
          ) : (
            <div className={styles.page}>
              <section className={styles.contactInfo}>
                <div className={styles.card}>
                  <h3>Adresimiz</h3>
                  <p>Elmalikent Mah. Elmalikent Cad. No:4 B Blok Kat:3 34764 Ümraniye / İstanbul</p>
                </div>

                <div className={styles.card}>
                  <h3>Telefon</h3>
                  <p>+90 216 474 08 60 / 2910 - 2918</p>
                </div>

                <div className={styles.card}>
                  <h3>E-posta</h3>
                  <p className={styles.mail}>
                    <a href="mailto:info@kuramer.org">info@kuramer.org</a>
                  </p>
                </div>

                <div className={styles.card} id={styles.socialCard}>
                  <h3>Bizi Takip Edin</h3>
                  <div className={styles.socialIcons}>
                    <a
                      href="https://www.facebook.com/profile.php?id=100022853400645"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/icons/facebook.png" alt="Facebook" className={styles.icon} />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/kuramer"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/icons/linkedin.png" alt="LinkedIn" className={styles.icon} />
                    </a>
                    <a
                      href="https://twitter.com/kuramer_"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/icons/twitter.png" alt="Twitter" className={styles.icon} />
                    </a>
                    <a
                      href="https://www.youtube.com/c/KuranAraştırmalarıMerkeziKURAMER/featured"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/icons/youtube.png" alt="YouTube" className={styles.icon} />
                    </a>
                  </div>
                </div>
              </section>

              <div className={styles.map}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96311.2619001974!2d28.946335297265623!3d41.0312297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7fb3558c6d1%3A0xd65734d1cb19db8c!2sKURAMER!5e0!3m2!1str!2str!4v1707150169725!5m2!1str!2str"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.infoMessage}>Kayıtlı Öge verisi bulunmamaktadır.</div>
      )}
    </div>
  );
  
}  