const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;
const mineflayerViewer = require('prismarine-viewer').mineflayer

console.log("Запуск Бота")

const bot = mineflayer.createBot({
  
  host: 'altair.minerent.net', // minecraft server ip
  username: 'KoriBotTest', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: 25600,
  // port: 25565,              // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})


bot.loadPlugin(pathfinder);

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  if (message.toLowerCase() === "привет" ) {
    bot.chat("Привет! вот мои доступные команды:\n 1)'Твое хп'\n 2) Укажите координаты в виде x:n y:n z:n p:n, p - погрешность в блоках, и я приду на них! Чтобы остановить меня скажите: 'Не иди' ");
    bot.chat("3)игроки максимум");
  }
  if (message.toLowerCase() === "твое хп" ) {
    bot.chat(Math.round(bot.health));
  }

  
  

  if (message.toLowerCase() === "игроки максимум" ) {
    bot.chat(bot.game.maxPlayers);
  }


  const coord = /x:(-?\d+) y:(-?\d+) z:(-?\d+) p:(-?\d+)/;
  const matchcoord = message.match(coord);

  if (matchcoord) {
    // Извлекаем координаты из сообщения
    const x = parseInt(matchcoord[1], 10);
    const y = parseInt(matchcoord[2], 10);
    const z = parseInt(matchcoord[3], 10);
    const p = parseInt(matchcoord[4], 10);

    bot.chat('В путь!');

    const goal = new GoalNear(x, y, z, p);
    bot.pathfinder.setGoal(goal);
  }

  if (message.toLowerCase() === "не иди" ) {
    bot.pathfinder.stop();
    bot.chat("Останавливаюсь!");
  }

});

bot.on('path_update', (result) => {
  if (result.status === 'noPath') {
    bot.chat('Я не смог прийти на координаты :(');
  }
});


// Обработчик достижения цели
bot.on('goal_reached', () => {
  bot.chat('Я на месте!');
});




bot.on('spawn', () => {
    console.log("Бот заспавнился")
});


bot.on('kicked', (reason) => {

  console.log("Бот кикнут", reason);
});


bot.on('error', (reason) => {
  console.log("Произошла ошибка", reason)
})

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3000 })
  console.log("Запуск Веб Ротации")
})