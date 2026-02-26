import React from 'react';

interface ToonRendererProps {
  toonId: string;
  size?: number;
  className?: string;
}

// Рендер Pebble - камушек-собака с милым лицом
const PebbleSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="pebbleShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <radialGradient id="pebbleGrad" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#a8a8a8"/>
        <stop offset="100%" stopColor="#6b6b6b"/>
      </radialGradient>
    </defs>
    {/* Тело - камушек */}
    <ellipse cx="32" cy="38" rx="22" ry="18" fill="url(#pebbleGrad)" filter="url(#pebbleShadow)"/>
    {/* Ушки собаки */}
    <ellipse cx="16" cy="22" rx="8" ry="12" fill="#7a7a7a" transform="rotate(-20 16 22)"/>
    <ellipse cx="48" cy="22" rx="8" ry="12" fill="#7a7a7a" transform="rotate(20 48 22)"/>
    {/* Глаза */}
    <ellipse cx="24" cy="34" rx="6" ry="7" fill="white"/>
    <ellipse cx="40" cy="34" rx="6" ry="7" fill="white"/>
    <circle cx="26" cy="35" r="3" fill="#333"/>
    <circle cx="42" cy="35" r="3" fill="#333"/>
    <circle cx="27" cy="34" r="1" fill="white"/>
    <circle cx="43" cy="34" r="1" fill="white"/>
    {/* Носик */}
    <ellipse cx="32" cy="44" rx="4" ry="3" fill="#4a4a4a"/>
    {/* Улыбка */}
    <path d="M 26 48 Q 32 54 38 48" stroke="#4a4a4a" strokeWidth="2" fill="none"/>
    {/* Блик */}
    <ellipse cx="24" cy="30" rx="8" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-15 24 30)"/>
  </svg>
);

// Рендер Vee - зеленый телевизор с милым лицом и антеннами
const VeeSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="veeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="veeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80"/>
        <stop offset="100%" stopColor="#22c55e"/>
      </linearGradient>
    </defs>
    {/* Антенны */}
    <line x1="20" y1="12" x2="24" y2="20" stroke="#333" strokeWidth="3"/>
    <line x1="44" y1="12" x2="40" y2="20" stroke="#333" strokeWidth="3"/>
    <circle cx="20" cy="10" r="4" fill="#ef4444"/>
    <circle cx="44" cy="10" r="4" fill="#3b82f6"/>
    {/* Корпус ТВ */}
    <rect x="10" y="20" width="44" height="36" rx="4" fill="url(#veeGrad)" filter="url(#veeShadow)"/>
    {/* Экран */}
    <rect x="14" y="24" width="30" height="24" rx="2" fill="#1a1a2e"/>
    {/* Глаза на экране */}
    <ellipse cx="22" cy="34" rx="5" ry="6" fill="#4ade80"/>
    <ellipse cx="36" cy="34" rx="5" ry="6" fill="#4ade80"/>
    <ellipse cx="23" cy="35" rx="2" ry="3" fill="#166534"/>
    <ellipse cx="37" cy="35" r="2" fill="#166534"/>
    {/* Улыбка */}
    <path d="M 22 42 Q 29 48 36 42" stroke="#4ade80" strokeWidth="2" fill="none"/>
    {/* Кнопки сбоку */}
    <circle cx="48" cy="32" r="3" fill="#333"/>
    <circle cx="48" cy="42" r="3" fill="#333"/>
    {/* Ножки */}
    <rect x="16" y="56" width="6" height="6" fill="#333"/>
    <rect x="42" y="56" width="6" height="6" fill="#333"/>
  </svg>
);

// Рендер Sprout - розовая клубничка с шарфом и зелеными лепестками
const SproutSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="sproutShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <radialGradient id="berryGrad" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#fda4af"/>
        <stop offset="100%" stopColor="#f472b6"/>
      </radialGradient>
    </defs>
    {/* Листья/волосы */}
    <ellipse cx="22" cy="12" rx="8" ry="10" fill="#22c55e" transform="rotate(-30 22 12)"/>
    <ellipse cx="32" cy="8" rx="6" ry="12" fill="#16a34a"/>
    <ellipse cx="42" cy="12" rx="8" ry="10" fill="#22c55e" transform="rotate(30 42 12)"/>
    {/* Тело - клубника */}
    <ellipse cx="32" cy="38" rx="20" ry="22" fill="url(#berryGrad)" filter="url(#sproutShadow)"/>
    {/* Семечки */}
    <ellipse cx="22" cy="32" rx="2" ry="1.5" fill="#fecdd3"/>
    <ellipse cx="42" cy="32" rx="2" ry="1.5" fill="#fecdd3"/>
    <ellipse cx="26" cy="45" rx="2" ry="1.5" fill="#fecdd3"/>
    <ellipse cx="38" cy="45" rx="2" ry="1.5" fill="#fecdd3"/>
    <ellipse cx="32" cy="52" rx="2" ry="1.5" fill="#fecdd3"/>
    {/* Глаза */}
    <ellipse cx="25" cy="35" rx="5" ry="6" fill="white"/>
    <ellipse cx="39" cy="35" rx="5" ry="6" fill="white"/>
    <circle cx="26" cy="36" r="3" fill="#333"/>
    <circle cx="40" cy="36" r="3" fill="#333"/>
    <circle cx="27" cy="35" r="1" fill="white"/>
    <circle cx="41" cy="35" r="1" fill="white"/>
    {/* Румянец */}
    <ellipse cx="18" cy="40" rx="4" ry="2" fill="#fca5a5" opacity="0.6"/>
    <ellipse cx="46" cy="40" rx="4" ry="2" fill="#fca5a5" opacity="0.6"/>
    {/* Улыбка */}
    <path d="M 27 44 Q 32 50 37 44" stroke="#be185d" strokeWidth="2" fill="none"/>
    {/* Шарф */}
    <path d="M 14 28 Q 32 34 50 28" stroke="#fb7185" strokeWidth="6" fill="none"/>
    <rect x="44" y="28" width="8" height="14" rx="2" fill="#fb7185"/>
  </svg>
);

// Рендер Finn - аквариум с глазами
const FinnSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="finnShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9"/>
        <stop offset="100%" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
    {/* Основа аквариума */}
    <rect x="10" y="16" width="44" height="40" rx="6" fill="#e0f2fe" filter="url(#finnShadow)" stroke="#0891b2" strokeWidth="2"/>
    {/* Вода */}
    <rect x="12" y="22" width="40" height="32" rx="4" fill="url(#waterGrad)" opacity="0.8"/>
    {/* Пузырьки */}
    <circle cx="18" cy="28" r="2" fill="rgba(255,255,255,0.6)"/>
    <circle cx="46" cy="34" r="3" fill="rgba(255,255,255,0.6)"/>
    <circle cx="22" cy="42" r="2" fill="rgba(255,255,255,0.6)"/>
    {/* Глаза */}
    <ellipse cx="25" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="39" cy="36" rx="7" ry="8" fill="white"/>
    <circle cx="27" cy="37" r="4" fill="#0891b2"/>
    <circle cx="41" cy="37" r="4" fill="#0891b2"/>
    <circle cx="28" cy="36" r="1.5" fill="white"/>
    <circle cx="42" cy="36" r="1.5" fill="white"/>
    {/* Улыбка */}
    <path d="M 27 46 Q 32 50 37 46" stroke="#0e7490" strokeWidth="2" fill="none"/>
    {/* Плавники по бокам */}
    <ellipse cx="6" cy="36" rx="6" ry="10" fill="#22d3ee" opacity="0.7"/>
    <ellipse cx="58" cy="36" rx="6" ry="10" fill="#22d3ee" opacity="0.7"/>
    {/* Крышка */}
    <rect x="8" y="12" width="48" height="6" rx="2" fill="#334155"/>
  </svg>
);

// Рендер Gigi - красный гачаболл
const GigiSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="gigiShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <radialGradient id="gigiGrad" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#fca5a5"/>
        <stop offset="100%" stopColor="#ef4444"/>
      </radialGradient>
    </defs>
    {/* Крышка сверху */}
    <rect x="24" y="6" width="16" height="6" rx="2" fill="#b91c1c"/>
    {/* Основа - капсула */}
    <circle cx="32" cy="36" r="24" fill="url(#gigiGrad)" filter="url(#gigiShadow)"/>
    {/* Разделительная линия */}
    <ellipse cx="32" cy="36" rx="24" ry="4" fill="#dc2626"/>
    {/* Верхняя половина прозрачная */}
    <path d="M 8 36 A 24 24 0 0 1 56 36" fill="#fecaca" opacity="0.5"/>
    {/* Глаза */}
    <ellipse cx="24" cy="30" rx="6" ry="7" fill="white"/>
    <ellipse cx="40" cy="30" rx="6" ry="7" fill="white"/>
    <circle cx="25" cy="31" r="3" fill="#333"/>
    <circle cx="41" cy="31" r="3" fill="#333"/>
    <circle cx="26" cy="30" r="1" fill="white"/>
    <circle cx="42" cy="30" r="1" fill="white"/>
    {/* Улыбка */}
    <path d="M 26 40 Q 32 46 38 40" stroke="#991b1b" strokeWidth="2" fill="none"/>
    {/* Блик */}
    <ellipse cx="22" cy="22" rx="8" ry="6" fill="rgba(255,255,255,0.4)" transform="rotate(-20 22 22)"/>
    {/* Отверстие для выдачи */}
    <rect x="28" y="48" width="8" height="8" rx="2" fill="#7f1d1d"/>
  </svg>
);

// Рендер Astro - полумесяц с шапкой для сна
const AstroSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="astroShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="astroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7"/>
        <stop offset="50%" stopColor="#fde68a"/>
        <stop offset="100%" stopColor="#1e1b4b"/>
      </linearGradient>
    </defs>
    {/* Шапка для сна */}
    <path d="M 20 16 Q 32 8 50 20 L 56 10 Q 50 4 32 4 Q 14 4 20 16" fill="#6366f1"/>
    <circle cx="56" cy="8" r="4" fill="#f472b6"/>
    {/* Полумесяц */}
    <path d="M 16 32 A 20 20 0 1 1 16 52 A 14 14 0 1 0 16 32" fill="url(#astroGrad)" filter="url(#astroShadow)"/>
    {/* Темная часть */}
    <path d="M 40 32 A 14 14 0 0 1 40 52 A 10 10 0 0 0 40 32" fill="#1e1b4b" opacity="0.6"/>
    {/* Глаза */}
    <ellipse cx="28" cy="38" rx="5" ry="6" fill="white"/>
    <circle cx="29" cy="39" r="3" fill="#4338ca"/>
    <circle cx="30" cy="38" r="1" fill="white"/>
    {/* Сонный глаз */}
    <path d="M 38 38 Q 42 36 46 38" stroke="#333" strokeWidth="2" fill="none"/>
    {/* Улыбка */}
    <path d="M 26 46 Q 32 50 38 46" stroke="#92400e" strokeWidth="2" fill="none"/>
    {/* Z-ы (сонные) */}
    <text x="48" y="24" fill="#6366f1" fontSize="10" fontWeight="bold">z</text>
    <text x="54" y="18" fill="#818cf8" fontSize="8" fontWeight="bold">z</text>
    {/* Звездочки */}
    <text x="8" y="26" fill="#fbbf24" fontSize="8">✦</text>
    <text x="50" y="56" fill="#fbbf24" fontSize="6">✦</text>
  </svg>
);

// Рендер Shelly - ракушка с милым лицом
const ShellySprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="shellyShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="shellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbcfe8"/>
        <stop offset="100%" stopColor="#ec4899"/>
      </linearGradient>
    </defs>
    {/* Основа ракушки */}
    <ellipse cx="32" cy="40" rx="26" ry="20" fill="url(#shellGrad)" filter="url(#shellyShadow)"/>
    {/* Линии ракушки */}
    <path d="M 10 40 Q 20 25 32 20 Q 44 25 54 40" stroke="#db2777" strokeWidth="2" fill="none"/>
    <path d="M 14 42 Q 22 30 32 26 Q 42 30 50 42" stroke="#db2777" strokeWidth="1.5" fill="none"/>
    <path d="M 18 44 Q 24 35 32 32 Q 40 35 46 44" stroke="#db2777" strokeWidth="1" fill="none"/>
    {/* Верхняя часть ракушки */}
    <ellipse cx="32" cy="22" rx="12" ry="8" fill="#f9a8d4"/>
    {/* Глаза */}
    <ellipse cx="26" cy="38" rx="5" ry="6" fill="white"/>
    <ellipse cx="38" cy="38" rx="5" ry="6" fill="white"/>
    <circle cx="27" cy="39" r="3" fill="#333"/>
    <circle cx="39" cy="39" r="3" fill="#333"/>
    <circle cx="28" cy="38" r="1" fill="white"/>
    <circle cx="40" cy="38" r="1" fill="white"/>
    {/* Румянец */}
    <ellipse cx="20" cy="44" rx="4" ry="2" fill="#fda4af" opacity="0.6"/>
    <ellipse cx="44" cy="44" rx="4" ry="2" fill="#fda4af" opacity="0.6"/>
    {/* Улыбка */}
    <path d="M 28 48 Q 32 52 36 48" stroke="#be185d" strokeWidth="2" fill="none"/>
    {/* Жемчужина */}
    <circle cx="32" cy="55" r="4" fill="#f0f9ff"/>
    <circle cx="30" cy="54" r="1.5" fill="white"/>
  </svg>
);

// Рендер Boxten - фиолетовая музыкальная шкатулка
const BoxtenSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="boxtenShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c4b5fd"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    {/* Крышка */}
    <rect x="8" y="10" width="48" height="12" rx="4" fill="#a78bfa" filter="url(#boxtenShadow)"/>
    <rect x="10" y="12" width="44" height="8" rx="2" fill="#ddd6fe"/>
    {/* Основной корпус */}
    <rect x="8" y="22" width="48" height="34" rx="4" fill="url(#boxGrad)" filter="url(#boxtenShadow)"/>
    {/* Декор */}
    <rect x="12" y="26" width="40" height="26" rx="2" fill="#7c3aed"/>
    {/* Глаза */}
    <ellipse cx="24" cy="36" rx="6" ry="7" fill="white"/>
    <ellipse cx="40" cy="36" rx="6" ry="7" fill="white"/>
    <circle cx="25" cy="37" r="3" fill="#5b21b6"/>
    <circle cx="41" cy="37" r="3" fill="#5b21b6"/>
    <circle cx="26" cy="36" r="1" fill="white"/>
    <circle cx="42" cy="36" r="1" fill="white"/>
    {/* Улыбка */}
    <path d="M 28 46 Q 32 50 36 46" stroke="#4c1d95" strokeWidth="2" fill="none"/>
    {/* Ноты */}
    <text x="14" y="32" fill="#fbbf24" fontSize="8">♪</text>
    <text x="44" y="30" fill="#fbbf24" fontSize="8">♫</text>
    {/* Ручка завода */}
    <rect x="52" y="32" width="8" height="4" rx="1" fill="#7c3aed"/>
    <circle cx="58" cy="34" r="3" fill="#c4b5fd"/>
    {/* Ножки */}
    <rect x="14" y="56" width="6" height="6" rx="2" fill="#5b21b6"/>
    <rect x="44" y="56" width="6" height="6" rx="2" fill="#5b21b6"/>
  </svg>
);

// Рендер Cosmo - шоколадный рулет с глазурью и звёздными веснушками
const CosmoSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="cosmoShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="chocoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a0522d"/>
        <stop offset="100%" stopColor="#6b3e26"/>
      </linearGradient>
    </defs>
    {/* Капюшон */}
    <ellipse cx="32" cy="18" rx="18" ry="14" fill="white"/>
    <path d="M 14 18 Q 32 8 50 18" fill="white"/>
    {/* Завязки капюшона */}
    <line x1="22" y1="26" x2="18" y2="36" stroke="#333" strokeWidth="2"/>
    <line x1="42" y1="26" x2="46" y2="36" stroke="#333" strokeWidth="2"/>
    {/* Основа - шоколадный рулет */}
    <ellipse cx="32" cy="42" rx="22" ry="18" fill="url(#chocoGrad)" filter="url(#cosmoShadow)"/>
    {/* Белая глазурь сверху */}
    <path d="M 14 36 Q 20 30 26 34 Q 32 28 38 34 Q 44 30 50 36" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
    {/* Звёздные веснушки */}
    <text x="18" y="44" fill="#40E0D0" fontSize="6">✦</text>
    <text x="24" y="48" fill="#FF69B4" fontSize="5">✦</text>
    <text x="20" y="52" fill="#32CD32" fontSize="5">✦</text>
    <text x="40" y="44" fill="#FF69B4" fontSize="6">✦</text>
    <text x="44" y="50" fill="#40E0D0" fontSize="5">✦</text>
    <text x="38" y="52" fill="#32CD32" fontSize="5">✦</text>
    {/* Глаза */}
    <ellipse cx="26" cy="40" rx="5" ry="6" fill="white"/>
    <ellipse cx="38" cy="40" rx="5" ry="6" fill="white"/>
    <circle cx="27" cy="41" r="3" fill="#4a3728"/>
    <circle cx="39" cy="41" r="3" fill="#4a3728"/>
    <circle cx="28" cy="40" r="1" fill="white"/>
    <circle cx="40" cy="40" r="1" fill="white"/>
    {/* Улыбка */}
    <path d="M 28 50 Q 32 54 36 50" stroke="#3d2817" strokeWidth="2" fill="none"/>
    {/* Полосатые носки */}
    <rect x="20" y="56" width="8" height="8" fill="#40E0D0"/>
    <rect x="20" y="58" width="8" height="2" fill="#FF69B4"/>
    <rect x="20" y="62" width="8" height="2" fill="#32CD32"/>
    <rect x="36" y="56" width="8" height="8" fill="#40E0D0"/>
    <rect x="36" y="58" width="8" height="2" fill="#FF69B4"/>
    <rect x="36" y="62" width="8" height="2" fill="#32CD32"/>
  </svg>
);

// Рендер Glisten - зеркало с золотой окантовкой и розовым бантом
const GlistenSprite: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <filter id="glistenShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <radialGradient id="mirrorGrad" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#e0e7ff"/>
      </radialGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700"/>
        <stop offset="50%" stopColor="#ffec8b"/>
        <stop offset="100%" stopColor="#daa520"/>
      </linearGradient>
    </defs>
    {/* Завиток "волос" */}
    <path d="M 32 8 Q 40 4 44 10 Q 48 16 42 18 Q 38 16 36 14 Q 34 10 32 8" fill="url(#goldGrad)"/>
    {/* Золотая окантовка */}
    <circle cx="32" cy="36" r="26" fill="url(#goldGrad)" filter="url(#glistenShadow)"/>
    {/* Зеркало */}
    <circle cx="32" cy="36" r="22" fill="url(#mirrorGrad)"/>
    {/* Блик на зеркале */}
    <ellipse cx="24" cy="28" rx="8" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(-20 24 28)"/>
    {/* Глаза */}
    <ellipse cx="25" cy="34" rx="5" ry="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1"/>
    <ellipse cx="39" cy="34" rx="5" ry="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1"/>
    <circle cx="26" cy="35" r="3" fill="#4338ca"/>
    <circle cx="40" cy="35" r="3" fill="#4338ca"/>
    <circle cx="27" cy="34" r="1" fill="white"/>
    <circle cx="41" cy="34" r="1" fill="white"/>
    {/* Румянец */}
    <ellipse cx="20" cy="40" rx="4" ry="2" fill="#fda4af" opacity="0.6"/>
    <ellipse cx="44" cy="40" rx="4" ry="2" fill="#fda4af" opacity="0.6"/>
    {/* Улыбка */}
    <path d="M 27 44 Q 32 50 37 44" stroke="#6366f1" strokeWidth="2" fill="none"/>
    {/* Розовый бант сзади (виден частично) */}
    <ellipse cx="12" cy="40" rx="8" ry="6" fill="#f9a8d4"/>
    <ellipse cx="52" cy="40" rx="8" ry="6" fill="#f9a8d4"/>
    <circle cx="32" cy="58" r="5" fill="#ec4899"/>
    {/* Белые гетры с розовыми пятнами */}
    <rect x="22" y="58" width="6" height="6" fill="white"/>
    <circle cx="24" cy="60" r="1.5" fill="#f9a8d4"/>
    <rect x="36" y="58" width="6" height="6" fill="white"/>
    <circle cx="38" cy="61" r="1.5" fill="#f9a8d4"/>
  </svg>
);

export const ToonRenderer: React.FC<ToonRendererProps> = ({ toonId, size = 64, className = '' }) => {
  const renderToon = () => {
    switch (toonId) {
      case 'pebble':
        return <PebbleSprite size={size} />;
      case 'vee':
        return <VeeSprite size={size} />;
      case 'sprout':
        return <SproutSprite size={size} />;
      case 'finn':
        return <FinnSprite size={size} />;
      case 'gigi':
        return <GigiSprite size={size} />;
      case 'astro':
        return <AstroSprite size={size} />;
      case 'shelly':
        return <ShellySprite size={size} />;
      case 'boxten':
        return <BoxtenSprite size={size} />;
      case 'cosmo':
        return <CosmoSprite size={size} />;
      case 'glisten':
        return <GlistenSprite size={size} />;
      default:
        return <PebbleSprite size={size} />;
    }
  };

  return (
    <div className={className}>
      {renderToon()}
    </div>
  );
};

export default ToonRenderer;
