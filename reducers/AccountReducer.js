export const AccountReducer = (state, action) => {
  switch (action.type) {
   case "setButtonLocked":
    return{
      ...state,
      ButtonLocked:action.payload
    }
    case "setLoadingCouponRedeem":
      return{
        ...state,
        loadingCouponRedeem:action.payload
      }
    case "setOpenModalCoupon":
      return{
        ...state,
        ModalCoupon:action.payload
      }
      case "setCouponForYou":
        return{
          ...state,
          couponForyou:action.payload
        }
    case "setShowOver":
      return {
        ...state,
        showOver: action.payload
      };
    case "setShowLogin":
      return {
        ...state,
        showLogin: action.payload
      };
    case "setShowSignup":
      return {
        ...state,
        showSignup: action.payload
      };
      case "setShowForgetPassword":
        return {
          ...state,
          showForgetPassword: action.payload
        };
        case "setShowEmailSent":
          return {
            ...state,
            setShowEmailSent: action.payload
          };
    case "setLoged":
      return {
        ...state,
        loged: action.payload
      };
    case "setLoading":
      return {
        ...state,
        loading: action.payload
      };
      case "setLoadingEmail":
        return {
          ...state,
          loadingEmail: action.payload
        };
    case "setUsername":
      return {
        ...state,
        username: action.payload
      };
    case "setFirstname":
      return {
        ...state,
        firstname: action.payload
      };
    case "setLastname":
      return {
        ...state,
        lastname: action.payload
      };
    case "setUserId":
      return {
        ...state,
        userId: action.payload
      };
    case "setAdmin":
      return {
        ...state,
        admin: action.payload
      };
    case "setAdminToken":
      return {
        ...state,
        adminToken: action.payload
      };
    case "setAdminLoading":
      return {
        ...state,
        adminLoading: action.payload
      };
    case "setNumber":
      return {
        ...state,
        wtspNumber: action.payload
      };
    case "setSeller":
      return {
        ...state,
        isSeller: action.payload
      };

    case "setEmail":
      return {
        ...state,
        email: action.payload
      };
      case "sethasDateBirth":
      return {
        ...state,
        hasdateBirth: action.payload
      };
      case "setopenRemindBirthday":
        return {
          ...state,
          openRemindBirthday: action.payload
        };
        case "setHasSignedUp":
          return {
            ...state,
            openRemindBirthday: action.payload
          };
          case "setHasLogedIn":
            return {
              ...state,
              openRemindBirthday: action.payload
            };
    default:
      return state;
  }
};
export const initialState = {
  loged: false,
  // loading: false,
  showForgetPassword:false,
  setShowEmailSent:false,
  loading: true,
  showLogin: false,
  showOver: false,
  showSignup: false,
  username: "",
  hasdateBirth:true,
  firstname: "",
  lastname: "",
  userId: "",
  admin: false,
  adminToken: "",
  adminLoading: true,
  wtspNumber: "",
   email: "",
  isSeller: false,
  loadingEmail:false,
  ButtonLocked:false,
  ModalCoupon:false,
  couponForyou:null,
  loadingCouponRedeem:false,
  openRemindBirthday:false,
  hasSignedUp:false,
  hasLogedIn:false
};
