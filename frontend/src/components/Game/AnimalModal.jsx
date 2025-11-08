import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { ANIMALS } from '../../mockData';

const AnimalModal = ({ isOpen, onClose, onAdd, resources, playerLevel, position }) => {
  const canAfford = (animal) => {
    return resources.gold >= animal.cost.gold && 
           resources.wood >= (animal.cost.wood || 0) &&
           resources.food >= (animal.cost.food || 0);
  };

  const isUnlocked = (animal) => animal.unlockLevel <= playerLevel;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🐄 Добавить животное">
      <div className="grid grid-cols-2 gap-4 p-4 max-h-[500px] overflow-y-auto">
        {ANIMALS.map((animal) => {
          const affordable = canAfford(animal);
          const unlocked = isUnlocked(animal);
          
          return (
            <div
              key={animal.id}
              className={`
                bg-gradient-to-br from-blue-50 to-cyan-50 
                border-4 rounded-lg p-4 transition-all duration-200
                ${
                  unlocked && affordable
                    ? 'border-blue-600 hover:scale-105 hover:shadow-xl cursor-pointer'
                    : 'border-gray-400 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => {
                if (unlocked && affordable) {
                  onAdd(animal.id, position);
                  onClose();
                }
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-5xl mb-2">{animal.image}</div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-blue-900">{animal.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{animal.description}</p>
                </div>
                
                <div className="w-full space-y-1 text-xs">
                  <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded">
                    <span className="font-semibold">Время роста:</span>
                    <span className="text-green-700">{animal.growTime} мин</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded">
                    <span className="font-semibold">Производство:</span>
                    <span className="text-purple-700">{animal.production.food || 0}🍖 {animal.production.gold || 0}💰</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded">
                    <span className="font-semibold">Стоимость:</span>
                    <span className={affordable ? 'text-green-700' : 'text-red-600 font-bold'}>
                      {animal.cost.gold}💰 {animal.cost.food || 0}🍖
                    </span>
                  </div>
                </div>
                
                {!unlocked && (
                  <div className="mt-2 text-xs text-red-600 font-bold">
                    🔒 Требуется уровень {animal.unlockLevel}
                  </div>
                )}
                
                <Button
                  disabled={!unlocked || !affordable}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (unlocked && affordable) {
                      onAdd(animal.id, position);
                      onClose();
                    }
                  }}
                >
                  Добавить
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

export default AnimalModal;
