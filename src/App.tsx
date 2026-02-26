import { useState, useEffect } from 'react';
import Menu from './components/Menu';
import CharacterSelect from './components/CharacterSelect';
import Lobby from './components/Lobby';
import GameCanvas from './components/GameCanvas';
import GameOver from './components/GameOver';
import ElevatorRoom from './components/ElevatorRoom';

type GamePhase = 'menu' | 'character_select' | 'lobby' | 'game' | 'elevator' | 'game_over';
type GameMode = 'solo' | 'multiplayer';

interface UpgradeCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: 'heal' | 'item' | 'challenge';
}

interface AppState {
  phase: GamePhase;
  mode: GameMode;
  selectedToonId: string | null;
  playerName: string;
  ichor: number;
  finalFloor: number;
  currentFloor: number;
  teammates: string[];
  bonusStamina: number;
  isChallengeFloor: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    phase: 'menu',
    mode: 'solo',
    selectedToonId: null,
    playerName: 'Player' + Math.floor(Math.random() * 9999),
    ichor: parseInt(localStorage.getItem('ichor') || '0'),
    finalFloor: 0,
    currentFloor: 1,
    teammates: [],
    bonusStamina: 0,
    isChallengeFloor: false
  });

  // Сохраняем ихор
  useEffect(() => {
    localStorage.setItem('ichor', state.ichor.toString());
  }, [state.ichor]);

  const handlePlay = () => {
    setState(prev => ({ ...prev, phase: 'character_select', mode: 'solo' }));
  };

  const handleMultiplayer = () => {
    setState(prev => ({ ...prev, phase: 'character_select', mode: 'multiplayer' }));
  };

  const handleCharacterSelect = (toonId: string) => {
    if (state.mode === 'solo') {
      // Соло - сразу в игру
      setState(prev => ({ 
        ...prev, 
        selectedToonId: toonId, 
        phase: 'game',
        currentFloor: 1,
        isChallengeFloor: false
      }));
    } else {
      // Мультиплеер - в лобби
      setState(prev => ({ ...prev, selectedToonId: toonId, phase: 'lobby' }));
    }
  };

  const handleStartGame = () => {
    setState(prev => ({ 
      ...prev, 
      phase: 'game',
      currentFloor: 1,
      isChallengeFloor: false
    }));
  };

  // Когда игрок завершил этаж и попадает в лифт
  const handleFloorComplete = (floor: number, earnedIchor: number) => {
    setState(prev => ({
      ...prev,
      phase: 'elevator',
      currentFloor: floor + 1,
      ichor: prev.ichor + earnedIchor,
      isChallengeFloor: false
    }));
  };

  // Когда время в лифте закончилось
  const handleElevatorContinue = (selectedCard?: UpgradeCard) => {
    setState(prev => {
      let newState = { ...prev, phase: 'game' as GamePhase };
      
      if (selectedCard) {
        switch (selectedCard.effect) {
          case 'heal':
            // Восстановление здоровья обрабатывается в GameCanvas
            break;
          case 'item':
            // Случайный предмет обрабатывается в GameCanvas
            break;
          case 'challenge':
            // Сложный этаж с 25 машинами и 6 Твистедами
            newState.isChallengeFloor = true;
            newState.bonusStamina = prev.bonusStamina + 50;
            break;
        }
      }
      
      return newState;
    });
  };

  const handleGameOver = (floor: number, earnedIchor: number) => {
    setState(prev => ({
      ...prev,
      phase: 'game_over',
      finalFloor: floor,
      ichor: prev.ichor + earnedIchor,
      currentFloor: 1
    }));
  };

  const handleBackToMenu = () => {
    setState(prev => ({
      ...prev,
      phase: 'menu',
      selectedToonId: null,
      currentFloor: 1,
      isChallengeFloor: false
    }));
  };

  const handleRetry = () => {
    setState(prev => ({ 
      ...prev, 
      phase: 'game',
      currentFloor: 1,
      isChallengeFloor: false
    }));
  };

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden">
      {state.phase === 'menu' && (
        <Menu 
          onPlay={handlePlay} 
          onMultiplayer={handleMultiplayer}
          ichor={state.ichor}
        />
      )}
      
      {state.phase === 'character_select' && (
        <CharacterSelect 
          onSelect={handleCharacterSelect}
          onBack={handleBackToMenu}
        />
      )}
      
      {state.phase === 'lobby' && state.selectedToonId && (
        <Lobby
          playerToonId={state.selectedToonId}
          playerName={state.playerName}
          ichor={state.ichor}
          onStartGame={handleStartGame}
          onLeave={handleBackToMenu}
          onIchorChange={(newIchor) => setState(prev => ({ ...prev, ichor: newIchor }))}
        />
      )}
      
      {state.phase === 'game' && state.selectedToonId && (
        <GameCanvas
          toonId={state.selectedToonId}
          isMultiplayer={state.mode === 'multiplayer'}
          currentFloor={state.currentFloor}
          isChallengeFloor={state.isChallengeFloor}
          bonusStamina={state.bonusStamina}
          onGameOver={handleGameOver}
          onFloorComplete={handleFloorComplete}
          onExit={handleBackToMenu}
        />
      )}
      
      {state.phase === 'elevator' && state.selectedToonId && (
        <ElevatorRoom
          playerToonId={state.selectedToonId}
          currentFloor={state.currentFloor}
          teammates={state.teammates}
          onContinue={handleElevatorContinue}
        />
      )}
      
      {state.phase === 'game_over' && (
        <GameOver
          floor={state.finalFloor}
          ichor={state.ichor}
          onRetry={handleRetry}
          onMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
