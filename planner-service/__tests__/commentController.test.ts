import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import PlanPals from '../src/app';
import { StatusCodes } from 'http-status-codes';
import { User, UserModel } from '../src/models/User';
import { PlannerModel } from '../src/models/Planner';
import { CommentModel } from '../src/models/Comment';

describe('Comment API', () => {
  let app: PlanPals;
  let testUser: User;
  let testPlanner: any;

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017';
    app = new PlanPals({ dbURI: mongoURI });
    app.startServer();

    // Create a test user
    testUser = await UserModel.create({
      userName: 'Jane Doe',
    });
    
    testPlanner = await PlannerModel.create({
      createdBy: testUser._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      roUsers: [],
      rwUsers: [testUser._id],
      name: 'Test Planner',
      description: 'Test Planner Description',
      destinations: [],
      transportations: [],
    });
  });

  afterAll(() => {
    app.stopServer();
  });

  it('should create a comment for a planner', async () => {
    const commentData = {
      plannerId: testPlanner._id,
      title: 'Test Comment',
      content: 'This is a test comment for the planner.',
    };
  
    const response = await request(app.app)
      .post('/comments')
      .send({
        plannerId: commentData.plannerId,
        title: commentData.title,
        content: commentData.content,
        createdBy: testUser._id,
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.CREATED);
  
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
  
  it('should retrieve comments for a planner', async () => {
    const response = await request(app.app)
      .get(`/planner/${testPlanner._id}/comments`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);
  
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Test Comment');
    expect(response.body.data[0].content).toBe('This is a test comment for the planner.');
  });
  
  it('should delete a comment', async () => {
    const getCommentsResponse = await request(app.app)
      .get(`/planner/${testPlanner._id}/comments`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);
  
    expect(getCommentsResponse.body.success).toBe(true);
    expect(getCommentsResponse.body.data).toHaveLength(1);
  
    const commentId = getCommentsResponse.body.data[0]._id;
  
    const deleteResponse = await request(app.app)
      .delete(`/comments/${commentId}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);
  
    expect(deleteResponse.body.success).toBe(true);
    expect(deleteResponse.body.message).toBe('Comment deleted successfully');
  });
})