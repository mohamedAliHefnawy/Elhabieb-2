import { RootState } from "@/src/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

export interface Product {
  _id: string;
  name: string;
  price: number;
  priceMarkter: number;
  gainMarkter: number;
  priceCustomer: number;
  colors: string[];
  images: string[];
  discrubtion: string;
  active: boolean;
  catogry: string;
  dateAdded: string;
  timeAdded: string;
  numberSelles: number;
  details: [
    {
      color: string;
      sizes: [
        {
          size: string;
          city: string;
          store: string;
          amount: number;
        }
      ];
    }
  ];
  products: {
    _id: string;
    properties: string[];
    name: string;
    price: number;
    priceMarkter: number;
    gainMarkter: number;
    priceCustomer: number;
    colors: string[];
    images: string[];
    discrubtion: string;
    active: boolean;
    catogry: string;
    dateAdded: string;
    timeAdded: string;
    numberSelles: number;
    details: [
      {
        color: string;
        sizes: [
          {
            size: string;
            city: string;
            store: string;
            amount: number;
          }
        ];
      }
    ];
  }[];
}

interface ProductState {
  Products: Product[];
  totalProducts: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  Products: [],
  totalProducts: 0,
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchProductsInFavUser = createAsyncThunk(
  "fav/fetchProductsInFavUser",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}fav/getProductsInFavUser/${slug}`
      );
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      console.log(decryptedData);
      if (decryptedData) {
        return decryptedData;
      }

    } catch (error) {
      throw new Error(`Failed to fetch and decrypt: ${error}`);
    }
  }
);

const favSlice = createSlice({
  name: "fav",
  initialState,
  reducers: {
    incrementTotalProductsFav: (state, action) => {
      state.totalProducts += action.payload;
    },
    decrementTotalProductsFav: (state, action) => {
      state.totalProducts -= action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsInFavUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsInFavUser.fulfilled, (state, action) => {
        state.Products = action.payload;
        state.totalProducts = action.payload.length;
        state.loading = false;
      })
      .addCase(fetchProductsInFavUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      });
  },
});

export const selectTotalProductsInFav = (state: RootState) =>
  state.fav.totalProducts;

export const { incrementTotalProductsFav, decrementTotalProductsFav } =
  favSlice.actions;
export default favSlice.reducer;
export type ItemsStateType = typeof initialState;
