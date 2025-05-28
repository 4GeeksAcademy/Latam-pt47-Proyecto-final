import Swal from "sweetalert2";

export const showSuccessAlert = (title, text) => {
    Swal.fire({
        title,
        text,
        icon: "success",
        confirmButtonText: "Aceptar",
    });
};

export const showErrorAlert = (title, text) => {
    Swal.fire({
        title,
        text,
        icon: "error",
        confirmButtonText: "Cerrar",
    });
};

export const showWarningAlert = (title, text) => {
    Swal.fire({
        title,
        text,
        icon: "warning",
        confirmButtonText: "Entendido",
    });
};