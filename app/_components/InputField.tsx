type InputFieldProps = {
  label: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];

  name: string;
  width?: string;
  placeholder?: string;
  onChange?: () => void;
  checked?: boolean;
  value?: string
};

const InputField: React.FC<InputFieldProps> = ({label, type, name, width, onChange, checked, value, placeholder}) => {
  // console.log(type)
  return (
    <div className={`${type === "checkbox" ? "" : "flex flex-col gap-3"} mt-4`}>
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        checked={checked}
        className={`border border-brand-1 rounded-sm px-2 py-1 ${width}`}
      />
    </div>
  );
};

export default InputField;
