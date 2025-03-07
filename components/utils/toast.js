import { toast } from "react-toastify";

const options = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "light",
};

const success = (message) => toast.success(message, options);

const error = (err) => toast.error(err, options);

export default { success, error };