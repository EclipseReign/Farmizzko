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
  energy: 100,
  experience: 0
};

// CROPS DATA - All available crops
export const CROPS_DATA = {
  wheat: {
    id: 'wheat',
    name: 'Пшеница',
    description: 'Быстрорастущая культура',
    cost: { gold: 10 },
    grow_time: 60,  // seconds
    wither_time: 300,
    yield: { food: 20, gold: 5 },
    experience: 5,
    level_required: 1,
    image: '🌾'
  },
  carrot: {
    id: 'carrot',
    name: 'Морковь',
    description: 'Быстрорастущая',
    cost: { gold: 15 },
    grow_time: 90,
    wither_time: 300,
    yield: { food: 25 },
    experience: 7,
    level_required: 1,
    image: '🥕'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Подсолнух',
    description: 'Яркие цветы, привлекают бабочек',
    cost: { gold: 25 },
    grow_time: 150,
    wither_time: 600,
    yield: { food: 15, gold: 10 },
    experience: 8,
    level_required: 1,
    butterflies: true,
    image: '🌻'
  },
  rose: {
    id: 'rose',
    name: 'Роза',
    description: 'Привлекает бабочек',
    cost: { gold: 30 },
    grow_time: 180,
    wither_time: 600,
    yield: { gold: 15 },
    experience: 10,
    level_required: 2,
    butterflies: true,
    image: '🌹'
  },
  corn: {
    id: 'corn',
    name: 'Кукуруза',
    description: 'Универсальная культура',
    cost: { gold: 40 },
    grow_time: 240,
    wither_time: 600,
    yield: { food: 35, gold: 15 },
    experience: 12,
    level_required: 2,
    image: '🌽'
  },
  echinacea: {
    id: 'echinacea',
    name: 'Эхинацея',
    description: 'Дает много еды при сборе',
    cost: { gold: 50 },
    grow_time: 300,
    wither_time: 600,
    yield: { food: 48 },
    experience: 15,
    level_required: 3,
    image: '🌺'
  },
  melon: {
    id: 'melon',
    name: 'Дыня',
    description: 'Коллекция дает защиту от засухи',
    cost: { gold: 75 },
    grow_time: 600,
    wither_time: 900,
    yield: { food: 30, gold: 20 },
    experience: 25,
    level_required: 4,
    image: '🍉'
  },
  ginger: {
    id: 'ginger',
    name: 'Имбирь',
    description: 'Прибыльная культура',
    cost: { gold: 100 },
    grow_time: 1080,
    wither_time: 1200,
    yield: { gold: 300 },
    experience: 50,
    level_required: 5,
    image: '🫚'
  }
};

// ANIMALS DATA - All available animals
export const ANIMALS_DATA = {
  chicken: {
    id: 'chicken',
    name: 'Курица',
    description: 'Несет яйца',
    cost: { gold: 100, wood: 30 },
    adult_age: 180,  // 3 minutes
    production_interval: 300,  // 5 minutes
    production_yield: { food: 15, gold: 5 },
    feed_cost: { food: 5 },
    experience: 10,
    level_required: 1,
    image: '🐔'
  },
  sheep: {
    id: 'sheep',
    name: 'Овца',
    description: 'Дает шерсть',
    cost: { gold: 150, wood: 40 },
    adult_age: 240,
    production_interval: 480,
    production_yield: { wood: 15, gold: 8 },
    feed_cost: { food: 8 },
    experience: 15,
    level_required: 2,
    image: '🐑'
  },
  goat: {
    id: 'goat',
    name: 'Коза',
    description: 'Дает молоко и шерсть',
    cost: { gold: 160, wood: 35 },
    adult_age: 210,
    production_interval: 420,
    production_yield: { food: 12, wood: 8, gold: 7 },
    feed_cost: { food: 7 },
    experience: 14,
    level_required: 2,
    image: '🐐'
  },
  pig: {
    id: 'pig',
    name: 'Свинья',
    description: 'Дает мясо',
    cost: { gold: 180, wood: 45 },
    adult_age: 270,
    production_interval: 540,
    production_yield: { food: 30, gold: 12 },
    feed_cost: { food: 12 },
    experience: 18,
    level_required: 3,
    image: '🐷'
  },
  cow: {
    id: 'cow',
    name: 'Корова',
    description: 'Дает молоко',
    cost: { gold: 200, wood: 50 },
    adult_age: 300,
    production_interval: 600,
    production_yield: { food: 20, gold: 10 },
    feed_cost: { food: 10 },
    experience: 20,
    level_required: 3,
    image: '🐄'
  },
  horse: {
    id: 'horse',
    name: 'Лошадь',
    description: 'Ускоряет перемещение',
    cost: { gold: 300, wood: 100 },
    adult_age: 360,
    production_interval: 0,  // doesn't produce
    production_yield: {},
    feed_cost: { food: 15 },
    experience: 30,
    level_required: 5,
    image: '🐴'
  }
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
