import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

import userReducer from "./slices/userSlice";
import formReducer from "./slices/formSlice";
import cartReducer from "./slices/cartSlice";

// Combine all reducers
const rootReducer = combineReducers({
    form: formReducer,
    cart: cartReducer,
    user: userReducer,
});

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["cart", "user"],
    blacklist: ["form"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Here first we create a store using configureStore() funx.
const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // redux-persist needs these ignored
                ignoredActions: ['form/updateImageFile', FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['form.imgFile'],
            },
        }),
})

const persistor = persistStore(store);

export { store, persistor };
