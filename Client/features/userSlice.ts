import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

interface UserItem {
  _id: string;
  email: string;
  phone: string;
  firstName: string;
  secondName: string;
  password: string;
  passwordWallet: string;
  validity: string;
  image: string;
  securityDelivery: {
    idsIOrders: [string],
    money: [{
      money: number;
      status: string;
      date: string;
      time: string;
      orderId: string;
    }],
    products: [{

      idProduct: string,
      nameProduct: string,
      colorProduct: string,
      sizeProduct: string,
      priceProduct: number,
      gainMarkter: number,
      priceMarkter: number,
      priceCustomer: number,
      imageProduct: string,
      storeProduct: string,
      cityProduct: string,
      amountProduct: number,
      orderId: string,
      amountNewProduct: number,

    }]
  }
}

interface UserWalletItem {
  money: number;
  status: string;
  date: string;
  time: string;
  orderId: string;
}

interface UserState {
  users: UserItem[];
  user: UserItem | null;
  userWallet: UserWalletItem[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: null,
  userWallet: [],
  loading: false,
  error: null,
};

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (slug: string) => {
    try {
      const response = await axios.get(`${apiEndpoint}user/getUser/${slug}`);
      const encryptedData = response.data.data;
      fetchUsers;
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

export const fetchUserWallet = createAsyncThunk(
  "user/fetchUserWallet",
  async (slug: string) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}user/getWalletUser/${slug}`
      );
      const encryptedData = response.data.data;
      fetchUsers;
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

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  try {
    const response = await axios.get(`${apiEndpoint}user/`);
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
});

export const fetchClients = createAsyncThunk("user/fetchClients", async () => {
  try {
    const response = await axios.get(`${apiEndpoint}user/getClients`);
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
});

export const fetchMarkters = createAsyncThunk(
  "user/fetchMarkters",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}user/getMarkters`);
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

export const fetchAdmins = createAsyncThunk(
  "user/fetchAdmins",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}user/getAdmins`);
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

export const fetchEmployes = createAsyncThunk(
  "user/fetchEmployes",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}user/getEmployes`);
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

export const fetchDeliveries = createAsyncThunk(
  "user/fetchDeliveries",
  async () => {
    try {
      const response = await axios.get(`${apiEndpoint}user/geDeliveries`);
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Handling fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      })

      // Handling fetchUserWallet
      .addCase(fetchUserWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserWallet.fulfilled, (state, action) => {
        state.userWallet = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserWallet.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      })

      // Handling fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      })

      // Handling fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      })

      // Handling fetchAdmins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      })

      // Handling fetchEmployes
      .addCase(fetchEmployes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployes.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployes.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      })

      // Handling fetchMarkter
      .addCase(fetchMarkters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarkters.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchMarkters.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      })

      // Handling fetchDeliveries
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch";
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
