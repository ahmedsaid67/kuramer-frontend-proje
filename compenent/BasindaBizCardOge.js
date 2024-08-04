import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const cardStyle = {
  width: '240px',
  height: '425px',
  position: 'relative',
  marginBottom: 5,
  border: '1px solid #ccc',
  overflow: 'hidden',
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 768px)': {
    width: '170px',
    height: '320px',
  },
};

const mediaStyle = {
  width: '100%',
  height: '350px',
  objectFit: 'cover',
  cursor: 'pointer',
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
  fontFamily: 'sans-serif',
  fontWeight: 550,
  color: '#343434',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  cursor: 'pointer',
  '@media (max-width: 768px)': {
    fontSize: '12px',
  },
  '&:hover': {
    color: '#2e5077', // Üzerine gelindiğinde daha açık bir gri
  },
  
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'auto',
  maxWidth: '80%',
  maxHeight: '80%',
  overflow: 'auto',
  '@media (max-width: 768px)': {
    width: '90%',
    maxHeight: '90%',
    maxWidth: '90%',
  },
};

const closeButtonStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  color: 'white', // Daha belirgin bir renk için beyaz
  backgroundColor: 'grey', // Daha yumuşak bir arka plan rengi
  borderRadius: '50%', // Daire şeklinde bir buton
  padding: '0.25rem', // İç boşluk
  minWidth: '32px', // Minimum genişlik
  minHeight: '32px', // Minimum yükseklik
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#bdbdbd', // Üzerine gelindiğinde daha açık bir gri
  },
};



function BasindaBizCardOge({ yayin }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card sx={cardStyle}>
      <CardMedia
        component="img"
        sx={mediaStyle}
        image={yayin.kapak_fotografi}
        alt={yayin.baslik}
        onClick={handleOpen}
      />
      <CardContent sx={contentContainerStyle} onClick={handleOpen}>
        <Typography variant="h10" sx={titleStyle}>
          {yayin.baslik}
        </Typography>
      </CardContent>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton sx={closeButtonStyle} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <img src={yayin.kapak_fotografi} alt={yayin.baslik} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
      </Modal>
    </Card>
  );
}

export default BasindaBizCardOge;


