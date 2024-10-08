import { VotingService } from '../services/votingService';
import { StatusCodes } from 'http-status-codes';

export class VotingController {
    private votingService: VotingService;

    constructor() {
        this.votingService = new VotingService();
    }

    // Vote on a locations
    public async voteOnLocation(req: any, res: any): Promise<void> {
        try {
            const { planId, locationName, upvote, userId } = req.body;

            if (!planId || !locationName || typeof upvote !== 'boolean' || !userId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Missing or invalid parameters',
                });
            }

            await this.votingService.voteOnLocation(planId, locationName, userId, upvote);
            res.status(StatusCodes.OK).json({ message: 'Vote registered successfully on locations' });
        } catch (error: any) {
            if (error.name === 'BSONError' || error.name === 'CastError') {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ObjectId' });
            }

            throw error;  // Let other errors propagate to a global error handler
        }
    }

    // Vote on an accommodation
    public async voteOnAccommodation(req: any, res: any): Promise<void> {
        try {
            const { planId, accommodationName, upvote, userId } = req.body;

            if (!planId || !accommodationName || typeof upvote !== 'boolean' || !userId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Missing or invalid parameters',
                });
            }

            await this.votingService.voteOnAccommodation(planId, accommodationName, userId, upvote);
            res.status(StatusCodes.OK).json({ message: 'Vote registered successfully on accommodation' });
        } catch (error: any) {
            if (error.name === 'BSONError' || error.name === 'CastError') {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ObjectId' });
            }

            throw error;
        }
    }

    // Vote on a transportation option
    public async voteOnTransportOption(req: any, res: any): Promise<void> {
        try {
            const { planId, transportType, upvote, userId } = req.body;

            if (!planId || !transportType || typeof upvote !== 'boolean' || !userId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Missing or invalid parameters',
                });
            }

            await this.votingService.voteOnTransportOption(planId, transportType, userId, upvote);
            res.status(StatusCodes.OK).json({ message: 'Vote registered successfully on transport option' });
        } catch (error: any) {
            if (error.name === 'BSONError' || error.name === 'CastError') {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ObjectId' });
            }

            throw error;
        }
    }
}
