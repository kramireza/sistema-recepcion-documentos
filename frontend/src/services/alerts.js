import Swal from "sweetalert2";

export const successAlert = (title, text) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#003366",
  });
};

export const errorAlert = (title, text) => {
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#C62828",
  });
};

export const confirmAlert = async (title, text) => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
    confirmButtonColor: "#C62828",
  });

  return result.isConfirmed;
};
