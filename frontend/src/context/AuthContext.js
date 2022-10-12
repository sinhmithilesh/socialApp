import {createContext, useReducer} from "react";
import AuthReducer from "./AuthReducer"
import React from "react";

const INITIAL_STATE = {
    user: {
        _id : "632c3985a7d5d2f62b1520e5",
        username : "mithlesh",
        email : "mithlesh1@gmail.com",
        profilePicture: "person/1.jpeg",
        coverPicture : "",
        isAdmin : false,
        followers: [],
        following: ['632c4a4379692a65a7be1a11']
    },
    isFetching : false,
    error : false
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider =  ({children}) => {

    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    return (
        <AuthContext.Provider value ={{user : state.user, isFetching : state.isFetching, error: state.error, dispatch}}>
            {children}     
        </AuthContext.Provider>
    )
}