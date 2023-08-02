const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const accountSchema = require("../../Models/accountSchema");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("coins")
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

		let data = await accountSchema.findOne({ userId: user.id });

		if (!data) {
			logHandler("error", "0", user.tag, interaction.commandName, "", "user no have economy account.");
			return interaction.followUp({ content: "Please type **/account** to create your economy account", ephemeral: true });
		};

		try {
			embed.setDescription(`Hey <@${user.id}>, you have ${data.coins} :coin: naracoins`);

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed], ephemeral: true });

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "0", user.tag, interaction.commandName, "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}
	}
}