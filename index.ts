import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()
import fs from "fs";
const client = new DiscordJS.Client({
  intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

client.on('ready', ()=>{
  console.log('Bot is ready');

  const guildId = process.env.TEST_GUILD_ID!
  const guild = client.guilds.cache.get(guildId) 
  let commands;
  if(guild){
    commands = guild.commands
  }else {
    commands = client.application?.commands
  }
  commands?.create({
    name:'ping',
    description:'Replies with pong.',
  })
  commands?.create({
    name:'add',
    description:'Add 2 number.',
    options: [
      {
        name:'num1',
        description:'the first number',
        required:true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,

      },
      {
        name:'num2',
        description:'the second number',
        required:true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,

      },
    ]
  })
  commands?.create({
    name:'checkprice',
    description:'Check prices of current market',
    options: [
      {
        name:'itemname',
        description:'name of the item',
        required:true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,

      },
    ]
  }),
  commands?.create({
    name:'alertprice',
    description:'put alert for prices of current market',
    options: [
      {
        name:'itemname',
        description:'name of the item',
        required:true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,

      },{
        name:'prixvoulu',
        description:'name of the item',
        required:true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,

      },
    ]
  })
})

client.on('interactionCreate',async (interaction) => {
  if(!interaction.isCommand()){
    console.log('was here');
    
    return;
  }
  
  
  const {commandName,options } = interaction
  if(commandName === 'ping'){
    interaction.reply({
      content: 'pong', ephemeral:true
    })
  }else if (commandName === 'add'){
    const num1 = options.getNumber('num1') !
    const num2 = options.getNumber('num2') !
    await interaction.deferReply({
      ephemeral:true
    })
    await interaction.editReply({
      content:`the sum is ${num1+num2}`
      
    })
  }else if (commandName === 'checkprice'){
    const itemname = options.getString('itemname') !
    await interaction.deferReply({
      ephemeral:true
    })
    
    let fichier: any = [];
    
    fs.readFile("output.json", async function (err, content) {
      if (err) throw err;
      fichier = await JSON.parse(content.toString());
      let trouve = false;
      for (let i in fichier){
        if (fichier[i].name == itemname){
          trouve = true
          await interaction.editReply({
            content:`${itemname} price : ${fichier[i].prix}`
          })
        }
      }
      if (trouve == false) {
        await interaction.editReply({
          content:`${itemname} was not found`
        })
      }
    });
    
  }
})


client.on('messageCreate', (message)=>{
  if(message.content != null && message.content.startsWith('!')){
    if(message.content === '!ping'){
      message.reply({
        content: 'pong'
      })
    }
  }
  
})


client.login(token)