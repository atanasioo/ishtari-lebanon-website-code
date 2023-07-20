import { axiosServer } from "@/axiosServer.js";

import buildLink from "@/urls";

const getHost = async (host) => {
  // console.log("host=")

  let url = "";
  if (
    host === "ishtari" ||
    // (host === "localhost:3001" ||
    // host === "localhost:3000") ||
    host === "ishtari.com" ||
    host === "www.ishtari.com" ||
    host === "https://www.ishtari.com" ||
    host === "https://cloudgoup.com/" ||
    host === "https://www.cloudgoup.com/" ||
    host === "http://cloudgoup.com" ||
    host === "www.cloudgoup.com" ||
    host === "https://next.ishtari.com/" ||
    host === "https://www.next.ishtari.com/" ||
    host === "http://next.ishtari.com" ||
    host === "www.next.ishtari.com" ||
    host === "next.ishtari.com"
  ) {
    // url = "https://www.ishtari.com/";
    url = "https://www.ishtari.com";
  } else if (
    host === "ishtari-ghana" ||
    host === "https://www.ishtari.com.gh/" ||
    host === "ishtari.com.gh"
  ) {
    url = "https://www.ishtari.com.gh";
  } else if (
    host === "flo" ||
    host === "www.flo-lebanon.com" ||
    host === "www.flo-lebanon.com" ||
    host === "flo-lebanon.com"
  ) {
    url = "https://www.flo-lebanon.com";
  } else if (
    host === "flo-bey" ||
    host === "www.flo-lebanon.com" ||
    host === "flo-lebanon.com"
  ) {
    url = "https://www.flo-lebanon.com";
  } else if (
    host === "aalbeit" ||
    host === "www.aalbeit.com" ||
    host === "aalbeit.com"
  ) {
    url = "https://www.aalbeit.com";
  } else if (host === "ishtari-usd" || host === "www.ishtari-usd.com") {
    url = "https://www.ishtari-usd.com/";
  } else if (
    host === "energy-plus" ||
    host === "www.energyplus-lb.com" ||
    host === "energyplus-lb.com"
  ) {
    url = "https://energyplus-lb.com";
  }

  // console.log(url)
  return url;
};

const getMainData = async (token, host) => {
  var data = [];
  let response = {};
};

const getConfig = async (host) => {
  let config = {};
  if (
    host === "ishtari" ||
    // (host === "localhost:3001" ||
    // host === "localhost:3000") ||
    host === "ishtari.com" ||
    host === "www.ishtari.com" ||
    host === "https://www.ishtari.com" ||
    host === "http://next.ishtari.com" ||
    host === "www.next.ishtari.com" ||
    host === "next.ishtari.com"
  ) {
    config = {
      "short-name": "ishtari",
      "seo-title": "ishtari | Online Shopping in Lebanon",
      "seo-title-base": " | ishtari",
      "seo-description":
        "Discover ishtari- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق اللبنانية",
      email: {
        it: "it@ishtari.com",
      },
      numbers: ["71060215", "71715333", "70222099", "70306099", "70444164"],
      supportNumber: "70464748",
      countryCode: "+961",
      "fb-meta": "12345678",
      appId: "130719880936639",
      "site-name": "ISHTARI",
      showMenu: true,
      showMenu2: true,
      showCart: true,
      showTopBrand: true,
      showVisaCard: true,
      send_email: "info@ishtari.com",
      zone: "118",
      "initial-zone": { id: "3969", name: "Beirut بيروت" },
      appleStore: "https://apps.apple.com/lb/app/ishtari/id1248110122",
      googlePlay:
        "https://play.google.com/store/apps/details?id=com.smartdevision.app.ishtari",

      "admin-product-url":
        "https://www.ishtari.com/control/admin/index.php?route=catalog/product/update&product_id=",
      "site-url": "https://www.ishtari.com",
      "admin-products-url":
        "https://www.ishtari.com/control/admin/index.php?route=catalog/product_one&token=",
      "admin-orders-url":
        "https://www.ishtari.com/control/admin/index.php?route=sale/order_one&token=",
      "admin-update-product":
        "https://www.ishtari.com/control/admin/index.php?route=catalog/product/update&product_id=",
      facebook: "https://www.facebook.com/ishtari.lebanon",
      instagram: "https://www.instagram.com/ishtaricom/",
      youtube: "https://www.youtube.com/channel/UCZ9aa_BjFF2oWVEtC4f6PDA",
      twitter: "https://twitter.com/ishtari",
      linkedin: "https://www.linkedin.com/company/ishtari",
      termCondition: false,
      loginRequired: false,
    };
  } else if (
    host === "ishtari-ghana" ||
    host === "https://www.ishtari.com.gh/" ||
    host === "ishtari.com.gh"
  ) {
    config = {
      "short-name": "ishtari",
      "seo-title": "ishtari | Online Shopping in Ghana",
      "seo-title-base": " | ishtari",
      "seo-description":
        "Discover ishtari- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق ",
      email: {
        it: "it@ishtari.com",
      },
      emailCheckout: true,

      "site-url": "https://www.ishtari.com.gh",
      numbers: ["0500665522"],
      "admin-update-product":
        "https://www.ishtari.com.gh/control/admin/index.php?route=catalog/product/update&product_id=",
      "admin-products-url":
        "https://www.ishtari.com.gh/control/admin/index.php?route=catalog/product_one&token=",
      "admin-orders-url":
        "https://www.ishtari.com.gh/control/admin/index.php?route=sale/order_one&token=",
      "site-name": "ISHTARI",

      showMenu: true,
      showMenu2: true,
      showCart: true,
      showTopBrand: false,
      showVisaCard: false,
      appleStore: "https://www.ishtari.com.gh/app",
      googlePlay: "https://www.ishtari.com.gh/app",
      "fb-meta": "jfr4rwyl2sxv2z7lfx9e34a7qd70yq",
      appId: "1044051939655564",
      facebook: "https://www.facebook.com/ishtari.ghana",
      instagram: "https://www.instagram.com/ishtari.ghana/",
      youtube: "",
      linkedin: "https://gh.linkedin.com/company/ishtari",
      send_email: "info@ishtari.com.gh",
      supportNumber: "0500667666",
      countryCode: "+233",
      zone: "82",
      useTown: true,
      "initial-zone": { id: "1274", name: "Greater Accra Region" },
      loginRequired: false,
      termCondition: true,
    };
  } else if (
    host === "flo" ||
    host === "www.flo-lebanon.com" ||
    host === "www.flo-lebanon.com" ||
    host === "flo-lebanon.com"
  ) {
    config = {
      "short-name": "Flo",
      "seo-title": "Flo | Online Shopping in Lebanon",
      "seo-title-base": " | Flo",
      "seo-description":
        "Discover Flo- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق ",
      email: {
        it: "it@ishtari.com",
      },
      "site-url": "https://www.flo-lebanon.com",

      "site-name": "FLO LEBANON",
      numbers: [],
      "admin-update-product":
        "https://www.flo-lebanon.com/control/admin/index.php?route=catalog/product/update&product_id=",
      "admin-products-url":
        "https://www.flo-lebanon.com/control/admin/index.php?route=catalog/product_one&token=",
      "admin-orders-url":
        "https://www.flo-lebanon.com/control/admin/index.php?route=sale/order_one&token=",

      showMenu: true,
      showMenu2: true,
      showCart: true,
      showTopBrand: false,
      showVisaCard: true,

      appleStore: "",
      googlePlay: "",
      "fb-meta": "jfr4rwyl2sxv2z7lfx9e34a7qd70yq",
      appId: "1044051939655564",
      facebook: "https://www.facebook.com/ishtari.ghana",
      instagram: "https://www.instagram.com/ishtari.ghana/",
      youtube: "",
      send_email: "info@ishtari.com.gh",
      supportNumber: "",
      countryCode: "+961",
      zone: "118",
      useTown: false,
      "initial-zone": { id: "3969", name: "Beirut بيروت" },
      loginRequired: false,
      termCondition: true,
    };
  } else if (
    host === "flo-bey" ||
    host === "www.flo-lebanon.com" ||
    host === "flo-lebanon.com"
  ) {
    config = {
      "short-name": "Flo",
      "seo-title": "Flo  | Online Shopping in Lebanon",
      "seo-title-base": " | Flo",
      "seo-description":
        "Discover ishtari- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق ",
      email: {
        it: "it@ishtari.com",
      },
      "site-url": "https://www.flo-lebanon.com/bey",
      numbers: [""],
      "admin-update-product":
        "https://www.flo-lebanon.com/bey/control/admin/index.php?route=catalog/product/update&product_id=",
      "admin-products-url":
        "https://www.flo-lebanon.com/bey/control/admin/index.php?route=catalog/product_one&token=",
      "admin-orders-url":
        "https://www.flo-lebanon.com/bey/control/admin/index.php?route=sale/order_one&token=",
      "site-name": "FLO LEBANON",

      showMenu: true,
      showMenu2: true,
      showCart: true,
      showTopBrand: false,
      showVisaCard: true,

      appleStore: "",
      googlePlay: "",
      "fb-meta": "jfr4rwyl2sxv2z7lfx9e34a7qd70yq",
      appId: "1044051939655564",
      facebook: "https://www.facebook.com/ishtari.ghana",
      instagram: "https://www.instagram.com/ishtari.ghana/",
      youtube: "",
      send_email: "",
      supportNumber: "",
      countryCode: "+961",
      zone: "118",
      useTown: false,
      "initial-zone": { id: "3969", name: "Beirut بيروت" },
      loginRequired: false,
      termCondition: true,
    };
  } else if (
    host === "aalbeit" ||
    host === "www.aalbeit.com" ||
    host === "aalbeit.com"
  ) {
    config = {
      "short-name": "Aalbeit",
      "seo-title": "Aalbeit | Online Shopping in Lebanon",
      "seo-title-base": " | Aalbeit",
      "seo-description":
        "Discover ishtari- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق اللبنانية",

      "admin-products-url":
        "https://www.aalbeit.com/control/admin/index.php?route=catalog/product_one&token=",
      "admin-orders-url":
        "https://www.aalbeit.com/control/admin/index.php?route=sale/order_one&token=",
      "site-url": "https://www.aalbeit.com",
      facebook: "https://www.facebook.com/ishtari.lebanon",
      instagram: "https://www.instagram.com/ishtaricom/",
      youtube: "https://www.youtube.com/channel/UCZ9aa_BjFF2oWVEtC4f6PDA",
      supportNumber: "06444174",
      countryCode: "+961",
      showMenu: true,
      showCart: true,
      showTopBrand: true,
      showVisaCard: true,

      zone: "118",
      "initial-zone": { id: "3969", name: "Beirut بيروت" },
      appleStore: "",
      googlePlay: "",
      "fb-meta": "12345678",
    };
  } else if (
    host === "ishtari-usd" ||
    host === "www.ishtari-usd.com" ||
    host === "ishtari-usd.com"
  ) {
    config = {
      "short-name": "ishtari USD",
      "seo-title": "ishtari | Online Shopping in Lebanon",
      "seo-title-base": " | ishtari",
      "site-url": "https://www.ishtari-usd.com",
      "seo-description":
        "Discover ishtari- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق اللبنانية",
      email: {
        it: "it@ishtari.com",
      },
      numbers: ["71060215", "81418583"],
      supportNumber: "70464748",
      countryCode: "+961",
      showMenu: true,
      showMenu2: false,
      "fb-meta": "12345678",
      appId: "130719880936639",

      showCart: true,
      showTopBrand: false,
      showVisaCard: true,

      zone: "118",
      "initial-zone": { id: "3969", name: "Beirut بيروت" },
      appleStore: "",
      googlePlay: "",
      useTown: false,

      "admin-update-product":
        "https://www.ishtari-usd.com/control/admin/index.php?route=catalog/product/update&product_id",
      "admin-products-url":
        "https://www.ishtari-usd.com/control/admin/index.php?route=catalog/product_one&token=",
      "admin-orders-url":
        "https://www.ishtari-usd.com/control/admin/index.php?route=sale/order_one&token=",
      facebook: "https://www.facebook.com/ishtari.lebanon",
      instagram: "https://www.instagram.com/ishtaricom/",

      youtube: "https://www.youtube.com/channel/UCZ9aa_BjFF2oWVEtC4f6PDA",
    };
  } else if (
    host === "energy-plus" ||
    host === "www.energyplus-lb.com" ||
    host === "energyplus-lb.com"
  ) {
    config = {
      "short-name": "energy+",
      "seo-title": "energy+ | Online Shopping in Lebanon",
      "seo-title-base": " | energy+",
      "seo-description":
        "Discover energy+ - Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق اللبنانية",
      email: {
        it: "it@ishtari.com",
      },
      numbers: [],
      supportNumber: "70464748",
      countryCode: "+961",
      "fb-meta": "12345678",
      appId: "130719880936639",
      showMenu: true,
      showMenu2: true,
      showCart: true,
      showTopBrand: true,
      showVisaCard: true,
      send_email: "info@ishtari.com",
      "site-name": "ENERGY++",

      zone: "118",
      "initial-zone": { id: "3969", name: "Beirut بيروت" },
      appleStore: "https://apps.apple.com/lb/app/ishtari/id1248110122",
      googlePlay:
        "https://play.google.com/store/apps/details?id=com.smartdevision.app.ishtari",

      "admin-product-url":
        "https://energyplus-lb.com/control/admin/index.php?route=catalog/product/update&product_id=",
      "site-url": "https://www.energyPlus-lb.com",
      "admin-products-url":
        "https://energyplus-lb.com/control/admin/index.php?route=catalog/product_one&token=",
      "admin-orders-url":
        "https://energyplus-lb.com/control/admin/index.php?route=sale/order_one&token=",
      "admin-update-product":
        "https://energyplus-lb.com/control/admin/index.php?route=catalog/product/update&product_id=",
      facebook: "https://www.facebook.com/ishtari.lebanon",
      instagram: "https://www.instagram.com/ishtaricom/",
      youtube: "https://www.youtube.com/channel/UCZ9aa_BjFF2oWVEtC4f6PDA",
      termCondition: false,
      loginRequired: false,
    };
  }
  return config;
};

export { getHost, getMainData, getConfig };
