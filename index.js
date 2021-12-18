const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed  } = require('discord.js');
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

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'collect') {
		const message = await interaction.reply({ content: 'Triggered collection bucket!', fetchReply: true });
		const filter = m => m.content.includes('discord');
		const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });
		
		collector.on('collect', m => {
			console.log(`Collected ${m.content}`);
			m.react('😄')
		});
		
		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
			message.reply({content: `lol we collected ${collected.size} items`})
		});
	}
});

const quiz = require('./quiz.json');

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'quiz') {
		const item = quiz[Math.floor(Math.random() * quiz.length)];
		const filter = response => {
			return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		
		interaction.reply(item.question, { fetchReply: true })
			.then(() => {
				interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
					.then(collected => {
						interaction.followUp(`${collected.first().author} got the correct answer!`);
					})
					.catch(collected => {
						interaction.followUp('Looks like nobody got the answer this time.');
					});
			});
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react-collect') {
		const message = await interaction.reply({ content: 'Respond with thumbs up or thumbs down!', fetchReply: true });
		message.react('👍🏿').then(() => message.react('👎🏿'));


		const filter = (reaction, user) => {
			return reaction.emoji.name === '👍🏿' && user.id !== message.author.id;
		};
		
		const collector = message.createReactionCollector({ filter, time: 15000 });
		
		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
		});
		
		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
			message.reply({content: `lol we collected ${collected.size} 👍🏿`})

		});
	}
});

// Await version of above
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react-await') {
		const message = await interaction.reply({ content: 'Respond with thumbs up or thumbs down!', fetchReply: true });
		message.react('👍🏿').then(() => message.react('👎🏿'));


		const filter = (reaction, user) => {
			return reaction.emoji.name === '👍🏿' && user.id !== message.author.id;
		};
		
		message.awaitReactions({ filter, max: 4, time: 10000, errors: ['time'] })
			.then(collected => console.log(collected.size))
			.catch(collected => {
				console.log(`After 10 seconds, only ${collected.size} out of 4 reacted.`);
				message.reply({ content: `After 10 seconds, only ${collected.size} out of 4 reacted.`});
			});
	}
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'button-collect') {
		interaction.reply({ content: 'Lets go!', fetchReply: true });
		// message.react('👍🏿').then(() => message.react('👎🏿'));
		
		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setCustomId('primary')
			.setLabel('Primary')
			.setStyle('PRIMARY'),
			);
		const message = await interaction.channel.send({content: ' Button goes here ', components: [row]})

		const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

		collector.on('collect', i => {
			if (i.user.id === interaction.user.id) {
				i.reply(`${i.user.username} clicked on the ${i.customId} button.`);
			} else {
				i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
			}
		});
		
		collector.on('end', collected => {
			console.log(`Collected ${collected.size} interactions.`);
			message.reply({ content: `After 15 seconds, the button was pressed ${collected.size} times`});

		});
	}
});





client.login(token);

