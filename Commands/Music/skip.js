const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips the song currently playing.")
		.addIntegerOption(option =>
			option.setName("tracknumber")
				.setDescription("Track number to skip to in the queue.")
				.setRequired(false)
				.setMinValue(1)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { member, guild, user, options } = interaction;
		const trackNumber = options.getInteger("tracknumber");
		const embed = new EmbedBuilder();

		const { channel } = member.voice;
		if (!channel || member.voice.channel !== guild.members.me.voice.channel) {
			embed.setDescription("\`🚨\` | You need to be in a same/voice channel.");

			logHandler("error", "0", user.tag, interaction.commandName, "", "user and bot not in the same/voice channel");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		const queue = client.distube.getQueue(interaction);

		if (queue.songs.length === 1 && queue.autoplay === false) {
			embed.setDescription("\`🚨\` | **There are no** `Songs` **in queue**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "there are no songs in queue");
			return interaction.followUp({ embeds: [embed] });
		};

		if(trackNumber > queue.songs.length - 1) {
			embed.setDescription(`\`🚨\` | There are only \`${queue.tracks.data.length}\` tracks in the queue. You cannot skip to track \`${queue.songs.length - 1}\`.`);
			return logHandler("error", "0", user.tag, interaction.commandName, "", "Track number was higher than total tracks.");
		};

		try {
			if(trackNumber) {
				await queue.jump(trackNumber);
				embed.setTitle(`\`⏭\` | **Jumped to position: \`${trackNumber}\` in the Queue!**`).setTimestamp();

				logHandler("distube", "2", user.tag, "", queue.songs[0].name);
			} else {
				await client.distube.skip(interaction);
				embed.setDescription("\`⏭\` | **Song has been:** `Skipped`")
	
				logHandler("distube", "2", user.tag, "", queue.songs[0].name);
			};
			return interaction.followUp({ embeds: [embed] });

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
};