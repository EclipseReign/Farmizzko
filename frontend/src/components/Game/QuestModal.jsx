import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { CheckCircle, Circle, Gift } from 'lucide-react';

const QuestModal = ({ isOpen, onClose, quests, onClaimReward }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Квесты" className="max-w-3xl">
      <div className="space-y-4">
        {quests && quests.length > 0 ? (
          quests.map((quest) => {
            const isCompleted = quest.completed;
            const isClaimed = quest.claimed;
            
            return (
              <div 
                key={quest.id} 
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${isClaimed ? 'bg-gray-100 border-gray-300' : 
                    isCompleted ? 'bg-green-50 border-green-400' : 
                    'bg-white border-gray-200'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {isClaimed ? (
                      <CheckCircle className="w-6 h-6 text-gray-400" />
                    ) : isCompleted ? (
                      <Gift className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{quest.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                    
                    {/* Requirements */}
                    {quest.requirements && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-semibold text-gray-500">Требования:</p>
                        {quest.requirements.buildings && (
                          <p className="text-xs text-gray-600">
                            Постройки: {quest.requirements.buildings.join(', ')}
                          </p>
                        )}
                        {quest.requirements.resources && (
                          <div className="flex gap-2 flex-wrap">
                            {Object.entries(quest.requirements.resources).map(([resource, amount]) => (
                              <span key={resource} className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {resource}: {amount}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Rewards */}
                    {quest.rewards && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-500">Награды:</p>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {Object.entries(quest.rewards).map(([resource, amount]) => (
                            <span key={resource} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                              +{amount} {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <div>
                    {isCompleted && !isClaimed && (
                      <Button 
                        size="sm"
                        onClick={() => onClaimReward(quest.id)}
                      >
                        Получить
                      </Button>
                    )}
                    {isClaimed && (
                      <span className="text-xs text-gray-500">Выполнено</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Нет доступных квестов</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuestModal;
