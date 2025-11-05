import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Sprout, Clock, Droplet } from 'lucide-react';
import { CROPS_DATA } from '../../mockData';

const CropModal = ({ isOpen, onClose, onPlant, resources, playerLevel, position, location = 'main' }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  const handlePlant = () => {
    if (selectedCrop) {
      onPlant(selectedCrop.id, position, location);
      onClose();
    }
  };
  
  const canAfford = (crop) => {
    return Object.entries(crop.cost).every(([resource, amount]) => 
      resources[resource] >= amount
    );
  };
  
  const availableCrops = Object.values(CROPS_DATA).filter(
    crop => crop.level_required <= playerLevel
  );
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Посадить растение">
      <div className="space-y-4">
        {/* Crop Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {availableCrops.map((crop) => {
            const affordable = canAfford(crop);
            const isSelected = selectedCrop?.id === crop.id;
            
            return (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                disabled={!affordable}
                className={`
                  p-3 rounded-lg border-2 transition-all text-left
                  ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
                  ${!affordable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-3xl mb-2">{crop.image}</div>
                <h3 className="font-semibold text-sm">{crop.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{crop.description}</p>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.floor(crop.grow_time / 60)}м {crop.grow_time % 60}с
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(crop.cost).map(([resource, amount]) => (
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
        
        {/* Selected Crop Details */}
        {selectedCrop && (
          <div className="border-t pt-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-semibold mb-2">При сборе получите:</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(selectedCrop.yield).map(([resource, amount]) => (
                  <span key={resource} className="text-sm bg-white px-2 py-1 rounded">
                    +{amount} {resource}
                  </span>
                ))}
                <span className="text-sm bg-yellow-100 px-2 py-1 rounded">
                  +{selectedCrop.experience} опыта
                </span>
              </div>
              
              {selectedCrop.butterflies && (
                <p className="text-xs text-blue-600 mt-2">
                  🦋 При сборе появляются бабочки!
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Action */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button 
            onClick={handlePlant}
            disabled={!selectedCrop || !canAfford(selectedCrop)}
            className="flex-1"
          >
            <Sprout className="w-4 h-4 mr-2" />
            Посадить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CropModal;
