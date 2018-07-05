// memanggil package 
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment');



// JSON file
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

// event listener
bot.on('message', message => {

  // variable 
  let prefix = 'mina';
  let sender = message.author;
  let args = message.content.slice(prefix.length).trim().split(" ");
  let command = args.shift().toUpperCase();
  if (bot.user.id === message.author.id) { return } 
  
  // Event
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
  if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 1000;
  if (!userData[sender.id + message.guild.id].username) userData[sender.id + message.guild.id].username = message.author.username;
  
  fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
    if (err) console.error(err);
   }) 
  
    // command 
  if (command == "MONEY" || command == "BALANCE") {
    message.channel.send({embed:{
      title: "💸Bank", 
      color: 0xF1C40F, 
      fields:[{
          name:"Account Holder", 
          value:message.author.username, 
          inline:true
      }, 
      {
      name:"Account Balance", 
      value:userData[sender.id + message.guild.id].money,
      inline:true
      }] 
      }}) 
   } 
  
  if (command == "DAILY") {
    if (userData[sender.id + message.guild.id].lastDaily != moment().format('L')) {
    userData[sender.id + message.guild.id].lastDaily = moment().format('L') 
    userData[sender.id + message.guild.id].money += 500;
    message.channel.send({embed:{
      title:"Daily Reward", 
      color: 0xF1C40F,
      description:"You got 💸500 added to your account!"
    }})
 } else {
    message.channel.send({embed:{
      title:"Daily Reward", 
      color: 0xF1C40F,
      description:"You already colected your daily reward! you can collect your next reward **" + moment().endOf('day').fromNow() + '**.' 
    }})
  }
}

  if (command == 'GUILD') {
  
    var guildMoney = 0;
    var guildUsers = 0;
    var guildRichest = '';
    var guildRichest$ = 0;
    
    for (var i in userData) {
      if (i.endsWith(message.guild.id)) {
        guildMoney += userData[i].money;
        guildUsers += 1;
        if (userData[i].money > guildRichest$) {
          guildRichest$ = userData[i].money;
          guildRichest = userData[i].username;
        }
      }
    }
    
    message.channel.send({embed:{
      title:"Guild stats", 
      color: 0xF1C40F, 
      fields:[{
        name:"Accounts", 
        value:guildUsers, 
        inline:true
      },
      {
        name:"💸Total Money", 
        value:guildMoney, 
        inline:true
      }, 
      {
        name:"Richest Account", 
        value:`${guildRichest} with ${guildRichest$}`
      }]
    }})
    
  }
  
   if (command == 'GLOBAL') {
  
    var globalMoney = 0;
    var globalUsers = 0;
    var globalRichest = '';
    var globalRichest$ = 0;
    
    for (var i in userData) {
        globalMoney += userData[i].money;
        globalUsers += 1;
        if (userData[i].money > globalRichest$) {
          globalRichest$ = userData[i].money;
          globalRichest = userData[i].username;
        }
      }
    
    message.channel.send({embed:{
      title:"Global stats", 
      color: 0xF1C40F, 
      fields:[{
        name:"Accounts", 
        value:globalUsers, 
        inline:true
      },
      {
        name:"💸Total Money", 
        value:globalMoney, 
        inline:true
      }, 
      {
        name:"Richest Account", 
        value:`${globalRichest} with ${globalRichest$}`
      }]
    }})
    
  }
  
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
    if (err) console.error(err);
   }) 
  
}) 
bot.on('ready', () => {
  console.log('Economy Launched...')
 }) 
// login
bot.login(process.env.TOKEN);
