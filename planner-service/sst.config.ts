/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'planner-service',
      providers: {
        aws: {
          profile:
            input.stage === 'production'
              ? 'placeholder-prod'
              : 'placeholder-dev',
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

    const atlasOwner = mongodbatlas.getAtlasUser({
      username: 'placeholder',
    })

    const orgId = mongodbatlas.getRolesOrgId({})

    const atlasTeam = new mongodbatlas.Team('PlanPalsAtlasTeam', {
      orgId: orgId.then((res) => res.orgId),
      name: 'PlanPalsAtlasTeam',
      usernames: ['placeholder'],
    })

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

    const atlasCluster = new mongodbatlas.Cluster('PlanPalsAtlasCluster', {
      projectId: atlasProject.id.apply((id) => id),
      name: 'PlanPalsAtlasCluster',
      providerName: 'TENANT',
      backingProviderName: 'AWS',
      providerRegionName: 'US_EAST_1',
      providerInstanceSizeName: 'M0',
    })

    const standard = atlasCluster.connectionStrings[0].private.apply(
      (str) => str,
    )

    cluster.addService('PlanPalsService', {
      link: [atlasCluster],
      loadBalancer: {
        ports: [{ listen: '80/http', forward: '8080/http' }],
      },
      environment: {
        DATABASE_CONNECTIONSTRING: 'placeholder',
      },
      dev: {
        command: 'npm i && npm run start',
      },
    })
  },
})
