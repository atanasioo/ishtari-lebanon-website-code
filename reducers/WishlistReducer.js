export const WishListReducer = (state, action) => {
    switch (action.type) {
        case "setProducts":
            return {
                ...state,
                products: action.payload
            }
        case "setProductsCount":
            return {
                ...state,
                productsCount: action.payload
            }
        
        case "loading":
            return {
                ...state,
                loading: action.payload
            }
        
        case "setProductIds":{
            return {
                ...state,
                pIds : action.payload
            }
        }

        default:
            return state
    }
}


export const initialState = {
    productsCount: 0,
    loading: false,
    emptyCart: false,
    products: [],
    pIds:[]
} 