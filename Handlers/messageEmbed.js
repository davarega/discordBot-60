const { EmbedBuilder } = require('discord.js');
const client = require('../index.js');
const config = require('../config.json');

const br = "\n=============================================\n";
const devContact = `You can join the support server to report the problem\n${config.supportServerUrl}`;

const errorEmbed = new EmbedBuilder()
	.setAuthor({name: client.user.username, iconURL: client.user.avatarURL()})
	.setColor('#ff0000')
	.setTitle("\`📛\` Vailed to use this command.")
	.setDescription("There is something wrong...")
	.addFields({ name: br, value: devContact });


module.exports = { errorEmbed };