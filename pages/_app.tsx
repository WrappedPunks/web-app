import ConfigModal from "@/components/config-modal";
import HeadMetaData from "@/components/head-meta-data";
import RootLayout from "@/components/layouts/root-layout";
import ProgressBar from "@/components/progress-bar";
import TransactionsMonitor from "@/components/transactions-monitor/transactions-monitor";
import WalletChangeWatcher from "@/components/wallet-change-watcher";
import createQueryClient from "@/configs/react-query";
import theme from "@/configs/theme";
import { createWagmiConfig } from "@/configs/wagmi";
import { AppPropsWithLayout } from "@/types";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { useRouter } from "next/router";
import { WagmiConfig } from "wagmi";

const wagmiConfig = createWagmiConfig();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const toast = useToast();
  const router = useRouter();

  const queryClient = createQueryClient(router, toast);

  const getLayout =
    Component.getLayout ?? ((page) => <RootLayout>{page}</RootLayout>);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <JotaiProvider>
            <WagmiConfig config={wagmiConfig}>
              <HeadMetaData />
              <ProgressBar />
              <TransactionsMonitor />
              {getLayout(<Component {...pageProps} />)}
              <ConfigModal />
              <WalletChangeWatcher />
            </WagmiConfig>
          </JotaiProvider>
        </Hydrate>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
