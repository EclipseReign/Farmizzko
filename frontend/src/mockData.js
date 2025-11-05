// Mock data for Wild West game

export const BUILDINGS = [
  {
    id: 'saloon',
    name: 'Салун',
    description: 'Место отдыха ковбоев',
    cost: { gold: 100, wood: 50, stone: 30 },
    production: { gold: 10 },
    time: 30,
    level: 1,
    image: '🏚️'
  },
  {
    id: 'mine',
    name: 'Шахта',
    description: 'Добыча золота',
    cost: { gold: 200, wood: 100, stone: 150 },
    production: { gold: 50 },
    time: 60,
    level: 2,
    image: '⛏️'
  },
  {
    id: 'sawmill',
    name: 'Лесопилка',
    description: 'Производство древесины',
    cost: { gold: 150, wood: 50, stone: 50 },
    production: { wood: 30 },
    time: 45,
    level: 1,
    image: '🪵'
  },
  {
    id: 'quarry',
    name: 'Каменоломня',
    description: 'Добыча камня',
    cost: { gold: 180, wood: 80, stone: 50 },
    production: { stone: 40 },
    time: 50,
    level: 2,
    image: '🗿'
  },
  {
    id: 'ranch',
    name: 'Ранчо',
    description: 'Разведение скота',
    cost: { gold: 250, wood: 150, stone: 100 },
    production: { food: 50 },
    time: 90,
    level: 3,
    image: '🐄'
  },
  {
    id: 'bank',
    name: 'Банк',
    description: 'Хранение золота',
    cost: { gold: 500, wood: 200, stone: 300 },
    production: { gold: 100 },
    time: 120,
    level: 5,
    image: '🏦'
  },
  {
    id: 'sheriff',
    name: 'Шериф',
    description: 'Защита города',
    cost: { gold: 300, wood: 100, stone: 200 },
    production: {},
    time: 75,
    level: 4,
    image: '⭐'
  },
  {
    id: 'hotel',
    name: 'Отель',
    description: 'Размещение жителей',
    cost: { gold: 400, wood: 250, stone: 150 },
    production: { gold: 75 },
    time: 100,
    level: 5,
    image: '🏨'
  }
];

export const INITIAL_RESOURCES = {
  gold: 500,
  wood: 200,
  stone: 150,
  food: 100,
  experience: 0
};

export const QUESTS = [
  {
    id: 'quest1',
    title: 'Добро пожаловать на Дикий Запад',
    description: 'Постройте свой первый салун',
    requirements: { buildings: ['saloon'] },
    rewards: { gold: 100, experience: 50 },
    completed: false
  },
  {
    id: 'quest2',
    title: 'Золотая лихорадка',
    description: 'Постройте шахту и добудьте 500 золота',
    requirements: { buildings: ['mine'], resources: { gold: 500 } },
    rewards: { gold: 200, experience: 100 },
    completed: false
  },
  {
    id: 'quest3',
    title: 'Лесоруб',
    description: 'Постройте лесопилку и соберите 300 дерева',
    requirements: { buildings: ['sawmill'], resources: { wood: 300 } },
    rewards: { gold: 150, experience: 75 },
    completed: false
  },
  {
    id: 'quest4',
    title: 'Каменный век',
    description: 'Постройте каменоломню',
    requirements: { buildings: ['quarry'] },
    rewards: { gold: 180, stone: 100, experience: 80 },
    completed: false
  },
  {
    id: 'quest5',
    title: 'Ранчеро',
    description: 'Постройте ранчо и накормите город',
    requirements: { buildings: ['ranch'], resources: { food: 200 } },
    rewards: { gold: 300, experience: 150 },
    completed: false
  }
];

export const MARKET_ITEMS = [
  {
    id: 'wood_pack',
    name: 'Пакет дерева',
    description: '100 единиц дерева',
    cost: { gold: 50 },
    rewards: { wood: 100 }
  },
  {
    id: 'stone_pack',
    name: 'Пакет камня',
    description: '100 единиц камня',
    cost: { gold: 75 },
    rewards: { stone: 100 }
  },
  {
    id: 'food_pack',
    name: 'Пакет еды',
    description: '100 единиц еды',
    cost: { gold: 60 },
    rewards: { food: 100 }
  },
  {
    id: 'gold_pack',
    name: 'Сундук золота',
    description: '500 золота',
    cost: { wood: 200, stone: 150 },
    rewards: { gold: 500 }
  },
  {
    id: 'premium_pack',
    name: 'Премиум пакет',
    description: 'Все ресурсы',
    cost: { gold: 1000 },
    rewards: { wood: 500, stone: 500, food: 500 }
  }
];

export const LEVELS = [
  { level: 1, experienceRequired: 0, unlocks: ['saloon', 'sawmill'] },
  { level: 2, experienceRequired: 100, unlocks: ['mine', 'quarry'] },
  { level: 3, experienceRequired: 300, unlocks: ['ranch'] },
  { level: 4, experienceRequired: 600, unlocks: ['sheriff'] },
  { level: 5, experienceRequired: 1000, unlocks: ['bank', 'hotel'] },
  { level: 6, experienceRequired: 1500, unlocks: [] },
  { level: 7, experienceRequired: 2200, unlocks: [] },
  { level: 8, experienceRequired: 3000, unlocks: [] },
  { level: 9, experienceRequired: 4000, unlocks: [] },
  { level: 10, experienceRequired: 5500, unlocks: [] }
];
