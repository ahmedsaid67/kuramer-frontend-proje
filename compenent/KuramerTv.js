// pages/kitapserileri.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/KuramerTv.module.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



import Slider from 'react-slick';
import { API_ROUTES } from '../utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'; 

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={styles.customPrevArrow} onClick={onClick}>
      <FaArrowLeft />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={styles.customNextArrow} onClick={onClick}>
       <FaArrowRight />
    </div>
  );
};

export default function KuramerTv() {
  const [kitapSerileri, setKitapSerileri] = useState([]);

  useEffect(() => {
    // API çağrısı için kullanılan endpoint
    const apiUrl = API_ROUTES.VIDEO_GALERI_ACTIVE;

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setKitapSerileri(response.data.results)
      } catch (error) {
        console.error('API çağrısı sırasında bir hata oluştu:', error.message);
      }
    };

    fetchData(); // useEffect içinde API çağrısını başlat

  }, []); // Boş dependency array, sadece bir kere çağrılmasını sağlar

  

  const settings = {
    dots: true,
    infinite: kitapSerileri.length >= 4,
    speed: 500,
    slidesToShow: 4, // Gösterilecek kart sayısı
    slidesToScroll: 1, // Kaydırılacak kart sayısı
    prevArrow: <CustomPrevArrow />, // Özel önceki ok bileşeni
    nextArrow: <CustomNextArrow /> ,
    responsive: [

      {
        breakpoint: 1400, 
        settings: {
          slidesToShow: 2, 
          infinite: kitapSerileri.length >= 2,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2, 
          infinite: kitapSerileri.length >= 2,
        }
      },
      {
        breakpoint: 768, // Ekran genişliği 768 pikselden küçükse
        settings: {
          slidesToShow: 1, // Gösterilecek kart sayısını 2'ye düşür
          infinite: kitapSerileri.length >= 1,
        }
      }
    ]
  };

  

  return (
    <>
      {kitapSerileri.length > 0 && (
          <div className={styles.container}>
            <Link href={"/medyagaleri/videogaleri/kategori"}>
              <h1 className={styles.title}>KURAMER TV</h1>
            </Link>
            <div className={styles.carouselContainer}>
                <Slider {...settings}>
                  {kitapSerileri.map((seri) => (
                    <div key={seri.id} className={styles.card}>
                      <a href={seri.url}  target="_blank" rel="noopener noreferrer">
                        <Image src={seri.kapak_fotografi} alt={seri.baslik} width={320} height={180} className={styles.cardImage} loading="eager" />
                      </a>
                      <a href={seri.url}  target="_blank" rel="noopener noreferrer">
                        <p className={styles.cardText}>{seri.baslik}</p>
                      </a>
                    </div>
                  ))}
                </Slider>
            </div>
          </div>
      )}
    </>
  );
}
