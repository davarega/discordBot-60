const { ChatInputCommandInteraction } = require('discord.js');
const { logHandler } = require('../../Handlers/logHandler');
const accountSchema = require('../../Mode../../Models/accountSchema');

module.exports = {
	name: "interactionCreate",
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {*} client 
	 */
	async execute(interaction, client) {

		if (!interaction.isChatInputCommand()) return;

		// Economy Account
		// let accountData;

		// try {
			// accountData = await accountSchema.findOne({ userId: interaction.user.id });

		// 	if (!accountData) {
				// accountData = await accountSchema.create({
		// 			userId: interaction.user.id,
		// 			coins: 0,
		// 		});
		// 	}
		// } catch (err) {
		// 	console.log(err);
		// 	logHandler("error", "3", interaction.user.id, "", "", err);
		// 	return interaction.reply({ content: "Failed to using economy command.", ephemeral: true });
		// };

		// Load Commands
		const command = client.commands.get(interaction.commandName);
		if (!command)
			return interaction.reply({ content: "Outdated command! Please check in later.", ephemeral: true });

		// Developer Commands
		if (command.developer && interaction.user.id !== "529274140801105920" && interaction.guild.id !== "876346848686788658")
			return interaction.reply({ content: "This command is only for the bot developer!", ephemeral: true });

		command.execute(interaction, client);
	}
}