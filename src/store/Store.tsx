
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import projectReducer from "./ProjectSlice";
import authReducer from "./AuthSlice";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage"; // needed for vite /lib/storage is wrong shape

const authPersistConfig = {
    key: "auth",
    storage,
};

const rootReducer = combineReducers({

    auth: persistReducer(authPersistConfig, authReducer),
    project: projectReducer,

});

export const store = configureStore({

    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// import { compose, legacy_createStore, applyMiddleware, createStore } from 'redux'
// import { logger } from 'redux-logger'

// import RootReducer from './RootReducer'

// const middleWares = [logger];

// const composedEnhancers = compose(applyMiddleware(...middleWares));

// export const store = legacy_createStore(RootReducer, undefined, composedEnhancers);
