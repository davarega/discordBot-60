const { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Invite bot to your server."),
	/**
	 * 
	 * @param {CommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const embed = new EmbedBuilder()
			.setColor("#000001")
			.setAuthor({ name: "Invite!" })
			.setDescription("```Invite me to your server!```")
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel("Invite")
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
					.setEmoji("🔗")
					.setStyle(ButtonStyle.Link)
			);

			logHandler("client", "3", interaction.user.tag, interaction.commandName);
		return interaction.followUp({ embeds: [embed], components: [row] });
	}
};