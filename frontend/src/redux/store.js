import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userRedux"

  const rootReducer = combineReducers({ 
        user: userReducer, 
        //product: productReducer, 
  })
  
export const store = configureStore({
    reducer: rootReducer,//persistedReducer,
})