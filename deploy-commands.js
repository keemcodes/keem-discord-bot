const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder().setName('react').setDescription('Reacts to interactions!'),
	new SlashCommandBuilder().setName('react-custom').setDescription('Custom reaction to interactions!'),
	new SlashCommandBuilder().setName('fruits').setDescription('Custom reaction to interactions!'),
	new SlashCommandBuilder().setName('fruits-order').setDescription('Custom reaction to interactions!'),
	new SlashCommandBuilder().setName('reaction').setDescription('Custom reaction to with thumbsUp/thumbsDown!'),
	new SlashCommandBuilder().setName('collect').setDescription('Custom message collector!'),
	new SlashCommandBuilder().setName('quiz').setDescription('Trigger a quiz!'),
	new SlashCommandBuilder().setName('react-collect').setDescription('Collect reacions!'),
	new SlashCommandBuilder().setName('react-await').setDescription('Collect reacions w/ await!'),
	new SlashCommandBuilder().setName('button-collect').setDescription('Collect messages!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

// Global
rest.put(Routes.applicationCommands(clientId),{ body: commands })
	.then(() => console.log('Successfully registered global application commands.'))
	.catch(console.error);

// Guild
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered guild application commands.'))
	.catch(console.error);