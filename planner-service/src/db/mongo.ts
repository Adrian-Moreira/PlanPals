import { MongoClient, Db } from 'mongodb';
import config from '../config';
import PPUser from '../objects/User';

const mongoURI = config.database.connectionString
	? config.database.connectionString
	: 'mongodb://localhost:27017';

class CheapDB {
	private mongoClient?: MongoClient;
	private mongoURI: string;

	constructor(uri: string = mongoURI) {
		this.mongoURI = uri;
	}

	public async connectToMongoDB(): Promise<MongoClient> {
		if (!this.mongoClient) {
			try {
				this.mongoClient = new MongoClient(this.mongoURI);
				await this.mongoClient.connect();
				console.log('Connected to MongoDB');
			} catch (err) {
				console.error('Failed to connect to MongoDB:', err);
				throw err;
			}
		}
		return this.mongoClient;
	}

	public async getDB(dbName: string): Promise<Db> {
		if (!this.mongoClient) {
			this.mongoClient = await this.connectToMongoDB();
		}
		return this.mongoClient.db(dbName);
	}

	public async closeMongoConnection() {
		if (this.mongoClient) {
			this.mongoClient.close();
			console.log('MongoDB connection closed');
		}
	}

	public async insertUser(user: PPUser): Promise<void> {
		try {
			const db = await this.getDB('planner');
			const collection = db.collection('users');
			const result = await collection.insertOne(user);
			console.log('User inserted with id:', result.insertedId);
		} catch (err) {
			console.error('Error inserting user:', err);
		}
	}

	public async findUserById(id: string): Promise<PPUser | null> {
		try {
			const db = await this.getDB('planner');
			const collection = db.collection('users');

			const user = await collection.findOne({ id });

			if (user) {
				console.log('User found:', user);
				return user as unknown as PPUser;
			} else {
				console.log('User not found with id:', id);
				return null;
			}
		} catch (err) {
			console.error('Error finding user by id:', err);
		}
        return null;
	}
}

export default CheapDB;
