/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'planner-service',
      providers: {
        aws: {
          profile: input.stage === 'production' ? 'pp-prod' : 'pp-dev',
        },
        mongodbatlas: '3.20.3',
      },
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },
  async run() {
    const region = aws.getRegionOutput().name
    const vpc = new sst.aws.Vpc('PlanPalsAWSVPC', { bastion: true })
    const cluster = new sst.aws.Cluster('PlanPalsAWSCluster', { vpc })
    const bucket = new sst.aws.Bucket('PlanPalsBucket', { access: 'public' })
    const userPool = new sst.aws.CognitoUserPool('PlanPalsCognitoUserPool', {
      usernames: ['email'],
    })
    const webClientPool = userPool.addClient('PlanPalsWebClientCognitoUserPool')
    const identityPool = new sst.aws.CognitoIdentityPool('PlanPalsCognitoIdentityPool', {
      userPools: [{ userPool: userPool.id, client: webClientPool.id }],
    })

    const atlasOwner = mongodbatlas.getAtlasUser({
      username: process.env.MONGODB_ATLAS_OWNER_USERNAME,
    })

    const orgId = mongodbatlas.getRolesOrgId({})

    const atlasProject = new mongodbatlas.Project('PlanPalsAtlasProject', {
      orgId: orgId.then((res) => res.orgId),
      isPerformanceAdvisorEnabled: false,
      name: 'PlanPalsAtlasProject',
      isCollectDatabaseSpecificsStatisticsEnabled: false,
      isRealtimePerformancePanelEnabled: false,
      isSchemaAdvisorEnabled: false,
      isExtendedStorageSizesEnabled: false,
      isDataExplorerEnabled: false,
      projectOwnerId: atlasOwner.then((res) => res.userId!),
      withDefaultAlertsSettings: false,
    })

    const atlasClusterName = 'PlanPalsAtlasCluster'

    const atlasCluster = new mongodbatlas.Cluster(atlasClusterName, {
      projectId: atlasProject.id.apply((id) => id),
      name: atlasClusterName,
      providerName: 'TENANT',
      backingProviderName: 'AWS',
      providerRegionName: 'US_EAST_1',
      providerInstanceSizeName: 'M0',
    })

    const atlasUserName: string | undefined = process.env.MONGODB_ATLAS_USERNAME
    const atlasPassword: string | undefined = process.env.MONGODB_ATLAS_PASSWORD

    const atlasUser = new mongodbatlas.DatabaseUser('PlanPalsAtlasUser', {
      username: atlasUserName!,
      password: atlasPassword!,
      projectId: atlasProject.id.apply((id) => id),
      authDatabaseName: 'admin',
      roles: [
        {
          roleName: 'readWrite',
          databaseName: 'test',
        },
        {
          roleName: 'readWrite',
          databaseName: 'planner',
        },
        {
          roleName: 'readAnyDatabase',
          databaseName: 'admin',
        },
      ],
      scopes: [
        {
          name: atlasCluster.name.apply((name) => name),
          type: 'CLUSTER',
        },
      ],
    })

    const atlasAllowAll = new mongodbatlas.ProjectIpAccessList('PlanPalsAllowAll', {
      projectId: atlasProject.id.apply((id) => id),
      ipAddress: '0.0.0.0',
    })

    const connectionString = (uri: string) =>
      `mongodb+srv://${atlasUserName}:${atlasPassword}@${uri}/?retryWrites=true&w=majority&appName=${atlasClusterName}`
    const stdSrv = atlasCluster.connectionStrings[0].standardSrv.apply((srv) => {
      return connectionString(srv.replaceAll('mongodb+srv://', ''))
    })

    const webFrontend = new sst.aws.StaticSite('PlanPalsWeb', {
      path: './frontend/web-frontend',
      domain: {
        name: 'ppapp.xyz',
        redirects: ['www.ppapp.xyz'],
      },
      build: {
        output: 'dist',
        command: 'npm run build',
      },
      environment: {
        VITE_REGION: region,
        VITE_API_URL: 'https://api.ppapp.xyz',
        VITE_BUCKET: bucket.name,
        VITE_USER_POOL_ID: userPool.id,
        VITE_IDENTITY_POOL_ID: identityPool.id,
        VITE_USER_POOL_CLIENT_ID: webClientPool.id,
      },
    })

    const flutterFrontend = new sst.aws.StaticSite('PlanPalsFlutter', {
      path: './front-end-flutter/planpals',
      domain: {
        name: 'm.ppapp.xyz',
      },
      build: {
        output: 'build/web',
        command: 'flutter pub get && flutter build web',
      },
    })

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
  },
})
