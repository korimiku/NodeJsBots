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
const bot = require('./botinit'); // Импортируем бота

function startweb() {
const app = express();
app.use(express.static(path.join(__dirname, 'radar')));
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
  res.send(
    res.sendFile(path.join(__dirname, 'radar', 'index.html'))
  );
});
  //mineflayerViewer(bot, { port: 3002 });
  //mineflayerViewer(bot, { port: 3003, firstPerson: true });
  //console.log("Запуск Веб Ротации");
});

}

module.exports = {
    startweb
  };