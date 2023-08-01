const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require('../../Handlers/logHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Set the volume for the songs.")
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

		const { member, guild, user, options } = interaction;
		const vol = options.getInteger("percent");
		const embed = new EmbedBuilder();

		const { channel } = member.voice;
		if (!channel || member.voice.channel !== guild.members.me.voice.channel) {
			logHandler("error", "0", user.tag, interaction.commandName, "", "user and bot not in the same/voice channel");
			return interaction.followUp("You need to be in a same/voice channel.");
		};

		const queue = client.distube.getQueue(interaction);
		if (!queue) {
			embed.setDescription("\`🚨\` | **There are no** `Songs` **in queue**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "there are no songs in queue");
			return interaction.followUp({ embeds: [embed] });
		};

		try {
			queue.setVolume(vol);
			embed.setDescription(`🔉 | Volume set to \`${queue.volume}\``);

			logHandler("distube", "8", user.tag, "", `${queue.volume}`);
			return interaction.followUp({ embeds: [embed], ephemeral: true });

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("⛔ | Something went wrong... Please try again.");

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
};