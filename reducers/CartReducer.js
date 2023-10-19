export const CartReducer = (state, action) => {
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
        case "setTotals":
            return {
                ...state,
                totals: action.payload
            }
        case "loading":
            return {
                ...state,
                loading: action.payload
            }
        
        case "setWishlist":{
            return {
                ...state,
                wishlist : action.payload
            }
        }
        case "setAsidecart":{
            return {
                ...state,
                aside : action.payload
            }
        }
        case "setProduct":{
            return {
                ...state,
                product : action.payload
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
    aside:false,
    products: [],
    product: '',
    totals: [],
    wishlist:[]
}