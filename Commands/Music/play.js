const { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
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
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
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

		try {
			embed.setColor("Green").setDescription(`\`🔍\` | **Searching... \`${query}\`**`);
			client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

			logHandler("distube", "0", user.tag, "", query);
			return interaction.followUp({ embeds: [embed] });

		} catch (err) {
			const problem1 = "\nInvalid url link. Make sure the url link you provided is correct.";
			const problem2 = "\nYour url link contains sensitive content. Sorry I can't play sensitive content.";

			console.log(err);
			errorEmbed.setDescription(`Hi there! **These links aren't supported**. Some possible problems:${problem1 + problem2}`);

			logHandler("error", "1", user.tag, "", query, err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};