import { usePreferImpersonatedAccount } from "@/features/user.hooks";
import { Modal, ModalContent, Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Address } from "viem";

const WalletChangeWatcher = () => {
  const { address } = usePreferImpersonatedAccount();
  const prevAddress = useRef<Address | undefined>(address);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!prevAddress.current) {
      prevAddress.current = address;
      return;
    }
    if (prevAddress.current !== address) {
      setShowLoading(true);
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  }, [address]);

  if (!showLoading) {
    return null;
  }

  return (
    <Modal isOpen onClose={() => null} size="full">
      <ModalContent justifyContent="center" alignItems="center">
        <Spinner color="primary.500" thickness="0.325rem" size="xl" />
      </ModalContent>
    </Modal>
  );
};

export default WalletChangeWatcher;
