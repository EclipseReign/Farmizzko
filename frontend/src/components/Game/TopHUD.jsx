import React from 'react';
import { Coins, Trees, Mountain, Drumstick, Star, User, Zap } from 'lucide-react';
import { Progress } from '../ui/progress';

const TopHUD = ({ user, resources, level, experienceToNext }) => {
  const experiencePercentage = (resources.experience / experienceToNext) * 100;
  const energy = resources.energy || 0;
  const maxEnergy = user.max_energy || 100;
  const energyPercentage = (energy / maxEnergy) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Wooden plank background */}
      <div className="relative bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 shadow-2xl border-b-4 border-amber-950">
        {/* Wood texture overlay */}
        <div className="absolute inset-0 wood-texture opacity-40" />
        
        {/* Decorative rope border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-950 to-transparent" />
        
        <div className="relative flex items-center justify-between px-6 py-3">
          {/* Left - Player Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gradient-to-br from-amber-950/80 to-amber-900/80 px-4 py-2 rounded-lg border-2 border-amber-700/50 shadow-lg backdrop-blur-sm">
              <User className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-lg font-western text-yellow-100">{user.username}</span>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-br from-amber-950/80 to-amber-900/80 px-4 py-2 rounded-lg border-2 border-yellow-600/50 shadow-lg min-w-[220px] backdrop-blur-sm">
              <Star className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold font-western text-yellow-100">Уровень {level}</span>
                  <span className="text-xs text-yellow-200/80">{resources.experience} / {experienceToNext}</span>
                </div>
                <div className="h-2 bg-amber-950/50 rounded-full overflow-hidden border border-yellow-700/30">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500 shadow-inner"
                    style={{ width: `${experiencePercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-br from-amber-950/80 to-amber-900/80 px-4 py-2 rounded-lg border-2 border-cyan-600/50 shadow-lg min-w-[170px] backdrop-blur-sm">
              <Zap className="w-5 h-5 text-cyan-400 drop-shadow-lg" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm font-western text-cyan-100">Энергия</span>
                  <span className="text-xs text-cyan-200/80">{energy} / {maxEnergy}</span>
                </div>
                <div className="h-2 bg-amber-950/50 rounded-full overflow-hidden border border-cyan-700/30">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500 shadow-inner"
                    style={{ width: `${energyPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center - Resources */}
          <div className="flex items-center gap-3">
            <ResourceItem 
              icon={<Coins className="w-5 h-5" />} 
              value={resources.gold} 
              label="Золото" 
              color="text-yellow-300" 
              bgColor="from-yellow-900/80 to-yellow-800/80" 
              borderColor="border-yellow-600/50" 
            />
            <ResourceItem 
              icon={<Trees className="w-5 h-5" />} 
              value={resources.wood} 
              label="Дерево" 
              color="text-amber-300" 
              bgColor="from-amber-900/80 to-amber-800/80" 
              borderColor="border-amber-600/50" 
            />
            <ResourceItem 
              icon={<Mountain className="w-5 h-5" />} 
              value={resources.stone} 
              label="Камень" 
              color="text-gray-300" 
              bgColor="from-gray-800/80 to-gray-700/80" 
              borderColor="border-gray-600/50" 
            />
            <ResourceItem 
              icon={<Drumstick className="w-5 h-5" />} 
              value={resources.food} 
              label="Еда" 
              color="text-orange-300" 
              bgColor="from-orange-900/80 to-orange-800/80" 
              borderColor="border-orange-600/50" 
            />
          </div>

          {/* Right - Logo */}
          <div className="flex items-center gap-3 bg-gradient-to-br from-amber-950/80 to-amber-900/80 px-5 py-3 rounded-lg border-2 border-amber-700/50 shadow-lg backdrop-blur-sm">
            <span className="text-4xl drop-shadow-lg">🤠</span>
            <div>
              <div className="font-bold text-xl font-western text-yellow-100 drop-shadow-md">Дикий Запад</div>
              <div className="text-xs text-amber-200/80 font-western italic">Новые земли</div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-950 via-yellow-800 to-amber-950 opacity-50" />
      </div>
    </div>
  );
};

const ResourceItem = ({ icon, value, label, color, bgColor, borderColor }) => (
  <div className={`flex items-center gap-3 bg-gradient-to-br ${bgColor} px-4 py-2.5 rounded-lg border-2 ${borderColor} shadow-lg min-w-[130px] backdrop-blur-sm transition-all duration-200 hover:scale-105`}>
    <div className={`${color} drop-shadow-md`}>{icon}</div>
    <div>
      <div className="font-bold text-xl font-western text-white drop-shadow-md">{value.toLocaleString()}</div>
      <div className="text-xs text-amber-200/90 font-western">{label}</div>
    </div>
  </div>
);

export default TopHUD;