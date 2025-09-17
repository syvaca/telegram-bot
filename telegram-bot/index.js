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
        await ctx.answerCbQuery("", {
          url: "https://rizzz-game.vercel.app/", // your Vercel game URL
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
