const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const accountSchema = require("../../Models/accountSchema");
const { logHandler } = require("../../Handlers/logHandler");
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	economyAccount: true,
	data: new SlashCommandBuilder()
		.setName("naracoins")
		.setDescription("See your Naracoins."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { user } = interaction;
		const embed = new EmbedBuilder();
		const data = await accountSchema.findOne({ userId: user.id });

		try {
			embed.setDescription(`\`💳\` | Hey <@${user.id}>, you have \`${data.coins}\` :coin: naracoins`);

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed], ephemeral: true });

		} catch (error) {
			console.log(error);

			logHandler("error", "0", user.tag, interaction.commandName, "", error);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		}
	}
}