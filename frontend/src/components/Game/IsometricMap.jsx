import React, { useState, useRef, useEffect } from 'react';
import { toast } from '../../hooks/use-toast';

const IsometricMap = ({ buildings = [], crops = [], animals = [], onBuildingClick, onCellClick }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const gridRows = 12;
  const gridCols = 16;
  const tileWidth = 120;
  const tileHeight = 60;

  // Convert grid coordinates to isometric screen coordinates
  const gridToIso = (row, col) => {
    const x = (col - row) * (tileWidth / 2);
    const y = (col + row) * (tileHeight / 2);
    return { x, y };
  };

  // Convert screen coordinates to grid coordinates
  const isoToGrid = (x, y) => {
    const col = Math.floor((x / (tileWidth / 2) + y / (tileHeight / 2)) / 2);
    const row = Math.floor((y / (tileHeight / 2) - x / (tileWidth / 2)) / 2);
    return { row, col };
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (dragStart) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  const handleCellClick = (row, col, e) => {
    if (!dragStart) {
      const cellKey = `${row}-${col}`;
      onCellClick(cellKey);
    }
  };

  useEffect(() => {
    // Center the map initially
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOffset({
        x: rect.width / 2 - (gridCols * tileWidth) / 4,
        y: 100
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-move select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        background: 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
        backgroundImage: `
          linear-gradient(45deg, rgba(0,0,0,.05) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(0,0,0,.05) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(0,0,0,.05) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(0,0,0,.05) 75%)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
      }}
    >
      <div
        className="relative"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          width: gridCols * tileWidth,
          height: gridRows * tileHeight
        }}
      >
        {/* Render grid tiles */}
        {Array.from({ length: gridRows * gridCols }).map((_, index) => {
          const row = Math.floor(index / gridCols);
          const col = index % gridCols;
          const cellKey = `${row}-${col}`;
          const building = buildings.find(b => b.position === cellKey);
          const crop = crops.find(c => c.position === cellKey);
          const animal = animals.find(a => a.position === cellKey);
          const hasObject = building || crop || animal;
          const isHovered = hoveredCell === cellKey;
          const pos = gridToIso(row, col);

          return (
            <div
              key={cellKey}
              className="absolute transition-all duration-150"
              style={{
                left: pos.x + (gridCols * tileWidth) / 2,
                top: pos.y,
                width: tileWidth,
                height: tileHeight,
                zIndex: row + col
              }}
              onMouseEnter={() => setHoveredCell(cellKey)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={(e) => handleCellClick(row, col, e)}
            >
              {/* Isometric tile */}
              <svg
                width={tileWidth}
                height={tileHeight}
                viewBox="0 0 120 60"
                className="absolute"
              >
                <polygon
                  points="60,0 120,30 60,60 0,30"
                  fill={hasObject ? '#d97706' : '#4ade80'}
                  stroke={isHovered ? '#fbbf24' : '#22c55e'}
                  strokeWidth="2"
                  className="transition-all duration-150"
                  style={{
                    filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                    cursor: 'pointer'
                  }}
                />
              </svg>

              {/* Building */}
              {building && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 hover:scale-110"
                  style={{ zIndex: 1000 + row + col }}
                >
                  <div className="relative">
                    <div className="text-6xl drop-shadow-lg">{building.image}</div>
                    
                    {building.status === 'building' && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${building.progress || 0}%` }}
                        />
                      </div>
                    )}
                    
                    {building.readyToCollect && (
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-bold">!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Crop */}
              {crop && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 hover:scale-110"
                  style={{ zIndex: 1000 + row + col }}
                >
                  <div className="relative">
                    <div className="text-5xl drop-shadow-lg">
                      {crop.image}
                    </div>
                    
                    {/* Crop growth stages */}
                    {crop.status === 'growing' && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${crop.growth_progress || 0}%` }}
                        />
                      </div>
                    )}
                    
                    {crop.status === 'ready' && (
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}
                    
                    {crop.status === 'withered' && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💀</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Animal */}
              {animal && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 hover:scale-110"
                  style={{ zIndex: 1000 + row + col }}
                >
                  <div className="relative">
                    <div className="text-5xl drop-shadow-lg">
                      {animal.image}
                    </div>
                    
                    {/* Animal growth */}
                    {animal.status === 'growing' && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${animal.progress || 0}%` }}
                        />
                      </div>
                    )}
                    
                    {(animal.status === 'adult' || animal.status === 'producing') && animal.canProduce && (
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                    )}
                    
                    {animal.needs_feeding && (
                      <div className="absolute -top-3 -left-3 w-6 h-6 bg-orange-500 rounded-full animate-bounce flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs">🍖</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IsometricMap;
