import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface MoneyTreasury {
  _id: string;
  image: string;
  name: string;
  Active: boolean;
  dateAdded: string;
  timeAdded: string;
  money: [
    {
      valueMoney: number;
      date: string;
      time: string;
      person: string;
      note: string;
    }
  ];
}

interface MoneyTreasuryState {
  moneyTreasuries: MoneyTreasury[];
  moneyTreasury: MoneyTreasury | null;
  loading: boolean;
  error: string | null;
}

const initialState: MoneyTreasuryState = {
  moneyTreasuries: [],
  moneyTreasury: null,
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchMoneyTreasuries = createAsyncThunk(
  "moneyTreasuries/fetchMoneyTreasuries",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}moneyTreasury`);
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

export const fetchMoneyTreasuryById = createAsyncThunk(
  "moneyTreasury/fetchMoneyTreasuryById",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}moneyTreasury/${slug}`);
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

const moneyTreasurySlice = createSlice({
  name: "moneyTreasury",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchMoneyTreasuries
      .addCase(fetchMoneyTreasuries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoneyTreasuries.fulfilled, (state, action) => {
        state.moneyTreasuries = action.payload;
        state.loading = false;
      })

      .addCase(fetchMoneyTreasuries.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch moneyTreasuries";
        state.loading = false;
      })

      // Handling fetchMoneyTreasuryById
      .addCase(fetchMoneyTreasuryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoneyTreasuryById.fulfilled, (state, action) => {
        state.moneyTreasury = action.payload;
        state.loading = false;
      })
      .addCase(fetchMoneyTreasuryById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch moneyTreasury";
        state.loading = false;
      });
  },
});

export default moneyTreasurySlice.reducer;
