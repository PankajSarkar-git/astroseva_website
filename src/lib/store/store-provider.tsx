"use client";

import { Provider } from "react-redux";
import React, { useRef } from "react";
import { type Persistor, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

interface StoreProviderProps {
  children: React.ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
