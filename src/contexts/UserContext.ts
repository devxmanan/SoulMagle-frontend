import { createContext, useContext } from "react";

export interface User {
    _id: string;
    name: string,
    email: string,
    profilePic: string,
    interests: string[]
}

export const initialUserValue = {
    _id: "",
    name: "",
    email: "",
    profilePic: "",
    interests: [""]
}

export const UserContext = createContext({
    userLog: false,
    user: initialUserValue,
    //@ts-ignore
    setUserLogged: (value: boolean) => { }
})

export const UserProvider = UserContext.Provider

export default function useUser() {
    return useContext(UserContext)
}