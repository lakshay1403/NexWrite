import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../apis/Users/UsersApi";
import {useQuery} from '@tanstack/react-query'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {isError, isLoading, data, isSuccess} = useQuery({queryFn: checkUserAuthStatusAPI, queryKey:['checkAuth']});
    //update the authenticated user
    useEffect(()=>{
        setIsAuthenticated(true);
    },[data]);


    //updating the user auth after login
    const login = () => {
        setIsAuthenticated(true)
    };
    //updating the userAuth after logout
    const logout = () => {
        setIsAuthenticated(false);
    };

    return(
        <AuthContext.Provider value={{isAuthenticated, isError, isLoading, isSuccess, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};


//Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
}