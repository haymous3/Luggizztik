import {ReactNode} from "react";
import Logo from "@/components/ui/Logo";

type AuthLayoutProps = {
  heading: string;
  intro: string;
  children: ReactNode;
};

const AuthLayout = ({children, heading, intro}: AuthLayoutProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen mx-auto pt-10 pb-3">
      <Logo />
      <div className="text-center mb-6">
        <h1 className="font-bold text-[32px] text-brand-1">{intro}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{heading}</p>
      </div>
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );
};

export default AuthLayout;
