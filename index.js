import { Telegraf } from "telegraf";

const bot = new Telegraf("8083131763:AAERBs2Ky8WU5TKUw1lIk8m1fTK_nG6g91g");

bot.command("play", (ctx) => {
  ctx.replyWithGame("rizzzgames");
});

bot.on("inline_query", (ctx) =>
  ctx.answerInlineQuery([
    { type: "game", id: "g1", game_short_name: "rizzzgames" },
  ])
);

bot.on("callback_query", async (ctx) => {
  try {
    // Only handle the game callback
    if (ctx.callbackQuery?.game_short_name === "rizzzgames") {
      // Extract user data from the callback query
      const user = ctx.callbackQuery.from;
      
      console.log("Telegram user data:", user); // Debug log
      
      // Create user data object with all available information
      const userData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name || null,
        username: user.username || null,
        language_code: user.language_code || null,
        is_premium: user.is_premium || false
      };
      
      // Encode user data as URL parameter
      const encodedUserData = encodeURIComponent(JSON.stringify(userData));
      let gameUrl = `https://rizzz-game.vercel.app/?user=${encodedUserData}`;
      if (ctx.chat.id && ctx.callbackQuery.message.message_id) {
        gameUrl += `&chat_id=${ctx.chat.id}&message_id=${ctx.callbackQuery.message.message_id}`;
      } else if (ctx.callbackQuery.inline_message_id) {
        gameUrl += `&inline_message_id=${ctx.callbackQuery.inline_message_id}`;
      }

      console.log("Game URL with user data:", gameUrl); // Debug log
      console.log("Chat ID:", ctx.chat.id); // Debug log
      console.log("Message ID:", ctx.callbackQuery.message.message_id); // Debug log
      console.log("Inline Message ID:", ctx.callbackQuery.inline_message_id); // Debug log
      
      await ctx.answerCbQuery("", {
        url: gameUrl
      });
    } else {
      // Acknowledge any other callbacks (if any)
      await ctx.answerCbQuery();
    }
  } catch (err) {
    console.error("callback_query error:", err);
    // At least acknowledge so Telegram stops spinning
    await ctx.answerCbQuery("Launching game…");
  }
});
  
  bot.launch();
  console.log("Bot is running…");
