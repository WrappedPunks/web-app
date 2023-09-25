import { MultiValue } from "chakra-react-select";
import { TSimpleNft } from "./nft.types";
import { TFilter, TOption } from "./punks-filter.types";

export const TRAITS = [
  {
    id: "trait",
    elements: [
      "Beanie",
      "Choker",
      "Pilot Helmet",
      "Tiara",
      "Orange Side",
      "Buck Teeth",
      "Welding Goggles",
      "Pigtails",
      "Pink With Hat",
      "Top Hat",
      "Spots",
      "Rosy Cheeks",
      "Blonde Short",
      "Wild White Hair",
      "Cowboy Hat",
      "Wild Blonde",
      "Straight Hair Blonde",
      "Big Beard",
      "Red Mohawk",
      "Half Shaved",
      "Blonde Bob",
      "Vampire Hair",
      "Clown Hair Green",
      "Straight Hair Dark",
      "Straight Hair",
      "Silver Chain",
      "Dark Hair",
      "Purple Hair",
      "Gold Chain",
      "Medical Mask",
      "Tassle Hat",
      "Fedora",
      "Police Cap",
      "Clown Nose",
      "Smile",
      "Cap Forward",
      "Hoodie",
      "Front Beard Dark",
      "Frown",
      "Purple Eye Shadow",
      "Handlebars",
      "Blue Eye Shadow",
      "Green Eye Shadow",
      "Vape",
      "Front Beard",
      "Chinstrap",
      "3D Glasses",
      "Luxurious Beard",
      "Mustache",
      "Normal Beard Black",
      "Normal Beard",
      "Eye Mask",
      "Goat",
      "Do-rag",
      "Shaved Head",
      "Muttonchops",
      "Peak Spike",
      "Pipe",
      "VR",
      "Cap",
      "Small Shades",
      "Clown Eyes Green",
      "Clown Eyes Blue",
      "Headband",
      "Crazy Hair",
      "Knitted Cap",
      "Mohawk Dark",
      "Mohawk",
      "Mohawk Thin",
      "Frumpy Hair",
      "Wild Hair",
      "Messy Hair",
      "Eye Patch",
      "Stringy Hair",
      "Bandana",
      "Classic Shades",
      "Shadow Beard",
      "Regular Shades",
      "Horned Rim Glasses",
      "Big Shades",
      "Nerd Glasses",
      "Black Lipstick",
      "Mole",
      "Purple Lipstick",
      "Hot Lipstick",
      "Cigarette",
      "Earring",
    ],
  },
  {
    id: "type",
    elements: ["Alien", "Ape", "Zombie", "Female", "Male"],
  },
];

export const isMatchTypes = (
  item: TSimpleNft,
  inputTypes: TFilter["types"]
) => {
  if (inputTypes.length === 0) return true;
  return inputTypes.some((input) => {
    return item.attributes.some((att) => {
      if (input.value !== "Unhuman") {
        return att.trait_type === "type" && att.value.startsWith(input.value);
      }
      return (
        att.trait_type === "type" &&
        !att.value.startsWith("Male") &&
        !att.value.startsWith("Female")
      );
    });
  });
};

export const isMatchAttributes = (
  item: TSimpleNft,
  inputAttributes: MultiValue<TOption>
) => {
  if (inputAttributes.length === 0) return true;
  return inputAttributes.some((inputAtt) => {
    return item.attributes.some(
      (att) =>
        att.trait_type === "attribute" && att.value.startsWith(inputAtt.value)
    );
  });
};

export const isMatchPunkIds = (
  item: TSimpleNft,
  inputPunkIds: TFilter["punkIds"]
) => {
  if (inputPunkIds.length === 0) return true;
  return inputPunkIds.some((pid) => pid.value === item.id.toString());
};

export const isExcludedTypes = (
  item: TSimpleNft,
  excludedTypes: TFilter["excludedTypes"]
) => {
  if (excludedTypes.length === 0) {
    return false;
  }
  return excludedTypes.some((excludedType) => {
    const itemGender = item.attributes.find((att) => att.trait_type === "type");
    if (!itemGender) return false;
    return excludedType.value !== "Unhuman"
      ? itemGender.value.startsWith(excludedType.value)
      : !itemGender.value.startsWith("Male") &&
          !itemGender.value.startsWith("Female");
  });
};

export const isExcludedTraits = (
  item: TSimpleNft,
  excludedTraits: TFilter["excludedTraits"]
) => {
  if (excludedTraits.length === 0) {
    return false;
  }
  return excludedTraits.some((excludedTrait) => {
    const itemTraits = item.attributes.filter(
      (att) => att.trait_type === "attribute"
    );
    if (itemTraits.length === 0) return false;
    return itemTraits.some(
      (itemTrait) => itemTrait.value === excludedTrait.value
    );
  });
};
