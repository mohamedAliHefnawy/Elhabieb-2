import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Key } from "readline";

interface Order {
  _id: string;
  date: string;
  totalPrice: number;
}

interface User {
  _id: string;
  date: string;
  totalPrice: number;
}

interface Delivery {
  name: string;
  ordersPerMonth: [{
    year: number;
    month: string;
    count: number;
  }]
}

interface Product {
  productId: string;
  numberSells: number;
  name: string;
  image: string;
  salesDetails: {
    string: [number]
  }
}


interface ReportesState {
  orders: Order[]
  clients: User[]
  markters: User[]
  deliveries: Delivery[]
  products: Product[]
  stores: []
  loading: boolean;
  error: string | null;
}

const initialState: ReportesState = {
  orders: [],
  clients: [],
  markters: [],
  deliveries: [],
  products: [],
  stores: [],
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchReportesOrders = createAsyncThunk(
  "orders/fetchReportesOrders",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}reportes/orders`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt categories: ${error}`);
    }
  }
);


export const fetchReportesClients = createAsyncThunk(
  "clients/fetchReportesClients",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}reportes/clients`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt categories: ${error}`);
    }
  }
);

export const fetchReportesMarkter = createAsyncThunk(
  "markter/fetchReportesMarkter",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}reportes/markter`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt categories: ${error}`);
    }
  }
);

export const fetchReportesDelivery = createAsyncThunk(
  "delivery/fetchReportesDelivery",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}reportes/delivery`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt categories: ${error}`);
    }
  }
);

export const fetchReportesProducts = createAsyncThunk(
  "products/fetchReportesProducts",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}reportes/products`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt categories: ${error}`);
    }
  }
);

export const fetchReportesStores = createAsyncThunk(
  "stores/fetchReportesStores",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}reportes/stores`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt categories: ${error}`);
    }
  }
);

const reportesSlice = createSlice({
  name: "reportes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Handling fetchReportesOrders
      .addCase(fetchReportesOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportesOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportesOrders.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch ReportesOrders";
        state.loading = false;
      })

      // Handling fetchReportesClients
      .addCase(fetchReportesClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportesClients.fulfilled, (state, action) => {
        state.clients = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportesClients.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch ReportesClients";
        state.loading = false;
      })

      // Handling fetchReportesMarkter
      .addCase(fetchReportesMarkter.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportesMarkter.fulfilled, (state, action) => {
        state.markters = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportesMarkter.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch ReportesMarkter";
        state.loading = false;
      })

      // Handling fetchReportesDelivery
      .addCase(fetchReportesDelivery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportesDelivery.fulfilled, (state, action) => {
        state.deliveries = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportesDelivery.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch ReportesDelivery";
        state.loading = false;
      })

      // Handling fetchReportesProducts
      .addCase(fetchReportesProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportesProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportesProducts.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch ReportesProducts";
        state.loading = false;
      })

      // Handling fetchReportesStores
      .addCase(fetchReportesStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportesStores.fulfilled, (state, action) => {
        state.stores = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportesStores.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch ReportesStores";
        state.loading = false;
      })

  },
});

export default reportesSlice.reducer;
