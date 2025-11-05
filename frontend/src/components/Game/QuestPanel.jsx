import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { CheckCircle2, Circle, Gift } from 'lucide-react';

const QuestPanel = ({ quests, onClaimReward }) => {
  return (
    <Card className="h-full border-2 border-amber-300">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
        <CardTitle className="text-amber-900 flex items-center gap-2">
          🎯 Задания
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {quests.map((quest) => (
              <Card 
                key={quest.id}
                className={`
                  transition-all duration-200
                  ${quest.completed ? 'bg-green-50 border-green-300' : 'bg-white border-amber-200'}
                `}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {quest.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-900">{quest.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Gift className="w-4 h-4" />
                    <span>Награда: {Object.entries(quest.rewards).map(([k, v]) => `${v} ${k}`).join(', ')}</span>
                  </div>

                  {quest.completed && !quest.claimed && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => onClaimReward(quest.id)}
                    >
                      Получить награду
                    </Button>
                  )}
                  
                  {quest.claimed && (
                    <Badge className="w-full justify-center bg-gray-200 text-gray-700">
                      Выполнено
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QuestPanel;
