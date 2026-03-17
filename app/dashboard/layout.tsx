import {Poppins} from "next/font/google";
import {AuthHeader} from "@/features/auth/components/AuthHeader";
//import {headers} from "next/headers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default async function Layout({
  children,
}: Readonly<{children: React.ReactNode}>) {

  //const referer = (await headers()).get("referer") || "";
  return (
    <div className={`${poppins.className} px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[7rem] pt-4 sm:pt-7 pb-8`}>
      <AuthHeader />

      {children}
    </div>
  );
}
