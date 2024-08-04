import React from 'react';
import styles from '../styles/BaslikGorsel.module.css';
import Link from 'next/link'; 
import { FaChevronRight, FaArrowCircleLeft } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';

// Function to map Turkish color names to hex codes
const getColorFromName = (colorName) => {
    const colorMap = {
        siyah: '#000000',
        beyaz: '#FFFFFF',
    };

    return colorMap[colorName.toLowerCase()] || '#FFFFFF'; // Default to white if color not found
};



function BaslikGorsel({ data = {}, altPage = false, dinamicPage = {}, isPagesLoading }) { // Adding default props
    // Destructure properties with default values
    const { name = '', renk = '', img = '' } = data;
    const textColor = getColorFromName(renk);

    const dinamicPageUrl = dinamicPage.url || '';
    const dinamicPageName = dinamicPage.name || '';

    const menuItem = data.menu_item || {};
    const { title = '', url = '' } = menuItem;
    const parentTitle = menuItem.parent?.title || '';
    const parentUrl = menuItem.parent?.url || '';
    const grandParentTitle = menuItem.parent?.parent?.title || '';
    const grandParentUrl = menuItem.parent?.parent?.url || '';


    return (
        <div className={styles.bannerImageContainer}>
            <div className={styles.aspectRatioBox}>
                {isPagesLoading ? (
                    <div className={styles.loader}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div>
                        {altPage && (grandParentUrl || parentUrl) && (
                            <div className={styles.backArrow}>
                                <Link href={grandParentUrl || parentUrl}>
                                    <FaArrowCircleLeft className={styles.arrowContainer} style={{ color: textColor }} />
                                </Link>
                            </div>
                        )}
                        <div className={styles.titleContainer} style={{ color: textColor }}>
                            <h1>{name}</h1>
                            <div className={styles.altTitle}>
                                <div>
                                    <Link href="/" className={styles.link} style={{ color: textColor }}>Ana Sayfa</Link>
                                    <FaChevronRight className={styles.icon} style={{ color: textColor }} />

                                    {grandParentTitle && (
                                        <>
                                            {grandParentUrl ? (
                                                <Link href={grandParentUrl} className={styles.link} style={{ color: textColor }}>
                                                    {grandParentTitle}
                                                </Link>
                                            ) : (
                                                <span className={styles.name} style={{ color: textColor }}>
                                                    {grandParentTitle}
                                                </span>
                                            )}
                                            <FaChevronRight className={styles.icon} style={{ color: textColor }} />
                                        </>
                                    )}

                                    {parentTitle && (
                                        <>
                                            {parentUrl ? (
                                                <Link href={parentUrl} className={styles.link} style={{ color: textColor }}>
                                                    {parentTitle}
                                                </Link>
                                            ) : (
                                                <span className={styles.name} style={{ color: textColor }}>
                                                    {parentTitle}
                                                </span>
                                            )}
                                            <FaChevronRight className={styles.icon} style={{ color: textColor }} />
                                        </>
                                    )}

                                    {title && (
                                        <>
                                            {url ? (
                                                <Link href={url} className={styles.link} style={{ color: textColor }}>
                                                    {title}
                                                </Link>
                                            ) : (
                                                <span className={styles.name} style={{ color: textColor }}>
                                                    {title}
                                                </span>
                                            )}
                                        </>
                                    )}

                                    {Object.keys(dinamicPage).length > 0 && (
                                        <>
                                            <FaChevronRight className={styles.icon} style={{ color: textColor }} />
                                            {dinamicPageUrl ? (
                                                <Link href={dinamicPageUrl} className={styles.link} style={{ color: textColor }}>
                                                    {dinamicPageName}
                                                </Link>
                                            ) : (
                                                <span className={styles.name} style={{ color: textColor }}>
                                                    {dinamicPageName}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {img && <img src={img} alt="Banner" className={styles.image} />}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BaslikGorsel;



