const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');
require('dotenv').config()

const token = process.env.MY_TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет, я бот-скриншотер. Нажми на кнопку, чтобы получить скриншот главной страницы сайта RBC.ru!", {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "Сделай скриншот",
          callback_data: 'screenshot'
        }]
      ]
    }
  });
});

bot.on('callback_query', async (query) => {
  if (query.data === 'screenshot') {
    bot.answerCallbackQuery(query.id);
    bot.sendChatAction(query.message.chat.id, 'upload_photo');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.rbc.ru/');
    const screenshotBuffer = await page.screenshot();
    await browser.close();

    bot.sendPhoto(query.message.chat.id, screenshotBuffer, {
      caption: 'Скриншот главной страницы RBC.ru'
    });
  }
});
