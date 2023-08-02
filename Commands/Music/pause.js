const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause the current track."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { member, guild, user } = interaction;
		const embed = new EmbedBuilder();

		const { channel } = member.voice;
		if (!channel || member.voice.channel !== guild.members.me.voice.channel) {
			embed.setDescription("\`🚨\` | You need to be in a same/voice channel.");
			
			logHandler("error", "0", user.tag, interaction.commandName, "", "user and bot not in the same/voice channel");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		const queue = client.distube.getQueue(interaction);
		if (!queue) {
			embed.setDescription("\`🚨\` | **There are no** `Songs` **in queue**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "there are no songs in queue");
			return interaction.followUp({ embeds: [embed] });
		};

		try {
			if(queue.paused) {
				queue.resume();
				embed.setDescription("\`⏭\` | **Song has been:** `resumed`");

				logHandler("distube", "7", user.tag, "", queue.songs[0].name);
				return interaction.followUp({ embeds: [embed] });
			} else {
				queue.pause();
				embed.setDescription("\`⏭\` | **Song has been:** `paused`");
	
				logHandler("distube", "6", user.tag, "", queue.songs[0].name);
				return interaction.followUp({ embeds: [embed] });
			};

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
};