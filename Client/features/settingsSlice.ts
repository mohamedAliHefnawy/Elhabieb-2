import { RootState } from "@/src/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface SettingsItem {
  colors: {
    navBarColor: string
    sideBarColor: string
    bodyColor: string
  },

  mat3ger: {
    images: string[]
  }
}

interface SettingsState {
  settings: SettingsItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    try {
      const response = await axios.get(
        `${apiEndpoint}settings`
      );
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt: ${error}`);
    }
  }
);

const settingsSlice = createSlice({
  name: "settinga",
  initialState,
  reducers: {
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      });
  },
});

export const selectTotalProductsInCart = (state: RootState) =>
  state.cart.totalProducts;


export default settingsSlice.reducer;
export type ItemsStateType = typeof initialState;
