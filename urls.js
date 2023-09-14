import Cookies from "js-cookie";

export var path = "";
if (typeof window !== "undefined") {
  var host = window.location.host;

  if (window.location.href.split("/")[3] === "bey") {
    path = "/bey";
  }
}

export var pixelID = "";
var mobileurls;
var path1 = "";
var urls = {
  token: "v2/index.php?route=token/token&grant_type=client_credentials",
  login: "v2/index.php?route=account/login/login",
  get_account: "v2/index.php?route=account/account/getAccount",
  save_account: "v2/index.php?route=account/account/saveAccount",
  change_password: "v2/index.php?route=account/account/changePassword",
  forget_password: "v2/index.php?route=account/forgotten/forgotten",
  wishlist: "v2/index.php?route=account/wishlist/wishlist",
  wishlistCount: "v2/index.php?route=account/wishlist/getTotalWishlist",
  orders: "v2/index.php?route=account/order/orders",
  order_details: "v2/index.php?route=account/order/orders&id=",
  register: "v2/index.php?route=account/register/register",
  latest: "v2/index.php?route=catalog/product/latest",
  zone: "v2/index.php?route=account/zone&country_id=",
  town: "v2/index.php?route=account/town&zone_id=",
  social: "v2/index.php?route=account/login/sociallogin",
  logout: "v2/index.php?route=account/logout/logout",
  address: "v2/index.php?route=account/address/address",
  cart: "v2/index.php?route=checkout/cart/cart",
  cartCount: "v2/index.php?route=checkout/cart/getProductsCount",
  search: "v2/index.php?route=catalog/search/autoCompleteV2&term=",
  trendingSearch: "v2/index.php?route=catalog/search/topSearch",
  historySearch: "v2/index.php?route=catalog/search/TopSearchByCustomer",
  home: "v2/index.php?route=common/widgets",
  banner_stats: "v2/index.php?route=analytics/banner/fetchStats",
  //home: "v2/index.php?route=common/widgets_preview",
  product: "v2/index.php?route=catalog/product&product_id=",
  recentlyViewed: "v2/index.php?route=catalog/recently_viewed",
  reviewedProtuctsCenter: "v2/index.php?route=catalog/review/getCustomerReviewedProducts",
  unreviewedProtuctsCenter: "v2/index.php?route=catalog/review/getCustomerUnreviewedProducts",
  getcustomerfeedback:"v2/index.php?route=account/feedback/getCustomerFeedback",
  getFlashSale: "v2/index.php?route=catalog/flash_sale&limit=20&page=1&flash_sale_event_id=",
  getProductAdditionalData: "v2/index.php?route=catalog/product/getProductAdditionalData",
  getReturnReasons: "v2/index.php?route=checkout/return_order/getReturnData",
  addReturnOrder: "v2/index.php?route=checkout/return_order/addReturnOrder",
  addReminderForFlashSale: "v2/index.php?route=catalog/flash_sale/remindMe",
  editcustomerfeedback: "v2/index.php?route=account/feedback/editCustomerFeedback",
  getTopSellingByCategoryId: "v2/index.php?route=cronjob/sold_item/getTopSellingByCategoryid",
  getAllTopSellingbyCategoryid: "v2/index.php?route=cronjob/sold_item/getAllTopSellingbyCategoryid",
  getBalance: "v2/index.php?route=account/wallet/getBalance",
  getTransactionHistory: "v2/index.php?route=account/wallet/getTransactionHistory",
  productpreview: "v2/index.php?route=catalog/product_preview&product_id=",
  category: "v2/index.php?route=catalog/category&path=",
  manufacturer: "v2/index.php?route=catalog/manufacturer&manufacturer_id=",
  seller: "v2/index.php?route=catalog/seller&seller_id=",
  alg: "v2/index.php?route=catalog/search&key=",
  filter: "v2/index.php?route=catalog/filter_product",
  banner_event: "v2/index.php?route=design/bannerevent",
  menu: "v2/index.php?route=common/home/getMenu",
  footer: "v2/index.php?route=common/home/getFooter",
  all_categories: "v2/index.php?route=catalog/category/categories&level=2",
  manual: "v2/index.php?route=checkout/manual",
  payment_form: "v2/index.php?route=checkout/payment_form",
  autoCompletePhone:
    "v2/index.php?route=account/address/autoComplete&filter_name=",
  getCustomerByPhone:
    "v2/index.php?route=account/address/getCustomerByPhone&phone=",
  information: "v2/index.php?route=catalog/information",
  alias: "v2/index.php?route=catalog/seo/handler&keyword=",
  footerv2: "v2/index.php?route=common/footerItem",
  headerv2: "v2/index.php?route=design/headerMenu",
  reviews: "v2/index.php?route=catalog/review",
  pixel: "v2/index.php?route=marketing/st",
  currency: "v2/index.php?route=account/change/currency",
  notify: "v2/index.php?route=marketing/notify/addNotification",
  // productBundles:
  //   "v2/index.php?route=catalog/product/getProductBundles&product_id=",
  insertLike: "v2/index.php?route=catalog/product/likeProduct",
  deleteLike: "v2/index.php?route=catalog/product/unlikeProduct",
  getLikeProduct: "v2/index.php?route=catalog/product/getLikedProducts",
  verify: "v2/index.php?route=account/address/addressPhoneVerification",
  checkVerify: "v2/index.php?route=account/address/checkVerification",
  disabledAccount: "v2/index.php?route=account/logout/disableAccount",
  widgetsPreview: "v2/index.php?route=common/widgets_preview",
  buyagain: "v2/index.php?route=account/order/getProductFromCompletedOrder",
  contactUs: "v2/index.php?route=account/contact_us",
  wishlist_group: "v2/index.php?route=account/wishlist_group/getGroups",
  EmailNotifications:
    "v2/index.php?route=account/account/getCustomerEmailDisable",
  disableEmailNotification:
    "v2/index.php?route=account/account/customerEmailDisable",
  whishlistProducts:
    "v2/index.php?route=account/wishlist_group/getGroupProducts",
  wishlistAdd: "v2/index.php?route=account/wishlist_group/addGroup",
  wishlistDelete:
    "v2/index.php?route=account/wishlist_group/deleteGroup&group_id=",
  wishlistUpdate: "v2/index.php?route=account/wishlist_group/updateGroup",
  addToWishlist_5: "v2/index.php?route=account/wishlist_group/addToWishlist",
  removeAll: "v2/index.php?route=account/wishlist_group/deleteItemFromAllGroup",
  pos: "v2/index.php?route=checkout/cart/addToCartPos",

  //Seller report
  seller_home: "v2/index.php?route=seller_report/home",
  seller_profile: "v2/index.php?route=seller_report/profile",
  seller_products: "v2/index.php?route=seller_report/products",
  seller_product_info: "v2/index.php?route=seller_report/products/info",
  seller_edit_product: "v2/index.php?route=seller_report/products/edit",
  seller_orders: "v2/index.php?route=seller_report/orders",
  seller_print_orders:
    "v2/index.php?route=seller_report/orders/getSellerOrders",
  seller_order_info: "v2/index.php?route=seller_report/orders/getOrderInfo",
  seller_return_orders: "v2/index.php?route=seller_report/return_order",
  seller_return_order_info:
    "v2/index.php?route=seller_report/return_order/getReturnOrderInfo",
  seller_accounting: "v2/index.php?route=seller_report/accounting",
  seller_reports: "v2/index.php?route=seller_report/reports",
  seller_reports_sold_products:
    "v2/index.php?route=seller_report/reports/getSoldProduct",
    clearCache: "v2/index.php?route=catalog/search/clearKeyCache&term=",

    pos : "v2/index.php?route=checkout/cart/addToCartPos",
    getSalesMan: "v2/index.php?route=stockapi/admin_login/getSalesMan",
    searchProduct: "v2/index.php?route=stockapi/product&item=",
};

if (typeof window !== "undefined") {
  if (
    Cookies.get("site-local-name") === "ishtari-ghana" ||
    host === "www.ishtari.com.gh" ||  host === "next.ishtari.com.gh" || 
    host === "ishtari.com.gh"
  ) {
    pixelID = "1132590020651282";
    host = "https://www.ishtari.com.gh/";
    // urls = {
    path1 = "";
    //   token: "v2/index.php?route=token/new_token&grant_type=client_credentials",
    //   login: "v2/index.php?route=account/login/login",
    //   get_account: "v2/index.php?route=account/account/getAccount",
    //   save_account: "v2/index.php?route=account/account/saveAccount",
    //   change_password: "v2/index.php?route=account/account/changePassword",
    //   wishlist: "v2/index.php?route=account/wishlist/wishlist",
    //   orders: "v2/index.php?route=account/order/orders",
    //   order_details: "v2/index.php?route=account/order/orders&id=",
    //   register: "v2/index.php?route=account/register/register",
    //   latest: "v2/index.php?route=catalog/product/latest",
    //   zone: "v2/index.php?route=account/zone/zone&country_id=",
    //   town: "v2/index.php?route=account/town/town&zone_id=",
    //   social: "v2/index.php?route=account/login/sociallogin",
    //   logout: "v2/index.php?route=account/logout/logout",
    //   address: "v2/index.php?route=account/address/address",
    //   cart: "v2/index.php?route=checkout/cart/cart",
    //   cartCount: "v2/index.php?route=checkout/cart/getProductsCount",
    //   search: "v2/index.php?route=catalog/fastsearch/autoComplete&term=",
    //   home: "v2/index.php?route=common/widgets",
    //   product: "v2/index.php?route=catalog/product&product_id=",
    //   productpreview: "v2/index.php?route=catalog/productpreview&product_id=",
    //   category: "v2/index.php?route=catalog/category&path=",
    //   manufacturer: "v2/index.php?route=catalog/manufacturer&manufacturer_id=",
    //   seller: "v2/index.php?route=catalog/seller&seller_id=",
    //   alg: "v2/index.php?route=catalog/new_search&key=",
    //   filter: "/v2/index.php?route=catalog/filter_product/new_filter",
    //   banner_event: "v2/index.php?route=design/bannerevent",
    //   menu: "v2/index.php?route=common/home/getMenu",
    //   footer: "v2/index.php?route=common/home/getFooter",
    //   all_categories: "v2/index.php?route=catalog/category/categories&level=2",
    //   manual: "v2/index.php?route=checkout/manual",
    //   payment_form: "v2/index.php?route=checkout/payment_form",
    //   autoCompletePhone:
    //     "v2/index.php?route=account/address/autoComplete&filter_name=",
    //   getCustomerByPhone:
    //     "v2/index.php?route=account/address/getCustomerByPhone&phone=",
    //   information: "v2/index.php?route=catalog/information",
    //   footerv2: "v2/index.php?route=common/footerItem",
    //   headerv2: "v2/index.php?route=design/headermenu/header",
    //   reviews: "v2/index.php?route=catalog/review"
    // };
  }
  if (
    Cookies.get("site-local-name") === "ishtari" ||
    host === "www.ishtari.com" ||
    host === "www.sari3.com" ||
    host === "ishtari.com"  || 
    host === "next.ishtari.com" ||
    host === "ishtari-mobile.com"
  ) {
    pixelID = "668318187192045";
    host = "https://www.ishtari.com/";
    path1 = "motor/";
    mobileurls = {
      token: "v2/index.php?route=token/token&grant_type=client_credentials",
      login: "v2/index.php?route=account/login/login",
      get_account: "v2/index.php?route=account/account/getAccount",
      save_account: "v2/index.php?route=account/account/saveAccount",
      change_password: "v2/index.php?route=account/account/changePassword",
      forget_password: "v2/index.php?route=account/forgotten/forgotten",
      wishlist: "v2/index.php?route=account/wishlist/wishlist",
      wishlistCount: "v2/index.php?route=account/wishlist/getTotalWishlist",
      orders: "v2/index.php?route=account/order/orders",
      order_details: "v2/index.php?route=account/order/orders&id=",
      register: "v2/index.php?route=account/register/register",
      latest: "v2/index.php?route=catalog/product/latest",
      zone: "v2/index.php?route=account/zone&country_id=",
      social: "v2/index.php?route=account/login/sociallogin",
      logout: "v2/index.php?route=account/logout/logout",
      address: "v2/index.php?route=account/address/address",
      cart: "v2/index.php?route=checkout/cart/cart",
      cartCount: "v2/index.php?route=checkout/cart/getProductsCount",
      search: "v2/index.php?route=catalog/search/autoCompleteV2&term=",
      trendingSearch: "v2/index.php?route=catalog/search/topSearch",
      historySearch: "v2/index.php?route=catalog/search/TopSearchByCustomer",
      getReturnReasons: "v2/index.php?route=checkout/return_order/getReturnReasons",
      addReturnOrder: "v2/index.php?route=checkout/return_order/addReturnOrder",
      home: "v2/index.php?route=common/widgets",
      //home: "v2/index.php?route=common/widgets_preview",
      product: "v2/index.php?route=catalog/product&product_id=",
      productpreview: "v2/index.php?route=catalog/product_preview&product_id=",
      category: "v2/index.php?route=catalog/category&path=",
      manufacturer: "v2/index.php?route=catalog/manufacturer&manufacturer_id=",
      seller: "v2/index.php?route=catalog/seller&seller_id=",
      alg: "v2/index.php?route=catalog/search&key=",
      filter: "v2/index.php?route=catalog/filter_product",
      banner_event: "v2/index.php?route=design/bannerevent",
      menu: "v2/index.php?route=common/home/getMenu",
      footer: "v2/index.php?route=common/home/getFooter",
      all_categories: "v2/index.php?route=catalog/category/categories&level=2",
      manual: "v2/index.php?route=checkout/manual",
      payment_form: "v2/index.php?route=checkout/payment_form",
      autoCompletePhone:
        "v2/index.php?route=account/address/autoComplete&filter_name=",
      getCustomerByPhone:
        "v2/index.php?route=account/address/getCustomerByPhone&phone=",
      information: "v2/index.php?route=catalog/information",
      alias: "v2/index.php?route=catalog/seo/handler&keyword=",
      footerv2: "v2/index.php?route=common/footerItem",
      headerv2: "v2/index.php?route=design/headerMenu",

      currency: "v2/index.php?route=account/change/currency",
      notify: "v2/index.php?route=marketing/notify/addNotification",
      // productBundles:
      //   "v2/index.php?route=catalog/product/getProductBundles&product_id=",
      insertLike: "v2/index.php?route=catalog/product/likeProduct",
      deleteLike: "v2/index.php?route=catalog/product/unlikeProduct",
      getLikeProduct: "v2/index.php?route=catalog/product/getLikedProducts",
      town: "v2/index.php?route=account/town/town&zone_id=",
      verify: "v2/index.php?route=account/address/addressPhoneVerification",
      checkVerify: "v2/index.php?route=account/address/checkVerification",
      disabledAccount: "v2/index.php?route=account/logout/disableAccount",
      widgetsPreview: "v2/index.php?route=common/widgets_preview",
      buyagain: "v2/index.php?route=account/order/getProductFromCompletedOrder",
      contactUs: "v2/index.php?route=account/contact_us",
      EmailNotifications:
        "v2/index.php?route=account/account/getCustomerEmailDisable",
      disableEmailNotification:
        "v2/index.php?route=account/account/customerEmailDisable",

      //Seller report
      seller_home: "v2/index.php?route=seller_report/home",
      seller_profile: "v2/index.php?route=seller_report/profile",
      seller_products: "v2/index.php?route=seller_report/products",
      seller_product_info: "v2/index.php?route=seller_report/products/info",
      seller_edit_product: "v2/index.php?route=seller_report/products/edit",
      seller_orders: "v2/index.php?route=seller_report/orders",
      seller_print_orders:
        "v2/index.php?route=seller_report/orders/getSellerOrders",
      seller_order_info: "v2/index.php?route=seller_report/orders/getOrderInfo",
      seller_return_orders: "v2/index.php?route=seller_report/return_order",
      seller_return_order_info:
        "v2/index.php?route=seller_report/return_order/getReturnOrderInfo",
      seller_accounting: "v2/index.php?route=seller_report/accounting",
      seller_reports: "v2/index.php?route=seller_report/reports",
      seller_reports_sold_products:
        "v2/index.php?route=seller_report/reports/getSoldProduct",
        pos : "v2/index.php?route=checkout/cart/addToCartPos",
        getSalesMan: "v2/index.php?route=stockapi/admin_login/getSalesMan",
        searchProduct: "v2/index.php?route=stockapi/product&item=",

    };
  }
  const firstPath = window.location.href.split("/")[3];
  // alert(firstPath)

  if (
    Cookies.get("site-local-name") === "flo" ||
    ((host === "www.flo-lebanon.com" || host === "flo-lebanon.com") &&
      firstPath !== "bey")
  ) {
    host = "https://www.flo-lebanon.com/";
    path1 = "api/";
  }

  if (
    Cookies.get("site-local-name") === "flo-bey" ||
    ((host === "www.flo-lebanon.com" || host === "flo-lebanon.com") &&
      firstPath === "bey")
  ) {
    host = "https://www.flo-lebanon.com/";
    path1 = "bey/api/";
  }
  if (
    Cookies.get("site-local-name") === "aalbeit" ||
    host === "www.aalbeit.com" ||
    host === "aalbeit.com"
  ) {
    host = "https://www.aalbeit.com/";
    path1 = "api/";
  }
  if (
    Cookies.get("site-local-name") === "ishtari-usd" ||
    host === "www.ishtari-usd.com"
  ) {
    host = "https://www.ishtari-usd.com/";
    path1 = "api/";
  }
  if (
    Cookies.get("site-local-name") === "energy-plus" ||
    host === "www.energyplus-lb.com" ||
    host === "energyplus-lb.com"
  ) {
    host = "https://energyplus-lb.com/";
    path1 = "api/";
  }
}
function buildLink(link, payload, width, hostServer) {
  const type = Cookies.get("site-local-name");

  // if (
  //   (width < 500 && localStorage.getItem("site-local-name") === "ishtari") ||
  //   (width < 500 && host === "https://www.ishtari.com/")
  // ) {
  //   var mobilehost = "https://www.ishtari-mobile.com/";
  //   const extra_params = typeof payload == "undefined" ? "" : payload;
  //   return mobilehost + mobileurls[link] + extra_params;
  // } else {
  const extra_params = typeof payload == "undefined" ? "" : payload;
  // if (typeof window !== "undefined" &&  hostServer !== "https://cloudgoup.com/" && hostServer !== "https://www.cloudgoup.com/" && hostServer !== "http://cloudgoup.com" && hostServer !== "www.cloudgoup.com" && hostServer !== "www.ishtari.com"){
  //  return host + path1 + urls[link] + extra_params;
  // }else{
///
  if (
    hostServer === "ishtari" ||
    hostServer === "https://www.ishtari.com" ||
    hostServer === "http://cloudgoup.com" ||
    hostServer === "https://cloudgoup.com/" ||
    hostServer === "www.cloudgoup.com" ||

    hostServer === "https://next.ishtari.com/" ||
    hostServer === "https://www.next.ishtari.com/" ||
    hostServer === "http://next.ishtari.com" ||
    hostServer === "www.next.ishtari.com"||
    hostServer === "next.ishtari.com" ||
    hostServer === "www.ishtari.com" ||
    hostServer === "ishtari-mobile.com" ||
    hostServer === "https://ishtari-mobile.com/" 
  ) {
    host = "https://www.ishtari.com/";
    path1 = "motor/";
    return host + path1 + urls[link] + extra_params;
  } else if (
    hostServer === "ishtari-ghana" ||
    hostServer === "https://www.ishtari.com.gh/" ||  hostServer === "next.ishtari.com.gh" ||
    hostServer === "https://next.ishtari.com.gh" ||
    hostServer === "www.next.ishtari.com.gh"||
    type === "ishtari-ghana"
  ) {

    host = "https://www.ishtari.com.gh/";
    path1 = "";
    return host + path1 + urls[link] + extra_params;
  } else if (
    hostServer === "flo" ||
    hostServer === "https://www.flo-lebanon.com/"
  ) {
    host = "https://www.flo-lebanon.com/";
    path1 = "api/";
    return host + path1 + urls[link] + extra_params;
  } else if (
    hostServer === "flo-bey" ||
    hostServer === "https://www.flo-lebanon.com/"
  ) {
    host = "https://www.flo-lebanon.com/";
    path1 = "bey/api/";
    return host + path1 + urls[link] + extra_params;
  } else if (
    hostServer === "aalbeit" ||
    hostServer === "https://www.aalbeit.com/"
  ) {
    host = "https://www.aalbeit.com/";
    path1 = "api/";
    return host + path1 + urls[link] + extra_params;
  } else if (
    hostServer === "ishtari-usd" ||
    hostServer === "https://www.ishtari-usd.com/"
  ) {
    host = "https://www.ishtari-usd.com/";
    path1 = "api/";
    return host + path1 + urls[link] + extra_params;
  } else if (
    hostServer === "energy-plus" ||
    hostServer === "https://energyplus-lb.com/"
  ) {
    host = "https://energyplus-lb.com/";
    path1 = "api/";
    return host + path1 + urls[link] + extra_params;
  } else {
    // host="https://www.ishtari.com.gh/";
  }
  return host + path1 + urls[link] + extra_params;
  //}

  // }
}
export default buildLink;
