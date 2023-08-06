const { EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "searchNoResult",

	async execute(client, query, song) {
		const embed = new EmbedBuilder()
			.setDescription(`\`📛\` | No result found for \`${query}\`!`)
			.setColor('#000001');

		client.channel.send({ embeds: [embed] });
		logHandler("error", "1", song.user.tag, "", query, "");
	}
}