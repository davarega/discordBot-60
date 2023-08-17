const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("")
	.setDescription(""),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction)  {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { user } = interaction;
		const embed = new EmbedBuilder();

		try {
			
		} catch (err) {
			console.log(err);

			logHandler("error", "3", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		}
	}
}