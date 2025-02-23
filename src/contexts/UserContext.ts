import { createContext, useContext } from "react";

export interface User {
    id: string;
    name: string,
    email: string,
    photoURL: string,
    interests: string[]
}

export const initialUserValue = {
    id: "",
    name: "",
    email: "",
    photoURL: "",
    interests: [""]
}

export const UserContext = createContext({
    userLog: false,
    user: initialUserValue
})

export const UserProvider = UserContext.Provider

export default function useUser() {
    return useContext(UserContext)
}