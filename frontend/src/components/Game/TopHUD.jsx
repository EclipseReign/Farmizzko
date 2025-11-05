import React from 'react';
import { Coins, Trees, Mountain, Drumstick, Star, User } from 'lucide-react';
import { Progress } from '../ui/progress';

const TopHUD = ({ user, resources, level, experienceToNext }) => {
  const experiencePercentage = (resources.experience / experienceToNext) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white shadow-lg z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left - Player Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-lg">
            <User className="w-5 h-5" />
            <span className="font-bold text-lg">{user.username}</span>
          </div>
          
          <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-lg min-w-[200px]">
            <Star className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Уровень {level}</span>
                <span className="text-xs text-amber-200">{resources.experience} / {experienceToNext}</span>
              </div>
              <Progress value={experiencePercentage} className="h-2 bg-black/30" />
            </div>
          </div>
        </div>

        {/* Center - Resources */}
        <div className="flex items-center gap-4">
          <ResourceItem icon={<Coins className="w-5 h-5" />} value={resources.gold} label="Золото" color="text-yellow-300" />
          <ResourceItem icon={<Trees className="w-5 h-5" />} value={resources.wood} label="Дерево" color="text-amber-300" />
          <ResourceItem icon={<Mountain className="w-5 h-5" />} value={resources.stone} label="Камень" color="text-gray-300" />
          <ResourceItem icon={<Drumstick className="w-5 h-5" />} value={resources.food} label="Еда" color="text-orange-300" />
        </div>

        {/* Right - Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">🤠</span>
          <div>
            <div className="font-bold text-xl">Дикий Запад</div>
            <div className="text-xs text-amber-200">Новые земли</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceItem = ({ icon, value, label, color }) => (
  <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg min-w-[120px]">
    <div className={color}>{icon}</div>
    <div>
      <div className="font-bold text-lg">{value}</div>
      <div className="text-xs text-amber-200">{label}</div>
    </div>
  </div>
);

export default TopHUD;
