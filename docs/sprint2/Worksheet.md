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
- **Fully Tested (80%+)**:
  - Route handlers
  - Service layer
  - Model validations
  - CRUD operations
  - Error handling

- **Mostly Tested (20-80%)**:
  - Edge cases

- **Somewhat Tested (0-20%)**:
  - Concurrent operations
  
- **Not Tested**:
  - Race conditions
  - Long-running operations
  - Network failures

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