const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName("embed")
		.setDescription("This command is only for the SkyNara bot developer!")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option.setName("description")
				.setDescription("Set the description for embed")
				.setRequired(true)
				.setMaxLength(4096)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { member, options, user } = interaction;
		const embed = new EmbedBuilder();
		const descEmbed = options.getString("description");

		try {
			embed.setDescription("\`✅\` | Your embed has been created!");
			interaction.followUp({ embeds: [embed], ephemeral: true });

			const resultEmbed = new EmbedBuilder()
				.setTitle("📝 | SERVER RULES")
				.setDescription(descEmbed)
				.setTimestamp()

			await interaction.channel.send({ embeds: [resultEmbed] });
			return logHandler("client", "3", user.tag, interaction.commandName);

		} catch (err) {
			console.log(err);

			logHandler("error", "3", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		}
	}
}