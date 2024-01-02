const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "6563265115:AAHHFX8-oC8aUp-TEdP6LBsThAx2vBelsuM";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "сейчас я загадаю число а  ты отгадай");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "отгадай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "начальное приветствие" },
    { command: "/info", description: "получить информацию о польователе" },
    { command: "/game", description: "игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот Icon Development Group`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "я вас не понимаю. попытацтесь снова");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не отгадал цифру ${data}`,
        againOptions
      );
    }
  });
};
start();
