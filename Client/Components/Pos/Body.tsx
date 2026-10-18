import React from "react";
import HeaderCatogries from "./HeaderCatogries";
import BodyProducts from "./BodyProducts";

export default function Body() {
  return (
    <div className="p-4 max-w-full overflow-hidden">
      <HeaderCatogries />
      <BodyProducts />
    </div>
  );
}
