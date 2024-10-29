/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'planner-service',
      providers: {
        aws: {
          profile: input.stage === 'production' ? 'hokt-prod' : 'hokt-dev',
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

    const atlasCluster = new mongodbatlas.Cluster('PlanPalsAtlasCluster', {
      projectId: '672071732f78132403602e61',
      name: 'PlanPalsAtlasCluster',
      providerName: 'TENANT',
      backingProviderName: 'AWS',
      providerRegionName: 'US_EAST_1',
      providerInstanceSizeName: 'M0',
    })

    const standard = atlasCluster.connectionStrings[0].standard

    cluster.addService('PlanPalsService', {
      loadBalancer: {
        ports: [{ listen: '80/http', forward: '8080/http' }],
      },
      environment: {
        DATABASE_CONNECTIONSTRING: standard,
      },
      dev: {
        command: 'npm i && npm run start',
      },
    })
  },
})
