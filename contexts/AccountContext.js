import { useReducer, createContext } from "react"
import { AccountReducer, initialState } from "../reducers/AccountReducer"

export const AccountContext = createContext({
    state: initialState,
    dispatch: () => null
})

export const AccountProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AccountReducer, initialState)

    return (
        <AccountContext.Provider value={[state, dispatch]}>
            {children}
        </AccountContext.Provider>
    )
}