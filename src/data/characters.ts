import { Toon } from '../types/game';

export const TOONS: Toon[] = [
  {
    id: 'pebble',
    name: 'Пеббл',
    emoji: '🪨',
    color: '#8B7355',
    isMain: true,
    baseHealth: 2,
    speed: 4.5,
    ability: {
      name: 'Быстрые лапки',
      type: 'passive',
      cooldown: 0,
      description: 'Пеббл от природы быстрее других Тунов'
    },
    description: 'Милый камушек-собачка с хорошей скоростью'
  },
  {
    id: 'finn',
    name: 'Финн',
    emoji: '🐟',
    color: '#4FC3F7',
    isMain: false,
    baseHealth: 3,
    speed: 3.5,
    ability: {
      name: 'Всплеск',
      type: 'passive',
      cooldown: 0,
      duration: 3,
      description: '+50% скорости на 3 сек после завершения машины'
    },
    description: 'Аквариум с загадочной рыбкой внутри'
  },
  {
    id: 'gigi',
    name: 'Джиджи',
    emoji: '🔴',
    color: '#EF5350',
    isMain: false,
    baseHealth: 3,
    speed: 3.5,
    ability: {
      name: 'Гача!',
      type: 'active',
      cooldown: 40,
      description: 'Достаёт случайный предмет из головы'
    },
    description: 'Красный гачаболл с сюрпризами'
  },
  {
    id: 'astro',
    name: 'Астро',
    emoji: '🌙',
    color: '#FFD54F',
    isMain: true,
    baseHealth: 2,
    speed: 3.5,
    ability: {
      name: 'Звёздная пыль',
      type: 'active',
      cooldown: 30,
      description: 'Восстанавливает стамину себе и союзникам'
    },
    description: 'Сонный полумесяц в ночном колпаке'
  },
  {
    id: 'sprout',
    name: 'Спраут',
    emoji: '🍓',
    color: '#F48FB1',
    isMain: true,
    baseHealth: 2,
    speed: 3.5,
    ability: {
      name: 'Целительный росток',
      type: 'active',
      cooldown: 40,
      description: 'Восстанавливает 1 HP себе или союзнику'
    },
    description: 'Розовая клубничка с радужными лепестками'
  },
  {
    id: 'vee',
    name: 'Вии',
    emoji: '📺',
    color: '#81C784',
    isMain: true,
    baseHealth: 2,
    speed: 3.5,
    ability: {
      name: 'Сканирование',
      type: 'active',
      cooldown: 30,
      duration: 5,
      description: 'Подсвечивает машины, Твистедов и предметы на 5 сек'
    },
    description: 'Зелёный телевизор с антеннами'
  },
  {
    id: 'shelly',
    name: 'Шелли',
    emoji: '🐚',
    color: '#F8BBD9',
    isMain: true,
    baseHealth: 2,
    speed: 3.5,
    ability: {
      name: 'Жемчужный блеск',
      type: 'passive',
      cooldown: 0,
      description: '+1% скорости за каждую завершённую машину'
    },
    description: 'Розовая ракушка с жемчужиной'
  },
  {
    id: 'boxten',
    name: 'Бокстен',
    emoji: '🎵',
    color: '#B39DDB',
    isMain: false,
    baseHealth: 3,
    speed: 3.5,
    ability: {
      name: 'Мелодия',
      type: 'active',
      cooldown: 25,
      duration: 5,
      description: 'Заводит шкатулку, отвлекая Твистедов'
    },
    description: 'Фиолетовая музыкальная шкатулка'
  },
  {
    id: 'cosmo',
    name: 'Космо',
    emoji: '🍫',
    color: '#8B4513',
    isMain: false,
    baseHealth: 3,
    speed: 3.5,
    ability: {
      name: 'Отдать сердце',
      type: 'active',
      cooldown: 28,
      description: 'Отдаёт 1 HP раненому союзнику (теряет сам)'
    },
    description: 'Шоколадный рулет с глазурью и звёздными веснушками'
  },
  {
    id: 'glisten',
    name: 'Глистен',
    emoji: '🪞',
    color: '#FFD700',
    isMain: false,
    baseHealth: 3,
    speed: 3.5,
    ability: {
      name: 'Блеск',
      type: 'passive',
      cooldown: 0,
      description: 'Твистеды замечают Глистена на большем расстоянии'
    },
    description: 'Зеркало с золотой окантовкой и розовым бантом'
  }
];

export const getToonById = (id: string): Toon | undefined => {
  return TOONS.find(toon => toon.id === id);
};
