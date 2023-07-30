const fs = require('fs');

function loadDistube(client) {
	const files = fs.readdirSync(`./Events/Distube`).filter((file) => file.endsWith(".js"));
	for (const file of files) {
		const event = require(`../Events/Distube/${file}`);

		client.distube.on(event.name, event.execute.bind(null, client));
	}
}

module.exports = { loadDistube }