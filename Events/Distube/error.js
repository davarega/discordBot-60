const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
	name: "error",

	async execute(client, channel, err) {
		console.error(err);
	}
};