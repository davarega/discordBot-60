const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logHandler } = require('../../Handlers/logHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Pong!"),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @returns 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		logHandler("client", "3", interaction.user.tag, interaction.commandName);
		return interaction.followUp({ content: "Pong!" });
	}
}