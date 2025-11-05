import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Coins, Trees, Mountain, Clock } from 'lucide-react';
import { BUILDINGS } from '../../mockData';

const BuildingListModal = ({ isOpen, onClose, onBuildStart, resources, playerLevel }) => {
  const canAfford = (building) => {
    return Object.entries(building.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );
  };

  const isUnlocked = (building) => {
    return playerLevel >= building.level;
  };

  const renderResourceCost = (cost) => {
    const icons = {
      gold: <Coins className="w-4 h-4" />,
      wood: <Trees className="w-4 h-4" />,
      stone: <Mountain className="w-4 h-4" />
    };

    return (
      <div className="flex gap-2 flex-wrap">
        {Object.entries(cost).map(([resource, amount]) => (
          <div key={resource} className="flex items-center gap-1 text-sm">
            {icons[resource]}
            <span className={resources[resource] >= amount ? 'text-green-600' : 'text-red-600'}>
              {amount}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-600">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900">
            🏗️ Строительство зданий
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {BUILDINGS.map((building) => {
              const unlocked = isUnlocked(building);
              const affordable = canAfford(building);

              return (
                <div
                  key={building.id}
                  className={`
                    bg-white rounded-lg p-4 border-2 transition-all duration-200
                    ${!unlocked ? 'opacity-50 grayscale border-gray-300' : 'border-amber-300 hover:border-amber-500 hover:shadow-lg'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-5xl">{building.image}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-amber-900">{building.name}</h3>
                        {!unlocked && (
                          <Badge variant="secondary" className="bg-gray-300">Lvl {building.level}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{building.description}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        {renderResourceCost(building.cost)}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{building.time}s</span>
                        </div>
                      </div>

                      {Object.keys(building.production).length > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          Производит: {Object.entries(building.production).map(([k, v]) => `+${v} ${k}`).join(', ')}
                        </div>
                      )}

                      <Button
                        className="w-full mt-2"
                        disabled={!unlocked || !affordable}
                        onClick={() => {
                          onBuildStart(building);
                          onClose();
                        }}
                        variant={affordable && unlocked ? "default" : "secondary"}
                      >
                        Построить
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingListModal;
