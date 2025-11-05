import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ShoppingCart, Coins, Trees, Mountain, Drumstick } from 'lucide-react';
import { MARKET_ITEMS } from '../../mockData';

const MarketPanel = ({ onPurchase, resources }) => {
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
    <Card className="h-full border-2 border-amber-300">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
        <CardTitle className="text-amber-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Рынок
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {MARKET_ITEMS.map((item) => {
              const affordable = canAfford(item);
              
              return (
                <Card 
                  key={item.id}
                  className="transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-amber-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Стоимость:</div>
                        <div className="flex gap-2">
                          {Object.entries(item.cost).map(([resource, amount]) => (
                            <div key={resource} className="flex items-center gap-1">
                              {resourceIcons[resource]}
                              <span className={`text-sm ${resources[resource] >= amount ? 'text-green-600' : 'text-red-600'}`}>
                                {amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Получите:</div>
                        <div className="flex gap-2">
                          {Object.entries(item.rewards).map(([resource, amount]) => (
                            <div key={resource} className="flex items-center gap-1">
                              {resourceIcons[resource]}
                              <span className="text-sm text-green-600">+{amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      disabled={!affordable}
                      onClick={() => onPurchase(item)}
                      variant={affordable ? "default" : "secondary"}
                    >
                      Купить
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MarketPanel;
