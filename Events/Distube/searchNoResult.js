const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "searchNoResult",

	async execute(client, query, track) {
		const embed = new EmbedBuilder()
			.setDescription(`\`📛\` | No result found for \`${query}\`!`)
			.setColor('#000001');

		client.channel.send({ embeds: [embed] });
		logHandler("error", "1", track.user.tag, "", query, "");
	}
}