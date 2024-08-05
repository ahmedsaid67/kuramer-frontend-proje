export const API_SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;


export const API_ROUTES = {
    TOKEN: API_SERVER_URL + "/token/",
    LOGOUT: API_SERVER_URL + "/logout/",
    CHECK_TOKEN : API_SERVER_URL + "/check-token/",
    USER_INFO : API_SERVER_URL + "/user-info/",

    // MENÜ
    MENU : API_SERVER_URL + "/menuitems/menu/selected/",
    MENU_ACTIVE : API_SERVER_URL + "/menuitems/menu/selected/get_active/",
    MENU_UPDATE : API_SERVER_URL + "/menuitems/menu/selected/update_status/",
    MENU_ALT_OGE : API_SERVER_URL + "/menuitems/menu/selected/get-sub-items/",

    // PERSONELLER
    PERSONEL_TURU : API_SERVER_URL + "/personelturu/",
    PERSONEL_TURU_ACTIVE : API_SERVER_URL + "/personelturu/get_active/",
    PERSONEL_TURU_LIST : API_SERVER_URL + "/personelturu-list/",
    PERSONEL_TURU_PAGINATIONS : API_SERVER_URL + "/personelturu/?page=currentPage",  // üstteki api ile aynı servistir, sadece mevcutta olan paginations yapısını kullanımı için hazır hale getirilmiştir. -- KULLANIM ÖRENEĞİ ---> const response = await axios.get(API_ROUTES.PERSONEL_TURU_PAGINATIONS.replace("currentPage",currentPage))
    PERSONEL_TURU_DETAIL : API_SERVER_URL + "/personelturu/id/",
    PERSONEL_TURU_DELETE : API_SERVER_URL + "/personelturu/bulk_soft_delete/",


    PERSONELLER : API_SERVER_URL + "/personsupdate/",
    PERSONELLER_ACTIVE : API_SERVER_URL + "/personsupdate/get_active/",
    PERSONELLER_PAGINATIONS : API_SERVER_URL + "/personsupdate/?page=currentPage",
    PERSONELLER_DETAIL : API_SERVER_URL + "/personsupdate/id/",
    PERSONELLER_DELETE : API_SERVER_URL + "/personsupdate/bulk_soft_delete/",
    PERSONELLER_KATEGORI_FILTER : API_SERVER_URL + `/personsupdate/?kategori=seciliKategori&page=currentPage`,
    PERSONELLER_KATEGORI_FILTER_PAGINATIONSUZ : API_SERVER_URL + `/personsupdate/?kategori=seciliKategori`,


    // YAYINLAR
    BROSURLER: API_SERVER_URL + "/brosurler/",
    BROSURLER_ACTIVE : API_SERVER_URL + "/brosurler/get_active/?page=currentPage",
    BROSURLER_PAGINATIONS : API_SERVER_URL + "/brosurler/?page=currentPage",
    BROSURLER_DETAIL : API_SERVER_URL + "/brosurler/id/",
    BROSURLER_DELETE : API_SERVER_URL + "/brosurler/bulk_soft_delete/",


    BULTENLER: API_SERVER_URL + "/bultenler/",
    BULTENLER_ACTIVE : API_SERVER_URL + "/bultenler/get_active/?page=currentPage",
    BULTENLER_LIST : API_SERVER_URL + "/bultenler-list/",
    BULTENLER_PAGINATIONS : API_SERVER_URL + "/bultenler/?page=currentPage",
    BULTENLER_DETAIL : API_SERVER_URL + "/bultenler/id/",
    BULTENLER_DELETE : API_SERVER_URL + "/bultenler/bulk_soft_delete/",
    

    ABONELER: API_SERVER_URL + "/abone/",
    ABONELER_PAGINATIONS : API_SERVER_URL + "/abone/?page=currentPage",
    ABONELER_DETAIL : API_SERVER_URL + "/abone/id/",
    ABONELER_DELETE : API_SERVER_URL + "/abone/bulk_soft_delete/",

    KITAP_KATEGORI : API_SERVER_URL + "/kitapkategori/",
    KITAP_KATEGORI_ACTIVE : API_SERVER_URL + "/kitapkategori/get_active/",
    KITAP_KATEGORI_LIST : API_SERVER_URL + "/kitapkategori-list/",
    KITAP_KATEGORI_PAGINATIONS : API_SERVER_URL + "/kitapkategori/?page=currentPage",
    KITAP_KATEGORI_DETAIL : API_SERVER_URL + "/kitapkategori/id/",
    KITAP_KATEGORI_DELETE : API_SERVER_URL + "/kitapkategori/bulk_soft_delete/",


    KITAPLAR : API_SERVER_URL + "/kitaplar/",
    KITAPLAR_ACTIVE : API_SERVER_URL + "/kitaplar/get_active/",
    KITAPLAR_PAGINATIONS : API_SERVER_URL + "/kitaplar/?page=currentPage",
    KITAPLAR_DETAIL : API_SERVER_URL + "/kitaplar/slug/",
    KITAPLAR_DELETE : API_SERVER_URL + "/kitaplar/bulk_soft_delete/",
    KITAPLAR_KATEGORI_FILTER : API_SERVER_URL + `/kitaplar/?kategori=seciliKategori&page=currentPage`,
    KITAPLAR_KATEGORI_FILTER_PAGINATIONSUZ : API_SERVER_URL + `/kitaplar/?kategori=seciliKategori`,
    KITAPLAR_GETFULL : API_SERVER_URL + "/kitaplar/get_full",

    CONTENT_IMAGE : API_SERVER_URL + "/contentimage/",
    CONTENT_IMAGE_DELETE : API_SERVER_URL + "/contentimage/bulk_soft_delete/",
    CONTENT_IMAGE_KATEGORI_FILTER : API_SERVER_URL + "/contentimage/?kategori=seciliKategori",


    // TEMEL KONU VE KAVRAMLAR
    
    TEMEL_KAVRAMLAR: API_SERVER_URL + "/temelkavramlar/",
    TEMEL_KAVRAMLAR_ACTIVE : API_SERVER_URL + "/temelkavramlar/get_active/?page=currentPage",
    TEMEL_KAVRAMLAR_PAGINATIONS : API_SERVER_URL + "/temelkavramlar/?page=currentPage",
    TEMEL_KAVRAMLAR_DETAIL : API_SERVER_URL + "/temelkavramlar/id/",
    TEMEL_KAVRAMLAR_DELETE : API_SERVER_URL + "/temelkavramlar/bulk_soft_delete/",


    TEMEL_KONULAR: API_SERVER_URL + "/temelkonular/",
    TEMEL_KONULAR_ACTIVE : API_SERVER_URL + "/temelkonular/get_active/?page=currentPage",
    TEMEL_KONULAR_PAGINATIONS : API_SERVER_URL + "/temelkonular/?page=currentPage",
    TEMEL_KONULAR_DETAIL : API_SERVER_URL + "/temelkonular/id/",
    TEMEL_KONULAR_DELETE : API_SERVER_URL + "/temelkonular/bulk_soft_delete/",


    // YAYINLARIMIZDAN SEÇMELER

    YAYINLARIMIZDAN_SECMELER: API_SERVER_URL + "/yayinlarimizdansecmeler/",
    YAYINLARIMIZDAN_SECMELER_ACTIVE : API_SERVER_URL + "/yayinlarimizdansecmeler/get_active/?page=currentPage",
    YAYINLARIMIZDAN_SECMELER_PAGINATIONS : API_SERVER_URL + "/yayinlarimizdansecmeler/?page=currentPage",
    YAYINLARIMIZDAN_SECMELER_DETAIL : API_SERVER_URL + "/yayinlarimizdansecmeler/id/",
    YAYINLARIMIZDAN_SECMELER_DELETE : API_SERVER_URL + "/yayinlarimizdansecmeler/bulk_soft_delete/",


    // MEDYA GALERİ

    YAZILI_BASIN: API_SERVER_URL + "/yazilibasin/",
    YAZILI_BASIN_ACTIVE : API_SERVER_URL + "/yazilibasin/get_active/?page=currentPage",
    YAZILI_BASIN_PAGINATIONS : API_SERVER_URL + "/yazilibasin/?page=currentPage",
    YAZILI_BASIN_DETAIL : API_SERVER_URL + "/yazilibasin/id/",
    YAZILI_BASIN_DELETE : API_SERVER_URL + "/yazilibasin/bulk_soft_delete/",


    GORSEL_BASIN: API_SERVER_URL + "/gorselbasin/",
    GORSEL_BASIN_ACTIVE : API_SERVER_URL + "/gorselbasin/get_active/?page=currentPage",
    GORSEL_BASIN_PAGINATIONS : API_SERVER_URL + "/gorselbasin/?page=currentPage",
    GORSEL_BASIN_DETAIL : API_SERVER_URL + "/gorselbasin/id/",
    GORSEL_BASIN_DELETE : API_SERVER_URL + "/gorselbasin/bulk_soft_delete/", 


    VIDEO_GALERI_KATEGORI : API_SERVER_URL + "/videogalerikategori/",
    VIDEO_GALERI_KATEGORI_ACTIVE : API_SERVER_URL + "/videogalerikategori/get_active/",
    VIDEO_GALERI_KATEGORI_LIST : API_SERVER_URL + "/videogalerikategori-list/",
    VIDEO_GALERI_KATEGORI_PAGINATIONS : API_SERVER_URL + "/videogalerikategori/?page=currentPage",
    VIDEO_GALERI_KATEGORI_DETAIL : API_SERVER_URL + "/videogalerikategori/kategori_id/",
    VIDEO_GALERI_KATEGORI_DELETE : API_SERVER_URL + "/videogalerikategori/bulk_soft_delete/",
    VIDEO_GALERI_KATEGORI_SLUG_FILTER : API_SERVER_URL + "/videogalerikategori/filter/slug/",


    VIDEO_GALERI : API_SERVER_URL + "/videogaleri/",
    VIDEO_GALERI_ACTIVE : API_SERVER_URL + "/videogaleri/get_active/",
    VIDEO_GALERI_LIST : API_SERVER_URL + "/videogaleri-list/",
    VIDEO_GALERI_PAGINATIONS : API_SERVER_URL + "/videogaleri/?page=currentPage",
    VIDEO_GALERI_DETAIL : API_SERVER_URL + "/videogaleri/kategori_id/",
    VIDEO_GALERI_DELETE : API_SERVER_URL + "/videogaleri/bulk_soft_delete/",
    VIDEO_GALERI_KATEGORI_FILTER : API_SERVER_URL + `/videogaleri/?kategori=seciliKategori&page=currentPage`,
    VIDEO_GALERI_KATEGORI_FILTER_PAGINATIONSUZ : API_SERVER_URL + `/videogaleri/?kategori=seciliKategori`,


    FOTO_GALERI_KATEGORI : API_SERVER_URL + "/fotogalerikategori/",
    FOTO_GALERI_KATEGORI_ACTIVE : API_SERVER_URL + "/fotogalerikategori/get_active/",
    FOTO_GALERI_KATEGORI_LIST : API_SERVER_URL + "/fotogalerikategori-list/",
    FOTO_GALERI_KATEGORI_PAGINATIONS : API_SERVER_URL + "/fotogalerikategori/?page=currentPage",
    FOTO_GALERI_KATEGORI_DETAIL : API_SERVER_URL + "/fotogalerikategori/id/",
    FOTO_GALERI_KATEGORI_DELETE : API_SERVER_URL + "/fotogalerikategori/bulk_soft_delete/",
    FOTO_GALERI_KATEGORI_SLUG_FILTER : API_SERVER_URL + "/fotogalerikategori/filter/slug/",


    FOTO_GALERI : API_SERVER_URL + "/fotogaleri/",
    FOTO_GALERI_ACTIVE : API_SERVER_URL + "/fotogaleri/get_active/",
    FOTO_GALERI_LIST : API_SERVER_URL + "/fotogaleri-list/",
    FOTO_GALERI_PAGINATIONS : API_SERVER_URL + "/fotogaleri/?page=currentPage",
    FOTO_GALERI_DETAIL : API_SERVER_URL + "/fotogaleri/id/",
    FOTO_GALERI_DELETE : API_SERVER_URL + "/fotogaleri/bulk_soft_delete/",
    FOTO_GALERI_KATEGORI_FILTER : API_SERVER_URL + `/fotogaleri/?kategori=seciliKategori&page=currentPage`,
    FOTO_GALERI_KATEGORI_FILTER_PAGINATIONSUZ : API_SERVER_URL + `/fotogaleri/?kategori=seciliKategori`,
    


    // ALBÜM İMAGES

    ALBUM_IMAGES : API_SERVER_URL + "/image/",
    ALBUM_IMAGES_DELETE : API_SERVER_URL + "/image/bulk_soft_delete/",
    ALBUM_IMAGES_KATEGORI_FILTER : API_SERVER_URL + `/image/?kategori=seciliKategori`,



    // KAMUOYU DUYURULARI

    KAMUOYU_DUYURULARI: API_SERVER_URL + "/kamuoyuduyurulari/",
    KAMUOYU_DUYURULARI_ACTIVE : API_SERVER_URL + "/kamuoyuduyurulari/get_active/?page=currentPage",
    KAMUOYU_DUYURULARI_PAGINATIONS : API_SERVER_URL + "/kamuoyuduyurulari/?page=currentPage",
    KAMUOYU_DUYURULARI_DETAIL : API_SERVER_URL + "/kamuoyuduyurulari/slug/",
    KAMUOYU_DUYURULARI_DELETE : API_SERVER_URL + "/kamuoyuduyurulari/bulk_soft_delete/",


    // MUSHAFLAR

    MUSHAF_FARKLARI: API_SERVER_URL + "/mushaffarklari/",
    MUSHAF_FARKLARI_ACTIVE : API_SERVER_URL + "/mushaffarklari/get_active/?page=currentPage",
    MUSHAF_FARKLARI_PAGINATIONS : API_SERVER_URL + "/mushaffarklari/?page=currentPage",
    MUSHAF_FARKLARI_DETAIL : API_SERVER_URL + "/mushaffarklari/id/",
    MUSHAF_FARKLARI_DELETE : API_SERVER_URL + "/mushaffarklari/bulk_soft_delete/",


    MUSHAF_KATEGORI : API_SERVER_URL + "/mushafkategori/",
    MUSHAF_KATEGORI_ACTIVE : API_SERVER_URL + "/mushafkategori/get_active/",
    MUSHAF_KATEGORI_LIST : API_SERVER_URL + "/mushafkategori-list/",
    MUSHAF_KATEGORI_PAGINATIONS : API_SERVER_URL + "/mushafkategori/?page=currentPage",
    MUSHAF_KATEGORI_DETAIL : API_SERVER_URL + "/mushafkategori/id/",
    MUSHAF_KATEGORI_DELETE : API_SERVER_URL + "/mushafkategori/bulk_soft_delete/",


    MUSHAFLAR : API_SERVER_URL + "/mushaflar/",
    MUSHAFLAR_ACTIVE : API_SERVER_URL + "/mushaflar/get_active/",
    MUSHAFLAR_PAGINATIONS : API_SERVER_URL + "/mushaflar/?page=currentPage",
    MUSHAFLAR_DETAIL : API_SERVER_URL + "/mushaflar/id/",
    MUSHAFLAR_DELETE : API_SERVER_URL + "/mushaflar/bulk_soft_delete/",
    MUSHAFLAR_KATEGORI_FILTER : API_SERVER_URL + `/mushaflar/?kategori=seciliKategori&page=currentPage`,
    MUSHAFLAR_KATEGORI_FILTER_PAGINATIONSUZ : API_SERVER_URL + `/mushaflar/?kategori=seciliKategori`,



    // FAALİYETLER
    
    SEMPOZYUMLAR: API_SERVER_URL + "/sempozyumlar/",
    SEMPOZYUMLAR_ACTIVE : API_SERVER_URL + "/sempozyumlar/get_active/?page=currentPage",
    SEMPOZYUMLAR_PAGINATIONS : API_SERVER_URL + "/sempozyumlar/?page=currentPage",
    SEMPOZYUMLAR_DETAIL : API_SERVER_URL + "/sempozyumlar/id/",
    SEMPOZYUMLAR_DELETE : API_SERVER_URL + "/sempozyumlar/bulk_soft_delete/",


    KONFERANSLAR: API_SERVER_URL + "/konferanslar/",
    KONFERANSLAR_ACTIVE : API_SERVER_URL + "/konferanslar/get_active/?page=currentPage",
    KONFERANSLAR_PAGINATIONS : API_SERVER_URL + "/konferanslar/?page=currentPage",
    KONFERANSLAR_DETAIL : API_SERVER_URL + "/konferanslar/id/",
    KONFERANSLAR_DELETE : API_SERVER_URL + "/konferanslar/bulk_soft_delete/",

    
    EGITIMLER: API_SERVER_URL + "/egitimler/",
    EGITIMLER_ACTIVE : API_SERVER_URL + "/egitimler/get_active/?page=currentPage",
    EGITIMLER_PAGINATIONS : API_SERVER_URL + "/egitimler/?page=currentPage",
    EGITIMLER_DETAIL : API_SERVER_URL + "/egitimler/slug/",
    EGITIMLER_DELETE : API_SERVER_URL + "/egitimler/bulk_soft_delete/",


    CALISTAYLAR: API_SERVER_URL + "/calistaylar/",
    CALISTAYLAR_ACTIVE : API_SERVER_URL + "/calistaylar/get_active/?page=currentPage",
    CALISTAYLAR_PAGINATIONS : API_SERVER_URL + "/calistaylar/?page=currentPage",
    CALISTAYLAR_DETAIL : API_SERVER_URL + "/calistaylar/id/",
    CALISTAYLAR_DELETE : API_SERVER_URL + "/calistaylar/bulk_soft_delete/",


    ARASTIRMALAR: API_SERVER_URL + "/arastirmalar/",
    ARASTIRMALAR_ACTIVE : API_SERVER_URL + "/arastirmalar/get_active/?page=currentPage",
    ARASTIRMALAR_PAGINATIONS : API_SERVER_URL + "/arastirmalar/?page=currentPage",
    ARASTIRMALAR_DETAIL : API_SERVER_URL + "/arastirmalar/slug/",
    ARASTIRMALAR_DELETE : API_SERVER_URL + "/arastirmalar/bulk_soft_delete/",


    // PUPUP

    PUPUP: API_SERVER_URL + "/puppup/",
    PUPUP_ACTIVE : API_SERVER_URL + "/puppup/get_active/",
    PUPUP_PAGINATIONS : API_SERVER_URL + "/puppup/?page=currentPage",
    PUPUP_DETAIL : API_SERVER_URL + "/puppup/id/",
    PUPUP_DELETE : API_SERVER_URL + "/puppup/bulk_soft_delete/",


    // SLİDERS

    SLIDERS: API_SERVER_URL + "/sliders/",
    SLIDERS_ACTIVE : API_SERVER_URL + "/sliders/get_active/",
    SLIDERS_PAGINATIONS : API_SERVER_URL + "/sliders/?page=currentPage",
    SLIDERS_DETAIL : API_SERVER_URL + "/sliders/detay_id/",
    SLIDERS_DELETE : API_SERVER_URL + "/sliders/bulk_soft_delete/",


    // BAŞLIK GÖRSEL

    BASLIK_GORSEL: API_SERVER_URL + "/baslikgorsel/",
    BASLIK_GORSEL_ACTIVE : API_SERVER_URL + "/baslikgorsel/get_active/",
    BASLIK_GORSEL_PAGINATIONS : API_SERVER_URL + "/baslikgorsel/?page=currentPage",
    BASLIK_GORSEL_DETAIL : API_SERVER_URL + "/baslikgorsel/id/",
    BASLIK_GORSEL_DELETE : API_SERVER_URL + "/baslikgorsel/bulk_soft_delete/",
    BASLIK_GORSEL_GET_GORSEL: API_SERVER_URL + "/baslikgorsel/get-by-name/data/",



    // SOSYAL MEDYA

    SOSYAL_MEDYA: API_SERVER_URL + "/sosyalmedya/",
    SOSYAL_MEDYA_ACTIVE : API_SERVER_URL + "/sosyalmedya/get_active/",
    SOSYAL_MEDYA_PAGINATIONS : API_SERVER_URL + "/sosyalmedya/?page=currentPage",
    SOSYAL_MEDYA_DETAIL : API_SERVER_URL + "/sosyalmedya/id/",
    SOSYAL_MEDYAL_DELETE : API_SERVER_URL + "/sosyalmedya/bulk_soft_delete/",



    // SAYFALAR

    SAYFALAR: API_SERVER_URL + "/sayfalar/",
    SAYFALAR_ACTIVE : API_SERVER_URL + "/sayfalar/get_active/",
    SAYFALAR_PAGINATIONS : API_SERVER_URL + "/sayfalar/?page=currentPage",
    SAYFALAR_DETAIL : API_SERVER_URL + "/sayfalar/id/",
    SAYFALAR_DELETE : API_SERVER_URL + "/sayfalar/bulk_soft_delete/",
    SAYFALAR_GET_GORSEL: API_SERVER_URL + "/sayfalar/get-by-url/",
    SAYFALAR_GET_FILTER: API_SERVER_URL + "/sayfalar/pages-filter/id/",


    // HOME PAGE COMPENENTS

    HOME_PAGE_COMPENENTS: API_SERVER_URL + "/homepagecompenents/",
    HOME_PAGE_COMPENENTS_ACTIVE : API_SERVER_URL + "/homepagecompenents/get_active/",
    HOME_PAGE_COMPENENTS_PAGINATIONS : API_SERVER_URL + "/homepagecompenents/?page=currentPage",
    HOME_PAGE_COMPENENTS_DETAIL : API_SERVER_URL + "/homepagecompenents/id/",
    HOME_PAGE_COMPENENTS_DELETE : API_SERVER_URL + "/homepagecompenents/bulk_soft_delete/",
    HOME_PAGE_COMPENENTS_GET_GORSEL: API_SERVER_URL + "/homepagecompenents/get-by-name/data/",



}