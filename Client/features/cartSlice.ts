import { RootState } from "@/src/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface CartItem {
  id: string;
  user: string;
  products: {
    productId: string;
    color: string;
    size: string;
  }[];
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
}

const initialState: CartState = {
  items: [],
  totalProducts: 0,
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchProductsInCartUser = createAsyncThunk(
  "cart/fetchProductsInCartUser",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}cart/getProductsInCartUser/${slug}`
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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    incrementTotalProducts: (state, action) => {
      state.totalProducts += action.payload;
    },
    decrementTotalProducts: (state, action) => {
      state.totalProducts -= action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsInCartUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsInCartUser.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalProducts = action.payload.length;
        state.loading = false;
      })
      .addCase(fetchProductsInCartUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      });
  },
});

export const selectTotalProductsInCart = (state: RootState) =>
  state.cart.totalProducts;

export const { incrementTotalProducts, decrementTotalProducts } =
  cartSlice.actions;
export default cartSlice.reducer;
export type ItemsStateType = typeof initialState;
