import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import styles from '../styles/EbookPopup.module.css';
import Image from 'next/image';

const EbookPopup = ({ isOpen, onClose, bookTitle, pageCount, images , currentPage, setCurrentPage }) => {
  const [showNav, setShowNav] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

    let timer;
    console.log(images);
    const handleMouseMove = () => {
      setShowNav(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowNav(false), 10000); // Hide nav after 10 seconds
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      timer = setTimeout(() => setShowNav(false), 10000); // Initial hide after 10 seconds
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [isOpen]);


  useEffect(() => {
    if (isOpen) {
      
      setZoom(1);
      setIsZoomed(false);
    }
  }, [isOpen]);
  

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: !isZoomed,
    arrows: true,
    nextArrow: <div className={styles.nextArrow} />,
    prevArrow: <div className={styles.prevArrow} />,
    afterChange: (index) => setCurrentPage(index + 1),
  };

  const toggleFullscreen = () => {
    const element = document.documentElement;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.log(`An error occurred while trying to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const zoomIn = () => {
    setZoom(prevZoom => {
      const newZoom = Math.min(prevZoom * 1.2, 3); // Limit zoom to 3x
      setIsZoomed(newZoom > 1); // Set zoom state
      return newZoom;
    });
  };

  const zoomOut = () => {
    setZoom(prevZoom => {
      const newZoom = Math.max(prevZoom / 1.2, 1); // Limit zoom to 1x
      setIsZoomed(newZoom > 1); // Set zoom state

      // Reset transform when zooming out to 1x
      if (newZoom === 1) {
        setTransform({ x: 0, y: 0 });
      }
      
      return newZoom;
    });
  };

  const handleMouseDown = (e) => {
    if (isZoomed) {
      const { clientX, clientY } = e;
      setDragStart({ x: clientX, y: clientY });
      setDragging(true);
    }
  };
  
  const handleMouseMove = (e) => {
    if (dragging && isZoomed) {
      const { clientX, clientY } = e;
      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;
  
      setTransform(prevTransform => ({
        x: prevTransform.x + deltaX / zoom,
        y: prevTransform.y + deltaY / zoom
      }));
  
      setDragStart({ x: clientX, y: clientY });
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  const handleTouchStart = (e) => {
    if (isZoomed) {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      setDragStart({ x: clientX, y: clientY });
      setDragging(true);
    }
  };
  
  const handleTouchMove = (e) => {
    if (dragging && isZoomed) {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;
  
      setTransform(prevTransform => ({
        x: prevTransform.x + deltaX / zoom,
        y: prevTransform.y + deltaY / zoom
      }));
  
      setDragStart({ x: clientX, y: clientY });
    }
  };
  
  const handleTouchEnd = () => {
    setDragging(false);
  };

  const cursorStyle = isZoomed ? 'grab' : 'auto';

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        <div className={`${styles.navBar} ${showNav ? styles.showNav : styles.hideNav}`}>
          <IconButton className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={styles.bookTitle}>
            {bookTitle}
          </Typography>
          <div className={styles.navButtons}>
            <IconButton className={styles.zoomButton} onClick={zoomIn}>
              <ZoomInIcon />
            </IconButton>
            <IconButton className={styles.zoomButton} onClick={zoomOut}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton className={styles.fullscreenButton} onClick={toggleFullscreen}>
              <FullscreenIcon />
            </IconButton>
          </div>
        </div>
        <Slider {...sliderSettings} className={styles.slider}>
          {images.map((imageObj, index) => (
            <div key={index} className={styles.imageContainer}>
              <Image
                src={imageObj.image}
                alt={`Sayfa ${index + 1}`}
                className={styles.pageImage}
                width={1080}
                height={1920}
                style={{
                  transform: `scale(${zoom}) translate(${transform.x}px, ${transform.y}px)`,
                  cursor: cursorStyle
                }}
                ref={imageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          ))}
        </Slider>

        <div className={`${styles.progressBarContainer} ${showNav ? styles.showNav : styles.hideNav}`}>
          <div className={styles.progressBar} style={{ width: `${(currentPage / pageCount) * 100}%` }} />
        </div>
      </div>
    </div>
  );
};

export default EbookPopup;
