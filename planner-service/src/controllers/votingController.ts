import { PlannerService } from '../services/PlannerService';

export class PlannerController {
    private plannerService: PlannerService;

    constructor() {
        this.plannerService = new PlannerService();
    }

    // Create a travel plan
    public async createTravelPlan(req: any, res: any): Promise<void> {
        try {
            const planData = req.body;
            const newPlan = await this.plannerService.createTravelPlan(planData);
            res.status(200).json(newPlan);
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'An internal server error occurred and the travel plan was not created' });
        }
    }

    // Invite a user
    public async inviteUser(req: any, res: any): Promise<void> {
        try {
            const { planId, userId } = req.body;
            await this.plannerService.inviteUser(planId, userId);
            res.status(200).json({ message: 'User invited successfully' });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'An internal server error occurred and the user was not invited' });
        }
    }

    // Join a travel plan
    public async joinTravelPlan(req: any, res: any): Promise<void> {
        try {
            const { planId, userId } = req.body;
            await this.plannerService.joinTravelPlan(planId, userId);
            res.status(200).json({ message: 'Joined travel plan successfully' });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'An internal server error occurred and the user was not joined to the travel plan' });
        }
    }
}
