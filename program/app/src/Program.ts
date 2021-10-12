export const GetInventory = async () => {
  return { resources: [{ ruby: 0 }], items: [{ title: "Iron Battleaxe" }] };
};

export const MineInventory = async () => {
  return { resources: [{ ruby: 0 }], items: [] };
};

export const CraftItem = async () => {
  return {};
};
