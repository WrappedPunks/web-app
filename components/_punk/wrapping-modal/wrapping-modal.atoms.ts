import { atom, useAtomValue, useSetAtom } from "jotai";

interface WrappingModalAtomValue {
  isOpen: boolean;
  punkId: number | null;
}

const wrappingModalAtom = atom<WrappingModalAtomValue>({
  isOpen: false,
  punkId: null,
});

const openWrappingModal = atom<
  null,
  [Omit<WrappingModalAtomValue, "isOpen">],
  void
>(null, (_get, set, info) => {
  set(wrappingModalAtom, {
    isOpen: true,
    ...info,
  });
});

const closeWrappingModal = atom(null, (_get, set) => {
  set(wrappingModalAtom, {
    isOpen: false,
    punkId: null,
  });
});

export const useWrappingModal = () => useAtomValue(wrappingModalAtom);

export const useOpenWrappingModal = () => useSetAtom(openWrappingModal);

export const useCloseWrappingModal = () => useSetAtom(closeWrappingModal);
