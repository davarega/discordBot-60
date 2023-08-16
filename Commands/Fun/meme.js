const { default: axios } = require("axios");
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription("Sending meme image from reddit."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { user } = interaction;
		const embed = new EmbedBuilder();

		try {
			const response = await axios.get('https://meme-api.com/gimme');
			const data = await response.data;

			embed.setTitle(`${data.title}`)
				.setURL(`${data.postLink}`)
				.setImage(`${data.url}`)
				.setTimestamp()
				.setFooter({ text: `👍🏼 ${data.ups} 💬 0 ` });

				logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });
		} catch (err) {
			console.log(err);

			logHandler("error", "3", user.tag, interaction.commandName, "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};