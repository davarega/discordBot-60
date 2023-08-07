const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	inVoiceChannel: true,
	sameVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resume the current song."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { user } = interaction;
		const embed = new EmbedBuilder();
		const queue = client.distube.getQueue(interaction);

		if (!queue) {
			embed.setDescription("\`📛\` | **No one is playing music right now!**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "there are no songs in queue");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		try {
			if(queue.paused) {
				queue.resume();
				embed.setDescription("\`⏭\` | **Song has been:** `resumed`");
				logHandler("distube", "7", user.tag, "", queue.songs[0].name);
			} else {
				queue.pause();
				embed.setDescription("\`⏭\` | **Song has been:** `paused`");

				logHandler("distube", "6", user.tag, "", queue.songs[0].name);
			};
			return interaction.followUp({ embeds: [embed] });

		} catch (error) {
			console.log(error);

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};