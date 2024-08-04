import React from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Grid } from '@mui/material';

const cardStyle = {
  width: '250px',
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

function CardOge({ yayin, handleDownloadPDF }) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const handleTitleClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={cardStyle}>
        <CardMedia
          component="img"
          sx={{
            ...mediaStyle,
          }}
          image={yayin.kapak_fotografi}
          alt={yayin.baslik}
        />
        <CardContent sx={contentContainerStyle}>
          <Typography variant="h10" sx={titleStyle}>
            <span onClick={handleTitleClick}>
              {yayin.baslik}
            </span>
          </Typography>
        </CardContent>
        <div sx={buttonContainerStyle}>
          <Button
            variant="outlined"
            sx={buttonStyle}
            onClick={() => handleDownloadPDF({ url: yayin.pdf_dosya, title: yayin.baslik })}
          >
            Dokümanı İncele
          </Button>
        </div>
      </Card>
    </Grid>
  );
}

export default CardOge;