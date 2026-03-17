import { Label } from "./label";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  name: string;
  options: Option[];
  width?: string;
  placeholder?: string;
  defaultValue?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  width,
  placeholder = "Select an option",
  defaultValue,
}) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        suppressHydrationWarning
        className={cn(
          "flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          width
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
