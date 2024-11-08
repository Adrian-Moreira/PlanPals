[Updated Diagram](./Diagram.md)

## Regression Testing

1. **How We Run Regression Tests:**
   - Jest + Supertest for REST API testing
   - With GitHub Actions as CI platform
   - Complete test on main pushes and pull requests
   - Changed files only during local development

2. **Test Script and Results:**
   - [GitHub Actions workflow](../../.github/workflows/main.yml) 
   ```yaml
   - name: Run PP-Server Tests
     run: |
       pushd backend/planner-service
       npm install
       npm run test -- --ci --reporters=jest-junit
   ```

   Latest Execution [Result](https://github.com/Adrian-Moreira/PlanPals/runs/32504914720)

## Testing slowdown

We have been able to keep all unit tests, integration tests in out test plan since out feature set is fairly small.

### Current Test Plans

1. **Development Testing Plan**
```bash
# During local development for the backend, we run
npm run test -- --onlyChanged
```
This runs tests only for modified files

2. **Main Plan**
```yaml
on:
  push:
  pull_request:
    branches: [main]
```
This runs a complete regression suite including all integration tests on push and pull requests.

## Not testing

### API Tier (Express + MongoDB)
[Coverage](https://github.com/Adrian-Moreira/PlanPals/releases/download/Sprint2/coverage.tar.gz)
- **Fully Tested (80%+)**:
  - Route handlers
  - Service layer
  - Model validations
  - CRUD operations
  - Error handling

```mermaid
flowchart TB
    subgraph Infra["Infrastructure (Not Tested)"]
        SST["SST Framework (Not tested)"]
        Docker["Docker Container (Not tested)"]
        Docker --> SST
        SST --> Cloud
        subgraph Cloud["Cloud (Not Tested)"]
            S3["AWS S3 Serving Web Frontend (Not tested)"]
            ELB["AWS Elastic Load Balancer (Not tested)"]
            ECS["AWS Elastic Container Service (Not tested)"]
            Atlas["MongoDB Atlas (Not tested)"]
            ELB --> ECS
        end
    end

    S3 --> Client
    ECS --> ExpressAPI

    subgraph "PlanPals"
        subgraph FrontendTier["Frontend Tier (Not Tested)"]
            Frontend["Flutter Frontend (Not tested)"]
            Client["Web Frontend (Not tested)"]
        end

        subgraph SSS["Service Tier (Fully Tested)"]
            subgraph "ExpressAPI"
                Routes["Route Layer (100% Coverage)"]
                subgraph Services["Services (100% Coverage)"]
                    subgraph PlannerServices["Planner Services"]
                        PlannerOps["Planner Operations (100% Coverage)"]
                    end
                end
                Models["Mongoose Schema (95.3% Coverage)"]
                Routes --> Services
                Services --> Models
            end
        end

        subgraph Database["Database (Partially Tested)"]
            Planners["Planner (Tested via Integration with in-memory DB)"]
        end
    end

    Atlas --> Database
    FrontendTier --> ELB
    Models --> Database

    classDef fullyCovered fill:#90EE90,stroke:#006400
    classDef mostlyCovered fill:#FFD700,stroke:#B8860B
    classDef notTested fill:#FFB6C1,stroke:#8B0000
    classDef partiallyTested fill:#87CEEB,stroke:#4682B4
    classDef pp fill:#bbccff,stroke:#1e1e1e
    classDef containers fill:#f5f5f5,stroke:#9e9e9e
    classDef cloud fill:#f5c5b5,stroke:#1e1e1e

    class ExpressAPI containers
    class Infra,Cloud cloud
    class Client,Frontend,S3,ELB,ECS,SST,Docker,Atlas notTested
    class Routes,Services,PlannerOps,PlannerServices,SSS fullyCovered
    class Models mostlyCovered
    class Planners,Database partiallyTested
    class PlanPals pp
```

## Profiler

### Slowest Endpoints:
- [Output](./profiler/Time)
  - DELETE /planner/[id]/destination/[id] ~71.04ms
    ```
    DELETE /planner/672d5a0309321a3990996ff2/destination/672d5a1309321a3990997002: 71.0425830000313ms
    ```
    - **Is this fixable?**
      - Yes, we can optimize our database delete operation to use a more efficient way instead of finding then deleting associated objects one-by-one.

- [Output](https://github.com/Adrian-Moreira/PlanPals/releases/download/Sprint2/planner-service-profile.tar.gz)
  - Frequent Database Operation
    - **Is this fixable?**
      - Yes, we can use cache for frequently accessed documents to avoid expensive database calls.

## Last Dash

1. **What issues do you foresee in the next (and final) sprint?**
   - Near real-time protocol, functionality and consistency between the 2 frontends might need more coordination.
   - Performance issue, 

## Showoff

#### Request Validation Architecture

My best contribution was designing a type-safe, reusable request validation that transform Zod schemas to validation middleware.

- Self-documenting [API contracts](../../backend/planner-service/src/controllers/transportation.ts):
    ```typescript
    const TransportationRouteSchema = {
    createTransportation: ReqAttrSchema.extend({
        params: z.object({
        plannerId: ObjectIdStringSchema,
        }),
        body: z.object({
        createdBy: ObjectIdStringSchema,
        type: z.string(),
        details: z.string().optional(),
        departureTime: z.string().datetime().or(z.date()),
        arrivalTime: z.string().datetime().or(z.date()),
        vehicleId: z.string().optional(),
        }),
    })
    }
    ```
- Validation Middleware [Factory](../../backend/planner-service/src/utils/RequestUtils.ts)
    ```typescript
    function mkParsers(schemas: Record<string, z.ZodSchema<any>>,):
        Record<string, (req: Request, res: Response, next: NextFunction) => Promise<void>>
        {
            return Object.fromEntries(Object.entries(schemas).map(([key, schema]) => [
                key, mkRequestParser(schema as z.ZodSchema<any>)
            ]))
        }
    ```

#### Infrastructure as Code

Contributed to the infrastructure setup using [SST](../../sst.config.ts) and AWS
- Declarative setup which is easy to change and expand
    ```typescript
    cluster.addService('PlanPalsService', {
        link: [atlasCluster, bucket, webFrontend, flutterFrontend],
        loadBalancer: {
            domain: {
                name: 'api.ppapp.xyz',
            },
            ports: [
                { listen: '80/http', forward: '8080/http', container: 'planner-service' },
                { listen: '443/https', forward: '8080/http', container: 'planner-service' },
            ],
        },
        containers: [
            {
                name: 'planner-service',
                image: {
                    context: './backend/planner-service',
                    dockerfile: './backend/planner-service/Dockerfile',
                },
                    environment: {
                    DATABASE_CONNECTIONSTRING: stdSrv,
                },
            },
        ],
        dev: {
            command: 'npm i && npm run start',
        },
    })
    ```
- Easy Continuous Deployment with `git push` to production branch with [SST Console](https://console.sst.dev) or `npx sst deploy --stage production` to deploy it manually.
  - Build and upload backend container to Elastic Container Registry and serve with Elastic Container Service
  - Create database at MongoDB Atlas
  - Serve static site for both frontend clients with S3
  - Load Balancer which redirects `http` and `https` requests
  - Secrets managed through SST Console or with environment variables for deploying manually.


- **"Simplicity is the ultimate sophistication"**
  - Self-documenting API contracts through reusable validation schemas, separation of concerns (Here: Validation) making the code maintainable
  - Declarative infrastructure that's easy to understand, modify and deploy


#### Web Comment Integration

Adrian's most proud contribution was designing and simplifying react components to allow comments on any object with a single, simple component

   ```javascript
   //Creates a button which when clicked shows or hides the comment box for a given object
   //objectId must be supplied to show the correct comment box
   
   import React, { useState } from 'react';
   import { BsChatFill } from "react-icons/bs";
   import CommentBox from './commentBox';
   
   //id is the objectId, type is the object type
   const CommentButton = ({id, type}) => {
     const [isVisible, setIsVisible] = useState(false);
   
     const toggleVisibility = () => {
       setIsVisible(prev => !prev);
     };
   
     return (
       <div id="comments" style={{display:"inline-block"}}>
   
           <button className="Icon-button" onClick={toggleVisibility}>
               <BsChatFill/>
           </button>
   
           <div id="commentVisibility" style={{display: isVisible ? "flex" : "none", float:"right"}}>
               <CommentBox objectId={id} objectType={type}/>
           </div>
       </div>
     );
   };
   
   export default CommentButton;
   ```

- **As simple as possible**
  - Creating layers of containers, I was able simplify the code inside as much as possible
  - This creates maintainable, readable and easy to use code
  - Adding this one button and supplying an objectId and type is all you need to add comments to anything!

#### Flutter Generic Card Component

[Generic Card Code](https://github.com/Adrian-Moreira/PlanPals/blob/main/front-end-flutter/planpals/lib/shared/components/generic_card.dart)

Ron’s proudest contribution was creating a flexible Card component that displays different types of data across the mobile app. This reusable design keeps the app consistent, reduced extra coding, and makes updates easier.

#### Web Frontend Planner UI

![UI Image](Images/Planner%20UI.png)
![Mobile UI Image](Images/Planner%20UI%20-%20Mobile.png)![UI Input Image](Images/Planner%20UI%20-%20Input.png)

Josh's proudest contribution was working on the web frontend UI for planners. The planner UI was iterated on each sprint to create an interface that was functional, good looking, and had great usability. We put a lot of effort into designing a UI that was simple and effective. We also focused on using CSS to style the components of the interface so that they would look great on both mobile and desktop. The UI was designed to display all necessary information to a user in a way that is understandable and digestible. We also designed the interface and forms so that it was very simple for users to input data and make the most out of their planners. In this we opted to use mostly icons as buttons rather than large buttons with words as this reduced clutter on the screen and gave the whole page a simple and clean appearance. All in all, we are proud of how the web frontend’s planner UI turned out.  

