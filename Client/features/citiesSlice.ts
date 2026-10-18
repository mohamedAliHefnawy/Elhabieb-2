import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";
import { ProductStateType } from "./productSlice";

interface City {
  _id: string;
  name: string;
  character: string;
  prices: [{ name: string; price: number }];
  stores: [{ _id: string; nameStore: string; codeStore: string; products: [] }];
  products: ProductStateType["products"];
}

interface CityState {
  Cities: City[];
  products: ProductStateType["products"];
  decryptedData: ProductStateType["products"];
  city: City | null;
  store: string;
  loading: boolean;
  error: string | null;
}

const initialState: CityState = {
  Cities: [],
  city: null,
  loading: false,
  error: null,
  products: [],
  decryptedData: [],
  store: "",
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchCities = createAsyncThunk("cities/fetchCities", async () => {
  try {
    const response = await axios.get(`${apiEndpoint}cities`);
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
});

export const fetchProductsWithStore = createAsyncThunk(
  "cities/fetchProductsWithStore",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}cities/getProductsWithStore/${slug}`
      );

      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return {
        decryptedData: decryptedData.data,
        city: decryptedData.city,
        store: decryptedData.store,
      };
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt products: ${error}`);
    }
  }
);

export const fetchCityById = createAsyncThunk(
  "city/fetchCityById",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}cities/${slug}`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt category: ${error}`);
    }
  }
);

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchCity
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.Cities = action.payload;
        state.loading = false;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch Cities";
        state.loading = false;
      })

      // Handling fetchCityById
      .addCase(fetchCityById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCityById.fulfilled, (state, action) => {
        state.city = action.payload;
        state.loading = false;
      })
      .addCase(fetchCityById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch city";
        state.loading = false;
      })

      // Handling fetchProductsWithStore

      .addCase(fetchProductsWithStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsWithStore.fulfilled, (state, action) => {
        state.decryptedData = action.payload.decryptedData;
        state.city = action.payload.city;
        state.store = action.payload.store;
        state.error = null; // أعد تعيين الخطأ
      })
      .addCase(fetchProductsWithStore.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch city";
        state.loading = false;
      });
  },
});

export default citySlice.reducer;
