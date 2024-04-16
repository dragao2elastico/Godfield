const Discord = require("discord.js");
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
name: 'volume',
description: 'Ajusta o volume da música atual entre 1 e 100',
type: Discord.ApplicationCommandType.ChatInput,
options: [{
name: 'nivel',
description: 'Define o nível do volume entre 1 e 100.',
type: Discord.ApplicationCommandOptionType.Integer,
required: true,
}],
run: async (client, interaction) => {
const volume = interaction.options.getInteger('nivel');
if (volume < 1 || volume > 100) {
return interaction.reply({ content: 'O nível de volume deve estar entre 1 e 100.', ephemeral: true });
}

const voiceChannel = interaction.member.voice.channel;
if (!voiceChannel) {
return interaction.reply({ content: 'Você precisa estar em um canal de voz para ajustar o volume!', ephemeral: true });
}

const connection = getVoiceConnection(interaction.guildId);
if (!connection) {
return interaction.reply({ content: 'Não estou conectado em um canal de voz!', ephemeral: true });
}

if (connection.state.status !== AudioPlayerStatus.Playing) {
return interaction.reply({ content: 'Não estou tocando música no momento!', ephemeral: true });
}

// Aqui a gente garante que subscription e player existem antes de tentar usar
const subscription = connection.state.subscription;
if (!subscription) {
return interaction.reply({ content: 'Não foi possível encontrar a subscription!', ephemeral: true });
}

const player = subscription.player;
if (!player) {
return interaction.reply({ content: 'Não foi possível encontrar o player!', ephemeral: true });
}

if (!player.state.resource) {
return interaction.reply({ content: 'Não foi possível encontrar o resource!', ephemeral: true });
}

player.state.resource.volume.setVolumeLogarithmic(volume / 100);

const embed = new Discord.EmbedBuilder()
.setColor(0x0099ff)
.setTitle('Volume Ajustado')
.setDescription(`O volume da música agora está em: ${volume}%`);
await interaction.reply({ embeds: [embed], ephemeral: false });
console.log(`Volume ajustado para: ${volume}%`);
}
}