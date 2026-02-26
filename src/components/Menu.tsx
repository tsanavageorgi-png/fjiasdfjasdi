interface MenuProps {
  onPlay: () => void;
  onMultiplayer: () => void;
  ichor: number;
}

export default function Menu({ onPlay, onMultiplayer, ichor }: MenuProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Логотип */}
      <div className="relative z-10 mb-8">
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-2xl">
          DANDY WORLD
        </h1>
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-purple-500/20 blur-xl -z-10" />
      </div>

      {/* Ихор баланс */}
      <div className="relative z-10 mb-8 flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full">
        <span className="text-2xl">💧</span>
        <span className="text-xl font-bold text-cyan-400">{ichor}</span>
        <span className="text-gray-400">Ихор</span>
      </div>

      {/* Кнопки */}
      <div className="relative z-10 flex flex-col gap-4">
        <button
          onClick={onPlay}
          className="px-12 py-4 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-400 hover:to-emerald-500 transform hover:scale-105 transition-all shadow-lg hover:shadow-green-500/50"
        >
          🎮 ИГРАТЬ
        </button>
        
        <button
          onClick={onMultiplayer}
          className="px-12 py-4 text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-400 hover:to-indigo-500 transform hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/50"
        >
          👥 МУЛЬТИПЛЕЕР
        </button>
        
        <button
          className="px-12 py-4 text-xl font-bold text-gray-300 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transform hover:scale-105 transition-all"
          onClick={() => alert('Настройки будут добавлены позже!')}
        >
          ⚙️ Настройки
        </button>
      </div>

      {/* Декоративные персонажи */}
      <div className="absolute bottom-8 left-8 text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍓</div>
      <div className="absolute bottom-8 right-8 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>📺</div>
      <div className="absolute top-8 left-8 text-5xl animate-bounce" style={{ animationDelay: '0.8s' }}>🌙</div>
      <div className="absolute top-8 right-8 text-5xl animate-bounce" style={{ animationDelay: '1.1s' }}>🐚</div>
    </div>
  );
}
