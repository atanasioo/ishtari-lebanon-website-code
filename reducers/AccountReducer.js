export const AccountReducer = (state, action) => {
    switch (action.type) {
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
      case "setUsername":
        return {
          ...state,
          username: action.payload
        };
      case "setFirstname":
        return {
          ...state,
          username: action.payload
        };
      case "setLastname":
        return {
          ...state,
          username: action.payload
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
  
      default:
        return state;
    }
  };
  export const initialState = {
    loged: false,
    loading: false,
    showLogin: false,
    showOver: false,
    showSignup: false,
    username: "",
    firstname: "",
    lastname: "",
    userId: "",
    admin: false,
    adminToken: "",
    adminLoading: true,
    wtspNumber: "",
     email: "",
    isSeller: false
  };
  