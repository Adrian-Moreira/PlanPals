import { PlannerModel } from '../models/Planner';

export class VotingService {

    // Vote on a location
    public async voteOnLocation(planId: string, locationName: string, userId: string, upvote: boolean): Promise<void> {
        const plan = await PlannerModel.findById(planId);
        if (!plan) throw new Error('Plan not found');

        const location = plan.locations?.find(p => p.name === locationName);
        if (location) {
            location.votes += upvote ? 1 : -1;
        } else {
            throw new Error('location not found');
        }

        await plan.save();  // Save the updated planner with the new vote
    }

    // Vote on an accommodation
    public async voteOnAccommodation(planId: string, accommodationName: string, userId: string, upvote: boolean): Promise<void> {
        const plan = await PlannerModel.findById(planId);
        if (!plan) throw new Error('Plan not found');

        const accommodation = plan.accommodations?.find(a => a.name === accommodationName);
        if (accommodation) {
            accommodation.votes += upvote ? 1 : -1;
        } else {
            throw new Error('Accommodation not found');
        }

        await plan.save();  // Save the updated planner with the new vote
    }

    // Vote on a transportation option
    public async voteOnTransportOption(planId: string, transportType: string, userId: string, upvote: boolean): Promise<void> {
        const plan = await PlannerModel.findById(planId);
        if (!plan) throw new Error('Plan not found');

        const transport = plan.transportations?.find(t => t.name === transportType);
        if (transport) {
            transport.votes += upvote ? 1 : -1;
        } else {
            throw new Error('Transport option not found');
        }

        await plan.save();  // Save the updated planner with the new vote
    }
}
