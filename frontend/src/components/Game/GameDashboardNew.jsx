import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import TopHUD from './TopHUD';
import BottomHUD from './BottomHUD';
import SidePanel from './SidePanel';
import IsometricMap from './IsometricMap';
import BuildingModal from './BuildingModal';
import BuildingListModal from './BuildingListModal';
import QuestModal from './QuestModal';
import MarketModal from './MarketModal';
import CropModal from './CropModal';
import AnimalModal from './AnimalModal';
import { LEVELS } from '../../mockData';
import { toast } from '../../hooks/use-toast';
import { player, buildings as buildingsApi, quests as questsApi, market as marketApi, crops as cropsApi, animals as animalsApi } from '../../services/api';

const GameDashboard = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState(initialUser);
  const [resources, setResources] = useState(initialUser.resources);
  const [buildings, setBuildings] = useState([]);
  const [crops, setCrops] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [quests, setQuests] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(initialUser.level);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  
  // Modal states
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [buildListModalOpen, setBuildListModalOpen] = useState(false);
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [marketModalOpen, setMarketModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [animalModalOpen, setAnimalModalOpen] = useState(false);

  // Load game data from backend
  const loadGameData = useCallback(async () => {
    try {
      const [profileData, buildingsData, questsData, cropsData, animalsData] = await Promise.all([
        player.getProfile(),
        buildingsApi.getAll(),
        questsApi.getAll(),
        cropsApi.getAll(),
        animalsApi.getAll()
      ]);
      
      setUser(profileData);
      setResources(profileData.resources);
      setPlayerLevel(profileData.level);
      setBuildings(buildingsData);
      setQuests(questsData);
      setCrops(cropsData);
      setAnimals(animalsData);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadGameData();
  }, [loadGameData]);
  
  // Calculate current level based on experience
  useEffect(() => {
    const currentLevel = LEVELS.reduce((level, l) => {
      if (user.experience >= l.experienceRequired) {
        return l.level;
      }
      return level;
    }, 1);
    setPlayerLevel(currentLevel);
  }, [user.experience]);

  // Building construction timer - check progress from server
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const buildingsData = await buildingsApi.getAll();
        setBuildings(prevBuildings => {
        // Check if any building completed
          prevBuildings.forEach(prevBuilding => {
            const newBuilding = buildingsData.find(b => b.id === prevBuilding.id);
            if (prevBuilding.status === 'building' && newBuilding && newBuilding.status === 'built') {
              toast({
                title: 'Строительство завершено!',
                description: `${newBuilding.name} готово к использованию`,
              });
              }
          });
          return buildingsData;
        });
      } catch (error) {
        console.error('Failed to update buildings:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getExperienceToNext = () => {
    const nextLevel = LEVELS.find(l => l.level === playerLevel + 1);
    return nextLevel ? nextLevel.experienceRequired : 10000;
  };

  const findEmptyCell = () => {
    const gridRows = 12;
    const gridCols = 16;
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellKey = `${row}-${col}`;
        if (!buildings.find(b => b.position === cellKey)) {
          return cellKey;
        }
      }
    }
    return '0-0';
  };

  const handleBuildStart = async (buildingData) => {
    try {
      const newBuilding = await buildingsApi.create(buildingData.id, findEmptyCell());
      
      // Reload data from server
      await loadGameData();
      
      toast({
        title: 'Строительство начато',
        description: `${buildingData.name} будет готово через ${buildingData.time} секунд`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
      }
  };

  const handleCollect = async (buildingId) => {
    try {
      const result = await buildingsApi.collect(buildingId);
      
      setResources(result.updatedResources);
      await loadGameData();

      toast({
        title: 'Ресурсы собраны!',
        description: Object.entries(result.collected).map(([k, v]) => `+${v} ${k}`).join(', '),
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleClaimReward = async (questId) => {
    try {
      const result = await questsApi.claim(questId);

      setResources(result.updatedResources);
      setPlayerLevel(result.level);
      await loadGameData();

      toast({
        title: 'Награда получена!',
        description: Object.entries(result.rewards).map(([k, v]) => `+${v} ${k}`).join(', '),
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handlePurchase = async (item) => {
    try {
      const result = await marketApi.purchase(item.id);
      
      setResources(result.updatedResources);
      await loadGameData();
      
      toast({
        title: 'Покупка совершена!',
        description: `Вы получили: ${Object.entries(result.purchased).map(([k, v]) => `${v} ${k}`).join(', ')}`,
      });
    } catch (error) {
      toast({
        title: 'Недостаточно ресурсов',
        description: 'У вас недостаточно ресурсов для покупки',
        variant: 'destructive'
      });
    }
  };
  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    setBuildingModalOpen(true);
  };

  const handleCellClick = (cellKey) => {
    // Check if cell is occupied
    const building = buildings.find(b => b.position === cellKey);
    const crop = crops.find(c => c.position === cellKey);
    const animal = animals.find(a => a.position === cellKey);
    
    if (building) {
      setSelectedBuilding(building);
      setBuildingModalOpen(true);
    } else if (crop) {
      handleCropClick(crop);
    } else if (animal) {
      handleAnimalClick(animal);
    } else {
      // Empty cell - show options
      setSelectedCell(cellKey);
      setBuildListModalOpen(true);
    }
  };

  const handleCropClick = async (crop) => {
    if (crop.status === 'ready') {
      // Harvest crop
      try {
        const result = await cropsApi.harvest(crop.id);
        await loadGameData();
        toast({
          title: '🌾 Урожай собран!',
          description: `+${result.yield?.food || 0} еды, +${result.yield?.gold || 0} золота`,
        });
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: error.message,
          variant: 'destructive'
        });
      }
    } else if (crop.status === 'withered') {
      // Remove withered crop
      if (confirm('Растение завяло. Удалить?')) {
        try {
          await cropsApi.remove(crop.id);
          await loadGameData();
          toast({ title: 'Увядшее растение убрано' });
        } catch (error) {
          toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
        }
      }
    }
  };

  const handleAnimalClick = async (animal) => {
    if (animal.canProduce) {
      // Collect production
      try {
        const result = await animalsApi.collect(animal.id);
        await loadGameData();
        toast({
          title: '🐄 Продукция собрана!',
          description: Object.entries(result.collected || {}).map(([k, v]) => `+${v} ${k}`).join(', '),
        });
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: error.message,
          variant: 'destructive'
        });
      }
    } else if (animal.status === 'adult' || animal.status === 'producing') {
      // Feed animal
      if (confirm(`Покормить ${animal.name}?`)) {
        try {
          await animalsApi.feed(animal.id);
          await loadGameData();
          toast({ title: `${animal.name} накормлено!` });
        } catch (error) {
          toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
        }
      }
    } else {
      toast({
        title: 'Животное растет',
        description: `Прогресс: ${Math.round(animal.progress || 0)}%`
      });
    }
  };

  const handlePlantCrop = async (cropType, position) => {
    try {
      await cropsApi.plant(cropType, position);
      await loadGameData();
      toast({
        title: '🌱 Растение посажено!',
        description: 'Ожидайте созревания...',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleAddAnimal = async (animalType, position) => {
    try {
      await animalsApi.add(animalType, position);
      await loadGameData();
      toast({
        title: '🐄 Животное добавлено!',
        description: 'Ожидайте взросления...',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const questsAvailable = quests.filter(q => q.completed && !q.claimed).length;

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
        <div className="text-white text-2xl">Загрузка игры...</div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-green-400 to-green-600">
      {/* Top HUD */}
      <TopHUD
        user={user}
        resources={resources}
        level={playerLevel}
        experienceToNext={getExperienceToNext()}
      />

      {/* Logout Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          className="bg-white/20 border-white/40 hover:bg-white/30 text-white backdrop-blur-sm"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>

      {/* Side Panel */}
      <SidePanel
        onOpenBuilding={() => setBuildListModalOpen(true)}
        onOpenCrops={() => {
          setSelectedCell(findEmptyCell());
          setCropModalOpen(true);
        }}
        onOpenAnimals={() => {
          setSelectedCell(findEmptyCell());
          setAnimalModalOpen(true);
        }}
        onOpenMarket={() => setMarketModalOpen(true)}
        onOpenQuests={() => setQuestModalOpen(true)}
        questsAvailable={questsAvailable}
      />

      {/* Main Game Map */}
      <div className="absolute top-[80px] bottom-[80px] left-0 right-0">
        <IsometricMap
          buildings={buildings}
          crops={crops}
          animals={animals}
          onBuildingClick={handleBuildingClick}
          onCellClick={handleCellClick}
        />
      </div>

      {/* Bottom HUD */}
      <BottomHUD
        onOpenFriends={() => toast({ title: 'Друзья', description: 'Функция в разработке' })}
        onOpenMap={() => toast({ title: 'Карта мира', description: 'Функция в разработке' })}
        onOpenInventory={() => toast({ title: 'Инвентарь', description: 'Функция в разработке' })}
        onOpenSettings={() => toast({ title: 'Настройки', description: 'Функция в разработке' })}
      />

      {/* Modals */}
      <BuildingModal
        building={selectedBuilding}
        isOpen={buildingModalOpen}
        onClose={() => setBuildingModalOpen(false)}
        onCollect={handleCollect}
        onUpgrade={() => toast({ title: 'Улучшение', description: 'Функция в разработке' })}
      />

      <BuildingListModal
        isOpen={buildListModalOpen}
        onClose={() => setBuildListModalOpen(false)}
        onBuildStart={handleBuildStart}
        resources={resources}
        playerLevel={playerLevel}
      />

      <QuestModal
        isOpen={questModalOpen}
        onClose={() => setQuestModalOpen(false)}
        quests={quests}
        onClaimReward={handleClaimReward}
      />

      <MarketModal
        isOpen={marketModalOpen}
        onClose={() => setMarketModalOpen(false)}
        onPurchase={handlePurchase}
        resources={resources}
      />
      <CropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onPlant={handlePlantCrop}
        resources={resources}
        playerLevel={playerLevel}
        position={selectedCell}
      />

      <AnimalModal
        isOpen={animalModalOpen}
        onClose={() => setAnimalModalOpen(false)}
        onAdd={handleAddAnimal}
        resources={resources}
        playerLevel={playerLevel}
        position={selectedCell}
      />
    </div>
  );
};

export default GameDashboard;