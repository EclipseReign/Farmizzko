import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { CROPS } from '../../mockData';

const CropModal = ({ isOpen, onClose, onPlant, resources, playerLevel, position }) => {
  const canAfford = (crop) => {
    return resources.gold >= crop.cost.gold && 
           resources.wood >= (crop.cost.wood || 0);
  };

  const isUnlocked = (crop) => crop.unlockLevel <= playerLevel;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🌾 Посадить растение">
      <div className="grid grid-cols-2 gap-4 p-4 max-h-[500px] overflow-y-auto">
        {CROPS.map((crop) => {
          const affordable = canAfford(crop);
          const unlocked = isUnlocked(crop);
          
          return (
            <div
              key={crop.id}
              className={`
                bg-gradient-to-br from-amber-50 to-orange-50 
                border-4 rounded-lg p-4 transition-all duration-200
                ${
                  unlocked && affordable
                    ? 'border-green-600 hover:scale-105 hover:shadow-xl cursor-pointer'
                    : 'border-gray-400 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => {
                if (unlocked && affordable) {
                  onPlant(crop.id, position);
                  onClose();
                }
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-5xl mb-2">{crop.image}</div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-amber-900">{crop.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{crop.description}</p>
                </div>
                
                <div className="w-full space-y-1 text-xs">
                  <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded">
                    <span className="font-semibold">Время:</span>
                    <span className="text-green-700">{crop.growTime} мин</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded">
                    <span className="font-semibold">Урожай:</span>
                    <span className="text-blue-700">{crop.yield.food}🍖 {crop.yield.gold}💰</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded">
                    <span className="font-semibold">Стоимость:</span>
                    <span className={affordable ? 'text-green-700' : 'text-red-600 font-bold'}>
                      {crop.cost.gold}💰
                    </span>
                  </div>
                </div>
                
                {!unlocked && (
                  <div className="mt-2 text-xs text-red-600 font-bold">
                    🔒 Требуется уровень {crop.unlockLevel}
                  </div>
                )}
                
                <Button
                  disabled={!unlocked || !affordable}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (unlocked && affordable) {
                      onPlant(crop.id, position);
                      onClose();
                    }
                  }}
                >
                  Посадить
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end gap-2 mt-4 px-4 pb-4">
        <Button variant="outline" onClick={onClose}>
          Закрыть
        </Button>
      </div>
    </Modal>
  );
};

export default CropModal;
