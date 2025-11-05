# Game data definitions for Wild West farming game

# CROPS DATA - All available crops with their properties
CROPS_DATA = {
    "wheat": {
        "id": "wheat",
        "name": "Пшеница",
        "description": "Быстрорастущая культура",
        "cost": {"gold": 10},
        "grow_time": 60,  # seconds
        "wither_time": 300,  # seconds after ready
        "yield": {"food": 20, "gold": 5},
        "experience": 5,
        "level_required": 1,
        "collection_drops": ["wheat_seed", "straw"],
        "image": "🌾"
    },
    "echinacea": {
        "id": "echinacea",
        "name": "Эхинацея",
        "description": "Дает много еды при сборе",
        "cost": {"gold": 50},
        "grow_time": 300,  # 5 minutes
        "wither_time": 600,
        "yield": {"food": 48},
        "experience": 15,
        "level_required": 3,
        "collection_drops": ["echinacea_flower", "purple_petal"],
        "image": "🌺"
    },
    "ginger": {
        "id": "ginger",
        "name": "Имбирь",
        "description": "Прибыльная культура",
        "cost": {"gold": 100},
        "grow_time": 1080,  # 18 minutes (simulated as 18 hours)
        "wither_time": 1200,
        "yield": {"gold": 300},
        "experience": 50,
        "level_required": 5,
        "collection_drops": ["ginger_root", "spice"],
        "image": "🫚"
    },
    "melon": {
        "id": "melon",
        "name": "Дыня",
        "description": "Коллекция дает защиту от засухи",
        "cost": {"gold": 75},
        "grow_time": 600,  # 10 minutes
        "wither_time": 900,
        "yield": {"food": 30, "gold": 20},
        "experience": 25,
        "level_required": 4,
        "collection_drops": ["melon_slice", "sweet_seed", "juicy_fruit"],
        "image": "🍉"
    },
    "rose": {
        "id": "rose",
        "name": "Роза",
        "description": "Привлекает бабочек",
        "cost": {"gold": 30},
        "grow_time": 180,  # 3 minutes
        "wither_time": 600,
        "yield": {"gold": 15},
        "experience": 10,
        "level_required": 2,
        "collection_drops": ["rose_petal", "thorn"],
        "butterflies": True,
        "image": "🌹"
    },
    "sunflower": {
        "id": "sunflower",
        "name": "Подсолнух",
        "description": "Яркие цветы, привлекают бабочек",
        "cost": {"gold": 25},
        "grow_time": 150,  # 2.5 minutes
        "wither_time": 600,
        "yield": {"food": 15, "gold": 10},
        "experience": 8,
        "level_required": 1,
        "collection_drops": ["sunflower_seed", "yellow_petal"],
        "butterflies": True,
        "image": "🌻"
    },
    "corn": {
        "id": "corn",
        "name": "Кукуруза",
        "description": "Универсальная культура",
        "cost": {"gold": 40},
        "grow_time": 240,  # 4 minutes
        "wither_time": 600,
        "yield": {"food": 35, "gold": 15},
        "experience": 12,
        "level_required": 2,
        "collection_drops": ["corn_cob", "golden_kernel"],
        "image": "🌽"
    },
    "carrot": {
        "id": "carrot",
        "name": "Морковь",
        "description": "Быстрорастущая",
        "cost": {"gold": 15},
        "grow_time": 90,  # 1.5 minutes
        "wither_time": 300,
        "yield": {"food": 25},
        "experience": 7,
        "level_required": 1,
        "collection_drops": ["carrot_top", "orange_root"],
        "image": "🥕"
    }
}

# ANIMALS DATA - All available animals
ANIMALS_DATA = {
    "cow": {
        "id": "cow",
        "name": "Корова",
        "description": "Дает молоко",
        "cost": {"gold": 200, "wood": 50},
        "adult_age": 300,  # 5 minutes
        "production_interval": 600,  # 10 minutes
        "production_yield": {"food": 20, "gold": 10},
        "feed_cost": {"food": 10},
        "experience": 20,
        "level_required": 3,
        "collection_drops": ["milk_bottle", "cow_hide"],
        "image": "🐄"
    },
    "sheep": {
        "id": "sheep",
        "name": "Овца",
        "description": "Дает шерсть",
        "cost": {"gold": 150, "wood": 40},
        "adult_age": 240,  # 4 minutes
        "production_interval": 480,  # 8 minutes
        "production_yield": {"wood": 15, "gold": 8},
        "feed_cost": {"food": 8},
        "experience": 15,
        "level_required": 2,
        "collection_drops": ["wool_ball", "sheep_fur"],
        "image": "🐑"
    },
    "chicken": {
        "id": "chicken",
        "name": "Курица",
        "description": "Несет яйца",
        "cost": {"gold": 100, "wood": 30},
        "adult_age": 180,  # 3 minutes
        "production_interval": 300,  # 5 minutes
        "production_yield": {"food": 15, "gold": 5},
        "feed_cost": {"food": 5},
        "experience": 10,
        "level_required": 1,
        "collection_drops": ["egg", "feather"],
        "image": "🐔"
    },
    "pig": {
        "id": "pig",
        "name": "Свинья",
        "description": "Дает мясо",
        "cost": {"gold": 180, "wood": 45},
        "adult_age": 270,  # 4.5 minutes
        "production_interval": 540,  # 9 minutes
        "production_yield": {"food": 30, "gold": 12},
        "feed_cost": {"food": 12},
        "experience": 18,
        "level_required": 3,
        "collection_drops": ["pork_chop", "pig_skin"],
        "image": "🐷"
    },
    "horse": {
        "id": "horse",
        "name": "Лошадь",
        "description": "Ускоряет перемещение",
        "cost": {"gold": 300, "wood": 100},
        "adult_age": 360,  # 6 minutes
        "production_interval": 0,  # doesn't produce
        "production_yield": {},
        "feed_cost": {"food": 15},
        "experience": 30,
        "level_required": 5,
        "collection_drops": ["horseshoe", "mane_hair"],
        "image": "🐴"
    },
    "goat": {
        "id": "goat",
        "name": "Коза",
        "description": "Дает молоко и шерсть",
        "cost": {"gold": 160, "wood": 35},
        "adult_age": 210,  # 3.5 minutes
        "production_interval": 420,  # 7 minutes
        "production_yield": {"food": 12, "wood": 8, "gold": 7},
        "feed_cost": {"food": 7},
        "experience": 14,
        "level_required": 2,
        "collection_drops": ["goat_milk", "goat_fur"],
        "image": "🐐"
    }
}

# TERRITORY DATA - Elements to clear
TERRITORY_DATA = {
    "grass": {
        "id": "grass",
        "name": "Трава",
        "description": "Расчистите для посадки",
        "clear_cost": {"energy": 1},
        "clear_time": 5,  # seconds
        "rewards": {"gold": 2},
        "experience": 1,
        "pest_chance": {"snake": 0.1},  # 10% chance of snake
        "image": "🌿"
    },
    "stone": {
        "id": "stone",
        "name": "Камень",
        "description": "Требует больше энергии",
        "clear_cost": {"energy": 3},
        "clear_time": 10,
        "rewards": {"stone": 5, "gold": 5},
        "experience": 3,
        "pest_chance": {"snake": 0.15},
        "image": "🪨"
    },
    "tree": {
        "id": "tree",
        "name": "Дерево",
        "description": "Дает древесину",
        "clear_cost": {"energy": 5},
        "clear_time": 15,
        "rewards": {"wood": 10, "gold": 8},
        "experience": 5,
        "pest_chance": {},
        "image": "🌳"
    },
    "bush": {
        "id": "bush",
        "name": "Куст",
        "description": "Небольшое препятствие",
        "clear_cost": {"energy": 2},
        "clear_time": 7,
        "rewards": {"wood": 3, "gold": 3},
        "experience": 2,
        "pest_chance": {"snake": 0.12},
        "image": "🌳"
    },
    "pine": {
        "id": "pine",
        "name": "Ель",
        "description": "Взрослая ель, может появиться медведь",
        "clear_cost": {"energy": 6},
        "clear_time": 20,
        "rewards": {"wood": 15, "gold": 10},
        "experience": 7,
        "pest_chance": {"bear": 0.25},
        "image": "🌲"
    },
    "cedar": {
        "id": "cedar",
        "name": "Кедр",
        "description": "Взрослый кедр, может появиться кабан",
        "clear_cost": {"energy": 7},
        "clear_time": 25,
        "rewards": {"wood": 20, "stone": 5, "gold": 12},
        "experience": 9,
        "pest_chance": {"boar": 0.3},
        "image": "🌲"
    },
    "skeleton": {
        "id": "skeleton",
        "name": "Скелет",
        "description": "Древние останки",
        "clear_cost": {"energy": 4},
        "clear_time": 12,
        "rewards": {"gold": 15, "agrobucks": 1},
        "experience": 6,
        "pest_chance": {"snake": 0.2},
        "image": "💀"
    }
}

# PESTS DATA - Creatures that appear
PESTS_DATA = {
    "wolf": {
        "id": "wolf",
        "name": "Волк",
        "description": "Опасный хищник",
        "chase_cost": {"energy": 5},
        "chase_time": 10,
        "rewards": {"totem_material": 1, "gold": 20},
        "experience": 10,
        "image": "🐺"
    },
    "bear": {
        "id": "bear",
        "name": "Медведь",
        "description": "Появляется при рубке елей и сосен",
        "chase_cost": {"energy": 7},
        "chase_time": 15,
        "rewards": {"totem_material": 2, "gold": 30},
        "experience": 15,
        "image": "🐻"
    },
    "boar": {
        "id": "boar",
        "name": "Кабан",
        "description": "Появляется при рубке кедров",
        "chase_cost": {"energy": 6},
        "chase_time": 12,
        "rewards": {"totem_material": 1, "gold": 25, "food": 10},
        "experience": 12,
        "image": "🐗"
    },
    "snake": {
        "id": "snake",
        "name": "Змея",
        "description": "Появляется при уборке зарослей",
        "chase_cost": {"energy": 3},
        "chase_time": 8,
        "rewards": {"totem_material": 1, "gold": 15},
        "experience": 8,
        "image": "🐍"
    },
    "mole": {
        "id": "mole",
        "name": "Крот",
        "description": "Портит посевы",
        "chase_cost": {"energy": 4},
        "chase_time": 9,
        "rewards": {"totem_material": 1, "gold": 18},
        "experience": 9,
        "image": "🦫"
    }
}

# COLLECTIONS DATA - Collection sets
COLLECTIONS_DATA = {
    "wheat_collection": {
        "id": "wheat_collection",
        "name": "Коллекция пшеницы",
        "items": ["wheat_seed", "straw", "golden_grain"],
        "items_needed": {"wheat_seed": 5, "straw": 3, "golden_grain": 2},
        "rewards": {"gold": 50, "experience": 20},
        "image": "🌾"
    },
    "melon_collection": {
        "id": "melon_collection",
        "name": "Коллекция дыни",
        "items": ["melon_slice", "sweet_seed", "juicy_fruit"],
        "items_needed": {"melon_slice": 4, "sweet_seed": 3, "juicy_fruit": 3},
        "rewards": {"drought_protection": 1},
        "description": "Дает защиту от засухи",
        "image": "🍉"
    },
    "flower_collection": {
        "id": "flower_collection",
        "name": "Коллекция цветов",
        "items": ["rose_petal", "yellow_petal", "purple_petal"],
        "items_needed": {"rose_petal": 5, "yellow_petal": 5, "purple_petal": 5},
        "rewards": {"gold": 100, "experience": 30, "agrobucks": 1},
        "image": "🌸"
    },
    "animal_collection": {
        "id": "animal_collection",
        "name": "Коллекция животноводства",
        "items": ["milk_bottle", "egg", "wool_ball"],
        "items_needed": {"milk_bottle": 3, "egg": 5, "wool_ball": 3},
        "rewards": {"gold": 80, "experience": 25},
        "image": "🐄"
    }
}

# SPECIAL BUILDINGS DATA
SPECIAL_BUILDINGS_DATA = {
    "greenhouse": {
        "id": "greenhouse",
        "name": "Теплица",
        "description": "Ускоряет рост на 30%, защищает от увядания",
        "cost": {"gold": 500, "wood": 200, "stone": 150},
        "build_time": 180,  # 3 minutes
        "capacity": 9,  # 3x3 grid
        "speed_bonus": 0.3,  # 30% faster growth
        "level_required": 3,
        "image": "🏡"
    },
    "pen": {
        "id": "pen",
        "name": "Загон",
        "description": "Ускоряет рост животных на 30%",
        "cost": {"gold": 600, "wood": 250, "stone": 100},
        "build_time": 200,
        "capacity": 6,  # 2x3 grid
        "speed_bonus": 0.3,
        "level_required": 4,
        "image": "🏗️"
    },
    "totem_workshop": {
        "id": "totem_workshop",
        "name": "Мастерская тотемов",
        "description": "Создает тотемы для мгновенного выращивания",
        "cost": {"gold": 800, "wood": 300, "stone": 200},
        "build_time": 240,
        "level_required": 5,
        "image": "🗿"
    },
    "coal_mine": {
        "id": "coal_mine",
        "name": "Угольная шахта",
        "description": "Добывает уголь для перемещения",
        "cost": {"gold": 700, "wood": 250, "stone": 300},
        "build_time": 220,
        "production_interval": 600,  # 10 minutes
        "production_yield": {"coal": 10},
        "level_required": 6,
        "image": "⛏️"
    },
    "weed_generator": {
        "id": "weed_generator",
        "name": "Генератор сорняков",
        "description": "Создает заросли для квестов",
        "cost": {"gold": 400, "wood": 150, "stone": 100},
        "build_time": 150,
        "level_required": 4,
        "image": "🌿"
    },
    "fountain_of_wishes": {
        "id": "fountain_of_wishes",
        "name": "Фонтан желаний",
        "description": "Обмен монет на сертификаты материалов",
        "cost": {"gold": 1000, "wood": 400, "stone": 300},
        "build_time": 300,
        "level_required": 7,
        "image": "⛲"
    },
    "witch_house": {
        "id": "witch_house",
        "name": "Дом ведьмы",
        "description": "Создает скелеты и зелья",
        "cost": {"gold": 900, "wood": 350, "stone": 250},
        "build_time": 280,
        "level_required": 8,
        "image": "🏚️"
    },
    "shaman_house": {
        "id": "shaman_house",
        "name": "Дом шамана",
        "description": "Создает талисманы перемещения",
        "cost": {"gold": 1200, "wood": 500, "stone": 400},
        "build_time": 320,
        "level_required": 9,
        "image": "🛖"
    }
}

# TOTEMS DATA
TOTEMS_DATA = {
    "crop_totem": {
        "id": "crop_totem",
        "name": "Тотем растений",
        "description": "Мгновенно выращивает 32 растения",
        "cost": {"totem_material": 10, "gold": 100},
        "capacity": 32,
        "type": "crop",
        "image": "🗿"
    },
    "animal_totem": {
        "id": "animal_totem",
        "name": "Тотем животных",
        "description": "Мгновенно выращивает животных",
        "cost": {"totem_material": 15, "gold": 150},
        "capacity_by_size": {
            "small": 32,  # chickens
            "medium": 16,  # sheep, goats
            "large": 8    # cows, horses
        },
        "type": "animal",
        "image": "🗿"
    },
    "tree_totem": {
        "id": "tree_totem",
        "name": "Тотем деревьев",
        "description": "Мгновенно выращивает 32 дерева",
        "cost": {"totem_material": 12, "gold": 120},
        "capacity": 32,
        "type": "tree",
        "image": "🗿"
    },
    "grass_totem": {
        "id": "grass_totem",
        "name": "Тотем травы",
        "description": "Создает заросли травы",
        "cost": {"totem_material": 5, "gold": 50},
        "capacity": 50,
        "type": "grass",
        "image": "🗿"
    }
}

# LEVEL PROGRESSION
LEVELS_DATA = [
    {"level": 1, "experience_required": 0},
    {"level": 2, "experience_required": 100},
    {"level": 3, "experience_required": 300},
    {"level": 4, "experience_required": 600},
    {"level": 5, "experience_required": 1000},
    {"level": 6, "experience_required": 1500},
    {"level": 7, "experience_required": 2200},
    {"level": 8, "experience_required": 3000},
    {"level": 9, "experience_required": 4000},
    {"level": 10, "experience_required": 5500},
]