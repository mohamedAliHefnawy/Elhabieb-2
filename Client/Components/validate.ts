// validate.ts

export const getValidityFromLocalStorage = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("validity");
  }
  return null; // أو يمكنك إرجاع قيمة افتراضية
};
