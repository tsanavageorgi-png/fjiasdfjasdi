import { Item } from '../types/game';

export const ITEMS: Item[] = [
  {
    id: 'medkit',
    name: 'Аптечка',
    emoji: '🩹',
    effect: 'heal',
    description: 'Восстанавливает 1 HP'
  },
  {
    id: 'energy_drink',
    name: 'Энергетик',
    emoji: '⚡',
    effect: 'stamina',
    description: 'Восстанавливает стамину'
  },
  {
    id: 'speed_boots',
    name: 'Ботинки скорости',
    emoji: '👟',
    effect: 'speed',
    description: '+30% скорости на 5 секунд'
  },
  {
    id: 'shield',
    name: 'Щит',
    emoji: '🛡️',
    effect: 'shield',
    description: 'Блокирует 1 удар'
  },
  {
    id: 'radar',
    name: 'Радар',
    emoji: '📡',
    effect: 'reveal',
    description: 'Показывает всех Твистедов на 10 сек'
  }
];

export const getRandomItem = (): Item => {
  return ITEMS[Math.floor(Math.random() * ITEMS.length)];
};
