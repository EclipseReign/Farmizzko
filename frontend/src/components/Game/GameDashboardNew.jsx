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
import { LEVELS } from '../../mockData';
import { toast } from '../../hooks/use-toast';
import { player, buildings as buildingsApi, quests as questsApi, market as marketApi } from '../../services/api';

const GameDashboard = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState(initialUser);
  const [resources, setResources] = useState(initialUser.resources);
  const [buildings, setBuildings] = useState([]);
  const [quests, setQuests] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(initialUser.level);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [buildListModalOpen, setBuildListModalOpen] = useState(false);
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [marketModalOpen, setMarketModalOpen] = useState(false);

  // Load game data from backend
  const loadGameData = useCallback(async () => {
    try {
      const [profileData, buildingsData, questsData] = await Promise.all([
        player.getProfile(),
        buildingsApi.getAll(),
        questsApi.getAll()
      ]);
      
      setUser(profileData);
      setResources(profileData.resources);
      setPlayerLevel(profileData.level);
      setBuildings(buildingsData);
      setQuests(questsData);
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

    const newResources = { ...resources };
    
    // Deduct cost
    Object.entries(item.cost).forEach(([resource, amount]) => {
      newResources[resource] -= amount;
    });
    
    // Add rewards
    Object.entries(item.rewards).forEach(([resource, amount]) => {
      newResources[resource] = (newResources[resource] || 0) + amount;
    });
    
    setResources(newResources);

    toast({
      title: 'Покупка совершена!',
      description: `Вы получили: ${Object.entries(item.rewards).map(([k, v]) => `${v} ${k}`).join(', ')}`,
    });
  };

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    setBuildingModalOpen(true);
  };

  const handleCellClick = (cellKey) => {
    // Open building selection modal when clicking empty cell
    setBuildListModalOpen(true);
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
        onOpenMarket={() => setMarketModalOpen(true)}
        onOpenQuests={() => setQuestModalOpen(true)}
        questsAvailable={questsAvailable}
      />

      {/* Main Game Map */}
      <div className="absolute top-[80px] bottom-[80px] left-0 right-0">
        <IsometricMap
          buildings={buildings}
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
    </div>
  );


export default GameDashboard;