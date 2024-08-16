import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppBar, Box, Toolbar, IconButton, Typography, List, ListItem, ListItemText, CssBaseline, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Head from 'next/head';
import styles from '../styles/Sidebar.module.css';


const drawerWidth = 270;

const MenuListItems = [
 
  {
    id: 1,
    text: 'Menü',
    url: '/panel/menu',
  },
  {
    id: 2,
    text: 'Banner',
    url: '/panel/sliders',
  },
  {
    id: 11111,
    text: 'Kamuoyu Duyuruları',
    url: '/panel/kamuoyu-duyurulari',
  },
  {
    id: 3,
    text: 'Popup',
    url: '/panel/popup',
  },

  {
    id:4,
    text: 'Ana Sayfa Bileşenleri',
    url: '/panel/home-page-compenents',
  }
  ,
  {
    id: 5,
    text: 'Medya ve Kuruluşlar',
    url: '/panel/sosyal-medya',
  },
  {
    id: 6,
    text: 'Personeller',
    children: [
      { id: 61, text: 'Personel Türü', url: '/panel/personeller/personel-turu' },
      { id: 62, text: 'Personeller', url: '/panel/personeller/personeller' },
    ],
  },
  {
    id: 7,
    text: 'Yayınlar',
    children: [
      {
        id: 71,
        text: 'Kitaplar',
        children: [
          { id: 711, text: 'Kitap Serileri', url: '/panel/yayinlar/kitaplar/kitap-kategori' },
          { id: 712, text: 'Kitaplar', url: '/panel/yayinlar/kitaplar/kitaplar' },
        ],
      },
        
      { id: 72, text: 'Broşürler', url: '/panel/yayinlar/brosurler' },
      { id: 73, text: 'Bültenler', url: '/panel/yayinlar/bultenler' },

        
      
    ],
  },
  {
    id: 8,
    text: 'Temel Konu ve Kavramlar',
    children: [
      { id: 81, text: 'Temel Konular', url: '/panel/temel-konu-ve-kavramlar/temel-konular' },
      { id: 82, text: 'Temel Kavramlar', url: '/panel/temel-konu-ve-kavramlar/temel-kavramlar' },
    ],
  },
  {
    id: 9,
    text: 'Yayınlarımızdan Seçmeler',
    url: '/panel/yayinlarimizdan-secmeler',
  },
  {
    id: 10,
    text: "Kur'an-ı Kerim",
    children: [
      {
        id: 101,
        text: 'Mushaflar',
        children: [
          { id: 1011, text: 'Mushaf Kategorileri', url: '/panel/kurani-kerim/mushaf-kategorileri' },
          { id: 1012, text: 'Mushaflar', url: '/panel/kurani-kerim/mushaflar' },
        ],
      },

      { id: 102, text: 'Mushaf Farkları', url: '/panel/kurani-kerim/mushaf-farklari' },

      
    ],
  },
  {
    id: 11,
    text: 'Faaliyetler',
    children: [
      { id: 111, text: 'Sempozyumlar', url: '/panel/faaliyetler/sempozyumlar' },
      { id: 112, text: 'Çalıştaylar', url: '/panel/faaliyetler/calistaylar' },
      { id: 113, text: 'Konferanslar', url: '/panel/faaliyetler/konferanslar' },
      { id: 114, text: 'Araştırmalar', url: '/panel/faaliyetler/arastirmalar' },
      { id: 115, text: 'Eğitimler', url: '/panel/faaliyetler/egitimler' },
    ],
  },
  {
    id: 12,
    text: 'Medya Galeri',
    children: [
      {
        id: 121,
        text: 'Basında Biz',
        children: [
          { id: 1211, text: 'Yazılı Basın', url: '/panel/medya-galeri/basinda-biz/yazili-basin' },
          { id: 1212, text: 'Görsel Basın', url: '/panel/medya-galeri/basinda-biz/gorsel-basin' },
        ],
      },
      {
        id: 122,
        text: 'Fotoğraf Galerisi',
        children: [
          { id: 1221, text: 'Fotoğraf Galerisi Kategorisi', url: '/panel/medya-galeri/foto/foto-galeri-kategori' },
          { id: 1222, text: 'Fotoğtaf Galerisi', url: '/panel/medya-galeri/foto/foto-galeri' },
        ],
      },
      {
        id: 123,
        text: 'Video Galeri',
        children: [
          { id: 1231, text: 'Video Galeri Kategorisi', url: '/panel/medya-galeri/video/video-galeri-kategori' },
          { id: 1232, text: 'Videolar', url: '/panel/medya-galeri/video/video-galeri' },
        ],
      },
    ],
  },
  // Diğer öğeleri de benzer şekilde ekleyebilirsiniz.
];

const NestedList = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [activeSubSubTab, setActiveSubSubTab] = useState(null);
  const [expandedMainTabs, setExpandedMainTabs] = useState({});
  const [selectedSubItems, setSelectedSubItems] = useState([]);
  const [selectedSubSubItems, setSelectedSubSubItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    const path = router.pathname;
    let activeMainItem, activeSubItem, activeSubSubItem;

    MenuListItems.forEach(item => {
      if (item.url === path) {
        activeMainItem = item;
      }
      item.children?.forEach(subItem => {
        if (subItem.url === path) {
          activeMainItem = item;
          activeSubItem = subItem;
        }
        subItem.children?.forEach(subSubItem => {
          if (subSubItem.url === path) {
            activeMainItem = item;
            activeSubItem = subItem;
            activeSubSubItem = subSubItem;
          }
        });
      });
    });

    if (activeMainItem) {
      setActiveMainTab(activeMainItem.id);
      setExpandedMainTabs(prev => ({ ...prev, [activeMainItem.id]: true }));
      setSelectedSubItems(activeMainItem.children || []);
    }
    if (activeSubItem) {
      setActiveSubTab(activeSubItem.id);
      setSelectedSubSubItems(activeSubItem.children || []);
    }
    if (activeSubSubItem) {
      setActiveSubSubTab(activeSubSubItem.id);
    }
  }, [router.pathname]);

  const logout = () => {
    dispatch(submitLogout());
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMainTabChange = (item) => {
    const isExpanded = expandedMainTabs[item.id];
    setExpandedMainTabs(prev => ({ ...prev, [item.id]: !isExpanded }));
    
    if (!isExpanded) {
      setActiveMainTab(item.id);
      setSelectedSubItems(item.children || []);
      setActiveSubTab(null);
      setSelectedSubSubItems([]);
      if (item.url) {
        router.push(item.url);
      }
    } else {
      setActiveMainTab(null);
      setSelectedSubItems([]);
      setActiveSubTab(null);
      setSelectedSubSubItems([]);
    }
  };

  const handleSubTabChange = (item) => {
    if (item.url) {
      router.push(item.url);
    } else {
      setActiveSubTab((prev) => (prev === item.id ? null : item.id));
      setSelectedSubSubItems(item.children || []);
    }
  };
  

  const handleSubSubTabChange = (item) => {
    if (item.url) {
      router.push(item.url);
    } else {
      setActiveSubSubTab(item.id);
    }
  };

  return (
    <>
      <Head>
        <title>Kuramer Panel</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ width: '100%', ml: { sm: `${drawerWidth}px` }, backgroundColor: 're', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Kuramer
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, height:'100vh', position:'sticky', top:'0' }}
        >
          <Toolbar />
          <Box
            sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)', bgcolor: '#3a3b3c', color: 'white' }}
          >
            <List>
              {MenuListItems.map(item => (
                <React.Fragment key={item.id}>
                  <ListItem
                    button
                    onClick={() => handleMainTabChange(item)}
                    sx={{
                      backgroundColor: '#3a3b3c',
                      
                      '&:hover': {
                        backgroundColor: '#5a5a5a',
                      },
                      ...(activeMainTab === item.id && {
                        backgroundColor: '#4a4a4a',
                        borderLeft: '4px solid #507dac',
                      })
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      sx={{ color: 'white' }}
                      primaryTypographyProps={{ fontSize: '0.9em' }}
                    />
                    {item.children && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMainTabChange(item);
                        }}
                      >
                        {expandedMainTabs[item.id] ? <ExpandLessIcon sx={{ color: 'white' }} /> : <ExpandMoreIcon sx={{ color: 'white' }} />}
                      </IconButton>
                    )}
                  </ListItem>
                  {expandedMainTabs[item.id] && item.children && (
                    <List component="div" disablePadding>
                      {item.children.map(subItem => (
                        <React.Fragment key={subItem.id}>
                          <ListItem
                            button
                            onClick={() => handleSubTabChange(subItem)}
                            sx={{
                              pl: 4,
                              backgroundColor: '#3a3b3c',
                              '&:hover': {
                                backgroundColor: '#5a5a5a'
                              },
                              ...(activeSubTab === subItem.id && {
                                backgroundColor: '#4a4a4a',
                                borderLeft: '4px solid #507dac',
                                fontWeight: 'bold'
                              })
                            }}
                          >
                            <ListItemText
                              primary={subItem.text}
                              sx={{ color: 'white' }}
                              primaryTypographyProps={{ fontSize: '0.9em' }}
                            />
                            {subItem.children && (
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubTabChange(subItem);
                                }}
                              >
                                {activeSubTab === subItem.id && subItem.children.length ? <ExpandLessIcon sx={{ color: 'white' }} /> : <ExpandMoreIcon sx={{ color: 'white' }} />}
                              </IconButton>
                            )}
                          </ListItem>
                          {activeSubTab === subItem.id && subItem.children && (
                            <List component="div" disablePadding>
                              {subItem.children.map(subSubItem => (
                                <ListItem
                                  button
                                  key={subSubItem.id}
                                  onClick={() => handleSubSubTabChange(subSubItem)}
                                  sx={{
                                    pl: 8,
                                    backgroundColor: '#3a3b3c',
                                    '&:hover': {
                                      backgroundColor: '#5a5a5a'
                                    },
                                    ...(activeSubSubTab === subSubItem.id && {
                                      backgroundColor: '#4a4a4a',
                                      borderLeft: '4px solid #507dac',
                                      fontWeight: 'bold'
                                    })
                                  }}
                                >
                                  <ListItemText
                                    primary={subSubItem.text}
                                    sx={{ color: 'white' }}
                                    primaryTypographyProps={{ fontSize: '0.85em' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}
        >
          <Toolbar />
          <Box sx={{ position: 'relative', width: '100%' }}>
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NestedList;
