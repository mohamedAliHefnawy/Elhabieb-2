import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";
import { EyeClosed } from "lucide-react";

interface Product {
  idproduct: string;
  nameProduct: string;
  imageProduct: string;
  colorProduct: string;
  sizeProduct: string;
  describtionProduct: string;
  priceProduct: number;
  amountProduct: number;
  amountNewProduct: number;
}

export default function ModelShowProductsOrder({
  codeInvoice,
  products,
  store,
}: {
  codeInvoice: string;
  products: Product[];
  store: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        onClick={onOpen}
        className="flex items-center gap-x-2 cursor-pointer"
      >
        <p>
          <EyeClosed strokeWidth={0.75} />
        </p>
        <p>{products.length}</p>
      </div>
      <Modal hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p dir="rtl">منتجات الطلبية {codeInvoice}</p>
              </ModalHeader>
              <ModalBody>
                <div className="border-t-1">
                  {products.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-x-2 border-b-1 py-2"
                      dir="rtl"
                    >
                      <Avatar src={item.imageProduct} className="w-20 h-20" />
                      <div>
                        <p>{item.nameProduct}</p>
                        <div className="my-1 flex items-center gap-x-2">
                          <p
                            className="w-4 h-4 rounded-2xl"
                            style={{ backgroundColor: item.colorProduct }}
                          ></p>
                          <p>|</p>
                          <p>{item.sizeProduct}</p>
                        </div>
                        <p>{item.priceProduct} د.ل</p>
                      </div>
                      <div className="text-sm opacity-50">المخزن : {store}</div>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="bordered"
                  className="w-full"
                  onPress={onClose}
                >
                  إلغاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
