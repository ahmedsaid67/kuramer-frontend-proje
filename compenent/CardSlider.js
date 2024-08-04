// pages/kitapserileri.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/CardSlider.module.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Slider from 'react-slick';
import { API_ROUTES } from '../utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 

const convertToUrlFriendly = (text) => {
  if (text && typeof text === 'string') {
    const turkishCharacters = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
    const cleanedText = text.trim().toLowerCase();
    const urlFriendlyText = Array.from(cleanedText).map(char => turkishCharacters[char] || char).join('');
    return urlFriendlyText.replace(/\s+/g, '-');
  }
  return '';
};


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

export default function CardSlider({id,kitapId,path}) {


  const [kitapSerileri, setKitapSerileri] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API_ROUTES gibi sabitlerin tanımlı olduğu varsayılarak devam ediliyor.
        const apiRoute = API_ROUTES.KITAPLAR_KATEGORI_FILTER_PAGINATIONSUZ.replace('seciliKategori', id);
        const response = await axios.get(apiRoute);
        const kitaplar = response.data.results;

        // kitapId ile eşleşmeyen kitapları filtrele
        const filteredKitaplar = kitaplar.filter(kitap => kitap.id !== kitapId);
        
        setKitapSerileri(filteredKitaplar);
      } catch (error) {
        console.error('API çağrısı sırasında bir hata oluştu:', error.message);
      }
    };

    fetchData();
  }, []);

  

  const settings = {
    dots: true,
    infinite: kitapSerileri.length >= 5,
    speed: 500,
    slidesToShow: 5, // Gösterilecek kart sayısı
    slidesToScroll: 1, // Kaydırılacak kart sayısı
    prevArrow: <CustomPrevArrow />, // Özel önceki ok bileşeni
    nextArrow: <CustomNextArrow /> ,
    responsive: [

      {
        breakpoint: 1400, 
        settings: {
          slidesToShow: 3, 
          infinite: kitapSerileri.length >= 3,
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
        <div className={styles.containerCardSlider}>
          <h1 className={styles.title}>İlgili Kitaplar</h1>
            <div className={styles.carouselContainer}>
              <Slider {...settings}>
                {kitapSerileri.map((seri) => (
                  <div key={seri.id} className={styles.card}>
                    <Link href={`/${path}/${seri.slug}`}>
                      <Image src={seri.kapak_fotografi} alt={seri.ad} width={240} height={352} className={styles.cardImage} loading="eager" />
                    </Link>
                    <Link href={`/${path}/${seri.slug}`}>
                      <p className={styles.cardText}>{seri.ad}</p>
                    </Link>
                  </div>
                ))}
              </Slider>
          </div>
        </div>
    )}
    </>
  );
}
