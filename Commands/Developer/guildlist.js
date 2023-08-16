const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const client = require('../../index.js');
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require('../../Handlers/messageEmbed');

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName("guildlist")
		.setDescription("This command is only for the SkyNara bot developer!")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 * @returns 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { user } = interaction;
		const embed = new EmbedBuilder();

		var guildlist = client.guilds.cache.map((guild) => {
			return `**${guild.name}**  : \`${guild.id}\``
		}).join("\n");

		try {
			embed.setAuthor({ name: `${client.user.username} Guild Lists`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
				.setDescription(guildlist)
				.setTimestamp();

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });

		} catch (err) {
			console.log(err);

			logHandler("error", "3", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};