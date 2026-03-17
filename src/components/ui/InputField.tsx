import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

type InputFieldProps = {
  label: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
  name: string;
  width?: string;
  placeholder?: string;
  onChange?: () => void;
  checked?: boolean;
  value?: string;
  required?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  width,
  onChange,
  checked,
  value,
  placeholder,
  required,
}) => {
  const isCheckbox = type === "checkbox";
  return (
    <div
      className={cn(
        isCheckbox ? "flex items-center gap-2" : "flex flex-col gap-2",
        "mt-4"
      )}
    >
      <Label htmlFor={name} className={cn(isCheckbox && "order-2")}>
        {label}
      </Label>
      <Input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        checked={checked}
        required={required}
        className={cn(width)}
      />
    </div>
  );
};

export default InputField;
