const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "addSong",

	async execute(client, queue, song) {
		const embed = new EmbedBuilder()
			.setDescription(`${song.user},  **Add • [${song.name}](${song.url})** - \`${song.formattedDuration}\`  **• to queue **`)
			.setColor('#000001');

		queue.textChannel.send({ embeds: [embed] });
		logHandler("distube", "4", song.user.tag, "", song.name);
	}
}