"use client";

import { Provider } from "react-redux";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store/store";

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
