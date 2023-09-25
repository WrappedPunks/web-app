import { Box, BoxProps } from "@chakra-ui/react";
import { forwardRef } from "react";

/**
 * The general container for anything with a width limited to 7xl (=80em, should be 1280px)
 */
const GeneralContainer = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <Box w="full" maxW="7xl" px={4} ref={ref} {...props} />;
});
GeneralContainer.displayName = "GeneralContainer";

export default GeneralContainer;
