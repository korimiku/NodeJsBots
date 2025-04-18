const bots = require('./bots.js');



mc.ping({ host: bots.host, port: bots.port }, (err, result) => {
    if (err) {
      console.error('Ошибка пинга сервера:', err);
      return;
    }
    motdServer = result.description.text
    versionServer = result.version.name
    onlinePlayer = result.players.online
  });
  