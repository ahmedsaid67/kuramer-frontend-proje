import React, { useState, useEffect } from 'react';
import { Card, Grid, Container, Paper, Typography } from '@mui/material';
import Link from 'next/link';

const titleStyle = {
  fontSize: '20px',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 550,
  color: 'black',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  '@media (max-width: 768px)': {
    fontSize: '16px',
  },
  '@media (max-width: 600px)': {
    fontSize: '14px',
  },
  marginBottom: 2,
};

const textStyle = {
  fontSize: '15px',
  color: 'black',
  fontFamily: 'Playfair Display, serif', 
  marginBottom: '8px',
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
  '@media (max-width: 600px)': {
    fontSize: '14px',
  },
};

const containerStyles = {
  paddingTop: 1,
  paddingBottom: 1,
  marginBottom: 1,
};

const imageStyle = {
  width: '95%',
  height: 'auto',
  maxWidth: '300px',
  marginBottom: '16px',
};

const paperStyles = {
  padding: 2,
  display: 'flex',
  flexDirection: 'column',
};

const summaryStyle = {
  marginTop: '16px',
  fontSize: '15px',
  color: '#000',
  whiteSpace: 'pre-line',
  fontFamily: 'Playfair Display, serif',
};

const readMoreStyle = {
  marginTop: '8px',
  fontSize: '14px',
  color: '#007BFF',
  cursor: 'pointer',
  textDecoration: 'underline',
};

function KitapCard({ kitap, path, activeTab }) {
  const [windowWidth, setWindowWidth] = useState(0);

  const basePath = path.includes('?') ? path.split('?')[0] : path;
  const linkTo = `${basePath}/${activeTab}/${kitap.slug}`;

  const handleResize = () => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      // Initial value
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  let maxCharacters = 600;

  if (windowWidth < 640) {
    maxCharacters = 50;
  } else if (640 <= windowWidth && windowWidth <= 768) {
    maxCharacters = 150;
  } else if (768 < windowWidth && windowWidth <= 1100) {
    maxCharacters = 350;
  } else if (1100 < windowWidth && windowWidth <= 1300) {
    maxCharacters = 350;
  }

  return (
    <Container sx={containerStyles} maxWidth="lg">
      <Paper elevation={3} sx={paperStyles}>
        <Grid container spacing={-10}>
          <Grid item xs={6} md={4}>
            <Link href={linkTo} passHref>
              <img
                src={kitap.kapak_fotografi}
                alt={kitap.baslik}
                style={imageStyle}
              />
            </Link>
          </Grid>
          <Grid item xs={6} md={8}>
            <Link href={linkTo} passHref>
              <Typography variant="h3" sx={titleStyle}>
                {kitap.ad}
              </Typography>
            </Link>
            <Typography variant="subtitle1" color="body1" gutterBottom sx={textStyle}>
              <span style={{ fontWeight: 'bold' }}>Yazar:</span> {kitap.yazar}
            </Typography>
            {windowWidth < 600 ? (
              <>
                <Typography variant="subtitle1" color="body1" gutterBottom sx={textStyle}>
                  <span style={{ fontWeight: 'bold' }}>Yayın Tarihi:</span> {kitap.yayin_tarihi}
                </Typography>
                <Link href={linkTo} passHref>
                  <Typography component="span" sx={readMoreStyle}>
                    Daha Fazlası...
                  </Typography>
                </Link>
              </>
            ) : (
              <>
                <Typography variant="subtitle1" color="body1" gutterBottom sx={textStyle}>
                  <span style={{ fontWeight: 'bold' }}>Yayın Tarihi:</span> {kitap.yayin_tarihi}
                </Typography>
                <Typography variant="subtitle1" color="body1" gutterBottom sx={textStyle}>
                  <span style={{ fontWeight: 'bold' }}>Sayfa Sayısı:</span> {kitap.sayfa_sayisi}
                </Typography>
                <Typography variant="subtitle1" color="body1" gutterBottom sx={textStyle}>
                  <span style={{ fontWeight: 'bold' }}>ISBN:</span> {kitap.isbn}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={summaryStyle}>
                  <span style={{ fontWeight: 'bold' }}>Özet:</span>
                  {kitap.ozet.length > maxCharacters
                    ? `${kitap.ozet.slice(0, maxCharacters)}...`
                    : kitap.ozet}
                  {kitap.ozet.length > maxCharacters && (
                    <Link href={linkTo} passHref>
                      <Typography component="span" sx={readMoreStyle}>
                        Detaylı İncele
                      </Typography>
                    </Link>
                  )}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default KitapCard;
