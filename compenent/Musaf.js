import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/Musaf.module.css';
import { API_ROUTES } from '../utils/constants';

const Musaf = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(API_ROUTES.HOME_PAGE_COMPENENTS_GET_GORSEL.replace('data', 'kuran-i-kerim'))
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      {data && (
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.leftContent}>
              <div className={styles.textContainer}>
                <h1 className={styles.baslik}>{data.baslik}</h1>
                <h4 className={styles.altbaslik}>{data.alt_baslik}</h4>
                <p className={styles.metin}>{data.icerik}</p>
                <Link href={data.url}>
                  <button className={styles.customButton}>Daha fazlası için tıklayınız</button>
                </Link>
              </div>
            </div>
            <div className={styles.rightContent}>
              <img src={data.img} alt={data.name} className={styles.rightImage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Musaf;


