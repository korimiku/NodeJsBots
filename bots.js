const mineflayer = require('mineflayer')
const readline = require('readline');
const mc = require('minecraft-protocol');
const { stdin: input, stdout: output } = require('node:process');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;
const mineflayerViewer = require('prismarine-viewer').mineflayer
const radarPlugin = require('mineflayer-radar')(mineflayer);
const express = require('express');
const path = require('path');
const { toggleRotation, commands, Info, isMoving } = require('./functions.js');
const { startweb } = require('./webapp.js');
const bot = require('./botinit'); // Импортируем бота


const host = "localhost"
const port = "25565"


module.exports = {
  host,
  port
};



//нужная фигня для координат
bot.loadPlugin(pathfinder);
const coord = /x:(-?\d+) y:(-?\d+) z:(-?\d+) p:(-?\d+)/;


//команды
const stop_coord = "не иди"
//test x:100 y:100 z:100 p:0



//CLI
const rl = readline.createInterface({ input, output });
function clearConsole() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

let interval
function setup() {
  let i = 0;
  const frames = ['-', '\\', '|', '/'];
  interval = setInterval(() => {
    process.stdout.write((`\rЗапуск Бота... ${frames[i]}`));
    i = (i + 1) % frames.length;
  }, 100);
}

setup()
startweb()

setTimeout(() => {
  clearInterval(interval)
  clearConsole(); 
  setTimeout(() => { 
    Info(); 
    commands()
  }, 1500);
}, 1500);



rl.on('line', (input) => {
  const command = input.trim().toLowerCase();

  if (command === '!твое хп') {console.log(Math.round(`${bot.health}\n`));}
  else if (command.toLowerCase() === "!инфо") {Info()}
  else if (command.toLowerCase() === "!крутись") {toggleRotation(true);}
  else if (command.toLowerCase() === "!не крутись") {toggleRotation(false);}
  else if (command.toLowerCase() === "!команды") {commands();}
  else if (command.toLowerCase() === "!игроки макс") {console.log(`${bot.game.maxPlayers}\n`);}
  else if (coord.test(command) || /^-?\d+ -?\d+ -?\d+ -?\d+$/.test(command)) {
    // Обработка координат в формате "x:100 y:10 z:100 p:0" или "100 10 100 0"
    let x, y, z, p;
    if (coord.test(command)) {
      // Если координаты в формате "x:100 y:10 z:100 p:0"
      const matchcoord = command.match(coord);
      x = parseInt(matchcoord[1], 10);
      y = parseInt(matchcoord[2], 10);
      z = parseInt(matchcoord[3], 10);
      p = parseInt(matchcoord[4], 10);
    } else {
      // Если координаты в формате "100 10 100 0"
      const parts = command.split(' ');
      x = parseInt(parts[0], 10);
      y = parseInt(parts[1], 10);
      z = parseInt(parts[2], 10);
      p = parseInt(parts[3], 10);
    }
    
    
    console.log('В путь!\n');
    const goal = new GoalNear(x, y, z, p);
    bot.pathfinder.setGoal(goal);
  } else if (command === `!${stop_coord}`) {
   
    bot.pathfinder.stop();
    console.log("Останавливаюсь!\n")
  } else {
    bot.chat(input);
    //console.log('Неизвестная команда');
  }
});


//minecraft

bot.on('chat', (username, message) => {
  //логирование чата
  const chatMessage = `${username}: ${message}`;
  console.log(chatMessage); // Выводим сообщение в консоль
  //доступные комамнды
  if (username === bot.username) return
  if (message.toLowerCase() === "привет" ) {
    bot.chat("Привет! вот мои доступные команды:\n1)Твое хп");
    bot.chat("2)Укажите координаты в виде x:n y:n z:n p:n, p - погрешность в блоках, и я приду на них! Чтобы остановить меня скажите: 'Не иди' ");
    bot.chat("3)игроки макс");
    bot.chat("5)инфо");
    bot.chat("6)крутись, чтобы остановить 'не крутись'")
  }
  if (message.toLowerCase() === "твое хп" ) {bot.chat(Math.round(bot.health));}
  if (message === 'крутись') {toggleRotation(true);} 
  if (message === 'не крутись') {toggleRotation(false);}
  if (message.toLowerCase() === "игроки макс" ) {bot.chat(bot.game.maxPlayers);}
  if (message.toLowerCase() === "инфо" ) {
    bot.chat(`Название сервера: ${motdServer}`);
    bot.chat(`Версия сервера: ${versionServer}`);
    bot.chat(`Ядро сервера: ${bot.game.serverBrand}`);
    bot.chat(`Игроков онлайн: ${onlinePlayer}`);
  }

  if (coord.test(message) || /^-?\d+ -?\d+ -?\d+ -?\d+$/.test(message)) {
    let x, y, z, p;

    if (coord.test(message)) {
      const matchcoord = message.match(coord);
      x = parseInt(matchcoord[1], 10);
      y = parseInt(matchcoord[2], 10);
      z = parseInt(matchcoord[3], 10);
      p = parseInt(matchcoord[4], 10);
    } else {

      const parts = message.split(' ');
      if (parts.length !== 4) {
        bot.chat("Неправильный формат координат. Используйте: x:100 y:10 z:100 p:0 или 100 10 100 0");
        return;
      }
      x = parseInt(parts[0], 10);
      y = parseInt(parts[1], 10);
      z = parseInt(parts[2], 10);
      p = parseInt(parts[3], 10);
    }

    bot.chat('В путь!');
    const goal = new GoalNear(x, y, z, p);
    bot.pathfinder.setGoal(goal);
  }

  if (message.toLowerCase() === stop_coord) {
    bot.pathfinder.stop();
    bot.chat("Останавливаюсь!");
  }

});

bot.on('path_update', (result) => {
  if (result.status === 'noPath') {
    bot.chat('Я не смог прийти на координаты :(');
  }
});

bot.on('goal_reached', () => {
  bot.chat('Я на месте!');
});


// Возможная логика авторазации пока сыро
// bot.on('spawn', () => {
//    console.log("Бот заспавнился");
//   bot.chat('/l 1234');
//    bot.setControlState('forward', true);

//     // Останавливаем бота через 5 блоков
//     setTimeout(() => {
//       bot.setControlState('forward', false); // Останавливаем движение
//      bot.chat("Анти Бот Пройден!");
//     }, 5000); // Время в миллисекундах (5 секунд для 5 блоков)
// });


bot.on('kicked', (reason) => {console.log("Бот кикнут", reason);});
bot.on('error', (reason) => {console.log("Произошла ошибка", reason)})


