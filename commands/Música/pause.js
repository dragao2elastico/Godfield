const Discord = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'pause', // comando pause
    description: 'Pausa a música que está tocando', // descrição
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel)
            return interaction.reply({ content: 'Você precisa estar em um canal de voz para pausar a música!', ephemeral: true });

        const connection = getVoiceConnection(interaction.guildId);
        if (!connection)
            return interaction.reply({ content: 'Não estou tocando música no momento!', ephemeral: true });

        const player = connection.state.subscription.player;
        if (player.state.status === 'paused')
            return interaction.reply({ content: 'A música já está pausada.', ephemeral: true });

        player.pause();
        
        const embed = new Discord.EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Música pausada')
            .setDescription(`A música foi pausada com sucesso!`);

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
}