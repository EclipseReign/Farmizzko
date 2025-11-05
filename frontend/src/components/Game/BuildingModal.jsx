import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Clock, ArrowUp } from 'lucide-react';

const BuildingModal = ({ building, isOpen, onClose, onCollect, onUpgrade }) => {
  if (!building) return null;
  
  const canCollect = building.status === 'built' && building.readyToCollect;
  const isBuilding = building.status === 'building';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={building.name || 'Здание'}>
      <div className="space-y-4">
        {/* Building Image/Icon */}
        <div className="text-6xl text-center">
          {building.image || '🏠'}
        </div>
        
        {/* Status */}
        <div className="text-center">
          {isBuilding ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Идет строительство...</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${building.progress || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{Math.round(building.progress || 0)}%</p>
            </div>
          ) : canCollect ? (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <p className="font-semibold">Готово к сбору!</p>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <Clock className="w-4 h-4 inline mr-1" />
              Производство...
            </div>
          )}
        </div>
        
        {/* Production Info */}
        {building.production && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-semibold mb-2">Производство:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(building.production).map(([resource, amount]) => (
                <div key={resource} className="text-sm">
                  <span className="font-medium">{resource}:</span> +{amount}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          {canCollect && (
            <Button 
              className="flex-1" 
              onClick={() => {
                onCollect(building.id);
                onClose();
              }}
            >
              Собрать ресурсы
            </Button>
          )}
          {!isBuilding && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onUpgrade(building.id)}
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Улучшить (скоро)
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BuildingModal;
