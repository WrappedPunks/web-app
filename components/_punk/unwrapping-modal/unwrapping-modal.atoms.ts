import { atom, useAtomValue, useSetAtom } from "jotai";

interface UnwrappingModalAtomValue {
  isOpen: boolean;
  punkId: number | null;
}

const unwrappingModalAtom = atom<UnwrappingModalAtomValue>({
  isOpen: false,
  punkId: null,
});

const openUnwrappingModal = atom<
  null,
  [Omit<UnwrappingModalAtomValue, "isOpen">],
  void
>(null, (_get, set, info) => {
  set(unwrappingModalAtom, {
    isOpen: true,
    ...info,
  });
});

const closeUnwrappingModal = atom(null, (_get, set) => {
  set(unwrappingModalAtom, {
    isOpen: false,
    punkId: null,
  });
});

export const useUnwrappingModal = () => useAtomValue(unwrappingModalAtom);

export const useOpenUnwrappingModal = () => useSetAtom(openUnwrappingModal);

export const useCloseUnwrappingModal = () => useSetAtom(closeUnwrappingModal);
