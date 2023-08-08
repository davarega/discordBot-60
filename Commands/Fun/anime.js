const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { default: axios } = require('axios');
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require('../../Handlers/messageEmbed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("anime")
		.setDescription("Generate anime image.")
		.addStringOption((option) =>
			option.setName("tag")
				.setDescription("Select a tag for the image.")
				.setRequired(true)
				.addChoices(
					{ name: 'waifu', value: 'waifu' },
					{ name: 'neko', value: 'neko' },
					{ name: 'kitsune', value: 'kitsune' },
					{ name: 'husbando', value: 'husbando' }
				)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { options, user } = interaction;
		const value = options.getString("tag");
		const embed = new EmbedBuilder();

		try {
			const response = await axios.get(`https://nekos.best/api/v2/${value}`);
			const data = await response.data.results[0];

			embed.setTitle(`Random ${value.charAt(0).toUpperCase()}${value.slice(1)} Image`)
				.setURL(`${data.source_url}`)
				.setImage(`${data.url}`)
				.setTimestamp()
				.setFooter({ text: `Request by ${user.tag} ` });

			logHandler("client", "4", user.tag, interaction.commandName, value);
			return interaction.followUp({ embeds: [embed] });

		} catch (err) {
			console.log(err);

			logHandler("error", "0", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
}