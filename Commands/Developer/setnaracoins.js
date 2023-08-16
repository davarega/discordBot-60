const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const accountSchema = require("../../Models/accountSchema");
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require('../../Handlers/messageEmbed');

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName("setnaracoins")
		.setDescription("This command is only for the SkyNara bot developer!")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option.setName("userid")
				.setDescription("Please only input user id.")
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName("amount")
				.setDescription("Input the amount of Naracoins.")
				.setRequired(true)
				.setMinValue(1)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @returns 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { options, user } = interaction;
		const target = options.getString("userid");
		const amount = options.getInteger("amount");
		const embed = new EmbedBuilder();

		const data = await accountSchema.findOne({ userId: target });
		if (!data) {
			embed.setDescription("\`📛\` | The user id is not defined.\n Please check the user id again.");

			logHandler("error", "0", user.tag, interaction.commandName, "", "the user id is not defined");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		try {
			await accountSchema.findOneAndUpdate(
				{
					userId: target,
				},
				{
					$set: {
						coins: amount,
					},
				},
			);
			embed.setDescription(`\`✅\` | **Success set ${amount}🪙 Naracoin to <@${target}>** `);

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });
		} catch (err) {
			console.log(err);

			logHandler("error", "3", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};