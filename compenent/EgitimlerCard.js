import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFeather } from '@fortawesome/free-solid-svg-icons';


const cardStyle = {
  maxWidth: 325,
  minWidth: 325,
  maxHeight: 500,
  minHeight: 300,
  border: '1px solid #ccc',
  borderRadius: 4,
};

const mediaStyle = {
  height: 200,
  objectFit: 'cover',
};

const titleStyle = {
  fontSize: '14px', // Font boyutunu küçült
  fontWeight: 550,
  color: '#343434',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  borderBottom: '1px solid #ccc', // Üst kenara gri bir çizgi ekle
  padding:1,
  '@media (max-width: 768px)': {
    fontSize: '13px',
  },
  marginBottom: 1,
};

const dateStyle = {
  fontSize: '15px', // Font boyutunu küçült
  color: '#343434',
  display: 'flex',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: 2,
  marginBottom: 2,
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
};

const authorStyle = {
  fontSize: '15px', // Font boyutunu küçült
  color: '#343434',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
};

const iconStyle = { // İkonlar için ortak stil
  width: '20px',
  height: '20px',
  marginRight: '5px',
  marginLeft:'5px'
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0.5rem',
  flex: 1, // İçerik konteynerini genişlet
};

const buttonContainerStyle = {
  textAlign: 'center',
  padding: '0.1rem',
  borderTop: '1px solid #ccc', // Üst kenara gri bir çizgi ekle
  backgroundColor: 'white', // Arkaplan rengini beyaz yap
  
};

const buttonStyle = {
  fontSize: '12px',
  width: '100%',
  borderRadius: 0, // Köşelerin kavisini kaldır
  '@media (max-width: 768px)': {
    fontSize: '10px',
  },

};

const KonferansCard = ({ data, path }) => {

  const formatDateWithoutTimeZone = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', options).format(date);
  };
  
  const partFirst=path.split('?')[0]
  const partSecond=path.split('tab=')[1]?.split('&')[0] 
  const url =`${partFirst}/${partSecond}`
  const linkTo = `${url}/${data.slug}`;

  return (
    <Card sx={cardStyle}>
      <Link href={linkTo} passHref>
        <CardMedia
          component="img"
          image={data.kapak_fotografi}
          alt="Konferans Kapak Fotoğrafı"
          sx={mediaStyle}
        />
      </Link>
      <CardContent sx={contentStyle}>
        <Link href={linkTo} passHref>
          <Typography sx={titleStyle} > 
            {data.baslik}
          </Typography>
        </Link>

        
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 1  }}>
            <FontAwesomeIcon icon={faFeather} style={iconStyle} />
                <Typography sx={{ ...authorStyle, marginLeft: '5px' }} variant="body3">
                {data.egitmen}
                </Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 1  }}>
            <FontAwesomeIcon icon={faCalendar} style={iconStyle} />
                <Typography sx={{ ...dateStyle, marginLeft: '5px' }} variant="body3">
                {formatDateWithoutTimeZone(data.tarih)}
                </Typography>
            </div>
       




      </CardContent>
    </Card>
  );
};

export default KonferansCard;  
