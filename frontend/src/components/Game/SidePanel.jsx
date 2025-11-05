import React from 'react';
import { Button } from '../ui/button';
import { Hammer, ShoppingCart, Target, Gift } from 'lucide-react';
import { Badge } from '../ui/badge';

const SidePanel = ({ onOpenBuilding, onOpenMarket, onOpenQuests, questsAvailable }) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      <PanelButton 
        icon={<Hammer className="w-6 h-6" />} 
        label="Строить"
        onClick={onOpenBuilding}
      />
      <PanelButton 
        icon={<ShoppingCart className="w-6 h-6" />} 
        label="Рынок"
        onClick={onOpenMarket}
      />
      <PanelButton 
        icon={<Target className="w-6 h-6" />} 
        label="Задания"
        onClick={onOpenQuests}
        badge={questsAvailable}
      />
      <PanelButton 
        icon={<Gift className="w-6 h-6" />} 
        label="Награды"
      />
    </div>
  );
};

const PanelButton = ({ icon, label, onClick, badge }) => (
  <div className="relative group">
    <Button
      className="w-16 h-16 rounded-full bg-amber-700 hover:bg-amber-600 shadow-xl border-4 border-amber-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
      onClick={onClick}
    >
      {icon}
    </Button>
    {badge > 0 && (
      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-2">
        {badge}
      </Badge>
    )}
    <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
      {label}
    </div>
  </div>
);

export default SidePanel;
