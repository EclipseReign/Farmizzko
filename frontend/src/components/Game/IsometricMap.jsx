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
      className="w-full h-full overflow-hidden cursor-move select-none relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        background: 'radial-gradient(ellipse at center, #b8dba5 0%, #8eb677 40%, #6b904f 100%)',
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,.03) 10px,
            rgba(255,255,255,.03) 20px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,.03) 10px,
            rgba(0,0,0,.03) 20px
          )
        `
      }}
    >
      {/* Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>
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
                <defs>
                  <linearGradient id={`grassGrad-${cellKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: hasObject ? '#c2822f' : '#7ec850', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: hasObject ? '#a86f23' : '#6ab53e', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: hasObject ? '#8b5a1e' : '#5a9e33', stopOpacity: 1 }} />
                  </linearGradient>
                  <pattern id={`grassPattern-${cellKey}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.1)" />
                    <circle cx="6" cy="6" r="0.5" fill="rgba(0,0,0,0.1)" />
                  </pattern>
                </defs>
                <polygon
                  points="60,0 120,30 60,60 0,30"
                  fill={`url(#grassGrad-${cellKey})`}
                  stroke={isHovered ? '#fbbf24' : hasObject ? '#8b5a1e' : '#4a873d'}
                  strokeWidth="2"
                  className="transition-all duration-150"
                  style={{
                    filter: isHovered ? 'brightness(1.3) drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' : 'brightness(1)',
                    cursor: 'pointer'
                  }}
                />
                <polygon
                  points="60,0 120,30 60,60 0,30"
                  fill={`url(#grassPattern-${cellKey})`}
                  className="pointer-events-none"
                />
                {/* Highlight border when hovered */}
                {isHovered && (
                  <polygon
                    points="60,0 120,30 60,60 0,30"
                    fill="none"
                    stroke="#ffd700"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                )}
              </svg>

              {/* Building */}
              {building && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 cursor-pointer"
                  style={{ zIndex: 1000 + row + col }}
                >
                  <div className="relative building-shadow">
                    {/* Building emoji */}
                    <div className="text-6xl drop-shadow-2xl transform hover:rotate-3 transition-transform duration-200">
                      {building.image}
                    </div>
                    
                    {/* Construction progress */}
                    {building.status === 'building' && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20">
                        <div className="bg-gradient-to-r from-amber-900 to-amber-800 rounded-full p-0.5 shadow-lg">
                          <div className="h-2.5 bg-amber-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 relative"
                              style={{ width: `${building.progress || 0}%` }}
                            >
                              <div className="absolute inset-0 bg-white/30 animate-pulse" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-0.5 text-xs font-bold text-amber-900 drop-shadow-sm">
                          {Math.round(building.progress || 0)}%
                        </div>
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
