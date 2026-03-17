import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

type OverViewBoxProps = {
  width: string;
  children: React.ReactNode;
};

const OverViewBox = ({ children, width }: OverViewBoxProps) => {
  return (
    <Card
      style={width !== "full" ? { width } : undefined}
      className={cn(
        "flex flex-1 gap-4 items-center px-10 py-4 flex-wrap border-0 shadow-sm",
        "bg-[linear-gradient(90deg,rgba(107,45,32,0.1)_0%,rgba(31,226,31,0.1)_100%)] bg-[#FFF]",
        width === "full" && "w-full"
      )}
    >
      <CardContent className="p-0 flex flex-1 gap-4 items-center flex-wrap">
        {children}
      </CardContent>
    </Card>
  );
};

export default OverViewBox;
