import React from 'react';
import { Card, CardContent, CardMedia, Button, Typography } from '@mui/material';


const cardStyle = {
  maxWidth: '250px',
  height: 'auto',
  position: 'relative',
  marginBottom: 5,
  border: '1px solid #ccc',
  overflow: 'hidden',
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '470px',
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
  WebkitLineClamp: 3,
};

const buttonContainerStyle = {
  textAlign: 'center',
  padding: '0.5rem',
  borderTop: '1px solid #ccc',
  backgroundColor: 'white',
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
};

const buttonStyle = {
  fontSize: '12px',
  width: '100%',
  borderRadius: 0,
};



const dateStyle = {
  textAlign: 'center',
  fontSize: '12px',
  color: '#757575',
  marginTop: '0.5rem', // Başlık ile tarih arasında biraz boşluk bırak
  '@media (max-width: 768px)': {
    fontSize:"10px", // Mobil görünümde font boyutunu küçült
  },
};



function KamuoyuDuyurulariCardOge({ yayin, handleDownloadPDF }) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);


  const handleTitleClick = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <Card sx={cardStyle}>
      <CardMedia
        component="img"
        sx={mediaStyle}
        image={yayin.kapak_fotografi}
        alt={yayin.baslik}
      />
      <CardContent sx={contentContainerStyle}>
        <Typography variant="h6" sx={titleStyle} onClick={handleTitleClick}>
          {yayin.baslik}
        </Typography>
        <Typography sx={dateStyle} variant='h6'>
          {new Date(yayin.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })} {/* Tarihi "gün ay yıl" formatında göster */}
        </Typography>
      </CardContent>
      <div sx={buttonContainerStyle}>
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={() => handleDownloadPDF({ url: yayin.pdf_dosya, title: yayin.baslik })}
        >
          Dökümanı İncele
        </Button>
      </div>
    </Card>
  );
}

export default KamuoyuDuyurulariCardOge;
