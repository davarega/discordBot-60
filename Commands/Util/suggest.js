const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, WebhookClient } = require('discord.js');
const config = require('../../config.json');
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require('../../Handlers/messageEmbed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("suggest")
		.setDescription("Send suggestions to bot/server.")
		.addStringOption(option =>
			option.setName("description")
				.setDescription("Describe your suggestion. (Bisa menggunakan bahasa indonesia)")
				.setRequired(true)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @returns 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { guild, options, user } = interaction;
		const webhook = new WebhookClient({ url: config.webhook.suggestion });
		const description = options.getString("description");

		const webhookEmbed = new EmbedBuilder().setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.addFields(
				{ name: "Suggestion:", value: `\`\`\`${description}\`\`\``, inline: false },
				{ name: "User:", value: user.tag, inline: false },
				{ name: "Guild:", value: `${guild.name} | ${guild.id}`, inline: false }
			)
			.setTimestamp();

		try {
			webhook.send({ embeds: [webhookEmbed] });
			const messageEmbed = new EmbedBuilder()
				.setDescription(`Your suggestion has been sent successfully.\nThanks for giving the \`skynara bot\` a suggestion.`);

			logHandler("client", "5", interaction.user.tag, "", description);
			return interaction.followUp({ embeds: [messageEmbed] });

		} catch (err) {
			console.log(err);

			logHandler("error", "3", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
}