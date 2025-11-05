import React, { useState, useEffect } from 'react';
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
import { INITIAL_RESOURCES, QUESTS, LEVELS } from '../../mockData';
import { toast } from '../../hooks/use-toast';

const GameDashboard = ({ user, onLogout }) => {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [buildings, setBuildings] = useState([]);
  const [quests, setQuests] = useState(QUESTS);
  const [playerLevel, setPlayerLevel] = useState(1);
  
  // Modal states
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [buildListModalOpen, setBuildListModalOpen] = useState(false);
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [marketModalOpen, setMarketModalOpen] = useState(false);

  // Calculate current level based on experience
  useEffect(() => {
    const currentLevel = LEVELS.reduce((level, l) => {
      if (resources.experience >= l.experienceRequired) {
        return l.level;
      }
      return level;
    }, 1);
    setPlayerLevel(currentLevel);
  }, [resources.experience]);

  // Check quest completion
  useEffect(() => {
    const updatedQuests = quests.map(quest => {
      if (quest.completed || quest.claimed) return quest;

      let isCompleted = true;

      // Check building requirements
      if (quest.requirements.buildings) {
        isCompleted = quest.requirements.buildings.every(buildingType =>
          buildings.some(b => b.type === buildingType && b.status === 'built')
        );
      }

      // Check resource requirements
      if (isCompleted && quest.requirements.resources) {
        isCompleted = Object.entries(quest.requirements.resources).every(
          ([resource, amount]) => resources[resource] >= amount
        );
      }

      return { ...quest, completed: isCompleted };
    });

    setQuests(updatedQuests);
  }, [buildings, resources]);

  // Building construction timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings(prevBuildings => {
        return prevBuildings.map(building => {
          if (building.status === 'building') {
            const elapsed = Date.now() - building.startTime;
            const progress = Math.min((elapsed / (building.buildTime * 1000)) * 100, 100);
            
            if (progress >= 100) {
              toast({
                title: 'Строительство завершено!',
                description: `${building.name} готово к использованию`,
              });
              return {
                ...building,
                status: 'built',
                progress: 100,
                lastCollectTime: Date.now(),
                readyToCollect: false
              };
            }
            
            return { ...building, progress };
          }
          return building;
        });
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Resource production timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings(prevBuildings => {
        return prevBuildings.map(building => {
          if (building.status === 'built' && building.production && Object.keys(building.production).length > 0) {
            const timeSinceCollect = Date.now() - (building.lastCollectTime || Date.now());
            const productionInterval = 60000; // 1 minute
            
            if (timeSinceCollect >= productionInterval && !building.readyToCollect) {
              return { ...building, readyToCollect: true };
            }
          }
          return building;
        });
      });
    }, 1000);

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

  const handleBuildStart = (buildingData) => {
    // Check if player can afford
    const canAfford = Object.entries(buildingData.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );

    if (!canAfford) {
      toast({
        title: 'Недостаточно ресурсов',
        description: 'У вас недостаточно ресурсов для строительства',
        variant: 'destructive'
      });
      return;
    }

    // Deduct resources
    const newResources = { ...resources };
    Object.entries(buildingData.cost).forEach(([resource, amount]) => {
      newResources[resource] -= amount;
    });
    setResources(newResources);

    // Add building to map
    const newBuilding = {
      id: `${buildingData.id}-${Date.now()}`,
      type: buildingData.id,
      name: buildingData.name,
      image: buildingData.image,
      position: findEmptyCell(),
      status: 'building',
      progress: 0,
      buildTime: buildingData.time,
      startTime: Date.now(),
      production: buildingData.production,
      readyToCollect: false
    };

    setBuildings([...buildings, newBuilding]);
    
    toast({
      title: 'Строительство начато',
      description: `${buildingData.name} будет готово через ${buildingData.time} секунд`,
    });
  };

  const handleCollect = (buildingId) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building || !building.readyToCollect) return;

    const newResources = { ...resources };
    Object.entries(building.production).forEach(([resource, amount]) => {
      newResources[resource] = (newResources[resource] || 0) + amount;
    });
    setResources(newResources);

    setBuildings(buildings.map(b => 
      b.id === buildingId 
        ? { ...b, readyToCollect: false, lastCollectTime: Date.now() }
        : b
    ));

    toast({
      title: 'Ресурсы собраны!',
      description: Object.entries(building.production).map(([k, v]) => `+${v} ${k}`).join(', '),
    });
  };

  const handleClaimReward = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    const newResources = { ...resources };
    Object.entries(quest.rewards).forEach(([resource, amount]) => {
      newResources[resource] = (newResources[resource] || 0) + amount;
    });
    setResources(newResources);

    setQuests(quests.map(q => 
      q.id === questId ? { ...q, claimed: true } : q
    ));

    toast({
      title: 'Награда получена!',
      description: Object.entries(quest.rewards).map(([k, v]) => `+${v} ${k}`).join(', '),
    });
  };

  const handlePurchase = (item) => {
    const canAfford = Object.entries(item.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );

    if (!canAfford) {
      toast({
        title: 'Недостаточно ресурсов',
        description: 'У вас недостаточно ресурсов для покупки',
        variant: 'destructive'
      });
      return;
    }

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
};

export default GameDashboard;