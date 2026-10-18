import Swal, { SweetAlertIcon } from "sweetalert2";

const Alert = (typeIcon: SweetAlertIcon, title: string) => {
  return Swal.fire({
    icon: typeIcon,
    title: title,
    toast: true,
    position: "top-right",
    timer: 3000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};

export default Alert;
