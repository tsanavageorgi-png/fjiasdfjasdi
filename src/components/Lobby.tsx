import { useState, useEffect, useRef, useCallback } from 'react';
import ToonRenderer from './ToonRenderer';
import { TOONS } from '../data/characters';
import { Skin } from '../types/game';

interface LobbyProps {
  playerToonId: string;
  playerName: string;
  ichor: number;
  onStartGame: () => void;
  onLeave: () => void;
  onIchorChange: (newIchor: number) => void;
}

// Скины для магазина
const SKINS: Skin[] = [
  { id: 'pebble_gold', name: 'Золотой Пеббл', toonId: 'pebble', price: 500, colors: { primary: '#FFD700', secondary: '#FFA500' }, owned: false },
  { id: 'vee_pink', name: 'Розовая Вии', toonId: 'vee', price: 400, colors: { primary: '#FF69B4', secondary: '#FF1493' }, owned: false },
  { id: 'sprout_blue', name: 'Голубой Спраут', toonId: 'sprout', price: 450, colors: { primary: '#87CEEB', secondary: '#4169E1' }, owned: false },
  { id: 'astro_purple', name: 'Фиолетовый Астро', toonId: 'astro', price: 400, colors: { primary: '#9370DB', secondary: '#8A2BE2' }, owned: false },
];

// Диалоги Дэнди о Тунах
const DANDY_GOSSIPS = [
  {
    toon: 'astro',
    text: '— Ты не поверишь, но прошлой ночью мне приснился самый чудесный сон!\n— И конечно же, всё это благодаря Астро!\n— Он самый лучший друг, которого может пожелать такой маленький цветок, как я!'
  },
  {
    toon: 'boxten',
    text: '— Признаюсь…\n— Мелодия музыкальной шкатулки Бокстена на самом деле довольно успокаивающая.\n— …\n— Жаль, что я слышу её не так часто, как раньше. Надеюсь, у него всё хорошо.'
  },
  {
    toon: 'finn',
    text: '— Вот это да! Знаешь что?\n— Я действительно считаю, что эта игрушечная рыбка в голове Финна может быть настоящим Туном.\n— Постой, послушай меня, у меня есть на это причины!\n— … Эта «игрушечная рыбка» моргает и двигается очень плавно для игрушки. Финн даже иногда с ней шепчется!\n— Интересно, заметил ли это кто-то из других Тунов?'
  },
  {
    toon: 'gigi',
    text: '— Представляешь, Гиги обвинила меня в том, что я раскрашиваю свои лепестки!?\n— …Мои лепестки полностью натуральные!!\n— Мне сказали, что мои радужные цвета приносят радость всем!'
  },
  {
    toon: 'pebble',
    text: '— Позволь рассказать тебе про самое милое, что сделал мой маленький питомец-камешек вчера!\n— Пеббл такой забавный, он пытался сделать сальто назад, но в итоге застрял на спине!\n— Хорошо, что я был рядом, чтобы спасти моего драгоценного малыша.\n— … Он лучший питомец, о таком только можно мечтать.'
  },
  {
    toon: 'shelly',
    text: '— Эм… я сейчас не так много общаюсь с большинством мейн Тунов как раньше!\n— Ничего серьёзного! Никакой особой причины! Просто, ну, немного отдалились!\n— … Да!\n— Но я очень надеюсь, что Шелли завела новых друзей!\n— Я не особо слежу за тем, чем она занимается.'
  },
  {
    toon: 'sprout',
    text: '— Я пытался немного поговорить со Спраутом…\n— Но потом перестал. Думаю, наши характеры иногда просто не совпадают.\n— Иногда кажется, что он пытается взять на себя руководство ситуациями, к которым не имеет отношения!\n— Я и сам могу справляться со своими делами, конечно! Ха-ха.'
  },
  {
    toon: 'vee',
    text: '— Ох, у меня как раз есть сплетня!\n— … Ви раньше думала, что сможет стать популярнее меня!\n— Знаешь, это было ещё тогда, когда у нас всё ещё шло шоу!\n— Ха-ха-ха! РАЗВЕ ЭТО НЕ СМЕШНО!!!'
  }
];

// Рендер NPC Дайла (часы)
const DileRenderer = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    {/* Тень */}
    <ellipse cx="40" cy="75" rx="25" ry="5" fill="rgba(0,0,0,0.3)" />
    {/* Золотое основание часов */}
    <circle cx="40" cy="40" r="30" fill="#FFD700" stroke="#DAA520" strokeWidth="3" />
    <circle cx="40" cy="40" r="26" fill="#FFF8DC" stroke="#DAA520" strokeWidth="2" />
    {/* Разноцветные рисочки времени */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B500', '#FF69B4'];
      const rad = (angle * Math.PI) / 180;
      const x1 = 40 + Math.sin(rad) * 20;
      const y1 = 40 - Math.cos(rad) * 20;
      const x2 = 40 + Math.sin(rad) * 24;
      const y2 = 40 - Math.cos(rad) * 24;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[i]} strokeWidth="3" strokeLinecap="round" />;
    })}
    {/* Лицо */}
    <circle cx="32" cy="36" r="4" fill="#333" /> {/* Левый глаз */}
    <circle cx="48" cy="36" r="4" fill="#333" /> {/* Правый глаз */}
    <circle cx="33" cy="35" r="1.5" fill="white" /> {/* Блик */}
    <circle cx="49" cy="35" r="1.5" fill="white" />
    <path d="M 32 48 Q 40 54 48 48" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" /> {/* Улыбка */}
    {/* Нос со стрелками часов */}
    <circle cx="40" cy="42" r="3" fill="#DAA520" />
    <line x1="40" y1="42" x2="40" y2="28" stroke="#333" strokeWidth="2" strokeLinecap="round" /> {/* Минутная стрелка */}
    <line x1="40" y1="42" x2="52" y2="42" stroke="#333" strokeWidth="2" strokeLinecap="round" /> {/* Часовая стрелка */}
    {/* Ножки */}
    <rect x="30" y="68" width="6" height="8" rx="3" fill="#DAA520" />
    <rect x="44" y="68" width="6" height="8" rx="3" fill="#DAA520" />
  </svg>
);

// Рендер NPC Дэнди - цветок с 6 лепестками (красный, фиолетовый, синий, зеленый, желтый, оранжевый)
const DandyRenderer = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    {/* Тень */}
    <ellipse cx="40" cy="75" rx="25" ry="5" fill="rgba(0,0,0,0.3)" />
    {/* 6 лепестков */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
      const colors = ['#EF4444', '#8B5CF6', '#3B82F6', '#22C55E', '#EAB308', '#F97316']; // красный, фиолетовый, синий, зеленый, желтый, оранжевый
      const rad = (angle * Math.PI) / 180;
      const x = 40 + Math.sin(rad) * 26;
      const y = 40 - Math.cos(rad) * 26;
      return <ellipse key={i} cx={x} cy={y} rx="12" ry="16" fill={colors[i]} transform={`rotate(${angle} ${x} ${y})`} />;
    })}
    {/* Внутренний круг - лицо */}
    <circle cx="40" cy="40" r="18" fill="#FFF8DC" />
    {/* Глаза */}
    <circle cx="34" cy="36" r="4" fill="#333" />
    <circle cx="46" cy="36" r="4" fill="#333" />
    <circle cx="35" cy="35" r="1.5" fill="white" />
    <circle cx="47" cy="35" r="1.5" fill="white" />
    {/* Счастливая улыбка */}
    <path d="M 32 45 Q 40 52 48 45" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Румянец */}
    <circle cx="28" cy="42" r="4" fill="#FECACA" opacity="0.6" />
    <circle cx="52" cy="42" r="4" fill="#FECACA" opacity="0.6" />
    {/* Ножки */}
    <rect x="34" y="56" width="5" height="10" rx="2" fill="#22C55E" />
    <rect x="41" y="56" width="5" height="10" rx="2" fill="#22C55E" />
  </svg>
);

interface Position {
  x: number;
  y: number;
}

interface ElevatorState {
  id: number;
  position: Position;
  players: string[];
  countdown: number | null;
}

export default function Lobby({ playerToonId, playerName, ichor, onStartGame, onLeave, onIchorChange }: LobbyProps) {
  // Размер лобби
  const LOBBY_WIDTH = 1200;
  const LOBBY_HEIGHT = 800;
  
  // Позиция игрока
  const [playerPos, setPlayerPos] = useState<Position>({ x: 600, y: 400 });
  const playerPosRef = useRef<Position>({ x: 600, y: 400 });
  const keysRef = useRef<Set<string>>(new Set());
  
  // Лифты
  const [elevators, setElevators] = useState<ElevatorState[]>([
    { id: 1, position: { x: 150, y: 100 }, players: [], countdown: null },
    { id: 2, position: { x: 550, y: 100 }, players: [], countdown: null },
    { id: 3, position: { x: 950, y: 100 }, players: [], countdown: null },
  ]);
  
  // Диалоги
  const [showDileShop, setShowDileShop] = useState(false);
  const [showDandyDialog, setShowDandyDialog] = useState(false);
  const [currentGossip, setCurrentGossip] = useState(0);
  const [skins, setSkins] = useState(SKINS);
  const [currentElevator, setCurrentElevator] = useState<number | null>(null);
  
  // Камера
  const [camera, setCamera] = useState<Position>({ x: 0, y: 0 });
  
  // NPC позиции
  const dilePos = { x: 300, y: 600 };
  const dandyPos = { x: 900, y: 600 };
  
  // Управление
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      
      // Взаимодействие с NPC
      if (e.key.toLowerCase() === 'e') {
        const distToDile = Math.hypot(playerPosRef.current.x - dilePos.x, playerPosRef.current.y - dilePos.y);
        const distToDandy = Math.hypot(playerPosRef.current.x - dandyPos.x, playerPosRef.current.y - dandyPos.y);
        
        if (distToDile < 80) {
          setShowDileShop(true);
        } else if (distToDandy < 80) {
          setShowDandyDialog(true);
        }
        
        // Проверка лифтов
        elevators.forEach((elev, idx) => {
          const dist = Math.hypot(playerPosRef.current.x - elev.position.x, playerPosRef.current.y - elev.position.y);
          if (dist < 100) {
            enterElevator(idx);
          }
        });
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
  }, [elevators]);
  
  // Вход в лифт
  const enterElevator = useCallback((elevIndex: number) => {
    if (currentElevator !== null) return;
    
    setCurrentElevator(elevIndex);
    setElevators(prev => prev.map((elev, i) => {
      if (i === elevIndex && elev.players.length < 8) {
        const newPlayers = [...elev.players, playerName];
        return {
          ...elev,
          players: newPlayers,
          countdown: newPlayers.length >= 1 ? 20 : null
        };
      }
      return elev;
    }));
  }, [currentElevator, playerName]);
  
  // Таймер лифта
  useEffect(() => {
    const interval = setInterval(() => {
      setElevators(prev => prev.map(elev => {
        if (elev.countdown !== null && elev.countdown > 0) {
          return { ...elev, countdown: elev.countdown - 1 };
        }
        return elev;
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Проверка старта игры
  useEffect(() => {
    const elev = currentElevator !== null ? elevators[currentElevator] : null;
    if (elev && elev.countdown === 0) {
      onStartGame();
    }
  }, [elevators, currentElevator, onStartGame]);
  
  // Игровой цикл
  useEffect(() => {
    if (showDileShop || showDandyDialog || currentElevator !== null) return;
    
    let animationId: number;
    
    const gameLoop = () => {
      const speed = 5;
      let dx = 0;
      let dy = 0;
      
      if (keysRef.current.has('w') || keysRef.current.has('arrowup')) dy -= speed;
      if (keysRef.current.has('s') || keysRef.current.has('arrowdown')) dy += speed;
      if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) dx -= speed;
      if (keysRef.current.has('d') || keysRef.current.has('arrowright')) dx += speed;
      
      if (dx !== 0 || dy !== 0) {
        const newX = Math.max(30, Math.min(LOBBY_WIDTH - 30, playerPosRef.current.x + dx));
        const newY = Math.max(30, Math.min(LOBBY_HEIGHT - 30, playerPosRef.current.y + dy));
        
        playerPosRef.current = { x: newX, y: newY };
        setPlayerPos({ x: newX, y: newY });
      }
      
      // Камера
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;
      const camX = Math.max(0, Math.min(LOBBY_WIDTH - viewWidth, playerPosRef.current.x - viewWidth / 2));
      const camY = Math.max(0, Math.min(LOBBY_HEIGHT - viewHeight, playerPosRef.current.y - viewHeight / 2));
      setCamera({ x: camX, y: camY });
      
      animationId = requestAnimationFrame(gameLoop);
    };
    
    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [showDileShop, showDandyDialog, currentElevator]);
  
  // Покупка скина
  const buySkin = (skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    if (!skin || skin.owned || ichor < skin.price) return;
    
    onIchorChange(ichor - skin.price);
    setSkins(prev => prev.map(s => s.id === skinId ? { ...s, owned: true } : s));
  };
  
  const playerToon = TOONS.find(t => t.id === playerToonId);
  
  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-b from-amber-900 via-orange-900 to-red-900 relative">
      {/* Мир лобби */}
      <div 
        className="absolute"
        style={{
          width: LOBBY_WIDTH,
          height: LOBBY_HEIGHT,
          transform: `translate(${-camera.x}px, ${-camera.y}px)`
        }}
      >
        {/* Пол */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-orange-900">
          {/* Паттерн пола */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px)'
          }} />
        </div>
        
        {/* Плакаты Gardenview */}
        {[100, 400, 700, 1000].map((x, i) => (
          <div 
            key={i}
            className="absolute bg-gradient-to-b from-green-400 to-emerald-600 rounded-lg shadow-lg border-4 border-amber-700"
            style={{ left: x, top: 20, width: 120, height: 80 }}
          >
            <div className="text-center text-white font-bold text-sm mt-2">🌿 GARDENVIEW</div>
            <div className="text-center text-yellow-200 text-xs">Добро пожаловать!</div>
            <div className="flex justify-center mt-1 gap-1">
              <span>🌸</span><span>🌻</span><span>🌺</span>
            </div>
          </div>
        ))}
        
        {/* Декоративные элементы вместо дерева */}
        <div 
          className="absolute flex gap-8 items-center justify-center"
          style={{ left: LOBBY_WIDTH / 2 - 150, top: 350, width: 300 }}
        >
          {/* Фонтан/статуя */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🌸</span>
            </div>
            <div className="w-32 h-4 bg-gray-400 rounded-t-lg mt-1" />
            <div className="w-40 h-6 bg-gradient-to-b from-gray-400 to-gray-600 rounded-lg" />
          </div>
        </div>
        
        {/* Лифты */}
        {elevators.map((elev, i) => (
          <div
            key={elev.id}
            className="absolute bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-3xl border-4 border-gray-600 shadow-2xl"
            style={{
              left: elev.position.x - 60,
              top: elev.position.y - 20,
              width: 120,
              height: 160
            }}
          >
            {/* Двери лифта */}
            <div className="absolute inset-2 flex">
              <div className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 border-r border-gray-700" />
              <div className="flex-1 bg-gradient-to-l from-gray-500 to-gray-600" />
            </div>
            {/* Индикатор */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black rounded text-green-400 text-sm font-mono">
              {elev.players.length}/8
            </div>
            {/* Таймер */}
            {elev.countdown !== null && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-600 rounded-full text-white font-bold animate-pulse">
                {elev.countdown}s
              </div>
            )}
            {/* Номер лифта */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-bold">
              Лифт {elev.id}
            </div>
            {/* Подсказка */}
            {Math.hypot(playerPos.x - elev.position.x, playerPos.y - elev.position.y) < 100 && currentElevator === null && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 rounded text-yellow-400 text-sm whitespace-nowrap">
                Нажми E чтобы войти
              </div>
            )}
          </div>
        ))}
        
        {/* NPC Дайл */}
        <div
          className="absolute cursor-pointer hover:scale-110 transition-transform"
          style={{ left: dilePos.x - 40, top: dilePos.y - 40 }}
        >
          <DileRenderer size={80} />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold bg-black/50 px-2 rounded">
            Дайл
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-yellow-400 text-xs bg-black/50 px-2 rounded">
            🛒 Магазин
          </div>
          {Math.hypot(playerPos.x - dilePos.x, playerPos.y - dilePos.y) < 80 && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 rounded text-yellow-400 text-sm">
              Нажми E
            </div>
          )}
        </div>
        
        {/* NPC Дэнди */}
        <div
          className="absolute cursor-pointer hover:scale-110 transition-transform"
          style={{ left: dandyPos.x - 40, top: dandyPos.y - 40 }}
        >
          <DandyRenderer size={80} />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold bg-black/50 px-2 rounded">
            Дэнди
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-pink-400 text-xs bg-black/50 px-2 rounded">
            💬 Сплетни
          </div>
          {Math.hypot(playerPos.x - dandyPos.x, playerPos.y - dandyPos.y) < 80 && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 rounded text-yellow-400 text-sm">
              Нажми E
            </div>
          )}
        </div>
        
        {/* Игрок */}
        {currentElevator === null && (
          <div
            className="absolute transition-none"
            style={{
              left: playerPos.x - 25,
              top: playerPos.y - 25,
              zIndex: 100
            }}
          >
            <ToonRenderer toonId={playerToonId} size={50} />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-sm font-bold bg-black/50 px-2 rounded whitespace-nowrap">
              {playerName}
            </div>
          </div>
        )}
      </div>
      
      {/* UI */}
      <div className="absolute top-4 left-4 flex items-center gap-4 z-50">
        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
          <span className="text-2xl">💧</span>
          <span className="text-xl font-bold text-cyan-400">{ichor}</span>
        </div>
        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
          <ToonRenderer toonId={playerToonId} size={30} />
          <span className="text-white font-bold">{playerToon?.name}</span>
        </div>
      </div>
      
      {/* Кнопка выхода */}
      <button
        onClick={onLeave}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 z-50"
      >
        Выйти
      </button>
      
      {/* Подсказка управления */}
      <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-lg text-gray-300 text-sm z-50">
        WASD - движение | E - взаимодействие
      </div>
      
      {/* В лифте */}
      {currentElevator !== null && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              🛗 Лифт {currentElevator + 1}
            </h2>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {elevators[currentElevator].countdown}
              </div>
              <div className="text-gray-400">секунд до старта</div>
            </div>
            <div className="mb-4">
              <div className="text-gray-400 mb-2">Игроки ({elevators[currentElevator].players.length}/8):</div>
              <div className="flex flex-wrap gap-2">
                {elevators[currentElevator].players.map((name, i) => (
                  <div key={i} className="px-3 py-1 bg-purple-600 rounded-full text-white text-sm">
                    {name}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentElevator(null);
                setElevators(prev => prev.map((e, i) => 
                  i === currentElevator 
                    ? { ...e, players: e.players.filter(n => n !== playerName), countdown: e.players.length <= 1 ? null : e.countdown }
                    : e
                ));
              }}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
            >
              Выйти из лифта
            </button>
          </div>
        </div>
      )}
      
      {/* Магазин Дайла */}
      {showDileShop && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-xl p-6 max-w-lg border-4 border-amber-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DileRenderer size={60} />
                <div>
                  <h2 className="text-2xl font-bold text-white">Магазин Дайла</h2>
                  <p className="text-amber-300 text-sm">Время - деньги, друг мой!</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                <span>💧</span>
                <span className="text-cyan-400 font-bold">{ichor}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {skins.map(skin => (
                <div 
                  key={skin.id}
                  className={`p-3 rounded-lg ${skin.owned ? 'bg-green-800/50' : 'bg-black/30'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: skin.colors.primary }}
                    />
                    <div>
                      <div className="text-white font-bold text-sm">{skin.name}</div>
                      <div className="text-amber-400 text-xs">💧 {skin.price}</div>
                    </div>
                  </div>
                  {skin.owned ? (
                    <div className="text-green-400 text-sm text-center">✓ Куплено</div>
                  ) : (
                    <button
                      onClick={() => buySkin(skin.id)}
                      disabled={ichor < skin.price}
                      className={`w-full py-1 rounded text-sm font-bold ${
                        ichor >= skin.price 
                          ? 'bg-amber-600 text-white hover:bg-amber-500' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Купить
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowDileShop(false)}
              className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
      
      {/* Диалог Дэнди */}
      {showDandyDialog && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-pink-800 to-purple-900 rounded-xl p-6 max-w-lg border-4 border-pink-500">
            <div className="flex items-center gap-3 mb-4">
              <DandyRenderer size={60} />
              <div>
                <h2 className="text-2xl font-bold text-white">Дэнди</h2>
                <p className="text-pink-300 text-sm">О, у меня есть что тебе рассказать!</p>
              </div>
            </div>
            
            {/* Выбор Туна */}
            <div className="flex flex-wrap gap-2 mb-4">
              {DANDY_GOSSIPS.map((g, i) => {
                const toon = TOONS.find(t => t.id === g.toon);
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentGossip(i)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      currentGossip === i 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-black/30 text-gray-300 hover:bg-black/50'
                    }`}
                  >
                    {toon?.emoji} {toon?.name}
                  </button>
                );
              })}
            </div>
            
            {/* Текст сплетни */}
            <div className="bg-black/30 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
              <div className="text-white whitespace-pre-line leading-relaxed">
                {DANDY_GOSSIPS[currentGossip].text}
              </div>
            </div>
            
            <button
              onClick={() => setShowDandyDialog(false)}
              className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              До свидания!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
