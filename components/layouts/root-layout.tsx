import { Grid } from "@chakra-ui/react";
import { Montserrat } from "next/font/google";
import { ReactNode } from "react";
import GeneralContainer from "../general-container";
import Footer from "./footer";
import Header from "./header";
import NavigationMenu from "./navigation-menu";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <Grid
      as="main"
      className={montserrat.className}
      fontWeight="medium"
      minH="100.1vh"
      templateRows={`auto 1fr auto`}
    >
      <Header />
      <NavigationMenu />
      <GeneralContainer mx="auto" py={10}>
        {children}
      </GeneralContainer>
      <Footer />
    </Grid>
  );
}
