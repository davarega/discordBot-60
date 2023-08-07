const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "addList",

	async execute(queue, playlist) {
		const embed = new EmbedBuilder()
			.setDescription(`${playlist.user},  **Add • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` **(${playlist.songs.length} songs) • to queue**`)

		queue.textChannel.send({ embeds: [embed] });
		logHandler("distube", "5", playlist.user.tag, playlist.name, playlist.songs.length);
	}
}