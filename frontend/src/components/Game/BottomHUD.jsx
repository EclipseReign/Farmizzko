import React from 'react';
import { Button } from '../ui/button';
import { Users, Map, Briefcase, Settings, HelpCircle, Home } from 'lucide-react';

const BottomHUD = ({ onOpenFriends, onOpenMap, onOpenInventory, onOpenSettings }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 shadow-lg z-50">
      <div className="flex items-center justify-center gap-2 px-6 py-3">
        <HUDButton icon={<Home className="w-6 h-6" />} label="Главная" active />
        <HUDButton icon={<Users className="w-6 h-6" />} label="Друзья" onClick={onOpenFriends} />
        <HUDButton icon={<Map className="w-6 h-6" />} label="Карта мира" onClick={onOpenMap} />
        <HUDButton icon={<Briefcase className="w-6 h-6" />} label="Инвентарь" onClick={onOpenInventory} />
        <HUDButton icon={<Settings className="w-6 h-6" />} label="Настройки" onClick={onOpenSettings} />
        <HUDButton icon={<HelpCircle className="w-6 h-6" />} label="Помощь" />
      </div>
    </div>
  );
};

const HUDButton = ({ icon, label, active, onClick }) => (
  <Button
    variant="ghost"
    className={`
      flex flex-col items-center gap-1 px-6 py-3 h-auto
      ${active 
        ? 'bg-amber-700 text-white hover:bg-amber-700' 
        : 'text-amber-100 hover:bg-amber-800 hover:text-white'
      }
      transition-all duration-200
    `}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Button>
);

export default BottomHUD;
