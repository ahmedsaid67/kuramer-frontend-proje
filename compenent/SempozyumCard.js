import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';


const cardStyle = {
  maxWidth: 325,
  minWidth: 325,
  maxHeight: 550,
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
  marginLeft:1,
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
  marginBottom: 2,
  marginLeft:0,
};

const dateStyle = {
  fontSize: '15px', // Font boyutunu küçült
  color: '#343434',
  display: 'flex',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media (max-width: 768px)': {
    fontSize: '13px',
  },
};

const placeStyle = {
  fontSize: '15px', // Font boyutunu küçült
  color: '#343434',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: 2,
  marginBottom: 2,
  '@media (max-width: 768px)': {
    fontSize: '13px',
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


const SempozyumCard= ({ data,path }) => {

  


  const formatDateWithoutTimeZone = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', options).format(date);
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
    const partFirst=path.split('?')[0]
    const partSecond=path.split('tab=')[1]?.split('&')[0] 
    const url =`${partFirst}/${partSecond}`
    return `${url}/${slug}-${data.id}`;
  };
  
  // Usage
  const linkTo = generateLink(data);
  

  return (
    
      <Card sx={cardStyle}>
        <Link href={linkTo} passHref>
          <CardMedia
            component="img"
            image={data.kapak_fotografi}
            alt="Sempozyum Kapak Fotoğrafı"
            sx={mediaStyle}
          />
        </Link>
        <CardContent sx={contentStyle}>
          <Link href={linkTo} passHref> 
            <Typography sx={titleStyle}> 
              {data.baslik}
            </Typography>
          </Link>   
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
            <FontAwesomeIcon icon={faCalendar} style={iconStyle} />
            <Typography sx={{...dateStyle, marginLeft: '5px'}} variant="body3">
              {formatDateWithoutTimeZone(data.tarih)}
            </Typography>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
          <FontAwesomeIcon icon={faLocationDot} style={iconStyle} />
            <Typography sx={{ ...placeStyle, marginLeft: '5px' }} variant="body3">
              {data.konum}
            </Typography>
          </div>

          

        </CardContent>
      </Card>
  );
};



export default SempozyumCard;  
