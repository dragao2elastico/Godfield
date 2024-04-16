require('../index')

const Discord = require('discord.js')
const client = require('../index')

client.on('messageCreate', message => {
    if (message.channel.id === '1225233999736344626') {
      try {
        const emoji = '<:seta2:1221049982426157096>'; 
        const emoji2 = '<:seta4:1221049977229545495>'
        message.react(emoji);
        message.react(emoji2);
      } catch (error) {
        console.error('Couldn\'t react to the message:', error);
      }
    }

    if (message.channel.id === '1213427212477538315') {
        try {
          const emoji = '<:seta2:1221049982426157096>'; 
          const emoji2 = '<:seta4:1221049977229545495>'
          message.react(emoji);
          message.react(emoji2);
        } catch (error) {
          console.error('Couldn\'t react to the message:', error);
        }
      }

      if (message.channel.id === '1212872519250616394') {
        try {
          const emoji = '<:maozinhaacorao:1217938310799032520>'; 
          const emoji2 = '<a:corao3d:1221048511953506366>'
          message.react(emoji);
          message.react(emoji2);
        } catch (error) {
          console.error('Couldn\'t react to the message:', error);
        }
      }
  });