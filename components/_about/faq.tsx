import { CONTRACT_ADDRESS } from "@/utils/constants";
import { getEtherscanUrlByAddress } from "@/utils/etherscan";
import { Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

type Faq = {
  question: string;
  answer: string[] | ReactNode[];
};

const FAQ_LIST: Faq[] = [
  {
    question: "What are the Cryptopunks?",
    answer: [
      <>
        The Cryptopunks are one of the earliest non fungible tokens created on
        the Ethereum blockchain, and were the inspiration for the ERC-721
        standard. You can purchase an original Cryptopunks at{" "}
        {
          <ChakraLink
            isExternal
            href="https://larvalabs.com/cryptopunks"
            textDecoration="underline"
          >
            https://larvalabs.com/cryptopunks
          </ChakraLink>
        }{" "}
        or{" "}
        <ChakraLink
          isExternal
          href="https://cryptopunks.app"
          textDecoration="underline"
        >
          https://cryptopunks.app
        </ChakraLink>
      </>,
    ],
  },
  {
    question: "What are the Wrapped Punks?",
    answer: [
      "Each Wrapped Punk is an original Cryptopunk that has been converted into an ERC-721 Non-Fungible Token. The Cryptopunks were one of the earliest Non-Fungible Tokens, created before the ERC-721 standard existed. In fact, the ERC-721 standard was inspired by the Cryptopunks.",
    ],
  },
  {
    question: "How do I wrap a Cryptopunk?",
    answer: [
      <>
        You can use{" "}
        <ChakraLink
          isExternal
          href="https://wrappedpunks.com"
          textDecoration="underline"
        >
          wrappedpunks.com
        </ChakraLink>{" "}
        to wrap your Cryptopunk. Alternatively, you can interact directly with
        the smart contract via etherscan. Instructions for doing so can be found
        here.
      </>,
      <>
        If you prefer to wrap your Punk using{" "}
        <ChakraLink
          isExternal
          href="https://wrappedpunks.com"
          textDecoration="underline"
        >
          wrappedpunks.com
        </ChakraLink>{" "}
        , connect your wallet, click on &quot;My Punks&quot;, open the page with
        the Punk you wish to wrap, and click on the &quot;Wrap&quot; button.
      </>,
      "The wrapping process requires two transactions: the first transaction sends your Punk to your proxy wallet, and the second transaction mints your Wrapped Punk and sends it to your wallet.",
    ],
  },
  {
    question: "Why should I wrap a Cryptopunk?",
    answer: [
      "After receiving the Wrapped Punk in your wallet, you can use it with any platform that is compatible with the ERC-721 standard, such as Opensea. However, it's important to note that only the wallet that owns the Wrapped Punk can retrieve the original Cryptopunk. If you transfer or sell your Wrapped Punk, your wallet will no longer have access to the Cryptopunk.",
    ],
  },
  {
    question: "How do I unwrap a Cryptopunk?",
    answer: [
      <>
        You can use{" "}
        <ChakraLink
          isExternal
          href="https://wrappedpunks.com"
          textDecoration="underline"
        >
          wrappedpunks.com
        </ChakraLink>{" "}
        to wrap your Cryptopunk. Alternatively, you can interact directly with
        the smart contract via etherscan. You can find instructions for this on
        the website.
      </>,
      <>
        To unwrap your Punk using{" "}
        <ChakraLink
          isExternal
          href="https://wrappedpunks.com"
          textDecoration="underline"
        >
          wrappedpunks.com
        </ChakraLink>
        , connect your wallet, click on &quot;My Punks&quot;, open the page with
        the Wrapped Punk you wish to unwrap, and click on the &quot;Unwrap&quot;
        button.
      </>,
      "Unwrapping requires one transaction, which will send the original Cryptopunk back to your wallet and concurrently burn the Wrapped Punk.",
    ],
  },
  {
    question: "Is this smart contract safe? Can I trust this website?",
    answer: [
      <>
        The contract underwent a security review by Consensys Diligence, and the
        report can be downloaded{" "}
        <ChakraLink
          isExternal
          href="/docs/WrappedPunk_Protocol_-_Spot-Check_-_October_1_2020.pdf"
          textDecoration="underline"
        >
          here
        </ChakraLink>
        .
      </>,
      <>
        <ChakraLink
          isExternal
          href="https://wrappedpunks.com"
          textDecoration="underline"
        >
          Wrappedpunks.com
        </ChakraLink>{" "}
        was launched as a user-friendly interface to the smart contract,
        facilitating wrapping and unwrapping.
      </>,
      "However wrappedpunks is an open-source, free, community project. We do not encourage you to wrap and unwrap your punk, nor we are responsible for any possible accident that can happen when you are interacting with this website. By using this website you adhere to our terms and conditions.",
    ],
  },
  {
    question: "What is the story of wrappedpunks.com ?",
    answer: [
      <>
        Wrappedpunks is an open-source smart contract that converts any original
        Cryptopunk into a standard ERC721 non-fungible token. The contract is
        fully decentralized and was deployed in September 2020. It was verified
        on{" "}
        <ChakraLink
          isExternal
          href="https://etherscan.io/"
          textDecoration="underline"
        >
          etherscan.io
        </ChakraLink>{" "}
        and can be interacted with at the address{" "}
        <ChakraLink
          isExternal
          href={getEtherscanUrlByAddress(CONTRACT_ADDRESS.WRAPPED_PUNKS)}
          textDecoration="underline"
        >
          {CONTRACT_ADDRESS.WRAPPED_PUNKS}
        </ChakraLink>
        .
      </>,
      <>
        Please note that{" "}
        <ChakraLink
          isExternal
          href="https://wrappedpunks.com"
          textDecoration="underline"
        >
          wrappedpunks.com
        </ChakraLink>{" "}
        is not associated with Larvalabs, the creators of the Cryptopunks, or
        with Yuga Labs, the owner of the Cryptopunks&apos; copyrights.
      </>,
      "While we maintain this service out of passion and love for the Cryptopunks, we encourage users to do their due diligence and verify that transactions are pointing to the correct smart contract before wrapping or unwrapping their Punks.",
      "Wrappedpunks contract can be accessed through Etherscan, but we caution users that interacting with Etherscan can be complicated. We highly discourage wrapping or unwrapping Cryptopunks unless you are familiar with Etherscan and smart contracts.",
      "If you choose to wrap your Punk, please note that any transaction is irreversible as it interacts with the Ethereum blockchain.",
      "By following the instructions above, you acknowledge that you understand that every transaction is irreversible and that you are doing it at your own risk.",
    ],
  },
];

export default function FAQ() {
  return (
    <VStack gap={10}>
      <Text textAlign="left" fontWeight={400}>
        Read below if you wish to learn about wrappedpunks. Click{" "}
        <ChakraLink
          isExternal
          href={getEtherscanUrlByAddress(CONTRACT_ADDRESS.WRAPPED_PUNKS)}
          textDecoration="underline"
        >
          here
        </ChakraLink>{" "}
        if you want to wrap your Punk interacting directly with the smart
        contract via etherscan.
      </Text>
      {FAQ_LIST.map((faq) => (
        <VStack key={faq.question} gap={2} alignItems="flex-start">
          <Text textAlign="left" fontWeight={700}>
            {faq.question}
          </Text>
          <VStack gap={2}>
            {faq.answer.map((answer, index) => (
              <Text key={index} textAlign="left" fontWeight={400}>
                {answer}
              </Text>
            ))}
          </VStack>
        </VStack>
      ))}
    </VStack>
  );
}
