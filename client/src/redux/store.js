import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  useReducer  from './user/userSlice';
import themeReducer from './theme/themeSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore';


const rootReducer =combineReducers({
    user:useReducer,
    theme:themeReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({serializableCheck: false}),
});

export const persistor =persistStore(store);