import { useEffect, useState } from "react";
import { Button, Tab, Tabs, Spinner } from "@nextui-org/react";
import Icons from "@/iconsSvg";
import axios from "axios";
import Alert from "@/Components/Alert";
import CryptoJS from "crypto-js";
import { fetchCityById } from "@/features/citiesSlice";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/src/store";

interface PriceCity {
  nameCity: string;
  priceDeliveryCity: number;
}

interface Data {
  nameCity: string;
  pricesCity: PriceCity[];
}

interface Store {
  nameStore: string;
  codeStore: string;
}

export default function EditCity() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const { slug } = useParams() || "";
  const dispatch = useDispatch<AppDispatch>();
  const { city } = useSelector((state: RootState) => state.city);

  const [stores, setStores] = useState<Store[]>([]);
  const [character, setCharacter] = useState("");
  const [nameCity, setNameCity] = useState("");
  const [selected, setSelected] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    pricesCity: PriceCity[];
  }>({
    pricesCity: [{ nameCity: "", priceDeliveryCity: 0 }],
  });

  const [loading, setLoading] = useState(false);

  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const handleAddCity = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      pricesCity: [
        ...prevFormData.pricesCity,
        { nameCity: "", priceDeliveryCity: 0 },
      ],
    }));
  };

  const handleInputChange = (
    index: number,
    field: keyof PriceCity,
    value: string | number
  ) => {
    const updatedPricesCity = [...formData.pricesCity];
    updatedPricesCity[index] = {
      ...updatedPricesCity[index],
      [field]: field === "priceDeliveryCity" ? +value : value,
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      pricesCity: updatedPricesCity,
    }));
  };

  const handleDeleteCity = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      pricesCity: prevFormData.pricesCity.filter((_, i) => i !== index),
    }));
  };

  const handleButtonClick = () => {
    const lastCode = stores.length
      ? stores[stores.length - 1].codeStore
      : `${character}0`;

    const match = lastCode.match(/(\D*)(\d*)$/);
    let newCode: number;

    if (match) {
      const currentNumber = match[2] ? parseInt(match[2], 10) : 0;
      newCode = currentNumber + 1;
    } else {
      newCode = 1;
    }
    const newCodeStore = `${character}${newCode}`;
    setStores([...stores, { nameStore: "", codeStore: newCodeStore }]);
  };

  const handleInputStoreChange = (
    index: number,
    field: keyof Store,
    value: string
  ) => {
    const updatedStores = [...stores];
    updatedStores[index] = {
      ...updatedStores[index],
      [field]: value,
    };
    setStores(updatedStores);
  };

  const handleDeleteStore = (index: number) => {
    setStores((prevStores) => prevStores.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      nameCity,
      character,
      ...formData,
      stores,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    setIsSubmitting(true);

    try {
      setLoading(true);
      const response = await axios.post(`${apiEndpoint}cities/edit/${slug}`, {
        data: encryptedData,
      });

      if (response.data === "EDIT_SUCCESS") {
        Alert("success", "تم تعديل المدينة بنجاح");
        new Audio("/mp3/editCitySucess.mp3").play();
      } else if (response.data === "CITY_NAME_EXISTS") {
        Alert("error", "عذراَ هذا الإسم مستخدم من قبل");
        new Audio("/mp3/sorry.mp3").play();
      }

      setLoading(false);
    } catch (error) {
      console.error("Error submitting data", error);
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (typeof slug === "string") {
      dispatch(fetchCityById(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (city) {
      setNameCity(city.name);
      setCharacter(city.character);
      setStores(city.stores);
      setFormData({
        pricesCity: city.prices.map((item) => ({
          nameCity: item.name,
          priceDeliveryCity: item.price,
        })),
      });
    }
  }, [city]);

  return (
    <div
      className="h-screen w-full bg-[var(--color-body)] border border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1"
      dir="rtl"
    >
      <form onSubmit={handleSubmit}>
        <Tabs
          selectedKey={selected}
          onSelectionChange={handleSelectionChange}
          color="default"
          variant="underlined"
          style={{ direction: "rtl" }}
        >
          <Tab key="1" title={<p className="mb-4">المدينة</p>}>
            <div className="flex">
              <div className="w-[14%] mr-3">
                <input
                  className="input"
                  type="text"
                  placeholder="الحرف"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                />
              </div>
              <div className="w-[100%] mr-1">
                <input
                  className="input"
                  type="text"
                  placeholder="إسم المدينة"
                  value={nameCity}
                  onChange={(e) => setNameCity(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="mt-4 w-[12%] h-14 mb-3 mr-3"
              variant="bordered"
              color="default"
              onClick={handleAddCity}
            >
              إضافة منطقة
            </Button>
            {formData.pricesCity.map((input, index) => (
              <div key={index} className="flex items-center">
                <div className="w-[15%] mr-2 mb-2 mt-2">
                  <input
                    className="input"
                    type="number"
                    placeholder="سعر التوصيل"
                    value={input.priceDeliveryCity}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "priceDeliveryCity",
                        +e.target.value
                      )
                    }
                  />
                </div>
                <input
                  className="input mr-2"
                  type="text"
                  placeholder="المنطقة"
                  value={input.nameCity}
                  onChange={(e) =>
                    handleInputChange(index, "nameCity", e.target.value)
                  }
                />
                <button
                  className="text-danger-500 hover:cursor-pointer p-3"
                  onClick={() => handleDeleteCity(index)}
                >
                  {Icons.DeleteIcon}
                </button>
              </div>
            ))}
          </Tab>
          <Tab key="2" title={<p className="mb-4">المخازن</p>}>
            <Button
              className="mt-4 w-[100%] h-14 mb-3"
              variant="bordered"
              color="default"
              onClick={handleButtonClick}
            >
              إضافة مخزن
            </Button>
            {stores.map((store, index) => (
              <div key={index} className="flex items-center">
                <input
                  className="input mr-2 mb-3"
                  type="text"
                  placeholder="المخزن"
                  value={store.nameStore}
                  onChange={(e) =>
                    handleInputStoreChange(index, "nameStore", e.target.value)
                  }
                />
                <button
                  className="text-danger-500 hover:cursor-pointer p-3"
                  onClick={() => handleDeleteStore(index)}
                >
                  {store.codeStore}
                </button>
              </div>
            ))}
          </Tab>
        </Tabs>
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full h-16 mt-6 bg-[var(--color-navbar)] border-1"
        >
          تعديل المدينة
        </Button>
      </form>
    </div>
  );
}
