export const SuggestionReducer = (state, action) => {
    switch (action.type) {
  
      case "setLoading":
        return {
          ...state,
          loading: action.payload
        };
    
  
      default:
        return state;
    }
  };
  export const initialState = {
    loading: false,
  };
  