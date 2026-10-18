import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Key } from "readline";

interface Category {
  id: Key | null | undefined;
  _id: string;
  image: string;
  name: string;
  productCount: number;
  Active: boolean;
  products: [];
}

interface CategoryState {
  categories: Category[];
  category: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}category`);
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

export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}category/${slug}`);
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
        state.loading = false;
      })

      // Handling fetchCategoryById
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category";
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
