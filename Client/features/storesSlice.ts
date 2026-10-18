import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

// Define the interfaces for Store and StoreState
interface Store {
  _id: string;
  nameStore: string;
  codeStore: string;
  products: [];
}

interface StoreState {
  Stores: Store[];
  Store: Store | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: StoreState = {
  Stores: [],
  Store: null,
  loading: false,
  error: null,
};

// Encryption key and API endpoint
const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

// Thunk to fetch stores
export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}stores/${slug}`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt store: ${error}`);
    }
  }
);

export const fetchProductsInStore = createAsyncThunk(
  "stores/fetchProductsInStore",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}stores/${slug}`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt store: ${error}`);
    }
  }
);

// Slice to manage store state
const StoreSlice = createSlice({
  name: "Store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchStores
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.Stores = action.payload;
        state.loading = false;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores";
        state.loading = false;
      });
  },
});

export default StoreSlice.reducer;
