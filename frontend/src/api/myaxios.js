import axios from  "axios"

const BASE_URL = "http://localhost:5000"

export default axios.create({
    baseURL: BASE_URL,
   /*withCredentials: true,
    headers: { 'Content-Type': 'aplication/json' },
    credentials: "include",*/   //! neden ne için kullanılır/kullanılmaz
})
