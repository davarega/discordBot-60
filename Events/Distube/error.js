const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "error",

	async execute(channel, e, query, queue, track) {
		if (channel) {
			const embed = new EmbedBuilder()
			.setColor('Red')
			.setDescription(`\`❌\` | An error encountered: ${e.toString().slice(0, 1974)}`);

			queue.textChannel.send({ embeds: [embed] });
		}
		else console.error(e);

		logHandler("error", "1", track.user.tag, "", query, e);
	}
}