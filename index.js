console.clear();
const Discord = require("discord.js");
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const config = require("./config.json");
let isPlaying = false

const client = new Discord.Client({
  intents: [
    1, 512, 32768, 2, 128,
    Discord.IntentsBitField.Flags.DirectMessages,
    Discord.IntentsBitField.Flags.GuildInvites,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildPresences,
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.MessageContent,
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMessageReactions,
    Discord.IntentsBitField.Flags.GuildEmojisAndStickers
  ],
  partials: [
    Discord.Partials.User,
    Discord.Partials.Message,
    Discord.Partials.Reaction,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember
  ]
});

module.exports = client;

// client.on('voiceStateUpdate', (oldState, newState) => {
//   if (newState.channel && !oldState.channel && newState.member.user.id === client.user.id) {
//       const channel = newState.channel;
//       const player = createAudioPlayer();
//       const stream = ytdl('https://www.youtube.com/watch?v=Oc7Cin_87H4', { filter: 'audioonly' });
//       const resource = createAudioResource(stream);

//       const connection = joinVoiceChannel({
//           channelId: channel.id,
//           guildId: channel.guild.id,
//           adapterCreator: channel.guild.voiceAdapterCreator,
//       });

//       player.play(resource);
//       connection.subscribe(player);

//       player.on('stateChange', (oldState, newState) => {
//           if (newState.status === 'idle') {
//               console.log('O som acabou de tocar.');
//               // connection.destroy();
//           }
//       });

//       player.on('error', error => {
//           console.error(`Erro no player: ${error.message}`);
//       });
//   }
// });

client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.channelId && newState.member.user.id === '667803134482972698') {
    let connection = getVoiceConnection(newState.guild.id);

    if (!connection || connection.joinConfig.channelId !== newState.channelId) {
      try {
        connection = joinVoiceChannel({
          channelId: newState.channelId,
          guildId: newState.guild.id,
          adapterCreator: newState.guild.voiceAdapterCreator,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
});

async function joinIfUserInVC(client, userId, guildId) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;
  const member = await guild.members.fetch(userId).catch(console.error);

  if (member && member.voice.channel) {
    const connection = getVoiceConnection(guildId);

    if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
      try {
        joinVoiceChannel({
          channelId: member.voice.channelId,
          guildId: guildId,
          adapterCreator: guild.voiceAdapterCreator,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}

setInterval(() => {
  joinIfUserInVC(client, '667803134482972698', '1212872518076076133');
}, 3);

client.on('interactionCreate', (interaction) => {
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.reply(`Error`);
    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
    cmd.run(client, interaction);
  }
});

client.slashCommands = new Discord.Collection();

require('./handler')(client);

client.login(config.token);

const fs = require('fs');

fs.readdir('./Events', (err, file) => {
  file.forEach(event => {
    require(`./Events/${event}`)
  })
})