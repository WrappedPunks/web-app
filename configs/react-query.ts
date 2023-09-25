import { useToast } from "@chakra-ui/react";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { NextRouter } from "next/router";

const createQueryClient = (
  router: NextRouter,
  toast?: ReturnType<typeof useToast>
) =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 2,
      },
    },
    queryCache: new QueryCache({
      onError: () => {
        toast?.({
          title: "Oops!",
          description: "Something went wrong, please try again later!",
          colorScheme: "red",
          position: "bottom-left",
        });
        router.replace("/");
      },
    }),
  });

export default createQueryClient;
