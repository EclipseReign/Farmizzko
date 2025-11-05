// Game data definitions for Wild West farming game - Frontend

export const CROPS_DATA = {
  wheat: {
    id: "wheat",
    name: "Пшеница",
    description: "Быстрорастущая культура",
    cost: { gold: 10 },
    growTime: 60,
    witherTime: 300,
    yield: { food: 20, gold: 5 },
    experience: 5,
    levelRequired: 1,
    image: "🌾"
  },
  echinacea: {
    id: "echinacea",
    name: "Эхинацея",
    description: "Дает много еды при сборе",
    cost: { gold: 50 },
    growTime: 300,
    witherTime: 600,
    yield: { food: 48 },
    experience: 15,
    levelRequired: 3,
    image: "🌺"
  },
  ginger: {
    id: "ginger",
    name: "Имбирь",
    description: "Прибыльная культура",
    cost: { gold: 100 },
    growTime: 1080,
    witherTime: 1200,
    yield: { gold: 300 },
    experience: 50,
    levelRequired: 5,
    image: "🫚"
  },
  melon: {
    id: "melon",
    name: "Дыня",
    description: "Коллекция дает защиту от засухи",
    cost: { gold: 75 },
    growTime: 600,
    witherTime: 900,
    yield: { food: 30, gold: 20 },
    experience: 25,
    levelRequired: 4,
    image: "🍉"
  },
  rose: {
    id: "rose",
    name: "Роза",
    description: "Привлекает бабочек",
    cost: { gold: 30 },
    growTime: 180,
    witherTime: 600,
    yield: { gold: 15 },
    experience: 10,
    levelRequired: 2,
    butterflies: true,
    image: "🌹"
  },
  sunflower: {
    id: "sunflower",
    name: "Подсолнух",
    description: "Яркие цветы, привлекают бабочек",
    cost: { gold: 25 },
    growTime: 150,
    witherTime: 600,
    yield: { food: 15, gold: 10 },
    experience: 8,
    levelRequired: 1,
    butterflies: true,
    image: "🌻"
  },
  corn: {
    id: "corn",
    name: "Кукуруза",
    description: "Универсальная культура",
    cost: { gold: 40 },
    growTime: 240,
    witherTime: 600,
    yield: { food: 35, gold: 15 },
    experience: 12,
    levelRequired: 2,
    image: "🌽"
  },
  carrot: {
    id: "carrot",
    name: "Морковь",
    description: "Быстрорастущая",
    cost: { gold: 15 },
    growTime: 90,
    witherTime: 300,
    yield: { food: 25 },
    experience: 7,
    levelRequired: 1,
    image: "🥕"
  }
};

export const ANIMALS_DATA = {
  cow: {
    id: "cow",
    name: "Корова",
    description: "Дает молоко",
    cost: { gold: 200, wood: 50 },
    adultAge: 300,
    productionInterval: 600,
    productionYield: { food: 20, gold: 10 },
    feedCost: { food: 10 },
    experience: 20,
    levelRequired: 3,
    image: "🐄"
  },
  sheep: {
    id: "sheep",
    name: "Овца",
    description: "Дает шерсть",
    cost: { gold: 150, wood: 40 },
    adultAge: 240,
    productionInterval: 480,
    productionYield: { wood: 15, gold: 8 },
    feedCost: { food: 8 },
    experience: 15,
    levelRequired: 2,
    image: "🐑"
  },
  chicken: {
    id: "chicken",
    name: "Курица",
    description: "Несет яйца",
    cost: { gold: 100, wood: 30 },
    adultAge: 180,
    productionInterval: 300,
    productionYield: { food: 15, gold: 5 },
    feedCost: { food: 5 },
    experience: 10,
    levelRequired: 1,
    image: "🐔"
  },
  pig: {
    id: "pig",
    name: "Свинья",
    description: "Дает мясо",
    cost: { gold: 180, wood: 45 },
    adultAge: 270,
    productionInterval: 540,
    productionYield: { food: 30, gold: 12 },
    feedCost: { food: 12 },
    experience: 18,
    levelRequired: 3,
    image: "🐷"
  },
  horse: {
    id: "horse",
    name: "Лошадь",
    description: "Ускоряет перемещение",
    cost: { gold: 300, wood: 100 },
    adultAge: 360,
    productionInterval: 0,
    productionYield: {},
    feedCost: { food: 15 },
    experience: 30,
    levelRequired: 5,
    image: "🐴"
  },
  goat: {
    id: "goat",
    name: "Коза",
    description: "Дает молоко и шерсть",
    cost: { gold: 160, wood: 35 },
    adultAge: 210,
    productionInterval: 420,
    productionYield: { food: 12, wood: 8, gold: 7 },
    feedCost: { food: 7 },
    experience: 14,
    levelRequired: 2,
    image: "🐐"
  }
};

export const TERRITORY_DATA = {
  grass: {
    id: "grass",
    name: "Трава",
    description: "Расчистите для посадки",
    clearCost: { energy: 1 },
    clearTime: 5,
    rewards: { gold: 2 },
    experience: 1,
    image: "🌿"
  },
  stone: {
    id: "stone",
    name: "Камень",
    description: "Требует больше энергии",
    clearCost: { energy: 3 },
    clearTime: 10,
    rewards: { stone: 5, gold: 5 },
    experience: 3,
    image: "🪨"
  },
  tree: {
    id: "tree",
    name: "Дерево",
    description: "Дает древесину",
    clearCost: { energy: 5 },
    clearTime: 15,
    rewards: { wood: 10, gold: 8 },
    experience: 5,
    image: "🌳"
  },
  bush: {
    id: "bush",
    name: "Куст",
    description: "Небольшое препятствие",
    clearCost: { energy: 2 },
    clearTime: 7,
    rewards: { wood: 3, gold: 3 },
    experience: 2,
    image: "🌳"
  },
  pine: {
    id: "pine",
    name: "Ель",
    description: "Взрослая ель, может появиться медведь",
    clearCost: { energy: 6 },
    clearTime: 20,
    rewards: { wood: 15, gold: 10 },
    experience: 7,
    image: "🌲"
  },
  cedar: {
    id: "cedar",
    name: "Кедр",
    description: "Взрослый кедр, может появиться кабан",
    clearCost: { energy: 7 },
    clearTime: 25,
    rewards: { wood: 20, stone: 5, gold: 12 },
    experience: 9,
    image: "🌲"
  },
  skeleton: {
    id: "skeleton",
    name: "Скелет",
    description: "Древние останки",
    clearCost: { energy: 4 },
    clearTime: 12,
    rewards: { gold: 15, agrobucks: 1 },
    experience: 6,
    image: "💀"
  }
};

export const PESTS_DATA = {
  wolf: {
    id: "wolf",
    name: "Волк",
    description: "Опасный хищник",
    chaseCost: { energy: 5 },
    chaseTime: 10,
    rewards: { totem_material: 1, gold: 20 },
    experience: 10,
    image: "🐺"
  },
  bear: {
    id: "bear",
    name: "Медведь",
    description: "Появляется при рубке елей",
    chaseCost: { energy: 7 },
    chaseTime: 15,
    rewards: { totem_material: 2, gold: 30 },
    experience: 15,
    image: "🐻"
  },
  boar: {
    id: "boar",
    name: "Кабан",
    description: "Появляется при рубке кедров",
    chaseCost: { energy: 6 },
    chaseTime: 12,
    rewards: { totem_material: 1, gold: 25, food: 10 },
    experience: 12,
    image: "🐗"
  },
  snake: {
    id: "snake",
    name: "Змея",
    description: "Появляется при уборке зарослей",
    chaseCost: { energy: 3 },
    chaseTime: 8,
    rewards: { totem_material: 1, gold: 15 },
    experience: 8,
    image: "🐍"
  },
  mole: {
    id: "mole",
    name: "Крот",
    description: "Портит посевы",
    chaseCost: { energy: 4 },
    chaseTime: 9,
    rewards: { totem_material: 1, gold: 18 },
    experience: 9,
    image: "🦫"
  }
};

export const COLLECTIONS_DATA = {
  wheat_collection: {
    id: "wheat_collection",
    name: "Коллекция пшеницы",
    items: ["wheat_seed", "straw", "golden_grain"],
    itemsNeeded: { wheat_seed: 5, straw: 3, golden_grain: 2 },
    rewards: { gold: 50, experience: 20 },
    image: "🌾"
  },
  melon_collection: {
    id: "melon_collection",
    name: "Коллекция дыни",
    items: ["melon_slice", "sweet_seed", "juicy_fruit"],
    itemsNeeded: { melon_slice: 4, sweet_seed: 3, juicy_fruit: 3 },
    rewards: { drought_protection: 1 },
    description: "Дает защиту от засухи",
    image: "🍉"
  },
  flower_collection: {
    id: "flower_collection",
    name: "Коллекция цветов",
    items: ["rose_petal", "yellow_petal", "purple_petal"],
    itemsNeeded: { rose_petal: 5, yellow_petal: 5, purple_petal: 5 },
    rewards: { gold: 100, experience: 30, agrobucks: 1 },
    image: "🌸"
  },
  animal_collection: {
    id: "animal_collection",
    name: "Коллекция животноводства",
    items: ["milk_bottle", "egg", "wool_ball"],
    itemsNeeded: { milk_bottle: 3, egg: 5, wool_ball: 3 },
    rewards: { gold: 80, experience: 25 },
    image: "🐄"
  }
};

export const LEVELS_DATA = [
  { level: 1, experienceRequired: 0 },
  { level: 2, experienceRequired: 100 },
  { level: 3, experienceRequired: 300 },
  { level: 4, experienceRequired: 600 },
  { level: 5, experienceRequired: 1000 },
  { level: 6, experienceRequired: 1500 },
  { level: 7, experienceRequired: 2200 },
  { level: 8, experienceRequired: 3000 },
  { level: 9, experienceRequired: 4000 },
  { level: 10, experienceRequired: 5500 },
];

// Helper functions
export function getCropData(cropId) {
  return CROPS_DATA[cropId];
}

export function getAnimalData(animalId) {
  return ANIMALS_DATA[animalId];
}

export function getTerritoryData(territoryId) {
  return TERRITORY_DATA[territoryId];
}

export function getPestData(pestId) {
  return PESTS_DATA[pestId];
}

export function getCollectionData(collectionId) {
  return COLLECTIONS_DATA[collectionId];
}

export function canAfford(resources, cost) {
  for (const [resource, amount] of Object.entries(cost)) {
    if ((resources[resource] || 0) < amount) {
      return false;
    }
  }
  return true;
}

export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}с`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}м`;
  } else {
    return `${Math.floor(seconds / 3600)}ч ${Math.floor((seconds % 3600) / 60)}м`;
  }
}