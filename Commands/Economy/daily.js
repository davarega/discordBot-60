const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");
const ms = require('parse-ms-2');
const accountSchema = require("../../Models/accountSchema");
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	economyAccount: true,
	data: new SlashCommandBuilder()
		.setName("daily")
		.setDescription("Claim your daily Naracoin."),
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
		const cooldown = 86400000;
		const timeLeft = cooldown - (Date.now() - data.dailyTimer);

		if (timeLeft > 0) {
			const { hours, minutes, seconds } = ms(timeLeft);
			embed.setDescription(`\`📛\` | <@${user.id}> You can't claim more daily coins.\nYou need to wait \`${hours} hrs ${minutes} min ${seconds} sec\` to claim again.`);

			await interaction.followUp({ embeds: [embed], ephemeral: true });
			return logHandler("error", "0", user.tag, interaction.commandName, "", "user has taken daily claim");
		};

		try {
			await accountSchema.findOneAndUpdate({ userId: user.id }, {
				$inc: {
					coins: 1,
				},
				$set: {
					dailyTimer: Date.now(),
				},
			});

			embed.setDescription(`\🪙\` | Hey <@${user.id}>, you get 1 :coin: from daily reward.`);

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed], ephemeral: true });

		} catch (err) {
			console.log(err);

			logHandler("error", "0", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		}
	}
}