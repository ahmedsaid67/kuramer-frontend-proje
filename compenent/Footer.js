import styles from '../styles/CustomFooter.module.css';
import { API_ROUTES } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {

  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await axios.get(API_ROUTES.SOSYAL_MEDYA_ACTIVE);
        setSocialMedia(response.data);
      } catch (error) {
        console.error('Sosyal medya bilgileri yüklenirken bir hata oluştu:', error);
      }
    };

    fetchSocialMedia();
  }, []);



  return (
    <footer className={styles.customFooter}>
      <div className={styles.footerContent}>

        

        <div className={`${styles.footerSection} ${styles.rightCizgi}`}>

          <h3>İletişim</h3>
          <p>Adres: Elmalıkent Mah. Elmalıkent Cad. No:4 B Blok Kat:3 34764 Ümraniye / İSTANBUL</p>
          <p>Email: <a href="mailto:info@kuramer.org">info@kuramer.org</a></p>
          <p>Telefon: +90 216 474 08 60 / 2910 - 2918</p>
        </div>

        

        <div className={`${styles.footerSection} ${styles.rightCizgi}`}>

          <h3>Hızlı Linkler</h3>
          <ul>
            <li><a href="/">Anasayfa</a></li>
            <li><a href="/yayinlar/kitaplar">Kitap Serileri</a></li>
            <li><a href="/yayinlarimizdan-secmeler">Yayınlarımızdan Seçmeler</a></li>
            <li><a href="/temel-konu-kavramlar">Temel Konu ve Kavramlar</a></li>
            <li><a href="/iletisim">İletişim</a></li>
            <li><a href="/kurumsal?tab=hakkimizda">Hakkımızda</a></li>
          </ul>
        </div>


        <div className={styles.footerSection}>
          <h3>Sosyal Medya ve İlgili Kuruluşlar</h3>
          <div className={styles.socialIcons}>
            {socialMedia.map(media => (
              <a key={media.id} href={media.url} target="_blank" rel="noopener noreferrer">
                <img src={media.img} alt={`${media.name} Icon`} className={styles.icon} />
              </a>
            ))}
          </div>
        </div>
          

      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2024 Kur'an Araştırmaları Merkezi</p>
      </div>
    </footer>
  );
};

export default Footer;
