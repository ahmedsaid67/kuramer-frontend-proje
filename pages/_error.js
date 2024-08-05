// pages/404.js
import Link from 'next/link';
import styles from '../styles/Custom404.module.css'; // Özelleştirilmiş CSS modülü
import Head from 'next/head'

export default function Custom404() {
  return (
    <div className={styles.container}>
       <Head>
                <title>Hata Sayfası | Kuramer</title>
                <link rel="icon" href="/kuramerlogo.png" />
        </Head>
      <h1 className={styles.title}>Oops!</h1>
      <p className={styles.description}>Aradığınız sayfa bulunamadı. Bir hata oluşmuş olabilir veya sayfa kaldırılmış olabilir.</p>
      <Link href="/">
        <div className={styles.homeLink}>Ana Sayfaya Dön</div>
      </Link>
    </div>
  );
}
