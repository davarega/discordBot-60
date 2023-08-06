const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	sameVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips the song currently playing.")
		.addIntegerOption(option =>
			option.setName("songnumber")
				.setDescription("Song number to skip to in the queue. Type /queue to show all songs in playlist")
				.setRequired(false)
				.setMinValue(2)
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
		const songNumber = options.getInteger("songnumber");
		const embed = new EmbedBuilder();
		const queue = client.distube.getQueue(interaction);

		if (!queue) {
			embed.setDescription("\`📛\` | **There are no** `Songs` **in queue**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "there are no songs in queue");
			return interaction.followUp({ embeds: [embed] });

		} else if (queue.songs.length === 1 && queue.autoplay === false) {
			embed.setDescription("\`🚨\` | **There are no** `Songs` **in queue**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "there are no songs in queue");
			return interaction.followUp({ embeds: [embed] });
			
		} else if (songNumber > queue.songs.length) {
			embed.setDescription(`\`🚨\` | There are only \`${queue.songs.length}\` songs in the queue. You cannot skip to song \`${queue.songs.length}\`.`);
			
			logHandler("error", "0", user.tag, interaction.commandName, "", "songs number was higher than total songs.");
			return interaction.followUp({ embeds: [embed] });
		};

		try {
			if (songNumber) {
				await queue.jump(songNumber - 1);
				embed.setTitle(`\`⏭\` | **Jumped to position: \`${songNumber}\` in the Queue!**`).setTimestamp();

				logHandler("distube", "2", user.tag, "", queue.songs[0].name);
			} else {
				await client.distube.skip(interaction);
				embed.setDescription("\`⏭\` | **Song has been:** `Skipped`")

				logHandler("distube", "2", user.tag, queue.songs[0].name, songNumber);
			};
			return interaction.followUp({ embeds: [embed] });

		} catch (error) {
			console.log(error);

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};