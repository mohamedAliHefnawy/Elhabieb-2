import product2 from "@/public/images/product2.png";
import CartProduct from "../CartProduct";

export default function SomeProducts() {
  return (
    <div className="mt-8 ">
      <p className="text-right mr-6 opacity-55">بعض المنتجات المشابهه</p>
      <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 max-sm:grid-cols-1 gap-4 p-4">
        <CartProduct
          idProduct={""}
          nameProduct={"منتج"}
          priceProduct={100}
          priceCustomer={120}
          priceMarkter={130}
          colorsProduct={[]}
          imagesProduct={[product2.src]}
          discrubtionProduct={"وصف"}
          catogryProduct={"قسم"}
          numberSellesProduct={0}
          detailsProduct={[
            {
              color: "",
              sizes: [
                {
                  size: "",
                  city: "",
                  store: "",
                  amount: 0,
                },
              ],
            },
          ]}
          products={[]}
        />
        <CartProduct
          idProduct={""}
          nameProduct={"منتج"}
          priceProduct={100}
          priceCustomer={120}
          priceMarkter={130}
          colorsProduct={[]}
          imagesProduct={[product2.src]}
          discrubtionProduct={"وصف"}
          catogryProduct={"قسم"}
          numberSellesProduct={0}
          detailsProduct={[
            {
              color: "",
              sizes: [
                {
                  size: "",
                  city: "",
                  store: "",
                  amount: 0,
                },
              ],
            },
          ]}
          products={[]}
        />
        <CartProduct
          idProduct={""}
          nameProduct={"منتج"}
          priceProduct={100}
          priceCustomer={120}
          priceMarkter={130}
          colorsProduct={[]}
          imagesProduct={[product2.src]}
          discrubtionProduct={"وصف"}
          catogryProduct={"قسم"}
          numberSellesProduct={0}
          detailsProduct={[
            {
              color: "",
              sizes: [
                {
                  size: "",
                  city: "",
                  store: "",
                  amount: 0,
                },
              ],
            },
          ]}
          products={[]}
        />
        <CartProduct
          idProduct={""}
          nameProduct={"منتج"}
          priceProduct={100}
          priceCustomer={120}
          priceMarkter={130}
          colorsProduct={[]}
          imagesProduct={[product2.src]}
          discrubtionProduct={"وصف"}
          catogryProduct={"قسم"}
          numberSellesProduct={0}
          detailsProduct={[
            {
              color: "",
              sizes: [
                {
                  size: "",
                  city: "",
                  store: "",
                  amount: 0,
                },
              ],
            },
          ]}
          products={[]}
        />
      </div>
    </div>
  );
}
