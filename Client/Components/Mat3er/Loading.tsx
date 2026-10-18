import { Progress, Spinner } from "@nextui-org/react";
import NavBar from "@/Components/Mat3er/NavBar";
import Footer from "@/Components/Mat3er/Footer";

export default function LoadingComponent() {
  return (
    <>
      <NavBar />
      <div className="w-[100%] h-screen flex flex-col items-center justify-center px-8">
        <p className="mb-5">يتم تحميل الصفحة ... </p>
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="max-w-md"
          color="warning"
        />
      </div>
      <Footer />
    </>
  );
}
