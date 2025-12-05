type OverViewBoxProps = {
  width: string;
  children: React.ReactNode;
};

const OverViewBox = ({children, width}: OverViewBoxProps) => {
  return (
    <div
      className={`w-[${width}] flex flex-1 gap-4 items-center px-10 py-4 flex-wrap bg-linear-[90deg,rgba(107,45,32,0.10)_0%,rgba(31,226,31,0.10)_100%] bg-[#FFF] rounded-sm`}
    >
      {children}
    </div>
  );
};

export default OverViewBox;
