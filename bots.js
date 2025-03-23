const mineflayer = require('mineflayer')
const readline = require('readline');
const mc = require('minecraft-protocol');
const { stdin: input, stdout: output } = require('node:process');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;
const mineflayerViewer = require('prismarine-viewer').mineflayer
const radarPlugin = require('mineflayer-radar')(mineflayer);
const express = require('express');


const host = "localhost"
const port = "25565"

const bot = mineflayer.createBot({
  
  host: host, // minecraft server ip
  username: 'Bot', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: port,
  // port: 25565,              // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

//sudo lsof -i :3001  # Найти процесс, использующий порт 3000
//kill -9 <PID>       # Заменить <PID> на идентификатор процесса из вывода lsof

bot.loadPlugin(pathfinder);

mc.ping({ host: host, port: port }, (err, result) => {
  if (err) {
    console.error('Ошибка пинга сервера:', err);
    return;
  }
  motdServer = result.description.text
  versionServer = result.version.name
  onlinePlayer = result.players.online
});

function Info() {
  console.log('Название сервера:', motdServer);
  console.log('Версия сервера:', versionServer);
  console.log('Ядро сервера:', bot.game.serverBrand);
  console.log('Игроков онлайн:', onlinePlayer);
  
}






//команды
const info = "инфо"
const serverBrand = "ядро сервера"
const hello = "привет"
const heal = "твое хп"
const max_pl = "игроки макс"
const stop_coord = "не иди"
const coord = /x:(-?\d+) y:(-?\d+) z:(-?\d+) p:(-?\d+)/;
//test x:100 y:100 z:100 p:0



//CLI
const rl = readline.createInterface({ input, output });



//Возможная логика очистки консоли
function clearConsole() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

let i = 0;
const frames = ['-', '\\', '|', '/'];
const interval = setInterval(() => {
  process.stdout.write((`\rЗапуск Бота... ${frames[i]}`));
  i = (i + 1) % frames.length;
}, 100);

const app = express();
const portapp = "3333"
const portViewerThirdPerson = "3334";
const portViewerFirstPerson = "3335";

bot.once('spawn', () => {
  console.log("\nУспешное подключение");
  app.listen(portapp, () => {
    console.log(`Веб ротация запущена на http://localhost:${portapp}`);
    mineflayerViewer(bot, { port: portViewerFirstPerson, firstPerson: true });
    mineflayerViewer(bot, { port: portViewerThirdPerson, firstPerson: false });
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Меню радара</h1>
    <ul>
      <li><a href="http://localhost:${portViewerFirstPerson}">Вид от первого лица</a></li>
      <li><a href="http://localhost:${portViewerThirdPerson}">Вид от третьего лица</a></li>
    </ul>
  `);
});
  //mineflayerViewer(bot, { port: 3002 });
  //mineflayerViewer(bot, { port: 3003, firstPerson: true });
  //console.log("Запуск Веб Ротации");
});

setTimeout(() => {
  clearInterval(interval);
  console.log('\rЗапуск завершен');
  clearConsole(); 
  setTimeout(() => {
    
    console.log("");
    Info(); 
    console.log("");
    console.log("Доступные команды:");
    console.log("1)!Твое хп");
    console.log("2)Укажите координаты в виде x:n y:n z:n p:n, p - погрешность в блоках, и я приду на них! Чтобы остановить меня скажите: 'Не иди' ");
    console.log("3)!игроки макс");
    console.log("4)!ядро сервера");
    console.log("5)!инфо");
    console.log("6)!команды");
    console.log("Для того чтобы написать что-то в чат напишите это в консоль и нажмите enter");
    console.log("");
  }, 1500);
}, 1500);





rl.on('line', (input) => {
  const command = input.trim().toLowerCase();

  if (command === `!${heal}`) {
   
    console.log(Math.round(bot.health));
    console.log("")
  } else if (command.toLowerCase() === `!${info}`) {
   
    Info();
    console.log("")
  } else if (command === `!${serverBrand}`) {
   
    console.log(bot.game.serverBrand);
    console.log("")
  } else if (command === "!команды") {
   
    console.log("Доступные команды:");
    console.log("1)!Твое хп");
    console.log("2)Укажите координаты в виде x:n y:n z:n p:n, p - погрешность в блоках, и я приду на них! Чтобы остановить меня скажите: 'Не иди' ");
    console.log("3)!игроки макс");
    console.log("4)!ядро сервера");
    console.log("5)!инфо");
    console.log("6)!команды");
    console.log("")

  } else if (command === `!${max_pl}`) {
   
    console.log(bot.game.maxPlayers);
    console.log("")
  } else if (coord.test(command)) {
    // Проверяем, соответствует ли команда регулярному выражению координат
    const matchcoord = command.match(coord);
    if (matchcoord) {
      const x = parseInt(matchcoord[1], 10);
      const y = parseInt(matchcoord[2], 10);
      const z = parseInt(matchcoord[3], 10);
      const p = parseInt(matchcoord[4], 10);

      console.log('В путь!');
      console.log("")
      const goal = new GoalNear(x, y, z, p);
      bot.pathfinder.setGoal(goal);
    }
  } else if (command === `!${stop_coord}`) {
   
    bot.pathfinder.stop();
    console.log("Останавливаюсь!")
    console.log("")
  } else {
    bot.chat(input);
    //console.log('Неизвестная команда');
  }
});


bot.on('chat', (username, message) => {
  //логирование чата
  const chatMessage = `${username}: ${message}`;
  console.log(chatMessage); // Выводим сообщение в консоль
  //доступные комамнды
  if (username === bot.username) return
  if (message.toLowerCase() === hello ) {
    bot.chat("Привет! вот мои доступные команды:\n1)Твое хп");
    bot.chat("2)Укажите координаты в виде x:n y:n z:n p:n, p - погрешность в блоках, и я приду на них! Чтобы остановить меня скажите: 'Не иди' ");
    bot.chat("3)игроки макс");
    bot.chat("4)ядро сервера");
    bot.chat("5)инфо");
  }

  

  if (message.toLowerCase() === heal ) {
    bot.chat(Math.round(bot.health));
  }

  if (message.toLowerCase() === info ) {
    bot.chat(`Название сервера: ${motdServer}`);
    bot.chat(`Версия сервера: ${versionServer}`);
    bot.chat(`Ядро сервера: ${bot.game.serverBrand}`);
    bot.chat(`Игроков онлайн: ${onlinePlayer}`);
  }

  
  if (message.toLowerCase() === max_pl ) {
    bot.chat(bot.game.maxPlayers);
  }

  if (message.toLowerCase() === serverBrand ) {
    bot.chat(bot.game.serverBrand);
  }


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

  if (message.toLowerCase() === stop_coord ) {
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











//Возможная логика авторазации пока сыро
//bot.on('spawn', () => {
//    console.log("Бот заспавнился");
//    bot.chat('/l iopqwe1');
//    bot.setControlState('forward', true);
//
//    // Останавливаем бота через 5 блоков
//    setTimeout(() => {
//      bot.setControlState('forward', false); // Останавливаем движение
//      bot.chat("Анти Бот Пройден!");
//    }, 5000); // Время в миллисекундах (5 секунд для 5 блоков)
//});


bot.on('kicked', (reason) => {

  console.log("Бот кикнут", reason);
});


bot.on('error', (reason) => {
  console.log("Произошла ошибка", reason)
})


