#!/usr/bin/env node

import express, { Express, Request, Response } from 'express';
// import { Server } from 'socket.io';
import { createServer, Server } from 'node:http';
import config from './config';
import CheapDB from './db/mongo';
import PPUser from './objects/User';

const port: number = config.server.port ? parseInt(config.server.port) : 8080;

class PlanPals {
	public app: Express;
	server: Server;
	db: CheapDB;

	constructor(db: CheapDB = new CheapDB()) {
		this.app = express();
		this.server = createServer(this.app);
		this.db = db;
		this.initRoutes();
	}

	private initRoutes(): void {
		this.app.post(
			'/api/user/create',
			express.json(),
			async (req: Request<{}, {}, PPUser>, res: Response) => {
				let user = req.body;
				try {
					await this.db.insertUser({
						id: user.id,
						userName: user.userName,
					} as PPUser);
					res.sendStatus(201);
				} catch (err) {
					res.sendStatus(500);
				}
			}
		);
		this.app.get('/api/user/:id', async (req: Request, res: Response) => {
			try {
				let user = await this.db.findUserById(req.params.id);
				if (user) {
					res.sendStatus(200);
				} else {
					res.sendStatus(404);
				}
			} catch (err) {
				res.sendStatus(500);
			}
		});
	}

	public startServer(): void {
		this.server.listen(port, () => {
			console.log(`PP erected on port ${port}`);
		});
	}

	public async stopServer(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.db.closeMongoConnection();
			if (!this.server) {
				resolve();
				return;
			}
			this.server.close((err: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
}

if (require.main === module) {
	const pp = new PlanPals();

	process.on('SIGINT', () => pp.stopServer());
	process.on('SIGTERM', () => pp.stopServer());

	pp.startServer();
}

export default PlanPals;
