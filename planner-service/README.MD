# PP Express!

## Prerequisites

- [Node v18.20.4](https://nodejs.org/en/download/package-manager)

## Development

### Setting up your Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/h-kt/PlanPals.git
   cd PlanPals/planner-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build:
   ```bash
   npm run build
   ```

### Running

To run the service:
```bash
npm run start
```

To run tests:
```bash
npm run test
```

To run tests with coverage:
```bash
npm run test -- --coverage
```

### Building the Docker Image

To run the server using the built Docker image:

1. Running the container:
   ```bash
   docker compose -f docker-compose.yml up --build
   ```

The server will be accessible at `http://localhost:xxxx`.

## API Documentation

[API](./docs/API.md)


## Contributing


## License

[WTFPL](./LICENSE)