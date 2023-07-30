const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { DisTube } = require('distube');
require('dotenv').config();

const { loadCommands } = require('./Handlers/commandHandler');
const { loadEvents } = require('./Handlers/eventHandler');
const { loadDistube } = require('./Handlers/distubeHandler');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
	intents: [Object.keys(GatewayIntentBits)],
	partials: [Object.keys(Partials)]
});

client.distube = new DisTube(client, {
	leaveOnFinish: false,
	leaveOnStop: false,
	// emptyCooldown: 60,
	plugins: [
		new SpotifyPlugin(),
		new SoundCloudPlugin(),
		new YtDlpPlugin(),
	],
});

client.commands = new Collection();

module.exports = client;

client.login(process.env.CLIENT_TOKEN).then(() => {
	loadCommands(client);
	loadEvents(client);
	loadDistube(client);
});