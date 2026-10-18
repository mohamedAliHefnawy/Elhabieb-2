"use client";

import PageProduct from "@/Components/Mat3er/PageProduct";
import { usePathname } from "next/navigation";

export default function Products() {
  const path = usePathname();
  const decodedPath = decodeURIComponent(path);

  const lastSegment = decodedPath.split("/").pop() as string;

  return (
    <div>
      <PageProduct slug={lastSegment} />
    </div>
  );
}
