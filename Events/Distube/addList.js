const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "addList",

	async execute(client, queue, playlist) {
		const embed = new EmbedBuilder()
			.setDescription(`${playlist.user},  **Add • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` **(${playlist.songs.length} tracks) • to queue**`)
			.setColor('#000001');

		queue.textChannel.send({ embeds: [embed] });
		logHandler("distube", "5", playlist.user.tag, "", playlist.name);
	}
}