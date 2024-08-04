// Navbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useWindowSize from './useWindowSize';
import styles from '../styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import {API_ROUTES} from "../utils/constants"

const Navbar = () => {
  const [width] = useWindowSize();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [activeSubMenu, setActiveSubMenu] = useState(null);


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      setActiveSubMenu(null);
    }
  };

  const isMobile = width < 1101;

  async function getIndex() {
    try {
      const response = await axios.get(API_ROUTES.MENU_ACTIVE);
      const sortedMenuItems = response.data.sort((a, b) => a.order - b.order);
      setMenuItems(sortedMenuItems);

    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  }
  
  useEffect(() => {
    getIndex();
  }, []);

  const handleSubMenuExpand = (itemId) => {
    if (menuItems.some(item => item.parent?.id === itemId)) {
      setActiveSubMenu(activeSubMenu === itemId ? null : itemId);
    }
  };

  const handleLogoClick = () => {
    // Eğer bir alt menü açıksa, kapat
    if (isMobile && menuOpen ) {
      setMenuOpen(false)
    }
  };

  const renderSubMenu = (parentId) => {
    return (
      <ul className={styles.subMenu}>
        {menuItems.filter(item => item.parent?.id === parentId).map(subItem => (
          <li key={subItem.id} className={styles.subNavItem}>
            {subItem.url ? (
              <Link href={subItem.url}>
                <div className={styles.linkContainer}>
                  {subItem.title}
                </div>
              </Link>
            ) : (
              <div className={styles.linkContainer}>
                  {subItem.title}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderSubMenu2 = (parentId) => {
    // Ana öğenin kendisini bulun
    const parentItem = menuItems.find(item => item.id === parentId);

  
    return (
      <ul className={styles.navMenu}>
        {/* Ana öğe başlığı bir menü öğesi olarak ekleniyor */}
        {parentItem && (
          <li className={`${styles.navItem} ${styles.navItemTitle}`}>
            {parentItem.url ? (
              <Link href={parentItem.url}>
                <div className={styles.linkMobilContainerParent} onClick={() => setMenuOpen(false)} >
                  {parentItem.title}
                </div>
              </Link>
            ) : (
              <div className={styles.linkMobilContainerParent} >
                {parentItem.title}
              </div>
            )}
          </li>
        )}
  
        {/* Alt öğelerin listesi */}
        {menuItems.filter(item => item.parent?.id === parentId).map(item => (
          <li key={item.id} className={styles.navItem}>
            {item.url ? (
              <Link href={item.url}>
                <div className={styles.linkMobilContainer} onClick={() => setMenuOpen(false)} >
                  {item.title}
                </div>
              </Link>
            ) : (
              <div className={styles.linkMobilContainer}>
                {item.title}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <Link href="/">
        <div className={styles.logo} onClick={handleLogoClick}>
          <Image src="/kuramerlogo.png" alt="Logo" width={50} height={50} loading="eager" />
        </div>
        </Link>
        {isMobile && (
          <button onClick={toggleMenu} className={styles.hamburgerButton}>
            <div className={styles.hamburgermenu}></div>
            <div className={styles.hamburgermenu}></div>
            <div className={styles.hamburgermenu}></div>
          </button>
        )}
        {isMobile && menuOpen && (
          <>
            {activeSubMenu === null ? (
              <ul className={styles.navMenu}>
                {menuItems.filter(item => !item.parent).map(item => {
                  // Alt öğesi olup olmadığını kontrol et
                  const hasSubItems = menuItems.some(subItem => subItem.parent?.id === item.id);

                  return hasSubItems ? (
                    // Alt öğesi varsa genişletme/daraltma fonksiyonunu tetikle
                    <li key={item.id} className={styles.navItem} onClick={() => handleSubMenuExpand(item.id)}>
                      <div className={styles.linkMobilContainer}>
                        {item.title}
                      </div>
                      <span className={styles.expandIcon}></span>
                    </li>
                  ) : (
                    // Alt öğesi yoksa doğrudan Link ile yönlendir
                    <li key={item.id} className={styles.navItem}>
                      {item.url ? (
                        <Link href={item.url}>
                          <div className={styles.linkMobilContainer} onClick={() => setMenuOpen(false)}>
                            {item.title}
                          </div>
                        </Link>
                      ) : (
                        <div className={styles.linkMobilContainer} onClick={() => setMenuOpen(false)}>
                          {item.title}
                        </div>
                      )}
                    </li>
                                      );
                })}
              </ul>
            ) : (
              <>
                <button onClick={() => setActiveSubMenu(null)} className={styles.backButton}></button>
                {renderSubMenu2(activeSubMenu)}
              </>
            )}
          </>
        )}

        
        {!isMobile && (
          <ul className={styles.navMenu}>
            {menuItems.filter(item => !item.parent).map(item => (
              <div key={item.id} className={styles.menuItemContainer} 
                   onMouseLeave={() => activeSubMenu === item.id && setActiveSubMenu(null)}>
                <li className={styles.navItem}
                    onMouseEnter={() => setActiveSubMenu(item.id)}>
                  {item.url ? (
                    <Link href={item.url}>
                      {item.title}
                    </Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </li>
                {activeSubMenu === item.id && renderSubMenu(item.id)}
              </div>
            ))}
          </ul>
        )}
      </nav>     
    </div>
  );
};

export default Navbar;













