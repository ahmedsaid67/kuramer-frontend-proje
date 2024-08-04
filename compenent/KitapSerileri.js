import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { API_ROUTES } from '../utils/constants';
import styles from '../styles/KitapSerileri.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 
import Link from 'next/link';

// Helper function to convert titles to URL-friendly strings
const convertToUrlFriendly = (text) => {
  if (text && typeof text === 'string') {
    const turkishCharacters = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
    const cleanedText = text.trim().toLowerCase();
    return Array.from(cleanedText).map(char => turkishCharacters[char] || char).join('').replace(/\s+/g, '-');
  }
  return '';
};

const CustomPrevArrow = ({ onClick, imagesLoaded }) => (
  imagesLoaded ? (
    <div className={styles.customPrevArrow} onClick={onClick}>
      <FaArrowLeft />
    </div>
  ) : null
);

const CustomNextArrow = ({ onClick, imagesLoaded }) => (
  imagesLoaded ? (
    <div className={styles.customNextArrow} onClick={onClick}>
      <FaArrowRight />
    </div>
  ) : null
);

export default function KitapSerileri() {
  const [kitapSerileri, setKitapSerileri] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.KITAP_KATEGORI_ACTIVE);
        setKitapSerileri(response.data);
        await preloadImages(response.data); // Preload images
      } catch (error) {
        console.error('API call error:', error.message);
      }
    };

    fetchData();
  }, []);

  const preloadImages = async (kitapSerileri) => {
    const promises = kitapSerileri.map((seri) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = seri.kapak_fotografi;
        img.onload = resolve;
        img.onerror = reject;
      })
    );
    await Promise.all(promises);
    setImagesLoaded(true); // Set imagesLoaded to true once all images are loaded
  };

  const settings = {
    dots: true,
    infinite: kitapSerileri.length > 3,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow imagesLoaded={imagesLoaded} />,
    nextArrow: <CustomNextArrow imagesLoaded={imagesLoaded} />,
    responsive: [
      {
        breakpoint: 1400,
        settings: { slidesToShow: 3, infinite: kitapSerileri.length > 2 }
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2, infinite: kitapSerileri.length > 1 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, infinite: kitapSerileri.length > 0 }
      }
    ]
  };

  return (
    <div className={styles.container}>
    {kitapSerileri.length === 0 ? (
      // Display placeholder if there are no book series
      <div className={styles.placeholder}></div>
    ) : (
      // Render the book series slider if data is available
      <>
        <Link href="/yayinlar/kitaplar">
          <div><h1 className={styles.title}>KİTAP SERİLERİ</h1></div>
        </Link>
        <div className={styles.carouselContainer}>
          <Slider {...settings}>
            {kitapSerileri.map((seri) => (
              <div key={seri.id} className={styles.card}>
                <Link href={`/yayinlar/kitaplar?tab=${convertToUrlFriendly(seri.baslik)}`}>
                  <div>
                    <img src={seri.kapak_fotografi} alt={seri.baslik} width={240} height={352} className={styles.cardImage} />
                    <p className={styles.cardText}>{seri.baslik}</p>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </>
    )}
  </div>
  );
}

