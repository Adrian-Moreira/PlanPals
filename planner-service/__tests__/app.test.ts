import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import PlanPals from '../src/app';

import { Db, MongoClient } from 'mongodb';
import CheapDB from '../src/db/mongo';
import PPUser from '../src/objects/User';

describe('insert', () => {
	let connection: MongoClient;
	let db: Db;
	let cheapDB: CheapDB;
	let app: PlanPals;

	beforeAll(async () => {
		const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017';
		cheapDB = new CheapDB(mongoURI);
		app = new PlanPals(cheapDB);
		app.startServer();
	});

	afterAll(async () => {
		await app.stopServer();
	});

	it('should return Created', async () => {
		const response = await request(app.app)
			.post('/api/user/create')
			.send({ id: 'jdoe', userName: 'Jane Doe' });
		expect(response.text).toBe('Created');
	});

    it('should return OK', async () => {
		const response = await request(app.app)
			.get('/api/user/jdoe');
		expect(response.text).toBe('OK');
	});

    it('should return Not Found', async () => {
		const response = await request(app.app)
			.get('/api/user/jane');
		expect(response.text).toBe('Not Found');
	});
});
