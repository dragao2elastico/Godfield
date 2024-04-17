const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'youtube',
    description: 'Enviando vídeo do YouTube em uma embed',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: 'embed',
        description: 'Envia a embed de um vídeo do YouTube',
        type: Discord.ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'url',
            description: 'A URL do vídeo do YouTube',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }]
    }],
    run: async (client, interaction) => {
        if (interaction.options.getSubcommand() === 'embed') {
            const videoUrl = interaction.options.getString('url');
            
            if (!ytdl.validateURL(videoUrl)) {
                await interaction.reply('Por favor, insira uma URL válida do YouTube.');
                return;
            }

            // Envie uma resposta imediata para evitar timeout
            const processingMessage = await interaction.reply({ content: 'Processando seu vídeo...', fetchReply: true });

            try {
                const tempDir = fs.mkdtempSync(path.join(__dirname, 'temp-'));
                const info = await ytdl.getInfo(videoUrl);
                const videoTitle = info.videoDetails.title.replace(/[<>:"\/\|?*]+/g, '');
                const filePath = path.join(tempDir, `${videoTitle}.mp4`);
                const videoStream = ytdl(videoUrl, { quality: 'highestvideo', filter: 'videoandaudio' });
                const videoWriter = fs.createWriteStream(filePath);

                videoStream.pipe(videoWriter);

                videoStream.on('finish', async () => {
                    const attachment = new AttachmentBuilder(filePath);
                    const videoEmbed = new EmbedBuilder()
                    .setTitle(videoTitle)
                    .setURL(videoUrl)
                    .setColor('#FF0000')
                    .setFooter({ text: 'Vídeo baixado com sucesso!' })
                    .setTimestamp();

                    if (info.videoDetails.thumbnails.length > 0) {
                        videoEmbed.setThumbnail(info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url);
                    }

                    // Edita a mensagem processando com a embed e o vídeo
                    await interaction.editReply({ content: 'Aqui está o vídeo:', embeds: [videoEmbed], files: [attachment] });
                    fs.unlinkSync(filePath);
                    fs.rmSync(tempDir, { recursive: true, force: true });
                });

                videoStream.on('error', error => {
                    console.error(error);
                    interaction.editReply('Houve um erro ao baixar o vídeo.');
                    fs.rmSync(tempDir, { recursive: true, force: true });
                });
            } catch (error) {
                console.error(error);
                interaction.editReply('Ocorreu um erro ao processar seu vídeo.');
            }
        }
    }
};