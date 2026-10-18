import { RootState } from "@/src/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface Product {
  _id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  amount: number;
  amountAvalible: number;
  price: number;
  describtion: string
}

interface Order {
  _id: string;
  products: [{
    idproduct: string,
    nameProduct: string,
    imageProduct: string,
    colorProduct: string,
    sizeProduct: string,
    describtionProduct: string,
    priceProduct: number,
    amountProduct: number,
    amountNewProduct: number,
  }],
  NumberInvoice: number,
  CodeInvoice: string,
  namePos: string,
  imagePos: string,
  phonePos: string,
  phoneCompany: string,
  colorCompany: string,
  moneyTreasury: string,
  city: string,
  store: string,
  totalPrice: number,
  totalPriceAfterDisount: number,
  discount: number,
  dateInvoice: string,
  timeInvoice: string,
  status : string ;
}

interface Money {
  NumberInvoice: number,
  CodeInvoice: string,
  discount: number,
  totalPrice: number,
  totalPriceAfterDisount: number,
  date: string,
  time: string,
  status: string,
}

interface CartPosState {
  Products: Product[];
  Orders: Order[];
  Order: Order | null;
  Money: Money[];
  totalProducts: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartPosState = {
  Products: [],
  Orders: [],
  Order: null,
  Money: [],
  totalProducts: 0,
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH as string;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;


export const fetchOrdersPos = createAsyncThunk(
  "pos/fetchPosById",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}pos/getOrdersPos/${slug}`);
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

export const fetchOrdersPosById = createAsyncThunk(
  "pos/fetchOrdersPosById",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}pos/getOrderPos/${slug}`);
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

export const fetchMoneyPos = createAsyncThunk(
  "pos/fetchMoneyPos",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}pos/getMoneyPos/${slug}`);
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



const cartPosSlice = createSlice({
  name: "cartPos",
  initialState,
  extraReducers: (builder) => {
    builder

      // Handling fetchOrdersPos
      .addCase(fetchOrdersPos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersPos.fulfilled, (state, action) => {
        state.Orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersPos.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch Orders";
        state.loading = false;
      })

      // Handling fetchOrdersPosById
      .addCase(fetchOrdersPosById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersPosById.fulfilled, (state, action) => {
        state.Order = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersPosById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch Orders";
        state.loading = false;
      })

      // Handling fetchMoneyPos
      .addCase(fetchMoneyPos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoneyPos.fulfilled, (state, action) => {
        state.Money = action.payload;
        state.loading = false;
      })
      .addCase(fetchMoneyPos.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch Money";
        state.loading = false;
      })
  },
  reducers: {

    incrementTotalProductsPos: (state, action) => {
      state.totalProducts += action.payload;
    },
    decrementTotalProductsPos: (state, action) => {
      state.totalProducts -= action.payload;
    },

    incrementProductAmount: (state, action) => {
      const existingProduct = state.Products.find(
        (product) => product._id === action.payload._id &&
          product.size === action.payload.size &&
          product.color === action.payload.color
      );
      if (existingProduct) {
        if (existingProduct.amount < existingProduct.amountAvalible) {
          existingProduct.amount += 1;
        }
      }
    },
    decrementProductAmount: (state, action) => {
      const existingProduct = state.Products.find(
        (product) => product._id === action.payload._id &&
          product.size === action.payload.size &&
          product.color === action.payload.color
      );
      if (existingProduct && existingProduct.amount > 1) {
        existingProduct.amount -= 1;
      }
    },
    addProduct: (state, action) => {
      const existingProduct = state.Products.find(
        (product) => product._id === action.payload._id &&
          product.size === action.payload.size &&
          product.color === action.payload.color
      );
      if (!existingProduct) {
        state.Products.push(action.payload);
        state.totalProducts += 1;
      } else {
        if (existingProduct.amount < existingProduct.amountAvalible) {

          existingProduct.amount += 1;
        }
      }
    },
    removeProduct: (state, action) => {
      state.Products = state.Products.filter(
        (product) =>
          !(
            product._id === action.payload._id &&
            product.size === action.payload.size &&
            product.color === action.payload.color
          )
      );
      state.totalProducts = state.Products.reduce(
        (total, product) => total + product.amount,
        0
      );
    },
    removeAllProducts: (state) => {
      state.Products = []
      state.totalProducts = 0
    },
  },
});

export const {
  incrementTotalProductsPos,
  decrementTotalProductsPos,
  incrementProductAmount,
  decrementProductAmount,
  addProduct,
  removeProduct,
  removeAllProducts
} = cartPosSlice.actions;

export default cartPosSlice.reducer;
export const selectProductsInCart = (state: RootState) => state.pos2.Products;
