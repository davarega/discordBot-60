const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js');
const { logHandler } = require('../../Handlers/logHandler');
const accountSchema = require("../../Models/accountSchema");
const { errorEmbed } = require('../../Handlers/messageEmbed');

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

		if(!data) {
			embed.setTitle(`**🏆  Top ${topAmount}  Naracoin Earners**`)
			.setDescription("-")
			.setTimestamp();
		}

		try {
			embed.setTitle(`**🏆  Top ${topAmount}  Naracoin Earners**`)
				.setDescription(sortedAccount.map((member, index) => {
					return `**\`[ ${index + 1} ]\`** :  **${client.users.cache.get(member.userId).tag}**  : \`${member.coins}🪙 \``
				}).join("\n"))
				.setTimestamp();

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed], ephemeral: true });

		} catch (err) {
			console.log(err);

			logHandler("error", "3", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		}
	}
}