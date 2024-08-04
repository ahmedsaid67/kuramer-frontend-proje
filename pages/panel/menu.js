import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Tabs, Tab, Box, Checkbox, Typography, Paper, Button, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { API_ROUTES } from "../../utils/constants";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [changes, setChanges] = useState({});
  const [apiError, setApiError] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ROUTES.MENU);
      console.log("response:",response.data.sort((a, b) => a.order - b.order))
      setMenuItems(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setApiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user.id) {
      router.push({
        pathname: "/login",
        query: { from: router.pathname },
      });
    } else {
      getData();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCheck = (id, checked) => {
    setChanges(prevChanges => {
      const newChanges = { ...prevChanges };
      newChanges[id] = checked;
      return newChanges;
    });
  };

  const handleSave = () => {
    const updatedChanges = {};
    Object.keys(changes).forEach(id => {
      const originalStatus = menuItems.find(item => item.id === parseInt(id))?.durum;
      if (originalStatus !== changes[id]) {
        updatedChanges[id] = changes[id];
      }
    });
    if (Object.keys(updatedChanges).length === 0) {
      setAlert({ show: true, type: 'warning', message: 'Hiçbir değişiklik yapmadınız.' });
      return;
    }

    setIsSaving(true);
    axios.patch(API_ROUTES.MENU_UPDATE, updatedChanges)
      .then(response => {
        setAlert({ show: true, type: 'success', message: 'Değişiklikler başarıyla kaydedildi.' });
        setMenuItems(prevItems => prevItems.map(item => ({
          ...item,
          durum: changes[item.id] !== undefined ? changes[item.id] : item.durum
        })));
        setChanges({});
      })
      .catch(error => {
        setAlert({ show: true, type: 'error', message: 'Değişiklikleri kaydederken bir hata oluştu.' });
      })
      .finally(() => {
        setIsSaving(false); // İşlem tamamlandığında veya hata oluştuğunda
      });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (apiError) {
    return (
      <Container>
        <Alert severity="error">
          Menü öğeleri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
        </Alert>
      </Container>
    );
  }

  if (!menuItems.length>0) {
    return (
      <Container>
        <Alert severity="error">
         Gösterilecek veri bulunmamaktadır.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box maxWidth="md" >
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
          {menuItems.filter(item => !item.parent).map((item, index) => (
            <Tab label={item.title.toLocaleUpperCase('tr-TR')} key={item.id} sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} />
          ))}
        </Tabs>
        {menuItems.filter(item => !item.parent).map((item, index) => (
          <TabPanel value={selectedTab} index={index} key={item.id}>
            <MenuItemComponent key={item.id} item={item} onCheck={handleCheck} changes={changes} isParent />
            {menuItems.filter(subItem => subItem.parent?.id === item.id).map(subItem => (   /* parent idi burası endpoint guncellmesi sonrası paren?.id oldu */
              <MenuItemComponent key={subItem.id} item={subItem} onCheck={handleCheck} changes={changes} />
            ))}
          </TabPanel>
        ))}
      </Box>
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Button variant="contained" color="primary" size="small" onClick={handleSave}>
          {isSaving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </Box>
      {alert.show && (
        <Alert severity={alert.type} onClose={() => setAlert({ show: false, type: '', message: '' })}>
          {alert.message}
        </Alert>
      )}
    </Container>
  );
};

const MenuItemComponent = ({ item, onCheck, changes, isParent }) => {
  const isChecked = changes[item.id] !== undefined ? changes[item.id] : item.durum;
  return (
    <Paper sx={{ mb: 1, p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: isParent ? 0 : 2 }}>
        <Checkbox checked={isChecked} onChange={(e) => onCheck(item.id, e.target.checked)} disabled={!isParent && changes[item.parent] === false} />
        <Typography sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '0.75rem' }}>{item.title}</Typography>
      </Box>
    </Paper>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (<Box sx={{ p: 2 }}>{children}</Box>)}
    </div>
  );
}

export default MenuPage;






