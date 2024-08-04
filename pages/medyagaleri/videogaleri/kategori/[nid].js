import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { API_ROUTES } from '../../../../utils/constants';
import styles from '../../../../styles/VideoGaleriDetay.module.css';
import BaslikGorselCompenent from '../../../../compenent/BaslikGorselCompenentDetail'
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import {Pagination} from '@mui/material';




export default function FotoGalleryPage() {
  const router = useRouter();
  const { nid, albumId } = router.query;
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentPage = parseInt(router.query.page || '1', 10);
  const [totalPages, setTotalPages] = useState(0);

  const [errorPage, setErrorPage] = useState(null);
  const [isPagesLoading, setPagesIsLoading] = useState(true); // Yükleme durumu için state
  const [pages,setPages] = useState([])
  const [detayItems,setDetayItems] = useState({})
  const [catgoriItem, setcatgoriItem] = useState({});

  const path = router.asPath;


  
  const pagesFetchData = async () => {
    setPagesIsLoading(true);
    try {

      const cleanedPath = path.split('?')[0];
      const pathSegments = cleanedPath.split('/').filter(Boolean);
      const fixedPart = `/${pathSegments.slice(0, 3).join('/')}`;

      
      const response1 = await axios.post(API_ROUTES.SAYFALAR_GET_GORSEL, { url: fixedPart });
      setPages(response1.data); // Değişken adını güncelle
      setErrorPage(null)
    } catch (error) {
      setErrorPage('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      console.log("error:",error)
    } finally {
      setPagesIsLoading(false); // Yükleme işlemi tamamlandığında veya hata oluştuğunda
    }
  };




    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_ROUTES.VIDEO_GALERI_KATEGORI_FILTER.replace("seciliKategori", nid).replace('currentPage', currentPage));
        setVideos(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
        setError(null)

        if (response.data.results[0]){
          setDetayItems({name: response.data.results[0].videogaleri_kategori.baslik, url: router.asPath});
        }
        else{
          const url = path.split('&')[0];
          const parts = url.split('/');
          const slug = parts.pop();
          //console.log("slug:",slug)
          const res=await axios.get(API_ROUTES.VIDEO_GALERI_KATEGORI_SLUG_FILTER.replace("slug", slug));
          //console.log("res:",res.data.baslik)
          setDetayItems({name: res.data.baslik, url: router.asPath});
        }

        
      } catch (error) {
        console.error("Veri yükleme sırasında bir hata oluştu:", error);
        if (error.response && error.response.status === 404) {
          // 'Invalid page' detayını kontrol eden ve buna göre hata mesajı döndüren koşul
          setError('Geçersiz sayfa. Bu sayfa mevcut değil veya sayfa numarası hatalı. Lütfen kontrol edin.');
        } else {
          setError('Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        }
      } finally {
        setIsLoading(false);
      }
    };


  useEffect(() => {
    if (!router.isReady) return;

    fetchData();
    pagesFetchData();
  }, [nid, currentPage, router.isReady]);

  

  const handleChangePage = (event, value) => {
    scrollToTop(() => {
      router.push(`${path.split('?')[0]}?page=${value}`, undefined, { shallow: true });
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




  return (
    <div>
      <Head>
        <title>Video Galerisi | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>

      <BaslikGorselCompenent data={pages} catgoriItem={catgoriItem} detayItems={detayItems} isPagesLoading={isPagesLoading}/>
      <div className={styles.galleryContainer}>
        {isLoading ? (
          <div className={styles.loader}><CircularProgress /></div>
        ) : error || errorPage ? (
          <div className={styles.errorMessage}>
           {error || errorPage}
          </div>
        ) : videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={video.id} className={styles.albumCard}>

                <a href={video.url}  target="_blank" rel="noopener noreferrer">
                  <Image
                    src={video.kapak_fotografi}
                    alt={video.baslik}
                    width={320}
                    height={180}
                  />
                </a>
              
              <div className={styles.albumTitle}>
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  {video.baslik}
                </a>
              </div>
              {(index + 1) % 3 === 0 && <br />} {/* Her üç video kartından sonra bir satır boşluğu ekleyin */}
            </div>
          ))
        ) : (
          <div className={styles.noDataMessage}>
            Yayın bulunmamaktadır.
          </div>
        )}
      </div>

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


    </div>
  );
}