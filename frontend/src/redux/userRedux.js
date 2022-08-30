import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
       currentUser :  null, 
       isFetching : false, 
       error : false
    },
    reducers: {
        //login start,success,failure
        loginStart: (state) => {
            state.isFetching = true
        },
        loginSuccess: (state, action) => {
            state.isFetching = false
            state.currentUser = action.payload
        },
        loginFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        //serte
        updateSuccess: (state, action) => {
            state.isFetching = false
            state.currentUser.accessToken = action.payload
        },

        //logout start,success,failure
        logoutStart: (state) => {
            state.isFetching = true
        },
        logoutSuccess: (state) => {
            state.isFetching = false
            state.currentUser = null
        },
        logoutFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        //register start,success,failure
        registerStart: (state) => {
            state.isFetching = true
        },
        registerSuccess: (state, action) => {
            state.isFetching = false
            state.currentUser = action.payload
        },
        registerFailure: (state) => {
            state.isFetching = false
            state.error = true
        }
    }
})

export const { 
    loginStart, loginSuccess, loginFailure, 
    logoutStart, logoutSuccess, logoutFailure,
    registerStart, registerSuccess, registerFailure,
    updateSuccess
} = userSlice.actions

export default userSlice.reducer