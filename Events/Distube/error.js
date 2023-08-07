const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
	name: "error",

	async execute(client, channel, err) {
		console.error(err);

		// let embed = new EmbedBuilder()
		// 	.setColor("#ff0000")
		// 	.setDescription(`\`❌\` | An error encountered: \n${err}`);
		// channel.send({ embeds: [embed] });

		// let owner = client.users.cache.get(client.owner[0]);
		// config.devUserID.send({ content: `\`❌\` | An error encountered: \n${err}\n<#${channel.id}>` });
	}
};