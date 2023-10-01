
import { useState } from "react";

const useFormField = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleBlur = () => setTouched(true);
  const handleChange = (e) => {
    setValue(e.target.value);
    setErrorMessage(""); // Clear error message
    setTouched(true);
  };
  return {
    value,
    touched,
    setValue,
    setTouched,
    errorMessage,
    handleBlur,
    handleChange,
    setErrorMessage,
  };
};

export default useFormField