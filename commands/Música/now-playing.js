const Discord = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
name: 'now-playing',
description: 'Mostra a música que está tocando atualmente',
type: Discord.ApplicationCommandType.ChatInput,
run: async (client, interaction) => {
const voiceChannel = interaction.member.voice.channel;
if (!voiceChannel)
return interaction.reply({ content: 'Você precisa estar em um canal de voz para usar este comando!', ephemeral: true });

const connection = getVoiceConnection(interaction.guildId);
if (!connection || !connection.state.subscription)
return interaction.reply({ content: 'Não estou tocando música no momento!', ephemeral: true });

const player = connection.state.subscription.player;
const current = player.state.resource.metadata;

if (!current)
return interaction.reply({ content: 'Não estou tocando música no momento!', ephemeral: true });

const embed = new Discord.EmbedBuilder()
.setColor(0x0099ff)
.setTitle('Tocando agora:')
.setDescription(`[${current.title}](${current.url})`); // Supondo que 'title' e 'url' sejam propriedades do objeto de metadados

await interaction.reply({ embeds: [embed], ephemeral: false });
}
}