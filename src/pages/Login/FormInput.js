import React from "react";

const FormInput = ({
  id,
  type,
  className,
  onBlur,
  onChange,
  invalid,
  value,
  errorMessage,
  errorClassName,
  containerClassName,
}) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</label>
      <input
        className={className}
        // autoComplete="off"
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        id={id}
        type={type}
      />
      <p className={errorClassName}>
        {invalid ? `Please enter a valid ${id}` : errorMessage}
      </p>
    </div>
  );
};

export default FormInput;
