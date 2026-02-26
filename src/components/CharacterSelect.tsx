import { useState } from 'react';
import { TOONS } from '../data/characters';
import ToonRenderer from './ToonRenderer';

interface CharacterSelectProps {
  onSelect: (toonId: string) => void;
  onBack: () => void;
}

export default function CharacterSelect({ onSelect, onBack }: CharacterSelectProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedToon = TOONS.find(t => t.id === selectedId);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900 p-6">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Выбери своего Туна</h1>
        <p className="text-gray-400">Каждый персонаж обладает уникальными способностями</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Список персонажей */}
        <div className="flex-1 grid grid-cols-4 gap-4 overflow-y-auto p-2">
          {TOONS.map((toon) => (
            <button
              key={toon.id}
              onClick={() => setSelectedId(toon.id)}
              className={`relative p-4 rounded-xl transition-all transform hover:scale-105 ${
                selectedId === toon.id
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 ring-4 ring-yellow-400'
                  : 'bg-gray-800/50 hover:bg-gray-700/50'
              }`}
            >
              {/* Мейн бейдж */}
              {toon.isMain && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
                  MAIN
                </div>
              )}
              
              {/* Модель персонажа */}
              <div className="w-20 h-20 mx-auto mb-2">
                <ToonRenderer toonId={toon.id} size={80} />
              </div>
              
              <h3 className="text-white font-bold text-lg">{toon.name}</h3>
              
              {/* HP */}
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(toon.baseHealth)].map((_, i) => (
                  <span key={i} className="text-red-500">❤️</span>
                ))}
              </div>
              
              {/* Тип способности */}
              <div className={`text-xs mt-1 ${
                toon.ability.type === 'active' ? 'text-cyan-400' : 'text-green-400'
              }`}>
                {toon.ability.type === 'active' ? '⚡ Активная' : '🔄 Пассивная'}
              </div>
            </button>
          ))}
        </div>

        {/* Детали персонажа */}
        <div className="w-80 bg-gray-800/50 rounded-xl p-6 flex flex-col">
          {selectedToon ? (
            <>
              {/* Модель */}
              <div className="w-32 h-32 mx-auto mb-4">
                <ToonRenderer toonId={selectedToon.id} size={128} />
              </div>
              
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {selectedToon.name}
              </h2>
              
              <p className="text-gray-400 text-center mb-4">{selectedToon.description}</p>
              
              {/* Статы */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Здоровье:</span>
                  <div className="flex gap-1">
                    {[...Array(selectedToon.baseHealth)].map((_, i) => (
                      <span key={i}>❤️</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Скорость:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(selectedToon.speed / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-white text-sm">{selectedToon.speed}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Тип:</span>
                  <span className={selectedToon.isMain ? 'text-yellow-400' : 'text-gray-300'}>
                    {selectedToon.isMain ? '⭐ Мейн' : 'Обычный'}
                  </span>
                </div>
              </div>
              
              {/* Способность */}
              <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={selectedToon.ability.type === 'active' ? 'text-cyan-400' : 'text-green-400'}>
                    {selectedToon.ability.type === 'active' ? '⚡' : '🔄'}
                  </span>
                  <h3 className="text-white font-bold">{selectedToon.ability.name}</h3>
                </div>
                <p className="text-gray-400 text-sm">{selectedToon.ability.description}</p>
                {selectedToon.ability.cooldown > 0 && (
                  <p className="text-cyan-400 text-xs mt-2">
                    Перезарядка: {selectedToon.ability.cooldown} сек
                  </p>
                )}
              </div>
              
              {/* Кнопка выбора */}
              <button
                onClick={() => onSelect(selectedToon.id)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all transform hover:scale-105"
              >
                Выбрать {selectedToon.name}
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Выбери персонажа слева
            </div>
          )}
        </div>
      </div>

      {/* Кнопка назад */}
      <button
        onClick={onBack}
        className="mt-4 px-6 py-2 text-gray-400 hover:text-white transition-colors"
      >
        ← Назад в меню
      </button>
    </div>
  );
}
