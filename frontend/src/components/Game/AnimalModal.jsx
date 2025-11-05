import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Plus, Clock } from 'lucide-react';
import { ANIMALS_DATA } from '../../mockData';

const AnimalModal = ({ isOpen, onClose, onAdd, resources, playerLevel, position, location = 'main' }) => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  
  const handleAdd = () => {
    if (selectedAnimal) {
      onAdd(selectedAnimal.id, position, location);
      onClose();
    }
  };
  
  const canAfford = (animal) => {
    return Object.entries(animal.cost).every(([resource, amount]) => 
      resources[resource] >= amount
    );
  };
  
  const availableAnimals = Object.values(ANIMALS_DATA).filter(
    animal => animal.level_required <= playerLevel
  );
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить животное">
      <div className="space-y-4">
        {/* Animal Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {availableAnimals.map((animal) => {
            const affordable = canAfford(animal);
            const isSelected = selectedAnimal?.id === animal.id;
            
            return (
              <button
                key={animal.id}
                onClick={() => setSelectedAnimal(animal)}
                disabled={!affordable}
                className={`
                  p-3 rounded-lg border-2 transition-all text-left
                  ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  ${!affordable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-3xl mb-2">{animal.image}</div>
                <h3 className="font-semibold text-sm">{animal.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{animal.description}</p>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Взрослый: {Math.floor(animal.adult_age / 60)}м
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(animal.cost).map(([resource, amount]) => (
                      <span key={resource} className="text-xs bg-gray-200 px-1 rounded">
                        {amount} {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Selected Animal Details */}
        {selectedAnimal && (
          <div className="border-t pt-4">
            <div className="bg-purple-50 p-3 rounded-lg space-y-2">
              <div>
                <p className="text-sm font-semibold mb-1">Производство:</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(selectedAnimal.production_yield).map(([resource, amount]) => (
                    <span key={resource} className="text-sm bg-white px-2 py-1 rounded">
                      +{amount} {resource}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Каждые {Math.floor(selectedAnimal.production_interval / 60)} минут
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold mb-1">Кормление:</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(selectedAnimal.feed_cost).map(([resource, amount]) => (
                    <span key={resource} className="text-sm bg-orange-100 px-2 py-1 rounded">
                      {amount} {resource}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={!selectedAnimal || !canAfford(selectedAnimal)}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AnimalModal;
