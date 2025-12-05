import {ReactNode} from "react";
type AuthLayoutProps = {
  heading: string;
  intro: string;
  children: ReactNode;
};
import Logo from "@/app/_components/Logo";
const AuthLayout = ({children, heading, intro}: AuthLayoutProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen mx-auto pt-10 pb-3">
      <Logo />
      <div>
        <p className="font-bold text-[32px] text-brand-1">{intro}</p>
        <h2 className="text-center">{heading}</h2>
      </div>
      <div className="w-[35%]">{children}</div>
    </div>
  );
};

export default AuthLayout;
