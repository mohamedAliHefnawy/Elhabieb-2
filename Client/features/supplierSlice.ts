import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface Supplier {
  _id: string;
  image: string;
  name: string;
  phone: number;
  dateAdded: string;
  timeAdded: string;
}

export interface InvoicesSupplier {
  _id: string;
  supplier: string;
  moneyTreasury: string;
  city: string;
  store: string;
  totalValuePurchase: number;
  paymentMoneyDetails: {
    valueMoney: number,
    employ: string,
    date: string,
    time: string,
  }[];
  date: string;
  time: string;
  productData: [{
    id: string,
    color: string,
    size: string,
    amount: string,
    price: string,
  }]
}



interface SupplierState {
  suppliers: Supplier[];
  supplier: Supplier | null;
  invoicesSupplier: InvoicesSupplier[];
  loading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  supplier: null,
  invoicesSupplier: [],
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchSuppliers",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}supplier`);
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

export const fetchSupplierById = createAsyncThunk(
  "supplier/fetchSupplierById",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}supplier/${slug}`);
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

export const fetchInvoicesSupplier = createAsyncThunk(
  "supplier/fetchInvoicesSupplier",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}supplier/invoices/${slug}`);
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



const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchSuppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers = action.payload;
        state.loading = false;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
        state.loading = false;
      })

      // Handling fetchSupplierById
      .addCase(fetchSupplierById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.supplier = action.payload;
        state.loading = false;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category";
        state.loading = false;
      })

      // Handling fetchSupplierById
      .addCase(fetchInvoicesSupplier.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoicesSupplier.fulfilled, (state, action) => {
        state.invoicesSupplier = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoicesSupplier.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category";
        state.loading = false;
      });
  },
});

export default supplierSlice.reducer;
