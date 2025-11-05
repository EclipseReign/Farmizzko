import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '../../hooks/use-toast';

const GameMap = ({ buildings, onBuild, onCollect, playerLevel }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Create a 10x8 grid for the game map
  const gridRows = 8;
  const gridCols = 10;

  const handleCellClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    const building = buildings.find(b => b.position === cellKey);
    
    if (building) {
      if (building.status === 'built' && building.readyToCollect) {
        onCollect(building.id);
      }
    }
    setSelectedCell(cellKey);
  };

  const getCellContent = (row, col) => {
    const cellKey = `${row}-${col}`;
    const building = buildings.find(b => b.position === cellKey);
    
    if (building) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-4xl transform hover:scale-110 transition-transform cursor-pointer">
            {building.image}
          </div>
          {building.status === 'building' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded">
              <div 
                className="h-full bg-amber-500 rounded transition-all duration-500"
                style={{ width: `${building.progress || 0}%` }}
              />
            </div>
          )}
          {building.readyToCollect && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse flex items-center justify-center text-white text-xs font-bold">
              !
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative">
        {/* Isometric grid */}
        <div className="grid gap-1" style={{ 
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          transform: 'rotateX(60deg) rotateZ(45deg)',
          transformStyle: 'preserve-3d'
        }}>
          {Array.from({ length: gridRows * gridCols }).map((_, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            const cellKey = `${row}-${col}`;
            const building = buildings.find(b => b.position === cellKey);
            const isHovered = hoveredCell === cellKey;
            const isSelected = selectedCell === cellKey;
            
            return (
              <div
                key={cellKey}
                onClick={() => handleCellClick(row, col)}
                onMouseEnter={() => setHoveredCell(cellKey)}
                onMouseLeave={() => setHoveredCell(null)}
                className={`
                  w-16 h-16 border-2 transition-all duration-200 cursor-pointer
                  ${building ? 'bg-amber-200 border-amber-400' : 'bg-green-100 border-green-300'}
                  ${isHovered ? 'border-yellow-500 scale-105 z-10' : ''}
                  ${isSelected ? 'border-blue-500 border-4' : ''}
                `}
                style={{
                  transform: isHovered ? 'rotateX(-60deg) rotateZ(-45deg) translateZ(10px)' : 'rotateX(-60deg) rotateZ(-45deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div style={{ transform: 'rotateZ(-45deg) rotateX(-60deg)' }}>
                  {getCellContent(row, col)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameMap;
