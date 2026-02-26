import { useState, useEffect, useCallback } from 'react';

type MiniGameType = 'timing' | 'clicking' | 'sequence' | 'slider';

interface MiniGameProps {
  type: MiniGameType;
  onComplete: (success: boolean) => void;
}

export default function MiniGame({ type, onComplete }: MiniGameProps) {
  const [progress, setProgress] = useState(0);
  const [targetZone, setTargetZone] = useState({ start: 40, end: 60 });
  const [clicks, setClicks] = useState(0);
  const [requiredClicks, setRequiredClicks] = useState(15);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(true);
  const [currentShow, setCurrentShow] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(3);
  const [direction, setDirection] = useState(1);
  
  // Инициализация
  useEffect(() => {
    if (type === 'sequence') {
      const seq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
      setSequence(seq);
      
      // Показать последовательность
      let i = 0;
      const interval = setInterval(() => {
        setCurrentShow(seq[i]);
        setTimeout(() => setCurrentShow(-1), 400);
        i++;
        if (i >= seq.length) {
          clearInterval(interval);
          setTimeout(() => setShowingSequence(false), 500);
        }
      }, 600);
      
      return () => clearInterval(interval);
    }
  }, [type]);
  
  // Таймер для clicking
  useEffect(() => {
    if (type !== 'clicking') return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          onComplete(clicks >= requiredClicks);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [type, clicks, requiredClicks, onComplete]);
  
  // Анимация timing
  useEffect(() => {
    if (type !== 'timing') return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + direction * 2;
        if (newProgress >= 100 || newProgress <= 0) {
          setDirection(d => -d);
        }
        return Math.max(0, Math.min(100, newProgress));
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [type, direction]);
  
  // Обработка клика для timing
  const handleTimingClick = useCallback(() => {
    const success = progress >= targetZone.start && progress <= targetZone.end;
    onComplete(success);
  }, [progress, targetZone, onComplete]);
  
  // Обработка клика для clicking
  const handleClickingClick = useCallback(() => {
    setClicks(prev => {
      const newClicks = prev + 1;
      if (newClicks >= requiredClicks) {
        onComplete(true);
      }
      return newClicks;
    });
  }, [requiredClicks, onComplete]);
  
  // Обработка sequence
  const handleSequenceClick = useCallback((index: number) => {
    if (showingSequence) return;
    
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    
    // Проверка
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      onComplete(false);
      return;
    }
    
    if (newPlayerSequence.length === sequence.length) {
      onComplete(true);
    }
  }, [showingSequence, playerSequence, sequence, onComplete]);
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 min-w-80">
        <h2 className="text-xl font-bold text-white text-center mb-4">
          {type === 'timing' && '⏱️ Остановите в зелёной зоне!'}
          {type === 'clicking' && '👆 Нажимайте быстрее!'}
          {type === 'sequence' && '🧠 Повторите последовательность!'}
        </h2>
        
        {/* Timing */}
        {type === 'timing' && (
          <div className="space-y-4">
            <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden">
              {/* Зелёная зона */}
              <div 
                className="absolute h-full bg-green-500/50"
                style={{
                  left: `${targetZone.start}%`,
                  width: `${targetZone.end - targetZone.start}%`
                }}
              />
              {/* Индикатор */}
              <div 
                className="absolute top-0 w-2 h-full bg-white rounded"
                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <button
              onClick={handleTimingClick}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
            >
              СТОП!
            </button>
          </div>
        )}
        
        {/* Clicking */}
        {type === 'clicking' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{clicks}/{requiredClicks}</div>
              <div className="text-yellow-400">{timeLeft.toFixed(1)}s</div>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${(clicks / requiredClicks) * 100}%` }}
              />
            </div>
            <button
              onClick={handleClickingClick}
              className="w-full py-8 bg-purple-600 text-white font-bold text-2xl rounded-lg hover:bg-purple-500 active:scale-95 transition-all"
            >
              👆 ЖМИ!
            </button>
          </div>
        )}
        
        {/* Sequence */}
        {type === 'sequence' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map(i => {
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];
                const isHighlighted = currentShow === i;
                const isPressed = playerSequence[playerSequence.length - 1] === i;
                
                return (
                  <button
                    key={i}
                    onClick={() => handleSequenceClick(i)}
                    disabled={showingSequence}
                    className={`h-20 rounded-lg transition-all ${colors[i]} ${
                      isHighlighted || isPressed ? 'brightness-150 scale-105' : 'brightness-75'
                    } ${showingSequence ? 'cursor-not-allowed' : 'hover:brightness-100'}`}
                  />
                );
              })}
            </div>
            <div className="text-center text-gray-400">
              {showingSequence ? 'Запоминайте...' : `${playerSequence.length}/${sequence.length}`}
            </div>
          </div>
        )}
        
        {/* Кнопка отмены */}
        <button
          onClick={() => onComplete(false)}
          className="w-full mt-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
