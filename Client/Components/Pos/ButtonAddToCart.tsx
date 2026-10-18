import { ShoppingBasket } from "lucide-react";
import { useDispatch } from "react-redux";
import { addProduct } from "@/features/posSlice";
import Alert from "../Alert";

export default function ButtonAddToCart({
  _id,
  name,
  image,
  color,
  size,
  amount,
  amountAvalible,
  price,
  describtion,
}: {
  _id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  amount: number;
  amountAvalible: number;
  price: number;
  describtion: string;
}) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const product = {
      _id,
      name,
      image,
      color,
      size,
      amount: 1,
      amountAvalible,
      price,
      describtion,
    };
    if (amountAvalible === 0) {
      Alert("error", "هذا المنتج غير متوفر");
      return;
    }
    new Audio("/mp3/addProductsToCart.mp3").play();
    dispatch(addProduct(product));
  };

  return (
    <p
      className={`cursor-pointer ${amountAvalible === 0 && "text-red-600"}`}
      onClick={handleAddToCart}
    >
      <ShoppingBasket size={28} strokeWidth={0.75} />
    </p>
  );
}
