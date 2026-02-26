export interface Position {
  x: number;
  y: number;
}

export interface Toon {
  id: string;
  name: string;
  emoji: string;
  color: string;
  isMain: boolean; // Мейны имеют 2 HP, обычные - 3
  baseHealth: number;
  speed: number;
  ability: Ability;
  description: string;
}

export interface Ability {
  name: string;
  type: 'active' | 'passive';
  cooldown: number; // в секундах, 0 для пассивных
  duration?: number; // длительность эффекта
  description: string;
}

export interface Player {
  id: string;
  oderId: string;
  odername: string;
  toonId: string;
  position: Position;
  health: number;
  maxHealth: number;
  stamina: number;
  speed: number;
  speedBonus: number;
  inventory: Item[];
  isAlive: boolean;
  abilityCooldown: number;
  abilityActive: boolean;
  machinesCompleted: number;
  isLocal?: boolean;
}

export interface OnlinePlayer {
  oderId: string;
  odername: string;
  toonId: string;
  position: Position;
  health: number;
  isAlive: boolean;
  inElevator: boolean;
  ready: boolean;
}

export interface Twisted {
  id: string;
  toonId: string;
  position: Position;
  speed: number;
  ability: 'chase' | 'slow' | 'steal' | 'speed' | 'teleport';
  state: 'patrol' | 'chase' | 'search' | 'distracted';
  targetPosition?: Position;
  lastSeenPlayer?: Position;
  searchTimer: number;
  distractedTimer: number;
  patrolPoints: Position[];
  currentPatrolIndex: number;
}

export interface Machine {
  id: string;
  position: Position;
  filled: boolean;
  progress: number;
  miniGameType: 'timing' | 'clicking' | 'sequence' | 'slider';
}

export interface Item {
  id: string;
  name: string;
  emoji: string;
  effect: 'heal' | 'speed' | 'shield' | 'reveal' | 'stamina';
  description: string;
}

export interface Obstacle {
  id: string;
  position: Position;
  width: number;
  height: number;
  type: 'wall' | 'crate' | 'pillar' | 'furniture' | 'tree' | 'poster';
  blocksVision: boolean;
}

export interface Elevator {
  id: string;
  position: Position;
  width: number;
  height: number;
  players: string[]; // player IDs
  maxPlayers: number;
  countdown: number;
  isActive: boolean;
}

export interface GameState {
  floor: number;
  machines: Machine[];
  obstacles: Obstacle[];
  twisteds: Twisted[];
  elevator: Elevator;
  isPanicMode: boolean;
  panicTimer: number;
  allMachinesFilled: boolean;
  ichor: number;
}

export interface LobbyState {
  players: OnlinePlayer[];
  elevators: Elevator[];
}

export interface Skin {
  id: string;
  name: string;
  toonId: string;
  price: number;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  owned: boolean;
}

export interface ShopState {
  skins: Skin[];
  playerIchor: number;
}

// Сообщения для мультиплеера
export interface ServerMessage {
  type: 'lobby_update' | 'game_start' | 'game_update' | 'player_joined' | 'player_left' | 'elevator_update' | 'chat';
  data: any;
}

export interface ClientMessage {
  type: 'join_lobby' | 'leave_lobby' | 'move' | 'enter_elevator' | 'leave_elevator' | 'ready' | 'chat';
  data: any;
}
