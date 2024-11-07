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

```mermaid
flowchart LR
    subgraph "Infrastructure"
        SST["SST Framework"]
        Docker["Docker Container"]
        Docker --> SST
        SST --> Cloud
        subgraph "Cloud"
            S3["AWS S3 Serving Web Frontend (ppapp.xyz)"]
            ELB["AWS Elastic Load Balancer (api.ppapp.xyz)"]
            ECS["AWS Elastic Container Service"]
            subgraph "MongoDB"
                subgraph "Database"
                    Planners[(Planner)]
                end
            end
            ELB --> ECS
        end
    end
    S3 --> Client
    ECS --> ExpressAPI
    subgraph "PlanPals"
        subgraph "Frontend Tier"
            Frontend["Flutter Frontend"]
            Client["Web Frontend (ppapp.xyz)"]
        end
        subgraph "Service Tier"
            subgraph "ExpressAPI"
                Routes["Route Layer (Input Validation)"]
                subgraph "Services"
                    subgraph "Planner Services"
                    end
                end
                Models["Model (Mongoose Schema)"]
                
                Routes --> Services
                Services --> Models
            end
        end

    end

    Client --> ELB
    Frontend --> ELB
    Models --> Database
    classDef frontendTier fill:#e1bee7,stroke:#9c27b0
    classDef apiGateway fill:#bbdefb,stroke:#1976d2
    classDef serviceTier fill:#c8e6c9,stroke:#4caf50
    classDef dataTier fill:#ffe0b2,stroke:#ff9800
    classDef infrastructure fill:#f5f5f5,stroke:#9e9e9e
    classDef containers fill:#f5f5f5,stroke:#9e9e9e
    classDef cloud fill:#f5c5b5,stroke:#1e1e1e
    classDef pp fill:#bbccff,stroke:#1e1e1e

    class Client,Frontend frontendTier
    class ALB,Gateway apiGateway
    class Routes,Services,Models,PlannerService serviceTier
    class MongoDB,Database,Planner dataTier
    class SST,Docker,Cloud infrastructure
    class AWS cloud
    class ExpressAPI containers
    class PlanPals pp
```