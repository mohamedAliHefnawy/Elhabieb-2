import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ShoppingBasket } from "lucide-react";

export default function ModelShowProductsInInvoice({
  products,
}: {
  products: any[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p
        onClick={onOpen}
        className=" bg-orange-100 border-1 border-orange-400  rounded-3xl p-3 text-center text-orange-950 cursor-pointer"
      >
        <ShoppingBasket strokeWidth={1} />
      </p>
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <div className="overflow-x-auto w-[100%]" dir="rtl">
                  <table className="min-w-full border-1 border-[var(--color-navbar)] text-center">
                    <thead>
                      <tr className="border-1 border-[var(--color-navbar)]">
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          المنتج #id
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          اللون
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          الحجم
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          الكمية
                        </th>
                        <th className="p-4 border-1 border-[var(--color-navbar)]">
                          السعر
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, i) => (
                        <tr
                          className="border-1 border-[var(--color-navbar)]"
                          dir="rtl"
                          key={i}
                        >
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            {item.id}
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            <p
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></p>
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            {item.size}
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            {item.amount}
                          </td>
                          <td className="p-4 border-1 border-[var(--color-navbar)]">
                            <span>{item.price}</span>
                            <span className="mr-1">د.ل</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغـاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
