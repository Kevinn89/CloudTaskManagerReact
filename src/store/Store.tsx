
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./ProjectSlice";

export const store = configureStore({
    reducer: {
        project: projectReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// import { compose, legacy_createStore, applyMiddleware, createStore } from 'redux'
// import { logger } from 'redux-logger'

// import RootReducer from './RootReducer'

// const middleWares = [logger];

// const composedEnhancers = compose(applyMiddleware(...middleWares));

// export const store = legacy_createStore(RootReducer, undefined, composedEnhancers);