import { useState, useEffect } from 'react';
import ToonRenderer from './ToonRenderer';
import { TOONS } from '../data/characters';

interface ElevatorRoomProps {
  playerToonId: string;
  currentFloor: number;
  onContinue: (selectedCard?: UpgradeCard) => void;
  teammates?: string[]; // IDs других Тунов в команде
}

interface UpgradeCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: 'heal' | 'item' | 'challenge';
}

// Диалоги в лифте
interface ElevatorDialogue {
  participants: [string, string]; // IDs Тунов
  lines: { speaker: number; text: string }[];
}

const ELEVATOR_DIALOGUES: ElevatorDialogue[] = [
  {
    participants: ['glisten', 'boxten'],
    lines: [
      { speaker: 0, text: "Хм… Бокси, у меня не размазался макияж?" },
      { speaker: 1, text: "А? О-ох, а... Нет?" },
      { speaker: 0, text: "Правильно, он всегда идеален." },
      { speaker: 1, text: "Тогда зачем ты спросил?" },
      { speaker: 0, text: "О, я просто хотел, чтобы ты взглянул!" }
    ]
  },
  {
    participants: ['sprout', 'cosmo'],
    lines: [
      { speaker: 0, text: "Хм... Ты замечал плакат со словом 'Аппятитные'?" },
      { speaker: 1, text: "Тот в столовой? Разве правильно не 'АппЕтитные'?" },
      { speaker: 0, text: "... Да, да так правильно." },
      { speaker: 1, text: "..." },
      { speaker: 0, text: "Мы же не будем это исправлять, да?" },
      { speaker: 1, text: "Хехехех- Не-а!" }
    ]
  },
  {
    participants: ['sprout', 'finn'],
    lines: [
      { speaker: 0, text: "Хмм... Может, как-нибудь приготовить что-нибудь из морепродуктов..." },
      { speaker: 1, text: ". . ." },
      { speaker: 0, text: "..." },
      { speaker: 1, text: "Спраут?" },
      { speaker: 0, text: "Финн, я в хорошем смысле- рыба у тебя в голове даже не настоящая." },
      { speaker: 1, text: "Для меня он настоящее некуда!!!" }
    ]
  },
  {
    participants: ['gigi', 'sprout'],
    lines: [
      { speaker: 0, text: "Пс, Спраут... На потолке написано 'наивный'." },
      { speaker: 1, text: "..." },
      { speaker: 0, text: "Оу, блин, даже не посмотришь?" },
      { speaker: 1, text: "Нет. Я не попадусь на это, хаха." },
      { speaker: 0, text: "Кхм... Ладно." }
    ]
  },
  {
    participants: ['gigi', 'cosmo'],
    lines: [
      { speaker: 0, text: "Псс, Космо! Смотри, там на потолке написано 'Наивный'!" },
      { speaker: 1, text: "Что- правда? Где?!" },
      { speaker: 0, text: "Мхехехе..." },
      { speaker: 1, text: "...Ой, погоди- Нет... Я попался." },
      { speaker: 0, text: "Джиджи выиграла!" }
    ]
  }
];

const UPGRADE_CARDS: UpgradeCard[] = [
  {
    id: 'first_aid',
    name: 'Первая помощь',
    description: 'Восстанавливает одно здоровье всем Тунам',
    icon: '💊',
    effect: 'heal'
  },
  {
    id: 'blind_grab',
    name: 'Слепой захват',
    description: 'Каждый Тун получает один случайный предмет',
    icon: '🎁',
    effect: 'item'
  },
  {
    id: 'times_up',
    name: 'Время вышло',
    description: 'Пройдите сложный этаж с 25 машинами и 6 Твистедами. Награда: +50 выносливости',
    icon: '⏰',
    effect: 'challenge'
  }
];

export default function ElevatorRoom({ playerToonId, currentFloor, onContinue, teammates = [] }: ElevatorRoomProps) {
  const [countdown, setCountdown] = useState(20);
  const [currentDialogue, setCurrentDialogue] = useState<ElevatorDialogue | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showVoting, setShowVoting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});

  // Определяем, нечётный ли этаж (голосование)
  const isVotingFloor = currentFloor % 2 === 1;

  // Найти подходящий диалог
  useEffect(() => {
    const allToons = [playerToonId, ...teammates];
    
    for (const dialogue of ELEVATOR_DIALOGUES) {
      const [p1, p2] = dialogue.participants;
      if (allToons.includes(p1) && allToons.includes(p2)) {
        // Случайный шанс запустить диалог
        if (Math.random() < 0.5) {
          setCurrentDialogue(dialogue);
          break;
        }
      }
    }
  }, [playerToonId, teammates]);

  // Таймер обратного отсчёта
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Показать голосование за 15 секунд до конца (если нечётный этаж)
  useEffect(() => {
    if (isVotingFloor && countdown <= 15 && countdown > 0) {
      setShowVoting(true);
    }
  }, [countdown, isVotingFloor]);

  // Автоматически переходить к следующей строке диалога
  useEffect(() => {
    if (!currentDialogue) return;
    
    const timer = setInterval(() => {
      setDialogueIndex(prev => {
        if (prev >= currentDialogue.lines.length - 1) {
          setCurrentDialogue(null);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentDialogue]);

  // Когда таймер заканчивается
  useEffect(() => {
    if (countdown === 0) {
      const winningCard = selectedCard ? UPGRADE_CARDS.find(c => c.id === selectedCard) : undefined;
      onContinue(winningCard);
    }
  }, [countdown, selectedCard, onContinue]);

  // Голосование
  const handleVote = (cardId: string) => {
    setSelectedCard(cardId);
    setVotes(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1
    }));
  };

  const playerToon = TOONS.find(t => t.id === playerToonId);

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Фон лифта */}
      <div className="absolute inset-0">
        {/* Стены лифта */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gray-700 to-gray-800 border-b-4 border-yellow-600" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-700 to-gray-800 border-t-4 border-yellow-600" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-700 to-gray-800 border-r-4 border-yellow-600" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-700 to-gray-800 border-l-4 border-yellow-600" />
        
        {/* Индикатор этажа */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black px-6 py-2 rounded-lg border-2 border-yellow-600">
          <span className="text-yellow-400 font-mono text-2xl">Этаж {currentFloor}</span>
        </div>
        
        {/* Панель с кнопками */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-600 p-3 rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full mb-2 ${i === 0 ? 'bg-green-500' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

      {/* Таймер */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <div className={`text-6xl font-bold ${countdown <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          {countdown}
        </div>
        <div className="text-gray-400 text-center text-sm">до следующего этажа</div>
      </div>

      {/* Персонажи в лифте */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-6 items-end">
        {/* Игрок */}
        <div className="flex flex-col items-center">
          <ToonRenderer toonId={playerToonId} size={80} />
          <div className="mt-2 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded">
            {playerToon?.name} (Вы)
          </div>
        </div>
        
        {/* Тиммейты */}
        {teammates.map((id, i) => {
          const toon = TOONS.find(t => t.id === id);
          return (
            <div key={i} className="flex flex-col items-center">
              <ToonRenderer toonId={id} size={60} />
              <div className="mt-2 text-gray-300 text-xs bg-black/50 px-2 py-1 rounded">
                {toon?.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Диалог */}
      {currentDialogue && (
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 w-96 z-20">
          <div className="bg-black/80 rounded-xl p-4 border-2 border-purple-500">
            <div className="flex items-start gap-3">
              <ToonRenderer 
                toonId={currentDialogue.participants[currentDialogue.lines[dialogueIndex].speaker]} 
                size={48} 
              />
              <div>
                <div className="text-purple-400 font-bold text-sm mb-1">
                  {TOONS.find(t => t.id === currentDialogue.participants[currentDialogue.lines[dialogueIndex].speaker])?.name}
                </div>
                <div className="text-white">
                  {currentDialogue.lines[dialogueIndex].text}
                </div>
              </div>
            </div>
            {/* Индикатор прогресса диалога */}
            <div className="flex gap-1 justify-center mt-3">
              {currentDialogue.lines.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i <= dialogueIndex ? 'bg-purple-500' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Голосование за карточки */}
      {showVoting && isVotingFloor && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-yellow-400 text-center mb-4">
              🎴 Выберите улучшение
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Голосование заканчивается через {countdown} сек
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {UPGRADE_CARDS.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleVote(card.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCard === card.id 
                      ? 'border-yellow-400 bg-yellow-900/50 scale-105' 
                      : 'border-gray-600 bg-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-2 text-center">{card.icon}</div>
                  <div className="text-white font-bold text-center mb-2">{card.name}</div>
                  <div className="text-gray-400 text-xs text-center">{card.description}</div>
                  {votes[card.id] > 0 && (
                    <div className="mt-2 text-center">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                        {votes[card.id]} голос(ов)
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Информация внизу */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-sm">
        {isVotingFloor ? 'Нечётный этаж - голосование за улучшения!' : 'Ожидание...'}
      </div>
    </div>
  );
}
