import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

export const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

const useAxiosSecure=()=>{
    const {logOut} = useAuth()
    const naviget = useNavigate()
    useEffect(()=>{
        axiosSecure.interceptors.response.use(res =>{
            return res
        }, async error=>{
            console.log('error from server', error.response)
            if(error.response.status === 401 || error.response.status===403){
                // log out and naviget to login route
                logOut()
                // naviget to login page
                naviget('/login')
            }
        })
    },[logOut, naviget])
    return axiosSecure;

}

export default useAxiosSecure;