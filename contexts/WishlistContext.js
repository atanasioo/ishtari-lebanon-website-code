import { useReducer, createContext } from "react"
import { WishListReducer, initialState } from "../reducers/WishlistReducer"

export const WishlistContext = createContext({
    state: initialState,
    dispatch: () => null
})

export const WishlistProvider = ({ children }) => {
    const [state, dispatch] = useReducer(WishListReducer, initialState)

    return (
        <WishlistContext.Provider value={[state, dispatch]}>
            {children}
        </WishlistContext.Provider>
    )
}