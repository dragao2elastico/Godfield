const Discord = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;
const SOUNDCLOUD_CLIENT_ID = 'AYuavtJ0edQEMiPskAZi3VfN1JJ9uDc5';
scdl.setClientID(SOUNDCLOUD_CLIENT_ID);

module.exports = {
  name: 'play',
  description: 'Toca uma música do YouTube ou SoundCloud no canal de voz',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'url',
      description: 'A URL do vídeo do YouTube ou SoundCloud para tocar',
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'ephemeral',
      description: 'Escolha se a resposta será visível apenas para você',
      type: Discord.ApplicationCommandOptionType.Boolean,
      required: false,
    }
  ],
  run: async (client, interaction) => {
    const url = interaction.options.getString('url');
    const ephemeral = interaction.options.getBoolean('ephemeral') || false;

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({
        content: 'Você precisa estar em um canal de voz pra tocar música!',
        ephemeral: true
      });
    }

    let stream;
    if (url.includes('soundcloud.com')) {
      try {
        stream = await scdl.download(url);
      } catch (error) {
        return interaction.reply({
          content: 'Houve um problema ao tentar tocar a música do SoundCloud.',
          ephemeral: true
        });
      }
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      stream = ytdl(url, { filter: 'audioonly' });
    } else {
      return interaction.reply({
        content: 'A URL fornecida não é de um vídeo do YouTube ou SoundCloud.',
        ephemeral: true
      });
    }

    const player = createAudioPlayer();
    const resource = createAudioResource(stream);
    
    player.on(AudioPlayerStatus.Idle, () => {
      console.log('O som acabou de tocar.');
      voiceChannel.leave();
      player.stop();
    });

    player.on('error', error => {
      console.error(`Erro no player: ${error.message}`);
      interaction.followUp({ content: 'Ocorreu um erro ao reproduzir a música.', ephemeral: true });
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    player.play(resource);
    
    await interaction.reply({
      content: `Tocando agora: ${url}`,
      ephemeral: ephemeral
    });
  }
};