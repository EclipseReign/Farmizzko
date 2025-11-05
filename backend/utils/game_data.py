# Game data definitions - buildings, crops, animals, etc.

BUILDINGS_DATA = {
    'saloon': {
        'id': 'saloon',
        'name': 'Салун',
        'description': 'Место отдыха ковбоев',
        'cost': {'gold': 100, 'wood': 50, 'stone': 30},
        'production': {'gold': 10},
        'time': 30,
        'level': 1,
        'image': '🏚️'
    },
    'mine': {
        'id': 'mine',
        'name': 'Шахта',
        'description': 'Добыча золота',
        'cost': {'gold': 200, 'wood': 100, 'stone': 150},
        'production': {'gold': 50},
        'time': 60,
        'level': 2,
        'image': '⛏️'
    },
    'sawmill': {
        'id': 'sawmill',
        'name': 'Лесопилка',
        'description': 'Производство древесины',
        'cost': {'gold': 150, 'wood': 50, 'stone': 50},
        'production': {'wood': 30},
        'time': 45,
        'level': 1,
        'image': '🪵'
    },
    'quarry': {
        'id': 'quarry',
        'name': 'Каменоломня',
        'description': 'Добыча камня',
        'cost': {'gold': 180, 'wood': 80, 'stone': 50},
        'production': {'stone': 40},
        'time': 50,
        'level': 2,
        'image': '🗿'
    },
    'ranch': {
        'id': 'ranch',
        'name': 'Ранчо',
        'description': 'Разведение скота',
        'cost': {'gold': 250, 'wood': 150, 'stone': 100},
        'production': {'food': 50},
        'time': 90,
        'level': 3,
        'image': '🐄'
    },
    'bank': {
        'id': 'bank',
        'name': 'Банк',
        'description': 'Хранение золота',
        'cost': {'gold': 500, 'wood': 200, 'stone': 300},
        'production': {'gold': 100},
        'time': 120,
        'level': 5,
        'image': '🏦'
    },
    'sheriff': {
        'id': 'sheriff',
        'name': 'Шериф',
        'description': 'Защита города',
        'cost': {'gold': 300, 'wood': 100, 'stone': 200},
        'production': {},
        'time': 75,
        'level': 4,
        'image': '⭐'
    },
    'hotel': {
        'id': 'hotel',
        'name': 'Отель',
        'description': 'Размещение жителей',
        'cost': {'gold': 400, 'wood': 250, 'stone': 150},
        'production': {'gold': 75},
        'time': 100,
        'level': 5,
        'image': '🏨'
    }
}

QUESTS_DATA = [
    {
        'id': 'quest1',
        'title': 'Добро пожаловать на Дикий Запад',
        'description': 'Постройте свой первый салун',
        'requirements': {'buildings': ['saloon'], 'resources': {}},
        'rewards': {'gold': 100, 'experience': 50},
        'level_required': 1
    },
    {
        'id': 'quest2',
        'title': 'Золотая лихорадка',
        'description': 'Постройте шахту и добудьте 1000 золота',
        'requirements': {'buildings': ['mine'], 'resources': {'gold': 1000}},
        'rewards': {'gold': 200, 'experience': 100},
        'level_required': 2
    },
    {
        'id': 'quest3',
        'title': 'Лесоруб',
        'description': 'Постройте лесопилку и соберите 500 дерева',
        'requirements': {'buildings': ['sawmill'], 'resources': {'wood': 500}},
        'rewards': {'gold': 150, 'experience': 75},
        'level_required': 1
    },
    {
        'id': 'quest4',
        'title': 'Каменный век',
        'description': 'Постройте каменоломню',
        'requirements': {'buildings': ['quarry'], 'resources': {}},
        'rewards': {'gold': 180, 'stone': 100, 'experience': 80},
        'level_required': 2
    },
    {
        'id': 'quest5',
        'title': 'Ранчеро',
        'description': 'Постройте ранчо и накормите город',
        'requirements': {'buildings': ['ranch'], 'resources': {'food': 200}},
        'rewards': {'gold': 300, 'experience': 150},
        'level_required': 3
    }
]

MARKET_ITEMS = [
    {
        'id': 'wood_pack',
        'name': 'Пакет дерева',
        'description': '100 единиц дерева',
        'cost': {'gold': 50},
        'rewards': {'wood': 100}
    },
    {
        'id': 'stone_pack',
        'name': 'Пакет камня',
        'description': '100 единиц камня',
        'cost': {'gold': 75},
        'rewards': {'stone': 100}
    },
    {
        'id': 'food_pack',
        'name': 'Пакет еды',
        'description': '100 единиц еды',
        'cost': {'gold': 60},
        'rewards': {'food': 100}
    },
    {
        'id': 'gold_pack',
        'name': 'Сундук золота',
        'description': '500 золота',
        'cost': {'wood': 200, 'stone': 150},
        'rewards': {'gold': 500}
    }
]
