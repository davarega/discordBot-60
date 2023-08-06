const { CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');
const { errorEmbed } = require('../../Handlers/messageEmbed');

module.exports = {
	inVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song.")
		.addStringOption((option) =>
			option.setName("query")
				.setDescription("Query a song. Support youtube/spotify/soundcloud playlist and url.")
				.setRequired(true)
		),
	/**
	 * 
	 * @param {CommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const query = interaction.options.getString("query");
		const { channel, member, guild, user } = interaction;
		const embed = new EmbedBuilder();
		const voiceChannel = member.voice.channel;

		if (guild.members.me.voice.channelId && member.voice.channelId !== guild.members.me.voice.channelId) {
			embed.setDescription(`\`📛\` | You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);

			logHandler("error", "0", user.tag, interaction.commandName, "", "user and bot not in the same voice channel");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		embed.setColor("Green").setDescription(`\`🔍\` | **Searching... \`${query}\`**`);
		interaction.followUp({ embeds: [embed] });

		try {
			const playing = await client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

			if (playing) {
				logHandler("distube", "0", user.tag, "", query);
			} else {
				embed.setColor('Red').setDescription("\`📛\` | Link not found.");

				logHandler("error", "1", user.tag, "", query, "link not found");
				return interaction.followUp({ embeds: [embed], ephemeral: true });
			};

		} catch (error) {
			const problem1 = "\nInvalid url link. Make sure the url link you provided is correct.";
			const problem2 = "\nYour url link contains sensitive content. Sorry I can't play sensitive content.";

			console.log(error)
			errorEmbed.setDescription(`Hi there! **These links aren't supported**. Some possible problems:${problem1 + problem2}`);

			logHandler("error", "1", user.tag, "", query, error);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};