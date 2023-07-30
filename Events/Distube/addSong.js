const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "addSong",

	async execute(client, queue, track) {
		const embed = new EmbedBuilder()
			.setDescription(`**Queued • [${track.name}](${track.url})** \`${track.formattedDuration}\` • ${track.user}`)
			.setColor('#000001');

		queue.textChannel.send({ embeds: [embed] });
		logHandler("distube", "4", track.user.tag, "", track.name);
	}
}