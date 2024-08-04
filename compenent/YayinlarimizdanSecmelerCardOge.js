import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import Link from 'next/link';
import { fontWeight } from '@mui/system';

const cardStyle = {
  width: '100%',
  height: 'auto',
  position: 'relative',
  marginBottom: 5,
  border: '1px solid #ccc',
  overflow: 'hidden',
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',

};

const mediaStyle = {
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
};

const contentContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0.5rem',
  flex: 1,
};

const titleStyle = {
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 550,
  color: '#343434',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2, // Restrict to 2 lines
  height: '2.8em', // Adjust to match the height of 2 lines of text
  lineHeight: '1.4em', // Ensure line height is consistent
  fontWeight:'bold',
  '&:hover': {
    color: '#2e5077', // Change color on hover
  },
};




function CardOge({ yayin,path }) {
  const generateLink = (data) => {
    const convertToUrlFriendly = (text) => {
      if (text && typeof text === 'string') {
        const turkishCharacters = {
          ç: 'c',
          ğ: 'g',
          ı: 'i',
          ö: 'o',
          ş: 's',
          ü: 'u',
          İ: 'i',
        };
        const cleanedText = text.trim().toLowerCase();
        const urlFriendlyText = Array.from(cleanedText)
          .map((char) => turkishCharacters[char] || char)
          .join('');
        return urlFriendlyText.replace(/[\s,\.]+/g, '-'); // Remove spaces, commas, and dots
      }
      return '';
    };

    const slug = convertToUrlFriendly(data.baslik);

    const url=path.split('?')[0]
    return `${url}/${slug}-${data.id}`;
  };

  // Usage
  const linkTo = generateLink(yayin);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={cardStyle}>
        <CardMedia
          component="img"
          sx={mediaStyle}
          image={yayin.kapak_fotografi}
          alt={yayin.baslik}
        />
        <CardContent sx={contentContainerStyle}>
          <Typography variant="h10" sx={titleStyle}>
            <Link href={linkTo} passHref>
              <span>{yayin.baslik}</span>
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CardOge;
