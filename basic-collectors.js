const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed  } = require('discord.js');
// const { } = require('discord.js');

const { token } = require('./config.json');


const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.once('ready', () => {
	console.log('Ready!');
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

