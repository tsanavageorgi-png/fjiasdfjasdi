interface GameOverProps {
  floor: number;
  ichor: number;
  onRetry: () => void;
  onMenu: () => void;
}

export default function GameOver({ floor, ichor, onRetry, onMenu }: GameOverProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 via-red-900 to-black">
      <div className="bg-gray-800/90 rounded-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">💀</div>
        <h1 className="text-4xl font-bold text-red-500 mb-4">ИГРА ОКОНЧЕНА</h1>
        
        <div className="space-y-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-gray-400">Достигнутый этаж</div>
            <div className="text-3xl font-bold text-white">{floor}</div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-gray-400">Заработано ихора</div>
            <div className="text-3xl font-bold text-cyan-400 flex items-center justify-center gap-2">
              <span>💧</span>
              <span>{ichor}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all"
          >
            🔄 Ещё раз
          </button>
          
          <button
            onClick={onMenu}
            className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all"
          >
            🏠 Меню
          </button>
        </div>
      </div>
    </div>
  );
}
