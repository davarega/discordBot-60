async function loadCommands(client) {
	const ascii = require('ascii-table');
	const fs = require('fs');
	const table = new ascii().setHeading("commands", "status");

	await client.commands.clear();

	let commandsArray = [];

	const commandsFolder = fs.readdirSync('./Commands');
	for (const folder of commandsFolder) {
		const commandFiles = fs
		.readdirSync(`./Commands/${folder}`)
		.filter((file) => file.endsWith(".js"));
		
		for (const file of commandFiles) {
			delete require.cache[require.resolve(`../Commands/${folder}/${file}`)];
			const commandFile = require(`../Commands/${folder}/${file}`);

			const properties = { folder, ...commandFile };
			client.commands.set(commandFile.data.name, properties);

			commandsArray.push(commandFile.data.toJSON());

			table.addRow(file, "Loaded");
			continue;
		};
	};
	client.application.commands.set(commandsArray);
	return console.log(table.toString(), "\nLoaded Commands");
}
module.exports = { loadCommands }