import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

const cardStyle = {
  maxWidth: 350,
  minWidth: 350,
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
  padding:1,
  '@media (max-width: 768px)': {
    fontSize: '13px',
  },
  marginBottom: 1,
};


const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0.5rem',
  flex: 1, // İçerik konteynerini genişlet
};


const ArastirmaCard = ({ data,path }) => {
  

  // Usage
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
          alt="Araştırma Kapak Fotoğrafı"
          sx={mediaStyle}
        />
      </Link>
      
      <CardContent sx={contentStyle}>
        <Link href={linkTo} passHref>
          <Typography sx={titleStyle} > 
            {data.baslik}
          </Typography>
        </Link>

      </CardContent>
    </Card>
  );
};

export default ArastirmaCard;  
