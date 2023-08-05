const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const client = require('../../index');
const accountSchema = require('../../Models/accountSchema');
const { logHandler } = require('../../Handlers/logHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("autoplay")
		.setDescription("Set autoplay mode on/off."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 * @returns 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { member, user } = interaction;
		const embed = new EmbedBuilder();
		const data = await accountSchema.findOne({ userId: user.id });
		const queue = client.distube.getQueue(interaction);

		if(!data.tags.includes(interaction.commandName)) {
			embed.setDescription("\`📛\` | You don't have permission to use this command.\nYou can type **/shop** to see/buy permission for sale.")
			logHandler("error", "0", user.tag, interaction.commandName, "", `user no have ${interaction.commandName} tag`);
			return interaction.followUp({ content: "masuk" });

		} else if (!queue) {
			embed.setDescription("\`📛\` | **No one is playing music right now!**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "there are no songs in queue");
			return interaction.followUp({ embeds: [embed] });
		};

		try {
			const autoplay = await queue.toggleAutoplay();
			embed.setDescription(`\`✅\` | **Success set Autoplay to:** \`${autoplay ? 'On' : 'Off' }\``);

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
}