import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {LoaderReducer}  from "./LoaderSlice";
import { UserReducer } from "./UserSlice"; 
import { TokenReducer } from "./TokenSlice";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
};


const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    loader: LoaderReducer,
    user: UserReducer, 
    token : TokenReducer
  }),
);


export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

