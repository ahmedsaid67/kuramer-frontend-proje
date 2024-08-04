import React from 'react';
import styles from '../styles/PersonellerCardOge.module.css';
import Link from 'next/link';

// Utility function to convert text to a URL-friendly slug
const toSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

function CardOge({ yayin,path,activeTab }) {
  const slugAd = toSlug(yayin.ad);
  const slugSoyad = toSlug(yayin.soyad);
  const basePath = path.includes('?') ? path.split('?')[0] : path;

  return (
    <div className={styles.containerStyle}>
      <img
        src={yayin.img}
        alt={`${yayin.ad} ${yayin.soyad}`}
        className={styles.imageStyle}
      />
      <p className={styles.textStyle}>{yayin.unvan} {yayin.ad} {yayin.soyad}</p>
      {yayin.icerik && ( // Koşullu render: yayin.pdf_dosya değeri varsa aşağıdaki div gösterilir
        <Link href={`${basePath}/${activeTab}/${slugAd}-${slugSoyad}-${yayin.id}`}>  
          <div className={styles.gecmisHoverEffect}>
            Özgeçmiş
          </div>
        </Link>
      )}
    </div>
  );
}

export default CardOge;







