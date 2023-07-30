const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "addList",

	async execute(client, queue, playlist) {
		const embed = new EmbedBuilder()
			.setDescription(`**Queued • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` (${playlist.songs.length} tracks) • ${playlist.user}`)
			.setColor('#000001');

		queue.textChannel.send({ embeds: [embed] });
		logHandler("distube", "5", playlist.user, "", playlist.name);
	}
}