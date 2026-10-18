import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface Order {
  _id: string;
  numberOrder: number;
  markter: string;
  vaildity: string;
  client: string;
  phoneMain: string;
  phoneAlternative: string;
  city: string;
  placeDetails: string;
  date: string;
  time: string;
  priceProducts: number;
  priceDelivery: number;
  gainAdmin: number;
  gainMarkter: number;
  totalPrice: number;
  delivery: string;
  company: {
    name: string,
    image: string,
    phone: string,
    color: string,
  }
  products: [
    {
      idProduct: string;
      nameProduct: string;
      colorProduct: string;
      sizeProduct: string;
      priceProduct: number,
      gainMarkter: number,
      priceMarkter: number,
      priceCustomer: number,
      imageProduct: string;
      storeProduct: string;
      cityProduct: string;
      amountProduct: number;
      amountNewProduct: number;

    }
  ];
  casesOrder: [
    {
      case: string;
      date: string;
      time: string;
    }
  ];
  chat: [{
    message: string,
    nameSender: string,
    vaildity: string,
    date: string,
    time: string,
    showUser: boolean,
    showAdmin: boolean,
    showEmploy: boolean,
    showDelivery: boolean,
  }];
}

interface ChatOrder {
  _id: string
  message: string,
  nameSender: string,
  vaildity: string,
  date: string,
  time: string,
}

interface StoreState {
  Orders: Order[];
  Order: Order | null;
  Chat: ChatOrder[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: StoreState = {
  Orders: [],
  Order: null,
  Chat: [],
  loading: false,
  error: null,
};

// Encryption key and API endpoint
const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  try {
    const response = await axios.get(`${apiEndpoint}order`);
    const encryptedData = response.data.data;

    if (!keyHash) {
      throw new Error("Encryption key is missing");
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
  } catch (error) {
    throw new Error(`Failed to fetch and decrypt store: ${error}`);
  }
});

export const fetchOrderByID = createAsyncThunk(
  "orders/fetchOrderByID",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}order/getOrder/${slug}`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt store: ${error}`);
    }
  }
);

export const fetchChatOrder = createAsyncThunk(
  "orders/fetchChatOrder",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}order/getChatOrder/${slug}`);
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt store: ${error}`);
    }
  }
);

export const fetchOrdersForUser = createAsyncThunk(
  "orders/fetchOrdersForUser",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}order/getOrderUser/${slug}`
      );
      const encryptedData = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


      return decryptedData;
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt store: ${error}`);
    }
  }
);

// Slice to manage store state
const OrderSlice = createSlice({
  name: "Order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.Orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores";
        state.loading = false;
      })

      // Handling fetchOrderByID
      .addCase(fetchOrderByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderByID.fulfilled, (state, action) => {
        state.Order = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderByID.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores";
        state.loading = false;
      })

      // Handling fetchChatOrder
      .addCase(fetchChatOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatOrder.fulfilled, (state, action) => {
        state.Chat = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatOrder.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores";
        state.loading = false;
      })

      // Handling fetchOrdersForUser
      .addCase(fetchOrdersForUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersForUser.fulfilled, (state, action) => {
        state.Orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersForUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores";
        state.loading = false;
      });
  },
});

export default OrderSlice.reducer;
