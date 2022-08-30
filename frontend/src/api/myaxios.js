import axios from  "axios"

const BASE_URL = "http://localhost:5000"

export const axios1 = axios.create({
    baseURL: BASE_URL,
   /*withCredentials: true,
    headers: { 'Content-Type': 'aplication/json' },
    credentials: "include",*/   //! neden ne için kullanılır/kullanılmaz
})

export const axiosPrvt = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'aplication/json' },
    withCredentials: true, //cookie işlemi için gerekir
    /*credentials: "include",*/   //! neden ne için kullanılır/kullanılmaz
})
