# PPAPI

## planner
```
GET /planner

POST /planner
{
  createdBy: userid
  startDate: "ISODate"
  endDate: "ISODate"
  roUsers?: [userid_0, ...]
  rwUsers?: [userid_0, ...]
  name: "Trip to Spain"
  description?: ""
  destinations: [destid]
  transportations: [t12nid]
}
```

### transporation
```
GET/POST /planner/:plannerId/transporation

GET/PUT/DELETE /planner/:plannerId/transporation/:transporationId
```

### destination

GET/POST /planner/:plannerId/destination

GET/PUT/DELETE /planner/:plannerId/destination/:destinationId

#### accommodation
```
GET/POST /planner/:plannerId/destination/:destinationId/accommodation

GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/accommodation/:accommodationId
```
#### activity
```
GET/POST /planner/:plannerId/destination/:destinationId/activity

GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/activity/:activityId
```

##### location
```
GET/POST /planner/:plannerId/destination/:destinationId/activity/:activityId/location

GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/activity/:activityId/location/:locationId
```
##### vote
```
GET/POST /planner/:plannerId/destination/:destinationId/activity/:activityId/vote
```
##### comment
```
GET/POST /planner/:plannerId/destination/:destinationId/activity/:activityId/comment

GET/PUT /planner/:plannerId/destination/:destinationId/activity/:activityId/comment/:commentId
```