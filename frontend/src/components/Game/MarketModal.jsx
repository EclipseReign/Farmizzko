import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ShoppingCart, Coins, Trees, Mountain, Drumstick } from 'lucide-react';
import { MARKET_ITEMS } from '../../mockData';

const MarketModal = ({ isOpen, onClose, onPurchase, resources }) => {
  const canAfford = (item) => {
    return Object.entries(item.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );
  };

  const resourceIcons = {
    gold: <Coins className="w-4 h-4" />,
    wood: <Trees className="w-4 h-4" />,
    stone: <Mountain className="w-4 h-4" />,
    food: <Drumstick className="w-4 h-4" />
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-600">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Рынок и торговля
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {MARKET_ITEMS.map((item) => {
              const affordable = canAfford(item);
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 border-2 border-amber-300 hover:border-amber-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-amber-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 font-medium">Стоимость:</div>
                        <div className="flex gap-2">
                          {Object.entries(item.cost).map(([resource, amount]) => (
                            <div key={resource} className="flex items-center gap-1">
                              {resourceIcons[resource]}
                              <span className={`text-sm font-bold ${resources[resource] >= amount ? 'text-green-600' : 'text-red-600'}`}>
                                {amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 font-medium">Получите:</div>
                        <div className="flex gap-2">
                          {Object.entries(item.rewards).map(([resource, amount]) => (
                            <div key={resource} className="flex items-center gap-1">
                              {resourceIcons[resource]}
                              <span className="text-sm font-bold text-green-600">+{amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      disabled={!affordable}
                      onClick={() => {
                        onPurchase(item);
                      }}
                      variant={affordable ? "default" : "secondary"}
                    >
                      Купить
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MarketModal;
