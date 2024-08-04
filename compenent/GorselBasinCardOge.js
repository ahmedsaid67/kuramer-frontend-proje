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
  '@media (max-width: 768px)': {
    maxWidth: 300,
    minWidth: 300,
  },
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
  '&:hover': {
    color: '#2e5077', // Üzerine gelindiğinde daha açık bir gri
  },
};


const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0.5rem',
  flex: 1, // İçerik konteynerini genişlet
};


const GorselBasinCardOge = ({ yayin }) => {
  

  return (
    <Card sx={cardStyle}>
      <a href={yayin.url}  target="_blank" rel="noopener noreferrer">
        <CardMedia
          component="img"
          image={yayin.kapak_fotografi}
          alt="Araştırma Kapak Fotoğrafı"
          sx={mediaStyle}
        />
      </a>
      
      <CardContent sx={contentStyle}>
        <a href={yayin.url}  target="_blank" rel="noopener noreferrer">
          <Typography sx={titleStyle} > 
            {yayin.baslik}
          </Typography>
        </a>

      </CardContent>
    </Card>
  );
};

export default GorselBasinCardOge;  

