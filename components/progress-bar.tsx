import { useToken } from "@chakra-ui/react";
import NextNProgress from "nextjs-progressbar";

const ProgressBar = () => {
  const [color] = useToken("colors", ["primary.500"], ["colors.primary.500"]);

  return (
    <NextNProgress
      options={{ showSpinner: false }}
      showOnShallow={false}
      height={4}
      color={color}
    />
  );
};

export default ProgressBar;
