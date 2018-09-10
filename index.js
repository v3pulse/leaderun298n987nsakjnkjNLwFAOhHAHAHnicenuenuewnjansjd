const Discord = require("discord.js");
const token = process.env.BOT_TOKEN;

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setGame("Small Scrims")
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  
  let prefix = "!";
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  if(cmd === `${prefix}winner`){
    let leaderboard = message.guild.channels.find(c => c.name === "leaderboards");
  if(!message.member.roles.has(message.guild.roles.find(r => r.name === "Scrim Staff"))) return;
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!rUser) return message.reply("User not found!").then(msg => msg.delete(5000));
  let winners = JSON.parse(fs.readFileSync("./winners.json", "utf8"));
  const uid = rUser.id;
  if(!winners[uid]) winners[uid] = 0;
  winners[uid] += 1;
  fs.writeFile("./winners.json", JSON.stringify(winners), err => console.log(err));
  
  let sortable = [];
  for(const user in winners){

    sortable.push([user, winners[user]]);
  }

  sortable.sort(function(a, b){

    return b[1] - a[1];
  });

  leaderboard.bulkDelete(1);
  
  let embed = new Discord.RichEmbed()
  .setTitle("Leaderboards")
  .setColor("#ff0000")
  .setFooter("Leaderboards updated")
  .setTimestamp()
  .addField("Top 5", [
    `<@${sortable[0][0]}> - ${sortable [0][1]} wins`,
    `<@${sortable[1][0]}> - ${sortable [1][1]} wins`,
    `<@${sortable[2][1]}> - ${sortable [2][2]} wins`,
    `<@${sortable[3][2]}> - ${sortable [3][3]} wins`,
    `<@${sortable[4][3]}> - ${sortable [4][4]} wins`,
    `<@${sortable[5][4]}> - ${sortable [5][5]} wins`
  ].join("\n"));
  leaderboard.send(embed);
  
  return;
  }
  
});

bot.login(token);
