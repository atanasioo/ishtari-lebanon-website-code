import { useReducer, createContext } from "react"
import { CartReducer, initialState } from "../reducers/CartReducer"

export const CartContext = createContext({
    state: initialState,
    dispatch: () => null
})

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState)

    return (
        <CartContext.Provider value={[state, dispatch]}>
            {children}
        </CartContext.Provider>
    )
}