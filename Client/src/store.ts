// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "@/features/categorySlice";
import productReducer from "@/features/productSlice";
import supplierReducer from "@/features/supplierSlice";
import cityReducer from "@/features/citiesSlice";
import storeReducer from "@/features/storesSlice";
import moneyTreasuryReducer from "@/features/moneyTreasurySlice";
import cartReducer from "@/features/cartSlice";
import favReducer from "@/features/favSlice";
import orderReducer from "@/features/ordersSlice";
import userReducer from "@/features/userSlice";
import withdrawReqReducer from "@/features/withdrawReqSlice";
import SettingsReducer from "@/features/settingsSlice";
import deliveryReducer from "@/features/delivery";
import moneyTransfersReducer from "@/features/moneyTransfersSlice";
import posReducer from "@/features/pos";
import posReducer2 from "@/features/posSlice";
import reportesReducer from "@/features/reportesSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    supplier: supplierReducer,
    city: cityReducer,
    store: storeReducer,
    moneyTreasury: moneyTreasuryReducer,
    cart: cartReducer,
    fav: favReducer,
    order: orderReducer,
    user: userReducer,
    withdrawReq: withdrawReqReducer,
    settings: SettingsReducer,
    delivery: deliveryReducer,
    moneyTransfers: moneyTransfersReducer,
    pos: posReducer,
    pos2: posReducer2,
    reportes: reportesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
