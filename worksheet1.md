# Sprint 1 Worksheet

[Coverage Report](https://github.com/Adrian-Moreira/PlanPals/releases/download/Sprint1/coverage.tar.gz)

## Testing importance

### "Unit" Tests

There's none. :(

### Integration Tests

[Testing to create a planner](https://github.com/Adrian-Moreira/PlanPals/blob/c526a134c8ed5059bc16087ea578ae5caf847678/planner-service/__tests__/planner-routes.test.ts#L196)

[Adding transportation to a planner as a user without permission](https://github.com/Adrian-Moreira/PlanPals/blob/11f87d012a3addf533af8bba8c768170cd42c5c1/planner-service/__tests__/t11n-route.test.ts#L186)

[Inviting a user to join a planner](https://github.com/Adrian-Moreira/PlanPals/blob/11f87d012a3addf533af8bba8c768170cd42c5c1/planner-service/__tests__/planner-routes.test.ts#L293)

### Acceptance Tests

There's none. :(

## Reproduceable Environments
1.
	Documentation was clear for each repo and I was *mostly* successful in getting a dev setup running. I spent about 50 minutes to get each component (logic, database, and web frontend) up, though most of this time was spent waiting for installs. Unfortunately I did run into a CORS issue while running the frontend, so it's inconclusive if the backend *actually* worked; though this issue was almost certainly a browser problem.
	
	![Running web frontend](https://i.imgur.com/7Dhoofr.png)
*Web frontend running*

	![Backend](https://i.imgur.com/OagQKTm.png)
*All backend components running*

	![Error](https://i.imgur.com/6OEU5Yg.png)
*Error shown on web app (CORS issue was found in Chrome console)*


2.
	Looking through all the docs I could only find a documented way to run frontend tests. Using npm install I successfully ran all the unit tests for the same web frontend seen above and they all passed! Again, these unit tests were the only tests I found documented.
	
	![Tests](https://i.imgur.com/D0X2mjN.png)
	*Unit tests running successfully*

3.
	The only issue I ran into while setting up and attempting to run my dev environment was the aforementioned CORS issue. This unfortunately halted all progress and, in the end, I failed to get a working environment setup at all. No other issues were reported in the console of any other component. This problem was most certainly due to the distributive nature of the application, though I believe if I overcame this error the system would've worked *flawlessly*. (though there is *no way* for *me* to know definitively)
