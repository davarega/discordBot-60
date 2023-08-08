const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	inVoiceChannel: true,
	sameVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Set the playback volume for songs.")
		.addIntegerOption((option) =>
			option.setName("percent")
				.setDescription("Enter a volume from 1-100. example: 50 = 50%")
				.setMinValue(1)
				.setMaxValue(100)
				.setRequired(true)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { user, options } = interaction;
		const vol = options.getInteger("percent");
		const embed = new EmbedBuilder();
		const queue = client.distube.getQueue(interaction);
		
		if (!queue) {
			embed.setDescription("\`📛\` | **No one is playing music right now!**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "no one is playing music at this moment");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		try {
			queue.setVolume(vol);
			embed.setDescription(`\`🔉\` | Volume set to \`${queue.volume}\``);

			logHandler("distube", "8", user.tag, "", `${queue.volume}`);
			return interaction.followUp({ embeds: [embed], ephemeral: true });

		} catch (err) {
			console.log(err);

			logHandler("error", "1", user.tag, "", "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};