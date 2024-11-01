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
    const vpc = new sst.aws.Vpc('PlanPalsAWSVPC', { bastion: true })
    const cluster = new sst.aws.Cluster('PlanPalsAWSCluster', { vpc })
    const bucket = new sst.aws.Bucket('PlanPalsBucket', {
      access: 'public',
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

    cluster.addService('PlanPalsService', {
      link: [atlasCluster, bucket],
      loadBalancer: {
        domain: {
          name: 'api.ppapp.xyz',
        },
        ports: [
          // { listen: '80/http', forward: '3000/http', container: 'planpals-ui' },
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
        // {
        //   name: 'planpals-web',
        //   image: {
        //     context: './front-end-web',
        //     dockerfile: './front-end-web/Dockerfile',
        //   },
        //   environment: {
        //     DATABASE_CONNECTIONSTRING: stdSrv,
        //     CLUSTER_ARN: cluster.nodes.cluster.arn,
        //     CLUSTER_URN: cluster.nodes.cluster.urn,
        //     CLUSTER_NAME: cluster.nodes.cluster.name,
        //     BUCKET_NAME: bucket.name,
        //   },
        // },
      ],
      dev: {
        command: 'npm i && npm run start',
      },
    })
  },
})
