import React from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Coins, Trees, Mountain, Drumstick, Star } from 'lucide-react';

const ResourcePanel = ({ resources, level, experienceToNext }) => {
  const resourceIcons = {
    gold: <Coins className="w-5 h-5" />,
    wood: <Trees className="w-5 h-5" />,
    stone: <Mountain className="w-5 h-5" />,
    food: <Drumstick className="w-5 h-5" />
  };

  const experiencePercentage = (resources.experience / experienceToNext) * 100;

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg">
      <div className="p-4">
        {/* Level and Experience */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-600" />
              <span className="font-bold text-lg text-amber-900">Уровень {level}</span>
            </div>
            <span className="text-sm text-amber-700">
              {resources.experience} / {experienceToNext} XP
            </span>
          </div>
          <Progress value={experiencePercentage} className="h-3" />
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(resources).map(([key, value]) => {
            if (key === 'experience') return null;
            return (
              <div 
                key={key}
                className="flex items-center gap-2 bg-white rounded-lg p-3 border border-amber-200 hover:border-amber-400 transition-colors"
              >
                <div className="text-amber-700">
                  {resourceIcons[key]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 capitalize">{key}</span>
                  <span className="font-bold text-amber-900">{value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ResourcePanel;
