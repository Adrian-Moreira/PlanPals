import PPUser from "./User";

interface PPLocation {
	name: string;
	address: string;
	createdBy: PPUser['id'];
	comments: PPNote['id'][];
}

interface PPAccommodation {
	id: string;
	name: string;
	location: PPLocation;
	startDate: Date;
	endDate: Date;
	createdBy: PPUser['id'];
	comments: PPNote['id'][];
}

interface PPActivity {
	id: string;
	name: string;
	date: Date;
	duration: number;
	location?: PPLocation;
	done: boolean;
	createdBy: PPUser['id'];
	comments: PPNote['id'][];
}

interface PPDestination {
	id: string;
	name: string;
	startDate: Date;
	endDate: Date;
	activities: PPActivity['id'][];
	accommodation: PPAccommodation['id'];
	createdBy: PPUser['id'];
	comments: PPNote['id'][];
}

interface PPNote {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	createdBy: PPUser['id'];
	comments: PPNote['id'][];
}

class Itinerary {
	id: string;
	createdBy: PPUser['id'];
	roUsers: PPUser['id'][];
	rwUsers: PPUser['id'][];
	title: string;
	describtion: string;
	startDate: Date;
	endDate: Date;
	destinations: PPDestination['id'][];
	comments: PPNote['id'][];
	createdAt: Date;
	updatedAt: Date;

	constructor(data: {
		id: string;
		createdBy: PPUser['id'];
		roUsers: PPUser['id'][];
		rwUsers: PPUser['id'][];
		title: string;
		describtion: string;
		startDate: Date;
		endDate: Date;
		destinations: PPDestination['id'][];
		comments: PPNote['id'][];
		createdAt: Date;
		updatedAt: Date;
	}) {
		this.id = data.id;
		this.createdBy = data.createdBy;
		this.roUsers = data.roUsers;
		this.rwUsers = data.rwUsers;
		this.title = data.title;
		this.describtion = data.describtion;
		this.startDate = data.startDate;
		this.endDate = data.endDate;
		this.destinations = data.destinations;
		this.comments = data.comments;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}
}

export default Itinerary;
