const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { default: axios } = require('axios');
const { logHandler } = require('../../Handlers/logHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nsfw")
		.setDescription("NSFW commands.")
		.addStringOption((option) =>
			option.setName("tag")
				.setDescription("NSFW tags list.")
				.setRequired(true)
				.addChoices(
					{ name: 'waifu', value: 'waifu' },
					{ name: 'milf', value: 'milf' },
					{ name: 'ecchi', value: 'ecchi' },
					{ name: 'ero', value: 'ero' },
					{ name: 'ass', value: 'ass' },
					{ name: 'hentai', value: 'hentai' },
					{ name: 'oral', value: 'oral' },
					{ name: 'paizuri', value: 'paizuri' },
				)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { channel, options, user } = interaction;
		const value = options.getString("tag");
		const embed = new EmbedBuilder();

		if (!channel.nsfw) {
			embed.setDescription("\`🔞\` | This command can only be used on nsfw channels.")
			logHandler("error", "0", user.tag, interaction.commandName, "", "user no in nsfw channel");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		const params = {
			included_tags: `${value}`,
			is_nsfw: true
		};

		try {
			const response = await axios.get('https://api.waifu.im/search', { params });
			const data = await response.data.images[0];

			embed.setTitle(`Random NSFW ${value.charAt(0).toUpperCase()}${value.slice(1)} Image`)
				.setURL(`${data.url}`)
				.setDescription(`Source : ${data.source}`)
				.setImage(`${data.url}`)
				.setTimestamp()
				.setFooter({ text: `💓 ${data.favorites} ` });

			logHandler("client", "4", user.tag, interaction.commandName, value);
			return interaction.followUp({ embeds: [embed] });
		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "0", user.tag, interaction.commandName, "",error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
};