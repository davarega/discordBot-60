const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	name: "playSong",

	async execute(client, queue, song) {
		const embed = new EmbedBuilder();

		try {
			var newQueue = client.distube.getQueue(queue.id);

			embed.setAuthor({ name: `Starting Playing...`, iconURL: 'https://cdn.discordapp.com/emojis/741605543046807626.gif' })
				.setThumbnail(song.thumbnail)
				.setColor('#000001')
				.setTitle(`${song.name || 'Unknown Title'}`)
				.setURL(`${song.url}`)
				.addFields(
					{ name: `Uploader:`, value: `**[${song.uploader.name}](${song.uploader.url})**`, inline: true },
					{ name: `Requester:`, value: `${song.user}`, inline: true },
					{ name: `Duration:`, value: `\`${song.formattedDuration}\``, inline: true },
					{ name: `Volume:`, value: `\`${newQueue.volume}%\``, inline: true },
					{ name: `Filters:`, value: `\`${newQueue.filters.names.join(", ") || "Normal"}\``, inline: true },
					{ name: `Autoplay:`, value: `\`${newQueue.autoplay ? "On" : "Off"}\``, inline: true }
				)
				.addFields({ name: `Current Duration: \`[0:00 / ${song.formattedDuration}]\``, value: `\`\`\`🔴 | 🧿▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\`\`\``, inline: false })
				.setTimestamp()

			await queue.textChannel.send({ embeds: [embed] });
			logHandler("distube", "3", song.user.tag, song.name, song.url);

		} catch (error) {
			console.log(error);

			logHandler("error", "1", song.user.tag, "", song.name, error);
			return queue.textChannel.send({ embeds: [errorEmbed] });
		};
	}
};