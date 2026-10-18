import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface Pos {
  _id: string;
  email: string;
  image: string;
  phone: string;
  validity: string;
  phoneCompany: string;
  colorCompany: string;
  password: string;
  city: string;
  store: string;
  moneysafe: string;
  orders: [
    {
      products: [
        {
          Idproduct: string;
          nameProduct: string;
          sizeProduct: string;
          amountProduct: number;
          priceProduct: number;
          returned: boolean;
        }
      ];
      totalPrice: number;
      deduct: number;
      dateInvoice: string;
      timeInvoice: string;
      NumberInvoice: number;
      CodeInvoice: string;
    }
  ];
  money: [
    {
      idInvoice: string;
      deduct: number;
      money: number;
      notes: string;
      date: string;
      time: string;
      acceptMoney: boolean;
      NumberInvoice: number;
      CodeInvoice: string;
    }
  ];

  convertedMoney: [
    {
      products: [
        {
          nameProduct: string;
          sizeProduct: string;
          amountProduct: number;
          priceProduct: number;
          returned: boolean;
        }
      ];
      totalPrice: number;
      deduct: number;
      dateInvoice: string;
      timeInvoice: string;
      NumberInvoice: number;
      CodeInvoice: string;
      money: number;
      notes: string;
      dateConverted: string;
      timeConverted: string;
    }
  ];
}

interface PosState {
  pos: Pos[];
  filteredPos: Pos[];
  onePos: Pos | null;
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  currentPage: "orders" | "money" | "convertedMoney" | null;
}

const initialState: PosState = {
  pos: [],
  filteredPos: [],
  onePos: null,
  loading: false,
  error: null,
  searchKeyword: "",
  currentPage: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH as string;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchPos = createAsyncThunk("pos/fetchPos", async () => {
  try {
    const response = await axios.get(`${apiEndpoint}pos`);
    const encryptedDataRes = response.data.data;
    if (!keyHash) {
      throw new Error("Encryption key is missing");
    }
    const bytes = CryptoJS.AES.decrypt(encryptedDataRes, keyHash);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
  } catch (error) {
    throw new Error(`Failed to fetch and decrypt categories: ${error}`);
  }
});

export const fetchPosById = createAsyncThunk(
  "pos/fetchPosById",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}pos/getPosById/${slug}`);
      const encryptedDataRes = response.data.data;
      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }
      const bytes = CryptoJS.AES.decrypt(encryptedDataRes, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt categories: ${error}`);
    }
  }
);

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setSearchKeyword(state, action) {
      state.searchKeyword = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // Handling fetchPos
      .addCase(fetchPos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPos.fulfilled, (state, action) => {
        state.pos = action.payload;
        state.loading = false;
      })
      .addCase(fetchPos.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
        state.loading = false;
      })

      // Handling fetchPosById
      .addCase(fetchPosById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosById.fulfilled, (state, action) => {
        state.onePos = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
        state.loading = false;
      });
  },
});
export const { setSearchKeyword } = posSlice.actions;
export default posSlice.reducer;
