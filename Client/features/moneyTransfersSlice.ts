import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Key } from "readline";

interface MoneyTransfers {
  _id: string
  namerSender: string;
  validitySender: string;
  date: string;
  time: string;
  money: [{
    money: number;
    date: string;
    time: string;
    orderId: string;
    numberOrder: number;
    codeOrder: string;
  }]
}

interface MoneyTransfersState {
  moneyTransfers: MoneyTransfers[];
  loading: boolean;
  error: string | null;
}

const initialState: MoneyTransfersState = {
  moneyTransfers: [],
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchMoneyTransfers = createAsyncThunk(
  "moneyTransfers/fetchMoneyTransfers",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}moneyTransfers`);
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

const moneyTransfersSlice = createSlice({
  name: "moneyTransfers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchMoneyTransfers
      .addCase(fetchMoneyTransfers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoneyTransfers.fulfilled, (state, action) => {
        state.moneyTransfers = action.payload;
        state.loading = false;
      })
      .addCase(fetchMoneyTransfers.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
        state.loading = false;
      });
  },
});

export default moneyTransfersSlice.reducer;
