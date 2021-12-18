const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');


const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.once('ready', () => {
	console.log('Ready!');
});

// client.on('interactionCreate', async interaction => {
// 	if (!interaction.isCommand()) return;

// 	const { commandName } = interaction;

// 	if (commandName === 'react') {
// 		const message = await interaction.reply('You can react with Unicode emojis!', { fetchReply: true });
// 		message.react('😄');
// 	} else if (commandName === 'react-custom') {
// 		const message = await interaction.reply('You can react with custom emojis!', { fetchReply: true });
// 		message.react('123456789012345678');
// 	} else if (commandName === 'fruits') {
// 		const message = await interaction.reply('Reacting with fruits!', { fetchReply: true });
// 		message.react('🍎')
// 			.then(() => message.react('🍊'))
// 			.then(() => message.react('🍇'))
// 			.catch(() => console.error('One of the emojis failed to react.'));
// 	}
// });

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react') {
		const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
		message.react('😄');
	}
});

// Reactions wont be in order
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'fruits') {
		interaction.reply('Reacting with fruits!');
		const message = await interaction.fetchReply();
		message.react('🍎');
		message.react('🍊');
		message.react('🍇');
		
	}
});

// Reactions will be in order
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'fruits-order') {
		const message = await interaction.reply({ content: 'Reacting with fruits!', fetchReply: true });

		try {
			await message.react('🍎');
			await message.react('🍊');
			await message.react('🍇');
			await message.reactions.cache.get('🍇').remove()
			await message.reactions.cache.get('🍊').remove()
			await message.reactions.cache.get('🍎').remove()
			// Or remove all with the line below
			// await message.reactions.removeAll()
		} catch (error) {
			console.error('One of the emojis failed to react:', error);
		}
	}
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'reaction') {
		const message = await interaction.reply({ content: 'Reaction with 👍 or 👎!', fetchReply: true });

		message.react('👍').then(() => message.react('👎'));

		const filter = (reaction, user) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
		};
		
		message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '👍') {
					message.reply('You reacted with a thumbs up.');
				} else {
					message.reply('You reacted with a thumbs down.');
				}
			})
			.catch(collected => {
				message.reply('You reacted with neither a thumbs up, nor a thumbs down.');
			});
	}
});




client.login(token);

