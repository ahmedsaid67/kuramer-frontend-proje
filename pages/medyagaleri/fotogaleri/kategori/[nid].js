import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { API_ROUTES } from '../../../../utils/constants';
import styles from '../../../../styles/FotoGaleriDetay.module.css';
import PhotoGalleryViewer from '../../../../compenent/PhotoGalleryViewer';
import BaslikGorsel from '../../../../compenent/BaslikGorsel';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import {Pagination} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function FotoGalleryPage() {
  const router = useRouter();
  const { nid, albumId } = router.query;
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentPage = parseInt(router.query.page || '1', 10);
  const [totalPages, setTotalPages] = useState(0);


  const [snackbarAcik, setSnackbarAcik] = useState(false);
  const [snackbarMesaj, setSnackbarMesaj] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    if (!router.isReady) return;
  
    // router.query artık kullanılabilir
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.FOTO_GALERI_KATEGORI_FILTER.replace("seciliKategori", nid).replace('currentPage', currentPage));
        setAlbums(response.data.results);
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
        setIsLoading(false);
      }
    };
    fetchData();
  }, [nid, currentPage, router.isReady]);
  

  const handleAlbumClick = async (selectedAlbum) => {
    try {
      const response = await axios.get(API_ROUTES.ALBUM_IMAGES_KATEGORI_FILTER.replace("seciliKategori", selectedAlbum.id));
      const images = response.data;
      if (images.length > 0) {
        setSelectedAlbum({ images });
        setViewerOpen(true);
        setShowMessage(false);
      } else {
        setSnackbarMesaj("Bu albümde hiç resim bulunmamaktadır.");
        setSnackbarSeverity('info');
        setSnackbarAcik(true);
      }
    } catch (error) {
      setSnackbarMesaj('Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      setSnackbarSeverity('error');
      setSnackbarAcik(true);
    }
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };


  const handleChangePage = (event, value) => {
    router.push(`/medyagaleri/fotogaleri/kategori/${nid}?page=${value}`, undefined, { shallow: true });
  };




  const snackbarKapatmaIsleyici = () => {
    setSnackbarAcik(false);
  };

  return (
    <div>
      <Head>
        <title>Fotoğraf Galerisi | Kuramer</title>
        <link rel="icon" href="/kuramerlogo.png" />
      </Head>


      <BaslikGorsel metin={"Fotoğraf Galerisi"} />

      
      <div className={styles.galleryContainer}>
        {isLoading ? (
          <div className={styles.loader}>
            <CircularProgress />
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            {error}
          </div>
        ) : albums.length > 0 ? (
          albums.map((album) => (
            <div key={album.id} className={styles.albumCard} onClick={() => handleAlbumClick(album)}>
              <div className={styles.albumImage} >
              <Image src={album.kapak_fotografi} alt={album.baslik} width={280} height={200} />
              </div>
              
              <div className={styles.albumTitle} onClick={() => handleAlbumClick(album)}>{album.baslik}</div>
            </div>
          ))
        ) : (
          <div className={styles.noDataMessage}>Albüm bulunmamaktadır.</div>
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
      <Snackbar open={snackbarAcik} autoHideDuration={6000} onClose={snackbarKapatmaIsleyici}>
        <Alert onClose={snackbarKapatmaIsleyici} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMesaj}
        </Alert>
      </Snackbar>
      {viewerOpen && (
        <PhotoGalleryViewer images={selectedAlbum?.images || []} onClose={handleCloseViewer} />
      )}
    </div>
  );
}







