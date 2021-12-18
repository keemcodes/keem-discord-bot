const { db } = require('./config.json')

const Sequelize = require('sequelize');

const sequelize = new Sequelize(db.table, db.user, db.pass, {
	host: db.host,
	dialect: db.dialect,
});

const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
		CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
		CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
	];

	await Promise.all(shop);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);