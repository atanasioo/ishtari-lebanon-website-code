import { useReducer, createContext } from "react"
import { SuggestionReducer, initialState } from "../reducers/SuggestionReducer"

export const SuggestionContext = createContext({
    state: initialState,
    dispatch: () => null
})

export const SuggestionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SuggestionReducer, initialState)

    return (
        <SuggestionContext.Provider value={[state, dispatch]}>
            {children}
        </SuggestionContext.Provider>
    )
}