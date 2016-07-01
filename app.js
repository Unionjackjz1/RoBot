// Your run of the mill imports!
var Discord 	= require("discord.io");
var API_TOKEN 	= process.env.API_KEY;

if (!API_TOKEN) {
	console.error("Could not load API key")
}

// Everything about our bot
vexBot = {
	commandPrefix: ".",
	// Synax:
	// vexBot.commands.foo = function(data) {...};
	//     data.message: The parameters sent to the command    
	//     data.name:    The user's name
	//     data.id:      The user's ID
	//     data.channel: The channel's ID
	//     data.event:   Raw JSON event
	commands: [],
	plugins: {}
}

// This is our auth token, and it's going on github :D
vexBot.client = new Discord.Client({
	token: API_TOKEN,
	autorun: true
});

// Initialization command.
// This lets us know that the bot has connected to the discord server,
// and has will let us have control over the presence of the bot.
vexBot.client.on('ready', function() {
	console.log(vexBot.client.username + " -  ( " + vexBot.client.id + ")" );
	vexBot.client.setPresence({
		idle_since: null,
		game: "10 BPS"
	});
});

// This is the main listening function in which commands are read & seen by the bot
vexBot.client.on('message', function(user, userID, channelID, message, event) {
	// if message x is receieved print y
	// Make this more dynamic.

	message = message.toString();

	console.log(user + " (" + userID + ") [" + channelID + "]: " + message);

	if (message.substring(0, vexBot.commandPrefix.length) == vexBot.commandPrefix) {
		var msg = message.substring(vexBot.commandPrefix.length);

		// Mobile keyboards sometimes automatically put in an annoying space.
		if (msg.substring(0, 1) == " ") {
			msg = msg.substring(1);
		}

		var cmd = '';
		while (msg.length > 0 && msg.substring(0, 1) != " ") {
			cmd += msg.substring(0, 1);
			msg = msg.substring(1);
			console.log(msg.length);
		}
		// Mobile keyboards automatically capitalize
		cmd = cmd.toLowerCase();

		// Remove space after command
		if (msg.substring(0, 1) == " ") {
			msg = msg.substring(1);
		}

		console.log("command \"" + cmd + "\"")

		if (cmd in vexBot.commands) {
			console.log("got command!")
			var result = vexBot.commands[cmd]({
				message: msg,
				name:    user,
				id:      userID,
				channel: channelID,
				event:   event
			});
			if (result) {
				console.log("responding")
				vexBot.client.sendMessage({
					to: channelID,
					message: user + ", " + result
				});
			}
		}
	}
});

// Load all of our plugins
var normalizedPath = require("path").join(__dirname, "plugins");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
	// If a plugin wants to expose an API of some sort, we plugins into vexBot.plugins[name]
	vexBot.plugins[file.substr(0, file.lastIndexOf('.'))] = require("./plugins/" + file);
});
