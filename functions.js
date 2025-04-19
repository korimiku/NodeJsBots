const mc = require('minecraft-protocol');
const bot = require('./botinit'); // Импортируем бота из отдельного файла
const { host, port } = require('./bots.js');


//!крутись
let isRotating = false; // Флаг вращения
let rotationInterval = null; // Интервал для вращения

function toggleRotation(enable) {
  if (enable && !isRotating) {
    isRotating = true;
    let yaw = 0;
    rotationInterval = setInterval(() => {
      yaw += 0.05;
      bot.look(yaw, 0, false);
    }, 50);
  } 
  else if (!enable && isRotating) {
    clearInterval(rotationInterval); // Останавливаем
    isRotating = false;
  }
}


//Это фигня для команд
function commands() {
  console.log("\nДоступные команды:");
  console.log("1)!Твое хп");
  console.log("2)Укажите координаты в виде x:n y:n z:n p:n, p - погрешность в блоках, и я приду на них! Чтобы остановить меня скажите: '!Не иди' ");
  console.log("3)!игроки макс");
  console.log("5)!инфо");
  console.log("6)!команды");
  console.log("7)!крутись, чтобы остановить '!не крутись'")
  console.log("Для того чтобы написать что-то в чат напишите это в консоль и нажмите enter\n");
}


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
  console.log('\nНазвание сервера:', motdServer);
  console.log('Версия сервера:', versionServer);
  console.log('Ядро сервера:', bot.game.serverBrand);
  console.log(`Игроков онлайн: ${onlinePlayer}\n`);
  
}



module.exports = {
  toggleRotation,
  commands,
  Info
};