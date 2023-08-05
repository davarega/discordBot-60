const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js');
const { logHandler } = require('../../Handlers/logHandler');
const accountSchema = require("../../Models/accountSchema");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Show the top 5 richest people have Naracoin."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {Client} client 
	 * @returns 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const topAmount = 5;
		const { user } = interaction;
		const embed = new EmbedBuilder();
		const data = await accountSchema.find();
		const sortedAccount = data.sort((a, b) => b.coins - a.coins).slice(0, topAmount);

		try {
			embed.setTitle(`**🏆  Top ${topAmount}  Naracoin Earners**`)
				.setDescription(sortedAccount.map((member, index) => {
					return `**\`[ ${index + 1} ]\`** :  **${client.users.cache.get(member.userId).tag}**  : \`${member.coins}🪙 \``
				}).join("\n"));

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