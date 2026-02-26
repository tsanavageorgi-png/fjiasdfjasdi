const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// CORS для Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Serve static files from the built client
app.use(express.static(path.join(__dirname, '../dist')));

// Состояние игры
const lobbies = {
  players: new Map(), // socketId -> player data
  elevators: [
    { id: 1, players: [], countdown: null, gameStarting: false },
    { id: 2, players: [], countdown: null, gameStarting: false },
    { id: 3, players: [], countdown: null, gameStarting: false }
  ]
};

// Игровые комнаты
const gameRooms = new Map(); // roomId -> game state

// Генерация ID комнаты
function generateRoomId() {
  return 'room_' + Math.random().toString(36).substr(2, 9);
}

// Socket.io обработчики
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Присоединение к лобби
  socket.on('join_lobby', (data) => {
    const { playerName, toonId } = data;
    
    const player = {
      oderId: socket.id,
      odername: playerName,
      toonId: toonId,
      position: { x: 600 + Math.random() * 100, y: 400 + Math.random() * 100 },
      health: 3,
      isAlive: true,
      inElevator: false,
      elevatorId: null,
      ready: false
    };
    
    lobbies.players.set(socket.id, player);
    socket.join('lobby');
    
    // Отправляем текущее состояние лобби новому игроку
    socket.emit('lobby_state', {
      players: Array.from(lobbies.players.values()),
      elevators: lobbies.elevators
    });
    
    // Уведомляем остальных о новом игроке
    socket.to('lobby').emit('player_joined', player);
    
    console.log(`${playerName} joined lobby with ${toonId}`);
  });

  // Обновление позиции в лобби
  socket.on('lobby_move', (position) => {
    const player = lobbies.players.get(socket.id);
    if (player) {
      player.position = position;
      socket.to('lobby').emit('player_moved', {
        oderId: socket.id,
        position
      });
    }
  });

  // Вход в лифт
  socket.on('enter_elevator', (elevatorId) => {
    const player = lobbies.players.get(socket.id);
    if (!player || player.inElevator) return;
    
    const elevator = lobbies.elevators.find(e => e.id === elevatorId);
    if (!elevator || elevator.players.length >= 8) return;
    
    player.inElevator = true;
    player.elevatorId = elevatorId;
    elevator.players.push(socket.id);
    
    // Начать обратный отсчёт если первый игрок
    if (elevator.players.length === 1 && !elevator.gameStarting) {
      elevator.countdown = 20;
      elevator.gameStarting = true;
      
      // Таймер
      const countdownInterval = setInterval(() => {
        elevator.countdown--;
        
        io.to('lobby').emit('elevator_update', {
          elevatorId,
          players: elevator.players.map(id => lobbies.players.get(id)),
          countdown: elevator.countdown
        });
        
        if (elevator.countdown <= 0) {
          clearInterval(countdownInterval);
          startGame(elevatorId);
        }
      }, 1000);
    }
    
    io.to('lobby').emit('elevator_update', {
      elevatorId,
      players: elevator.players.map(id => lobbies.players.get(id)),
      countdown: elevator.countdown
    });
    
    console.log(`${player.odername} entered elevator ${elevatorId}`);
  });

  // Выход из лифта
  socket.on('leave_elevator', () => {
    const player = lobbies.players.get(socket.id);
    if (!player || !player.inElevator) return;
    
    const elevator = lobbies.elevators.find(e => e.id === player.elevatorId);
    if (elevator) {
      elevator.players = elevator.players.filter(id => id !== socket.id);
      
      // Если лифт пуст, сбросить таймер
      if (elevator.players.length === 0) {
        elevator.countdown = null;
        elevator.gameStarting = false;
      }
      
      io.to('lobby').emit('elevator_update', {
        elevatorId: elevator.id,
        players: elevator.players.map(id => lobbies.players.get(id)),
        countdown: elevator.countdown
      });
    }
    
    player.inElevator = false;
    player.elevatorId = null;
  });

  // Начало игры
  function startGame(elevatorId) {
    const elevator = lobbies.elevators.find(e => e.id === elevatorId);
    if (!elevator || elevator.players.length === 0) return;
    
    const roomId = generateRoomId();
    const players = elevator.players.map(id => lobbies.players.get(id));
    
    // Создаём игровую комнату
    const gameState = {
      roomId,
      floor: 1,
      players: players.map(p => ({
        ...p,
        position: { x: 800, y: 900 },
        health: getToonHealth(p.toonId),
        isAlive: true
      })),
      machines: generateMachines(1),
      twisteds: generateTwisteds(1),
      isPanicMode: false,
      panicTimer: 15
    };
    
    gameRooms.set(roomId, gameState);
    
    // Перемещаем игроков в игровую комнату
    elevator.players.forEach(id => {
      const playerSocket = io.sockets.sockets.get(id);
      if (playerSocket) {
        playerSocket.leave('lobby');
        playerSocket.join(roomId);
        lobbies.players.delete(id);
      }
    });
    
    // Сбрасываем лифт
    elevator.players = [];
    elevator.countdown = null;
    elevator.gameStarting = false;
    
    // Отправляем старт игры
    io.to(roomId).emit('game_start', gameState);
    
    console.log(`Game started in room ${roomId} with ${players.length} players`);
    
    // Игровой цикл
    startGameLoop(roomId);
  }

  // Движение игрока в игре
  socket.on('game_move', (data) => {
    const { roomId, position } = data;
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    const player = room.players.find(p => p.oderId === socket.id);
    if (player && player.isAlive) {
      player.position = position;
      socket.to(roomId).emit('player_moved', {
        oderId: socket.id,
        position
      });
    }
  });

  // Заполнение машины
  socket.on('machine_filled', (data) => {
    const { roomId, machineId } = data;
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    const machine = room.machines.find(m => m.id === machineId);
    if (machine && !machine.filled) {
      machine.filled = true;
      
      io.to(roomId).emit('machine_update', {
        machineId,
        filled: true
      });
      
      // Проверка всех машин
      if (room.machines.every(m => m.filled) && !room.isPanicMode) {
        room.isPanicMode = true;
        room.panicTimer = 15;
        
        io.to(roomId).emit('panic_mode', {
          timer: room.panicTimer
        });
        
        // Таймер паники
        const panicInterval = setInterval(() => {
          room.panicTimer--;
          
          if (room.panicTimer <= 0) {
            clearInterval(panicInterval);
            // Проверяем кто дошёл до лифта
            checkElevatorReached(roomId);
          }
        }, 1000);
      }
    }
  });

  // Игрок достиг лифта
  socket.on('reached_elevator', (data) => {
    const { roomId } = data;
    const room = gameRooms.get(roomId);
    if (!room || !room.isPanicMode) return;
    
    const player = room.players.find(p => p.oderId === socket.id);
    if (player) {
      player.reachedElevator = true;
    }
  });

  // Урон игроку
  socket.on('player_damaged', (data) => {
    const { roomId } = data;
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    const player = room.players.find(p => p.oderId === socket.id);
    if (player && player.isAlive) {
      player.health--;
      
      io.to(roomId).emit('player_health', {
        oderId: socket.id,
        health: player.health
      });
      
      if (player.health <= 0) {
        player.isAlive = false;
        io.to(roomId).emit('player_died', { oderId: socket.id });
        
        // Проверка game over
        if (room.players.every(p => !p.isAlive)) {
          io.to(roomId).emit('game_over', {
            floor: room.floor,
            reason: 'all_dead'
          });
          gameRooms.delete(roomId);
        }
      }
    }
  });

  // Использование способности
  socket.on('use_ability', (data) => {
    const { roomId, abilityType, targetId } = data;
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    const player = room.players.find(p => p.oderId === socket.id);
    if (!player) return;
    
    // Способности влияющие на других игроков
    if (abilityType === 'heal' && targetId) {
      const target = room.players.find(p => p.oderId === targetId);
      if (target && target.isAlive) {
        target.health = Math.min(target.health + 1, getToonHealth(target.toonId));
        io.to(roomId).emit('player_health', {
          oderId: targetId,
          health: target.health
        });
      }
    } else if (abilityType === 'stamina') {
      // Восстановление стамины всем рядом
      io.to(roomId).emit('stamina_restored', { fromPlayer: socket.id });
    } else if (abilityType === 'distract') {
      // Отвлечение твистедов
      io.to(roomId).emit('twisteds_distracted', { 
        position: player.position,
        duration: 5
      });
    }
  });

  // Отключение
  socket.on('disconnect', () => {
    const player = lobbies.players.get(socket.id);
    if (player) {
      // Удаление из лифта
      if (player.inElevator) {
        const elevator = lobbies.elevators.find(e => e.id === player.elevatorId);
        if (elevator) {
          elevator.players = elevator.players.filter(id => id !== socket.id);
          if (elevator.players.length === 0) {
            elevator.countdown = null;
            elevator.gameStarting = false;
          }
        }
      }
      
      lobbies.players.delete(socket.id);
      io.to('lobby').emit('player_left', { oderId: socket.id });
    }
    
    // Удаление из игровых комнат
    gameRooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.oderId === socket.id);
      if (playerIndex !== -1) {
        room.players[playerIndex].isAlive = false;
        io.to(roomId).emit('player_disconnected', { oderId: socket.id });
      }
    });
    
    console.log('Player disconnected:', socket.id);
  });
});

// Вспомогательные функции
function getToonHealth(toonId) {
  const mains = ['pebble', 'sprout', 'vee', 'shelly', 'astro'];
  return mains.includes(toonId) ? 2 : 3;
}

function generateMachines(floor) {
  let count = 4;
  if (floor >= 5 && floor <= 10) count = 5;
  else if (floor >= 11 && floor <= 15) count = 6;
  else if (floor >= 16) count = 8;
  
  const machines = [];
  for (let i = 0; i < count; i++) {
    machines.push({
      id: `machine_${i}`,
      position: {
        x: 100 + (i % 4) * 350 + Math.random() * 100,
        y: 200 + Math.floor(i / 4) * 300 + Math.random() * 100
      },
      filled: false
    });
  }
  return machines;
}

function generateTwisteds(floor) {
  const count = Math.min(1 + Math.floor(floor / 3), 5);
  const toons = ['pebble', 'finn', 'gigi', 'astro', 'sprout', 'vee', 'shelly', 'boxten'];
  const abilities = ['chase', 'slow', 'steal', 'speed'];
  
  const twisteds = [];
  for (let i = 0; i < count; i++) {
    twisteds.push({
      id: `twisted_${i}`,
      toonId: toons[Math.floor(Math.random() * toons.length)],
      position: {
        x: 100 + Math.random() * 1400,
        y: 100 + Math.random() * 800
      },
      speed: 2 + floor * 0.1,
      ability: abilities[Math.floor(Math.random() * abilities.length)],
      state: 'patrol'
    });
  }
  return twisteds;
}

function startGameLoop(roomId) {
  const interval = setInterval(() => {
    const room = gameRooms.get(roomId);
    if (!room) {
      clearInterval(interval);
      return;
    }
    
    // Обновление твистедов (серверная логика)
    room.twisteds.forEach(twisted => {
      // Простое патрулирование
      twisted.position.x += (Math.random() - 0.5) * twisted.speed * 2;
      twisted.position.y += (Math.random() - 0.5) * twisted.speed * 2;
      
      // Границы
      twisted.position.x = Math.max(50, Math.min(1550, twisted.position.x));
      twisted.position.y = Math.max(50, Math.min(950, twisted.position.y));
    });
    
    // Отправляем обновление твистедов
    io.to(roomId).emit('twisteds_update', room.twisteds);
    
  }, 100); // 10 FPS для серверной логики
}

function checkElevatorReached(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  const survivors = room.players.filter(p => p.isAlive && p.reachedElevator);
  const dead = room.players.filter(p => p.isAlive && !p.reachedElevator);
  
  // Убиваем тех кто не успел
  dead.forEach(p => {
    p.isAlive = false;
    io.to(roomId).emit('player_died', { oderId: p.oderId, reason: 'didnt_reach_elevator' });
  });
  
  if (survivors.length === 0) {
    io.to(roomId).emit('game_over', {
      floor: room.floor,
      reason: 'no_survivors'
    });
    gameRooms.delete(roomId);
  } else {
    // Следующий этаж
    room.floor++;
    room.machines = generateMachines(room.floor);
    room.twisteds = generateTwisteds(room.floor);
    room.isPanicMode = false;
    room.panicTimer = 15;
    
    survivors.forEach(p => {
      p.position = { x: 800, y: 900 };
      p.reachedElevator = false;
    });
    
    io.to(roomId).emit('next_floor', {
      floor: room.floor,
      machines: room.machines,
      twisteds: room.twisteds,
      players: survivors
    });
  }
}

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 Dandy World Server running on port ${PORT}`);
});
