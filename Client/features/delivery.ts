import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface DelieveryOrders {
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
  products: [
    {
      idProduct: string;
      nameProduct: string;
      colorProduct: string;
      sizeProduct: string;
      priceProduct: number;
      gainMarkter: number;
      priceMarkter: number;
      priceCustomer: number;
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
  chat: [
    {
      message: string;
      nameSender: string;
      vaildity: string;
      date: string;
      time: string;
      showUser: boolean;
      showAdmin: boolean;
      showEmploy: boolean;
      showDelivery: boolean;
    }
  ];
  company: {
    name: string;
    image: string;
    phone: string;
    color: string;
  };
}

interface DelieveryWallet {
  money: number;
  status: string;
  date: string;
  time: string;
  orderId: string;
  numberOrder: number;
}

interface DeliveryProducts {
  idProduct: string;
  nameProduct: string;
  colorProduct: string;
  sizeProduct: string;
  priceProduct: number;
  gainMarkter: number;
  priceMarkter: number;
  priceCustomer: number;
  imageProduct: string;
  storeProduct: string;
  cityProduct: string;
  amountProduct: number;
  amountNewProduct: number;
  validity: string;
}

interface AllData {
  money: DelieveryWallet[];
  productsReturnedAndPartial: DeliveryProducts[];
  productsWithOrderWaiting: DeliveryProducts[];
}

interface DelieveryState {
  delieveryOrders: DelieveryOrders[];
  delieveryOrder: DelieveryOrders | null;
  delieveryWallet: DelieveryWallet[];
  delieveryProducts: DeliveryProducts[];
  allData: AllData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DelieveryState = {
  delieveryOrders: [],
  delieveryOrder: null,
  delieveryWallet: [],
  delieveryProducts: [],
  allData: null,
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH as string;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchOrdersDelivery = createAsyncThunk(
  "delivery/fetchOrdersDelivery",
  async ({
    dataReq,
    numberOrdersReq,
    delivery,
  }: {
    dataReq: string[];
    numberOrdersReq: number;
    delivery: string;
  }) => {
    try {
      const dataToEncrypt = {
        dataReq,
        numberOrdersReq,
        delivery,
      };

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        keyHash
      ).toString();

      const response = await axios.post(
        `${apiEndpoint}delivery/getOrdersToDelivery`,
        {
          data: encryptedData,
        }
      );

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

export const fetchOrderDelivery = createAsyncThunk(
  "delivery/fetchOrderDelivery",
  async ({ dataReq, slug }: { dataReq: string[]; slug: string }) => {
    try {
      const dataToEncrypt = {
        dataReq,
        slug,
      };

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        keyHash
      ).toString();

      const response = await axios.post(
        `${apiEndpoint}delivery/getOrderToDelivery`,
        {
          data: encryptedData,
        }
      );

      const encryptedDataRes = response.data.data;

      if (!keyHash) {
        throw new Error("Encryption key is missing");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedDataRes, keyHash);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData[0];
    } catch (error) {
      throw new Error(`Failed to fetch and decrypt category: ${error}`);
    }
  }
);

export const fetDeliveryWallet = createAsyncThunk(
  "delivery/fetDeliveryWallet",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}delivery/getWalletDelivery/${slug}`
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

export const fetDeliveryProducts = createAsyncThunk(
  "delivery/fetDeliveryProducts",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}delivery/getProductsDelivery/${slug}`
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

export const fetDeliveryAllData = createAsyncThunk(
  "delivery/fetDeliveryAllData",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}delivery/getAllDataDelivery/${slug}`
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

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchOrdersDelivery
      .addCase(fetchOrdersDelivery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersDelivery.fulfilled, (state, action) => {
        state.delieveryOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersDelivery.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
        state.loading = false;
      })

      // Handling fetchOrderDelivery
      .addCase(fetchOrderDelivery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDelivery.fulfilled, (state, action) => {
        state.delieveryOrder = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderDelivery.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category";
        state.loading = false;
      })

      // Handling fetDeliveryWallet
      .addCase(fetDeliveryWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetDeliveryWallet.fulfilled, (state, action) => {
        state.delieveryWallet = action.payload;
        state.loading = false;
      })
      .addCase(fetDeliveryWallet.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category";
        state.loading = false;
      })

      // Handling fetDeliveryProducts
      .addCase(fetDeliveryProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetDeliveryProducts.fulfilled, (state, action) => {
        state.delieveryProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetDeliveryProducts.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category";
        state.loading = false;
      })

      // Handling fetDeliveryAllData
      .addCase(fetDeliveryAllData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetDeliveryAllData.fulfilled, (state, action) => {
        state.allData = action.payload;
        state.loading = false;
      })
      .addCase(fetDeliveryAllData.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category";
        state.loading = false;
      });
  },
});

export default deliverySlice.reducer;
