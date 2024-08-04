
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Secmeler.module.css';
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


export default function YayinlarimizdanSecmeler() {
  const [secmeler, setSecmeler] = useState([]);

  useEffect(() => {
    // API çağrısı için kullanılan endpoint
    const apiUrl = API_ROUTES.YAYINLARIMIZDAN_SECMELER_ACTIVE.replace("currentPage",1);

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setSecmeler(response.data.results);
      } catch (error) {
        console.error('API çağrısı sırasında bir hata oluştu:', error.message);
      }
    };

    fetchData(); // useEffect içinde API çağrısını başlat

  }, []); // Boş dependency array, sadece bir kere çağrılmasını sağlar

  const settings = {
    dots: true,
    infinite: secmeler.length >= 5,
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
          infinite: secmeler.length >= 3,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2, 
          infinite: secmeler.length >= 2,
        }
      },
      {
        breakpoint: 768, // Ekran genişliği 768 pikselden küçükse
        settings: {
          slidesToShow: 1, // Gösterilecek kart sayısını 2'ye düşür
          infinite: secmeler.length >= 1,
        }
      }
    ]
  };


  const generateLink = (data) => {
    const convertToUrlFriendly = (text) => {
      if (text && typeof text === 'string') {
        const turkishCharacters = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'İ': 'i' };
        const cleanedText = text.trim().toLowerCase();
        const urlFriendlyText = Array.from(cleanedText).map(char => turkishCharacters[char] || char).join('');
        return urlFriendlyText.replace(/[\s,\.]+/g, '-'); // Remove spaces, commas, and dots
      }
      return '';
    };
  
    const slug = convertToUrlFriendly(data.baslik);
    return `/yayinlarimizdan-secmeler/${slug}-${data.id}`;
  };

  return (
    <>
      {secmeler.length > 0 && (
          <div className={styles.container}>
            <Link href={"/yayinlarimizdan-secmeler"}>
              <h1 className={styles.title}>YAYINLARIMIZDAN SEÇMELER</h1>
            </Link>
              <div className={styles.carouselContainer}>
                <Slider {...settings}>
                  {secmeler.map((seri) => (
                    <div key={seri.id} className={styles.card}>
                      <Link href={generateLink(seri)}>
                        <Image src={seri.kapak_fotografi} alt={seri.baslik} width={240} height={352} className={styles.cardImage} loading="eager" />
                      </Link>
                      <Link href={generateLink(seri)}>
                        <p className={styles.cardText}>{seri.baslik}</p>
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
