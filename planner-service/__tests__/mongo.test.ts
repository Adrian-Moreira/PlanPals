import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Db, MongoClient } from 'mongodb';
import CheapDB from '../src/db/mongo';

describe('insert', () => {
	let connection: MongoClient;
	let db: Db;
	let cheapDB: CheapDB;

	beforeAll(async () => {
		const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017';
		cheapDB = new CheapDB(mongoURI);
		connection = await cheapDB.connectToMongoDB();
		db = await cheapDB.getDB('planner');
	});

	afterAll(async () => {
		await cheapDB.closeMongoConnection();
	});

	it('should insert jdoe2 into users collection', async () => {
		const users = db.collection('users');

		const mockUser = { id: 'jdoe2', userName: 'Jane Doe' };
		await cheapDB.insertUser(mockUser);

		const insertedUser = await users.findOne({ id: 'jdoe2', userName: 'Jane Doe' });
		expect(insertedUser).toEqual(mockUser);
	});
});
