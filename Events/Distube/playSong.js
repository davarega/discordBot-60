const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "playSong",

	async execute(client, queue, track) {
		try {
			var newQueue = client.distube.getQueue(queue.id);

			const embed = new EmbedBuilder()
				.setAuthor({ name: `Starting Playing...`, iconURL: 'https://cdn.discordapp.com/emojis/741605543046807626.gif' })
				.setThumbnail(track.thumbnail)
				.setColor('#000001')
				.setTitle(`${track.name || 'Unknown Title'}`)
				.setURL(`${track.url}`)
				.addFields(
					{ name: `Uploader:`, value: `**[${track.uploader.name}](${track.uploader.url})**`, inline: true },
					{ name: `Requester:`, value: `${track.user}`, inline: true },
					{ name: `Duration:`, value: `${track.formattedDuration}`, inline: true },
					{ name: `Current Volume:`, value: `${newQueue.volume}%`, inline: true },
					{ name: `Filters:`, value: `${newQueue.filters.names.join(", ") || "Normal"}`, inline: true },
					{ name: `Autoplay:`, value: `${newQueue.autoplay ? "Activated" : "Not Active"}`, inline: true }
				)
				.addFields({ name: `Current Duration: \`[0:00 / ${track.formattedDuration}]\``, value: `\`\`\`🔴 | 🎶▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\`\`\``, inline: false })
				.setTimestamp()

			await queue.textChannel.send({ embeds: [embed] });
			logHandler("distube", "3", track.user.tag, track.name, track.url);

		} catch (error) {
			console.log(error);
			const embed = new EmbedBuilder().setColor('Red').setDescription("\`⛔ | Something went wrong... Please try again.\`");

			logHandler("error", "1", track.user.tag, "", track.name, error);
			return queue.textChannel.send({ embeds: [embed] });
		};
	}
};