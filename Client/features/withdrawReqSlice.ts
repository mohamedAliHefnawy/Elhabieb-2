import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

export interface WithdrawReq {
  _id: string;
  user: string;
  moneyTreasury: string;
  money: [
    {
      money: number;
      orderId: string;
      status: string;
    }
  ];
  phone: string;
  state: string;
  date: string;
  time: string;
}

interface WithdrawReqState {
  withdrawReqs: WithdrawReq[];
  loading: boolean;
  error: string | null;
}

const initialState: WithdrawReqState = {
  withdrawReqs: [],
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchWithdrawReqs = createAsyncThunk(
  "withdrawReq/fetchWithdrawReqs",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}withdrawReq`);
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

export const fetchWithdrawReqsToUser = createAsyncThunk(
  "withdrawReqs/fetchWithdrawReqsToUser",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}withdrawReq/getWithdrawReqsToUser/${slug}`
      );
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

const withdrawReqsSlice = createSlice({
  name: "withdrawReqs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchWithdrawReqs
      .addCase(fetchWithdrawReqs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWithdrawReqs.fulfilled, (state, action) => {
        state.withdrawReqs = action.payload;
        state.loading = false;
      })
      .addCase(fetchWithdrawReqs.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch withdrawReqs";
        state.loading = false;
      })

      // Handling fetchWithdrawReqsToUser
      .addCase(fetchWithdrawReqsToUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWithdrawReqsToUser.fulfilled, (state, action) => {
        state.withdrawReqs = action.payload;
        state.loading = false;
      })
      .addCase(fetchWithdrawReqsToUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch withdrawReqs";
        state.loading = false;
      });
  },
});

export default withdrawReqsSlice.reducer;
