require("dotenv").config();
const CryptoJS = require("crypto-js");
const Orders = require("../models/order");
const Users = require("../models/user");
const Products = require("../models/products");
const Cities = require("../models/cities");
const MoneyTreasury = require("../models/moneyTreasury");

const keyHash = process.env.KEY_HASH;

const months = [
  "يناير",
  "فبراير",
  "مارس",
  "إبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

exports.FetchOrders = async (req, res) => {
  try {
    const orders = await Orders.find();

    const currentYear = new Date().getFullYear();

    const ordersByMonth = months.map((month, index) => ({
      month,
      count: orders.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getMonth() === index &&
          orderDate.getFullYear() === currentYear
        );
      }).length,
    }));

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(ordersByMonth),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.FetchTopClients = async (req, res) => {
  try {
    const topClients = await Orders.aggregate([
      { $match: { vaildity: "Client" } },
      { $group: { _id: "$markter", orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } },
      { $limit: 4 },
    ]);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(topClients),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.FetchTopMarkters = async (req, res) => {
  try {
    const topMarkters = await Orders.aggregate([
      { $match: { vaildity: "Markter" } },
      { $group: { _id: "$markter", orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } },
      { $limit: 4 },
    ]);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(topMarkters),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.Fetch2DataDelivery = async (req, res) => {
  try {
    const topDeliveries = await Users.aggregate([
      { $match: { "securityDelivery.idsIOrders": { $exists: true, $ne: [] } } },
      {
        $project: {
          _id: 1,
          email: 1,
          orderCount: { $size: "$securityDelivery.idsIOrders" },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 2 },
    ]);

    const deliveriesWithMonthlyOrders = await Promise.all(
      topDeliveries.map(async (delivery) => {
        try {
          const ordersDetails = await Orders.aggregate([
            { $match: { delivery: delivery.email } },
            {
              $addFields: {
                date: {
                  $dateFromString: {
                    dateString: "$date",
                    format: "%m/%d/%Y",
                  },
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                },
                orderCount: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ]);

          return {
            name: delivery.email,
            ordersPerMonth: ordersDetails.map((order) => ({
              year: order._id.year,
              month: months[order._id.month - 1],
              count: order.orderCount,
            })),
          };
        } catch (error) {
          console.error("Error fetching orders for", delivery.email, error);
          return { name: delivery.email, ordersPerMonth: [] };
        }
      })
    );

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(deliveriesWithMonthlyOrders),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.FetchTopProducts = async (req, res) => {
  try {
    const orders = await Orders.find();

    const productSales = {};

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const productId = product.idProduct;
        const productName = product.nameProduct;
        const productImage = product.imageProduct;
        const numberSells = product.amountProduct;
        const saleDate = new Date(order.date).getMonth();
        const year = new Date(order.date).getFullYear();

        if (!productSales[productId]) {
          productSales[productId] = {
            numberSells: 0,
            salesDetails: {},
            name: productName,
            image: productImage,
          };
        }

        productSales[productId].numberSells += numberSells;

        if (!productSales[productId].salesDetails[year]) {
          productSales[productId].salesDetails[year] = Array(12).fill(0);
        }

        productSales[productId].salesDetails[year][saleDate] += numberSells;
      });
    });

    const salesArray = Object.keys(productSales).map((productId) => ({
      productId,
      ...productSales[productId],
    }));

    salesArray.sort((a, b) => b.numberSells - a.numberSells);
    const topProducts = salesArray.slice(0, 4);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(topProducts),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.FetchStores = async (req, res) => {
  try {
    const products = await Products.find({});

    const storesReport = {};

    products.forEach((product) => {
      const processedProducts = {};

      product.details.forEach((detail) => {
        detail.sizes.forEach((size) => {
          const storeName = size.store;

          if (!storesReport[storeName]) {
            storesReport[storeName] = {
              available: 0,
              lowStock: 0,
              outOfStock: 0,
            };
          }

          if (!processedProducts[storeName]) {
            processedProducts[storeName] = new Set();
          }

          if (!processedProducts[storeName].has(product._id.toString())) {
            processedProducts[storeName].add(product._id.toString());

            if (size.amount > 10) {
              storesReport[storeName].available += 1;
            } else if (size.amount > 0) {
              storesReport[storeName].lowStock += 1;
            } else {
              storesReport[storeName].outOfStock += 1;
            }
          }
        });
      });
    });

    const reportData = Object.entries(storesReport).map(([name, values]) => ({
      name,
      ...values,
    }));

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(reportData),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
