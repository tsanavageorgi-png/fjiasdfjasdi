import { useState, useEffect, useRef, useCallback } from 'react';
import { Position, Machine, Obstacle, Twisted, Item } from '../types/game';
import { TOONS, getToonById } from '../data/characters';
import { getRandomItem } from '../data/items';
import ToonRenderer from './ToonRenderer';
import MiniGame from './MiniGame';

interface GameCanvasProps {
  toonId: string;
  isMultiplayer: boolean;
  currentFloor?: number;
  isChallengeFloor?: boolean;
  bonusStamina?: number;
  onGameOver: (floor: number, earnedIchor: number) => void;
  onFloorComplete?: (floor: number, earnedIchor: number) => void;
  onExit: () => void;
}

// Константы карты
const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;

// Генерация препятствий
const generateObstacles = (floor: number): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  
  // Стены по периметру
  obstacles.push({ id: 'wall_top', position: { x: 0, y: 0 }, width: MAP_WIDTH, height: 20, type: 'wall', blocksVision: true });
  obstacles.push({ id: 'wall_bottom', position: { x: 0, y: MAP_HEIGHT - 20 }, width: MAP_WIDTH, height: 20, type: 'wall', blocksVision: true });
  obstacles.push({ id: 'wall_left', position: { x: 0, y: 0 }, width: 20, height: MAP_HEIGHT, type: 'wall', blocksVision: true });
  obstacles.push({ id: 'wall_right', position: { x: MAP_WIDTH - 20, y: 0 }, width: 20, height: MAP_HEIGHT, type: 'wall', blocksVision: true });
  
  // Случайные препятствия
  const obstacleCount = 10 + floor * 2;
  const types: Array<'crate' | 'pillar' | 'furniture'> = ['crate', 'pillar', 'furniture'];
  
  for (let i = 0; i < obstacleCount; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const width = type === 'crate' ? 60 : type === 'pillar' ? 40 : 80;
    const height = type === 'crate' ? 60 : type === 'pillar' ? 40 : 50;
    
    obstacles.push({
      id: `obs_${i}`,
      position: {
        x: 100 + Math.random() * (MAP_WIDTH - 200 - width),
        y: 150 + Math.random() * (MAP_HEIGHT - 300 - height)
      },
      width,
      height,
      type,
      blocksVision: true
    });
  }
  
  return obstacles;
};

// Генерация машин
const generateMachines = (floor: number, isChallenge: boolean = false): Machine[] => {
  let count = 4;
  if (isChallenge) {
    count = 25; // Сложный этаж
  } else if (floor >= 5 && floor <= 10) count = 5;
  else if (floor >= 11 && floor <= 15) count = 6;
  else if (floor >= 16) count = 8;
  
  const machines: Machine[] = [];
  const types: Array<'timing' | 'clicking' | 'sequence'> = ['timing', 'clicking', 'sequence'];
  
  for (let i = 0; i < count; i++) {
    machines.push({
      id: `machine_${i}`,
      position: {
        x: 100 + (i % 4) * 350 + Math.random() * 100,
        y: 200 + Math.floor(i / 4) * 300 + Math.random() * 100
      },
      filled: false,
      progress: 0,
      miniGameType: types[Math.floor(Math.random() * types.length)]
    });
  }
  
  return machines;
};

// Генерация Твистедов
const generateTwisteds = (floor: number, isChallenge: boolean = false): Twisted[] => {
  const count = isChallenge ? 6 : Math.min(1 + Math.floor(floor / 3), 5);
  const twisteds: Twisted[] = [];
  const abilities: Array<'chase' | 'slow' | 'steal' | 'speed'> = ['chase', 'slow', 'steal', 'speed'];
  
  for (let i = 0; i < count; i++) {
    const patrolPoints: Position[] = [];
    for (let j = 0; j < 4; j++) {
      patrolPoints.push({
        x: 100 + Math.random() * (MAP_WIDTH - 200),
        y: 100 + Math.random() * (MAP_HEIGHT - 200)
      });
    }
    
    twisteds.push({
      id: `twisted_${i}`,
      toonId: TOONS[Math.floor(Math.random() * TOONS.length)].id,
      position: {
        x: 100 + Math.random() * (MAP_WIDTH - 200),
        y: 100 + Math.random() * (MAP_HEIGHT - 200)
      },
      speed: 2 + floor * 0.1,
      ability: abilities[Math.floor(Math.random() * abilities.length)],
      state: 'patrol',
      searchTimer: 0,
      distractedTimer: 0,
      patrolPoints,
      currentPatrolIndex: 0
    });
  }
  
  return twisteds;
};

export default function GameCanvas({ 
  toonId, 
  isMultiplayer: _isMultiplayer, 
  currentFloor: initialFloor = 1,
  isChallengeFloor = false,
  bonusStamina: _bonusStamina = 0,
  onGameOver, 
  onFloorComplete,
  onExit 
}: GameCanvasProps) {
  const toon = getToonById(toonId)!;
  
  // Состояние игрока
  const [playerHealth, setPlayerHealth] = useState(toon.baseHealth);
  const [playerPos, setPlayerPos] = useState<Position>({ x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 });
  const [stamina, setStamina] = useState(100); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [inventory, setInventory] = useState<Item[]>([]);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [machinesCompleted, setMachinesCompleted] = useState(0);
  const [abilityCooldown, setAbilityCooldown] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isShielded, setIsShielded] = useState(false);
  
  // Состояние игры
  const [floor, setFloor] = useState(initialFloor);
  const [machines, setMachines] = useState<Machine[]>(() => generateMachines(initialFloor, isChallengeFloor));
  const [obstacles, setObstacles] = useState<Obstacle[]>(() => generateObstacles(initialFloor));
  const [twisteds, setTwisteds] = useState<Twisted[]>(() => generateTwisteds(initialFloor, isChallengeFloor));
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [panicTimer, setPanicTimer] = useState(15);
  const [ichorEarned, setIchorEarned] = useState(0);
  
  // Мини-игра
  const [activeMachine, setActiveMachine] = useState<Machine | null>(null);
  
  // Камера
  const [camera, setCamera] = useState<Position>({ x: 0, y: 0 });
  
  // Refs для игрового цикла
  const playerPosRef = useRef<Position>({ x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 });
  const keysRef = useRef<Set<string>>(new Set());
  const twistedsRef = useRef<Twisted[]>([]);
  const lastTimeRef = useRef<number>(0);
  const invulnerableRef = useRef<number>(0);
  
  // Позиция лифта
  const elevatorPos = { x: MAP_WIDTH / 2, y: 50 };
  
  // Инициализация этажа
  const initFloor = useCallback((floorNum: number, isChallenge: boolean = false) => {
    setMachines(generateMachines(floorNum, isChallenge));
    setObstacles(generateObstacles(floorNum));
    const newTwisteds = generateTwisteds(floorNum, isChallenge);
    setTwisteds(newTwisteds);
    twistedsRef.current = newTwisteds;
    setIsPanicMode(false);
    setPanicTimer(15);
    playerPosRef.current = { x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 };
    setPlayerPos({ x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 });
  }, []);
  
  // Проверка видимости (Line of Sight)
  const hasLineOfSight = useCallback((from: Position, to: Position): boolean => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.ceil(dist / 20);
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const checkX = from.x + dx * t;
      const checkY = from.y + dy * t;
      
      for (const obs of obstacles) {
        if (obs.blocksVision &&
            checkX >= obs.position.x && checkX <= obs.position.x + obs.width &&
            checkY >= obs.position.y && checkY <= obs.position.y + obs.height) {
          return false;
        }
      }
    }
    return true;
  }, [obstacles]);
  
  // Проверка коллизий
  const checkCollision = useCallback((pos: Position, width: number, height: number): boolean => {
    for (const obs of obstacles) {
      if (pos.x < obs.position.x + obs.width &&
          pos.x + width > obs.position.x &&
          pos.y < obs.position.y + obs.height &&
          pos.y + height > obs.position.y) {
        return true;
      }
    }
    return false;
  }, [obstacles]);
  
  // Управление
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      
      // Взаимодействие с машиной
      if (e.key.toLowerCase() === 'e' && !activeMachine && !isPanicMode) {
        const nearMachine = machines.find(m => 
          !m.filled && Math.hypot(playerPosRef.current.x - m.position.x, playerPosRef.current.y - m.position.y) < 60
        );
        if (nearMachine) {
          setActiveMachine(nearMachine);
        }
      }
      
      // Способность
      if (e.key === ' ' && abilityCooldown <= 0 && toon.ability.type === 'active') {
        activateAbility();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeMachine, isPanicMode, abilityCooldown, machines, toon.ability.type]);
  
  // Активация способности
  const activateAbility = useCallback(() => {
    switch (toon.id) {
      case 'gigi':
        // Случайный предмет
        const item = getRandomItem();
        setInventory(prev => [...prev, item]);
        setAbilityCooldown(40);
        break;
      case 'astro':
        // Восстановление стамины
        setStamina(100);
        setAbilityCooldown(30);
        break;
      case 'sprout':
        // Восстановление здоровья
        setPlayerHealth(prev => Math.min(prev + 1, toon.baseHealth));
        setAbilityCooldown(40);
        break;
      case 'vee':
        // Подсветка
        setIsRevealing(true);
        setTimeout(() => setIsRevealing(false), 5000);
        setAbilityCooldown(30);
        break;
      case 'boxten':
        // Отвлечение Твистедов
        setTwisteds(prev => prev.map(t => ({
          ...t,
          state: 'distracted' as const,
          distractedTimer: 5,
          targetPosition: playerPosRef.current
        })));
        setAbilityCooldown(25);
        break;
    }
  }, [toon]);
  
  // Завершение мини-игры
  const handleMiniGameComplete = useCallback((success: boolean) => {
    if (success && activeMachine) {
      setMachines(prev => prev.map(m => 
        m.id === activeMachine.id ? { ...m, filled: true, progress: 100 } : m
      ));
      setMachinesCompleted(prev => prev + 1);
      setIchorEarned(prev => prev + 10 + floor * 2);
      
      // Пассивка Финна
      if (toon.id === 'finn') {
        setSpeedBonus(1.5);
        setTimeout(() => setSpeedBonus(0), 3000);
      }
      
      // Пассивка Шелли
      if (toon.id === 'shelly') {
        setSpeedBonus(prev => prev + 0.01);
      }
    }
    setActiveMachine(null);
  }, [activeMachine, floor, toon.id]);
  
  // Проверка всех машин заполнены
  useEffect(() => {
    if (machines.length > 0 && machines.every(m => m.filled) && !isPanicMode) {
      setIsPanicMode(true);
      setPanicTimer(15);
    }
  }, [machines, isPanicMode]);
  
  // Таймер паники
  useEffect(() => {
    if (!isPanicMode) return;
    
    const interval = setInterval(() => {
      setPanicTimer(prev => {
        if (prev <= 1) {
          // Время вышло - проверяем дошел ли игрок до лифта
          const dist = Math.hypot(playerPosRef.current.x - elevatorPos.x, playerPosRef.current.y - elevatorPos.y);
          if (dist > 80) {
            onGameOver(floor, ichorEarned);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPanicMode, floor, ichorEarned, onGameOver]);
  
  // Проверка достижения лифта
  useEffect(() => {
    if (!isPanicMode) return;
    
    const checkElevator = () => {
      const dist = Math.hypot(playerPosRef.current.x - elevatorPos.x, playerPosRef.current.y - elevatorPos.y);
      if (dist < 80) {
        // Переход в комнату лифта
        if (onFloorComplete) {
          onFloorComplete(floor, ichorEarned);
        } else {
          // Старое поведение - сразу следующий этаж
          const nextFloor = floor + 1;
          setFloor(nextFloor);
          initFloor(nextFloor);
        }
      }
    };
    
    const interval = setInterval(checkElevator, 100);
    return () => clearInterval(interval);
  }, [isPanicMode, floor, initFloor, onFloorComplete, ichorEarned]);
  
  // Кулдаун способности
  useEffect(() => {
    if (abilityCooldown <= 0) return;
    
    const interval = setInterval(() => {
      setAbilityCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [abilityCooldown]);
  
  // Основной игровой цикл
  useEffect(() => {
    if (activeMachine) return;
    
    let animationId: number;
    
    const gameLoop = (timestamp: number) => {
      const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 16.67 : 1;
      lastTimeRef.current = timestamp;
      
      // Движение игрока
      let speed = toon.speed * (1 + speedBonus);
      let dx = 0;
      let dy = 0;
      
      if (keysRef.current.has('w') || keysRef.current.has('arrowup')) dy -= speed * deltaTime;
      if (keysRef.current.has('s') || keysRef.current.has('arrowdown')) dy += speed * deltaTime;
      if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) dx -= speed * deltaTime;
      if (keysRef.current.has('d') || keysRef.current.has('arrowright')) dx += speed * deltaTime;
      
      if (dx !== 0 || dy !== 0) {
        // Проверка коллизий раздельно по осям
        let newX = playerPosRef.current.x + dx;
        let newY = playerPosRef.current.y + dy;
        
        if (!checkCollision({ x: newX, y: playerPosRef.current.y }, 30, 30)) {
          playerPosRef.current.x = Math.max(30, Math.min(MAP_WIDTH - 30, newX));
        }
        
        if (!checkCollision({ x: playerPosRef.current.x, y: newY }, 30, 30)) {
          playerPosRef.current.y = Math.max(30, Math.min(MAP_HEIGHT - 30, newY));
        }
        
        setPlayerPos({ ...playerPosRef.current });
      }
      
      // Обновление Твистедов
      const updatedTwisteds = twistedsRef.current.map(twisted => {
        const distToPlayer = Math.hypot(twisted.position.x - playerPosRef.current.x, twisted.position.y - playerPosRef.current.y);
        const canSee = distToPlayer < 300 && hasLineOfSight(twisted.position, playerPosRef.current);
        
        let newState = twisted.state;
        let newSearchTimer = twisted.searchTimer;
        let newDistractedTimer = twisted.distractedTimer;
        let newLastSeen = twisted.lastSeenPlayer;
        
        // Состояние Твистеда
        if (twisted.state === 'distracted') {
          newDistractedTimer -= deltaTime * 0.06;
          if (newDistractedTimer <= 0) {
            newState = 'patrol';
          }
        } else if (canSee) {
          newState = 'chase';
          newLastSeen = { ...playerPosRef.current };
        } else if (twisted.state === 'chase') {
          newState = 'search';
          newSearchTimer = 3;
        } else if (twisted.state === 'search') {
          newSearchTimer -= deltaTime * 0.06;
          if (newSearchTimer <= 0) {
            newState = 'patrol';
          }
        }
        
        // Движение Твистеда
        let targetX = twisted.position.x;
        let targetY = twisted.position.y;
        
        if (newState === 'chase' && newLastSeen) {
          targetX = newLastSeen.x;
          targetY = newLastSeen.y;
        } else if (newState === 'search' && newLastSeen) {
          targetX = newLastSeen.x;
          targetY = newLastSeen.y;
        } else if (newState === 'patrol') {
          const patrol = twisted.patrolPoints[twisted.currentPatrolIndex];
          targetX = patrol.x;
          targetY = patrol.y;
        } else if (newState === 'distracted' && twisted.targetPosition) {
          targetX = twisted.targetPosition.x;
          targetY = twisted.targetPosition.y;
        }
        
        const moveSpeed = newState === 'chase' ? twisted.speed * 1.5 : twisted.speed;
        const angle = Math.atan2(targetY - twisted.position.y, targetX - twisted.position.x);
        const moveX = Math.cos(angle) * moveSpeed * deltaTime;
        const moveY = Math.sin(angle) * moveSpeed * deltaTime;
        
        let newPos = { ...twisted.position };
        newPos.x += moveX;
        newPos.y += moveY;
        
        // Патрулирование - следующая точка
        let newPatrolIndex = twisted.currentPatrolIndex;
        if (newState === 'patrol') {
          const patrol = twisted.patrolPoints[twisted.currentPatrolIndex];
          if (Math.hypot(newPos.x - patrol.x, newPos.y - patrol.y) < 20) {
            newPatrolIndex = (twisted.currentPatrolIndex + 1) % twisted.patrolPoints.length;
          }
        }
        
        return {
          ...twisted,
          position: newPos,
          state: newState,
          searchTimer: newSearchTimer,
          distractedTimer: newDistractedTimer,
          lastSeenPlayer: newLastSeen,
          currentPatrolIndex: newPatrolIndex
        };
      });
      
      twistedsRef.current = updatedTwisteds;
      setTwisteds(updatedTwisteds);
      
      // Проверка урона от Твистедов
      if (invulnerableRef.current <= 0) {
        for (const twisted of updatedTwisteds) {
          const dist = Math.hypot(twisted.position.x - playerPosRef.current.x, twisted.position.y - playerPosRef.current.y);
          if (dist < 40) {
            if (!isShielded) {
              setPlayerHealth(prev => {
                const newHealth = prev - 1;
                if (newHealth <= 0) {
                  onGameOver(floor, ichorEarned);
                }
                return newHealth;
              });
              invulnerableRef.current = 60; // Неуязвимость на 1 секунду
              
              // Способность Твистеда
              if (twisted.ability === 'slow') {
                setSpeedBonus(-0.5);
                setTimeout(() => setSpeedBonus(0), 3000);
              } else if (twisted.ability === 'steal' && inventory.length > 0) {
                setInventory(prev => prev.slice(0, -1));
              }
            } else {
              setIsShielded(false);
            }
            break;
          }
        }
      } else {
        invulnerableRef.current -= deltaTime;
      }
      
      // Камера
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;
      const camX = Math.max(0, Math.min(MAP_WIDTH - viewWidth, playerPosRef.current.x - viewWidth / 2));
      const camY = Math.max(0, Math.min(MAP_HEIGHT - viewHeight, playerPosRef.current.y - viewHeight / 2));
      setCamera({ x: camX, y: camY });
      
      animationId = requestAnimationFrame(gameLoop);
    };
    
    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [activeMachine, toon, speedBonus, checkCollision, hasLineOfSight, isShielded, inventory.length, floor, ichorEarned, onGameOver]);
  
  // Использование предмета
  const useItem = (index: number) => {
    const item = inventory[index];
    if (!item) return;
    
    switch (item.effect) {
      case 'heal':
        setPlayerHealth(prev => Math.min(prev + 1, toon.baseHealth));
        break;
      case 'speed':
        setSpeedBonus(0.3);
        setTimeout(() => setSpeedBonus(0), 5000);
        break;
      case 'shield':
        setIsShielded(true);
        break;
      case 'reveal':
        setIsRevealing(true);
        setTimeout(() => setIsRevealing(false), 10000);
        break;
      case 'stamina':
        setStamina(100);
        break;
    }
    
    setInventory(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="w-full h-full overflow-hidden bg-gray-900 relative">
      {/* Игровой мир */}
      <div
        className="absolute"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          left: -camera.x,
          top: -camera.y
        }}
      >
        {/* Пол */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: '#2d3748',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px)'
          }}
        />
        
        {/* Лифт */}
        <div
          className={`absolute rounded-t-2xl border-4 ${isPanicMode ? 'border-green-400 animate-pulse' : 'border-gray-600'}`}
          style={{
            left: elevatorPos.x - 60,
            top: elevatorPos.y - 30,
            width: 120,
            height: 100,
            backgroundColor: isPanicMode ? '#059669' : '#374151'
          }}
        >
          <div className="text-center text-white font-bold mt-2">🛗 ЛИФТ</div>
          {isPanicMode && (
            <div className="text-center text-yellow-400 text-sm mt-1">БЕГИ СЮДА!</div>
          )}
        </div>
        
        {/* Препятствия */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="absolute"
            style={{
              left: obs.position.x,
              top: obs.position.y,
              width: obs.width,
              height: obs.height,
              backgroundColor: obs.type === 'wall' ? '#1a202c' : 
                              obs.type === 'crate' ? '#92400e' : 
                              obs.type === 'pillar' ? '#6b7280' : '#78350f',
              borderRadius: obs.type === 'pillar' ? '50%' : '4px',
              boxShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            {obs.type === 'crate' && <div className="text-center text-2xl mt-2">📦</div>}
            {obs.type === 'furniture' && <div className="text-center text-2xl mt-2">🪑</div>}
          </div>
        ))}
        
        {/* Машины */}
        {machines.map(machine => (
          <div
            key={machine.id}
            className={`absolute w-16 h-16 rounded-lg flex items-center justify-center text-3xl
              ${machine.filled ? 'bg-green-600' : 'bg-purple-700'}
              ${isRevealing && !machine.filled ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
            `}
            style={{
              left: machine.position.x - 32,
              top: machine.position.y - 32,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            {machine.filled ? '✅' : '⚙️'}
            {!machine.filled && Math.hypot(playerPos.x - machine.position.x, playerPos.y - machine.position.y) < 60 && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-yellow-400 text-xs whitespace-nowrap">
                Нажми E
              </div>
            )}
          </div>
        ))}
        
        {/* Твистеды */}
        {twisteds.map(twisted => (
          <div
            key={twisted.id}
            className={`absolute ${isRevealing ? 'ring-4 ring-red-500 animate-pulse' : ''}`}
            style={{
              left: twisted.position.x - 25,
              top: twisted.position.y - 25
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-30 animate-ping" />
              <div className="grayscale contrast-125 brightness-75">
                <ToonRenderer toonId={twisted.toonId} size={50} />
              </div>
              {/* Индикатор состояния */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg">
                {twisted.state === 'chase' && '👁️'}
                {twisted.state === 'search' && '❓'}
                {twisted.state === 'distracted' && '🎵'}
              </div>
            </div>
          </div>
        ))}
        
        {/* Игрок */}
        <div
          className="absolute"
          style={{
            left: playerPos.x - 25,
            top: playerPos.y - 25,
            zIndex: 100,
            opacity: invulnerableRef.current > 0 ? 0.5 : 1
          }}
        >
          <ToonRenderer toonId={toonId} size={50} />
          {isShielded && (
            <div className="absolute inset-0 border-4 border-cyan-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>
      
      {/* UI */}
      <div className="absolute top-4 left-4 z-50">
        {/* Этаж */}
        <div className="bg-black/70 px-4 py-2 rounded-lg mb-2">
          <span className="text-gray-400">Этаж:</span>
          <span className="text-white font-bold ml-2">{floor}</span>
        </div>
        
        {/* Здоровье */}
        <div className="bg-black/70 px-4 py-2 rounded-lg mb-2 flex items-center gap-1">
          {[...Array(toon.baseHealth)].map((_, i) => (
            <span key={i} className={i < playerHealth ? 'text-red-500' : 'text-gray-600'}>
              {i < playerHealth ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        
        {/* Машины */}
        <div className="bg-black/70 px-4 py-2 rounded-lg mb-2">
          <span className="text-gray-400">Машины:</span>
          <span className="text-white font-bold ml-2">
            {machines.filter(m => m.filled).length}/{machines.length}
          </span>
        </div>
        
        {/* Ихор */}
        <div className="bg-black/70 px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="text-xl">💧</span>
          <span className="text-cyan-400 font-bold">{ichorEarned}</span>
        </div>
      </div>
      
      {/* Способность */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/70 px-4 py-2 rounded-lg">
          <div className="text-gray-400 text-sm">{toon.ability.name}</div>
          {toon.ability.type === 'active' ? (
            <div className="text-center">
              {abilityCooldown > 0 ? (
                <span className="text-yellow-400">{abilityCooldown}s</span>
              ) : (
                <span className="text-green-400">SPACE</span>
              )}
            </div>
          ) : (
            <span className="text-green-400 text-sm">Пассивная</span>
          )}
        </div>
      </div>
      
      {/* Инвентарь */}
      {inventory.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          {inventory.map((item, i) => (
            <button
              key={i}
              onClick={() => useItem(i)}
              className="w-12 h-12 bg-black/70 rounded-lg flex items-center justify-center text-2xl hover:bg-black/90 transition-colors"
              title={item.name}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      )}
      
      {/* Режим паники */}
      {isPanicMode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="bg-red-600/90 px-8 py-4 rounded-xl animate-pulse">
            <div className="text-white text-2xl font-bold text-center">⚠️ РЕЖИМ ПАНИКИ ⚠️</div>
            <div className="text-yellow-400 text-4xl font-bold text-center">{panicTimer}</div>
            <div className="text-white text-center">Беги к лифту!</div>
          </div>
        </div>
      )}
      
      {/* Мини-игра */}
      {activeMachine && (
        <MiniGame
          type={activeMachine.miniGameType}
          onComplete={handleMiniGameComplete}
        />
      )}
      
      {/* Кнопка выхода */}
      <button
        onClick={onExit}
        className="absolute bottom-4 right-4 px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 z-50"
      >
        Выйти
      </button>
      
      {/* Управление */}
      <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-lg text-gray-400 text-sm z-50">
        WASD - движение | E - машина | SPACE - способность
      </div>
    </div>
  );
}
