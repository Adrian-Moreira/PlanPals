# PPAPI

This document outlines the API endpoints for the PPAPI (Planner API), detailing the available requests, required parameters, and expected responses. The API is structured to manage planners, destinations, accommodations, activities, and associated entities like transportation, votes, comments, and locations.

---

## Table of Contents

- [PPAPI](#ppapi)
  - [Table of Contents](#table-of-contents)
  - [Planner](#planner)
    - [`GET /planner`](#get-planner)
      - [Query Parameters:](#query-parameters)
      - [Example Request:](#example-request)
      - [Response:](#response)
    - [`POST /planner`](#post-planner)
      - [Request Body:](#request-body)
      - [Response:](#response-1)
  - [Transportation](#transportation)
    - [`GET /planner/:plannerId/transportation`](#get-plannerplanneridtransportation)
      - [Parameters:](#parameters)
      - [Example Request:](#example-request-1)
      - [Response:](#response-2)
    - [`POST /planner/:plannerId/transportation`](#post-plannerplanneridtransportation)
      - [Parameters:](#parameters-1)
      - [Request Body:](#request-body-1)
      - [Response:](#response-3)
    - [`GET/PUT/DELETE /planner/:plannerId/transportation/:transportationId`](#getputdelete-plannerplanneridtransportationtransportationid)
      - [Parameters:](#parameters-2)
      - [GET Example Request:](#get-example-request)
      - [GET Response:](#get-response)
      - [PUT Request Body:](#put-request-body)
      - [PUT Response:](#put-response)
      - [DELETE Response:](#delete-response)
  - [Destination](#destination)
    - [`GET/POST /planner/:plannerId/destination`](#getpost-plannerplanneriddestination)
      - [Parameters:](#parameters-3)
      - [GET Example Request:](#get-example-request-1)
      - [GET Response:](#get-response-1)
      - [POST Request Body:](#post-request-body)
      - [POST Response:](#post-response)
    - [`GET/PUT/DELETE /planner/:plannerId/destination/:destinationId`](#getputdelete-plannerplanneriddestinationdestinationid)
      - [Parameters:](#parameters-4)
      - [GET Example Request:](#get-example-request-2)
      - [GET Response:](#get-response-2)
      - [PUT Request Body:](#put-request-body-1)
      - [PUT Response:](#put-response-1)
      - [DELETE Response:](#delete-response-1)
  - [Accommodation](#accommodation)
    - [`GET/POST /planner/:plannerId/destination/:destinationId/accommodation`](#getpost-plannerplanneriddestinationdestinationidaccommodation)
      - [Parameters:](#parameters-5)
      - [GET Example Request:](#get-example-request-3)
      - [GET Response:](#get-response-3)
      - [POST Request Body:](#post-request-body-1)
      - [POST Response:](#post-response-1)
    - [`GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/accommodation/:accommodationId`](#getputdelete-plannerplanneriddestinationdestinationidaccommodationaccommodationid)
      - [Parameters:](#parameters-6)
      - [GET Example Request:](#get-example-request-4)
      - [GET Response:](#get-response-4)
      - [PUT Request Body:](#put-request-body-2)
      - [PUT Response:](#put-response-2)
      - [DELETE Response:](#delete-response-2)
  - [Activity](#activity)
    - [`GET/POST /planner/:plannerId/destination/:destinationId/activity`](#getpost-plannerplanneriddestinationdestinationidactivity)
      - [Parameters:](#parameters-7)
      - [GET Example Request:](#get-example-request-5)
      - [GET Response:](#get-response-5)
      - [POST Request Body:](#post-request-body-2)
      - [POST Response:](#post-response-2)
    - [`GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/activity/:activityId`](#getputdelete-plannerplanneriddestinationdestinationidactivityactivityid)
      - [Parameters:](#parameters-8)
      - [GET Example Request:](#get-example-request-6)
      - [GET Response:](#get-response-6)
      - [PUT Request Body:](#put-request-body-3)
      - [PUT Response:](#put-response-3)
      - [DELETE Response:](#delete-response-3)
  - [Location](#location)
    - [`GET/POST /planner/:plannerId/destination/:destinationId/activity/:activityId/location`](#getpost-plannerplanneriddestinationdestinationidactivityactivityidlocation)
      - [Parameters:](#parameters-9)
      - [GET Example Request:](#get-example-request-7)
      - [GET Response:](#get-response-7)
      - [POST Request Body:](#post-request-body-3)
      - [POST Response:](#post-response-3)
    - [`GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/activity/:activityId/location/:locationId`](#getputdelete-plannerplanneriddestinationdestinationidactivityactivityidlocationlocationid)
      - [Parameters:](#parameters-10)
      - [GET Example Request:](#get-example-request-8)
      - [GET Response:](#get-response-8)
      - [PUT Request Body:](#put-request-body-4)
      - [PUT Response:](#put-response-4)
      - [DELETE Response:](#delete-response-4)
  - [Vote](#vote)
    - [`GET /planner/:plannerId/destination/:destinationId/activity/:activityId/vote`](#get-plannerplanneriddestinationdestinationidactivityactivityidvote)
      - [Parameters:](#parameters-11)
      - [Example Request:](#example-request-2)
      - [Response:](#response-4)
    - [`POST /planner/:plannerId/destination/:destinationId/activity/:activityId/vote`](#post-plannerplanneriddestinationdestinationidactivityactivityidvote)
      - [Parameters:](#parameters-12)
      - [Request Body:](#request-body-2)
      - [Response:](#response-5)
  - [Comment](#comment)
    - [`GET/POST /planner/:plannerId/destination/:destinationId/activity/:activityId/comment`](#getpost-plannerplanneriddestinationdestinationidactivityactivityidcomment)
      - [Parameters:](#parameters-13)
      - [GET Example Request:](#get-example-request-9)
      - [GET Response:](#get-response-9)
      - [POST Request Body:](#post-request-body-4)
      - [POST Response:](#post-response-4)
    - [`GET/PUT /planner/:plannerId/destination/:destinationId/activity/:activityId/comment/:commentId`](#getput-plannerplanneriddestinationdestinationidactivityactivityidcommentcommentid)
      - [Parameters:](#parameters-14)
      - [GET Example Request:](#get-example-request-10)
      - [GET Response:](#get-response-10)
      - [PUT Request Body:](#put-request-body-5)
      - [PUT Response:](#put-response-5)

---

## Planner

### `GET /planner`

Retrieve a list of planners created by a specific user.

#### Query Parameters:

- `userId` (string): **Required.** The user ID of the planner creator.

#### Example Request:

```
GET /planner?userId=user123
```

#### Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "planner001",
      "createdBy": "user123",
      "startDate": "2023-10-01T00:00:00Z",
      "endDate": "2023-10-10T00:00:00Z", // ISODateString
      "name": "Trip to Spain",
      "description": "Exploring Barcelona and Madrid",
      "roUsers": [{}: User],
      "rwUsers": [{}: User],
      "destinations": [{}: Destination],
      "transportations": [{}: Transport],
      "invites": [{}: User],
    }
    // ... more planners
  ]
}
```

### `POST /planner`

Create a new planner.

#### Request Body:

```json
{
  "createdBy": "user123",
  "startDate": "2023-10-01T00:00:00Z",
  "endDate": "2023-10-10T00:00:00Z",
  "roUsers": ["user456"],        // Optional: Read-only user ids
  "rwUsers": ["user789"],        // Optional: Read-write user ids
  "name": "Trip to Spain",
  "description": "Exploring Barcelona and Madrid",  // Optional
  "destinations": ["dest001"],   // List of destination IDs
  "transportations": ["trans001"] // List of transportation IDs
}
```

#### Response:

```json
{
  "success": true,
  "data": {
    "_id": "planner002",
    "createdBy": "user123",
    "startDate": "2023-10-01T00:00:00Z",
    "endDate": "2023-10-10T00:00:00Z",
    "name": "Trip to Spain",
    "description": "Exploring Barcelona and Madrid",
    "roUsers": [{}: User],
    "rwUsers": [{}: User],
    "destinations": [{}: Destination],
    "transportations": [{}: Transport],
    "invites": [{}: User],
  }
}
```

---

## Transportation

### `GET /planner/:plannerId/transportation`

Retrieve all transportation entries associated with a planner.

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.

#### Example Request:

```
GET /planner/planner001/transportation?userId=uid001
```

#### Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "trans001",
      "plannerId": "planner001",
      "type": "Flight",
      "details": "Flight from NYC to Madrid with Iberia",
      "vehicleId": "IB6252",
      "departureTime": "2024-10-09T20:45:00-04:00",
      "arrivalTime": "2024-10-10T09:54:00+02:00"
    }
    // ... more transportation entries
  ]
}
```

### `POST /planner/:plannerId/transportation`

Add a new transportation entry to a planner.

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.

#### Request Body:

```json
{
  "createdBy": "uid001",
  "type": "Flight",
  "details": "Flight from NYC to Madrid with Iberia",
  "departureTime": "2024-10-09T20:45:00-04:00",
  "arrivalTime": "2024-10-10T09:54:00+02:00",
  "vehicleId": "IB6252"
}
```

#### Response:

```json
{
  "success": true,
  "data": {
    "_id": "trans002",
    "plannerId": "planner001",
    "type": "Train",
    "vehicleId": "AVE #3141",
    "details": "Train from Madrid to Barcelona",
    "departureTime": "2024-10-11T14:30:00+02:00",
    "arrivalTime": "2024-10-11T16:30:00+02:00"
  }
}
```

### `GET/PUT/DELETE /planner/:plannerId/transportation/:transportationId`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `transportationId` (string): **Required.** The ID of the transportation entry.

#### GET Example Request:

```
GET /planner/planner001/transportation/trans001
```

#### GET Response:

```json
{
  "success": true,
  "data": {
    "transportationId": "trans001",
    "plannerId": "planner001",
    "type": "Flight",
    "details": "Flight from NYC to Madrid",
    "departureTime": "2023-10-01T08:00:00Z",
    "arrivalTime": "2023-10-01T20:00:00Z"
  }
}
```

#### PUT Request Body:

```json
{
  "details"?: "Updated flight details",
  "vehicleId"?: "",
  "departureTime"?: "",
  "arrivalTime"?: ""
}
```

#### PUT Response:

```json
{
  "success": true,
  "data": {}: Transport // updated object
}
```

#### DELETE Response:

```json
{
  "success": true,
  "message": "Transportation entry deleted successfully."
}
```

---

## Destination

### `GET/POST /planner/:plannerId/destination`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.

#### GET Example Request:

```
GET /planner/planner001/destination
```

#### GET Response:

```json
{
  "success": true,
  "data": [
    {
      "destinationId": "dest001",
      "plannerId": "planner001",
      "name": "Madrid",
      "startDate": "2023-10-01",
      "endDate": "2023-10-05",
      "activities": ["activity001"],
      "accommodations": ["accom001"]
    }
    // ... more destinations
  ]
}
```

#### POST Request Body:

```json
{
  "name": "Barcelona",
  "startDate": "2023-10-05",
  "endDate": "2023-10-10"
}
```

#### POST Response:

```json
{
  "success": true,
  "data": {
    "destinationId": "dest002",
    "plannerId": "planner001",
    "name": "Barcelona",
    "startDate": "2023-10-05",
    "endDate": "2023-10-10",
    "activities": [],
    "accommodations": []
  }
}
```

### `GET/PUT/DELETE /planner/:plannerId/destination/:destinationId`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `destinationId` (string): **Required.** The ID of the destination.

#### GET Example Request:

```
GET /planner/planner001/destination/dest001
```

#### GET Response:

```json
{
  "success": true,
  "data": {
    "destinationId": "dest001",
    "plannerId": "planner001",
    "name": "Madrid",
    "startDate": "2023-10-01",
    "endDate": "2023-10-05",
    "activities": ["activity001"],
    "accommodations": ["accom001"]
  }
}
```

#### PUT Request Body:

```json
{
  "name": "Madrid City",
  "endDate": "2023-10-06" // Extended stay
}
```

#### PUT Response:

```json
{
  "success": true,
  "data": {
    "destinationId": "dest001",
    "plannerId": "planner001",
    "name": "Madrid City",
    "startDate": "2023-10-01",
    "endDate": "2023-10-06",
    "activities": ["activity001"],
    "accommodations": ["accom001"]
  }
}
```

#### DELETE Response:

```json
{
  "success": true,
  "message": "Destination deleted successfully."
}
```

---

## Accommodation

### `GET/POST /planner/:plannerId/destination/:destinationId/accommodation`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `destinationId` (string): **Required.** The ID of the destination.

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/accommodation
```

#### GET Response:

```json
{
  "success": true,
  "data": [
    {
      "accommodationId": "accom001",
      "destinationId": "dest001",
      "name": "Madrid Hotel",
      "address": "123 Main St, Madrid",
      "checkInDate": "2023-10-01",
      "checkOutDate": "2023-10-05"
    }
    // ... more accommodations
  ]
}
```

#### POST Request Body:

```json
{
  "name": "Barcelona Hostel",
  "address": "456 Side St, Barcelona",
  "checkInDate": "2023-10-05",
  "checkOutDate": "2023-10-10"
}
```

#### POST Response:

```json
{
  "success": true,
  "data": {
    "accommodationId": "accom002",
    "destinationId": "dest002",
    "name": "Barcelona Hostel",
    "address": "456 Side St, Barcelona",
    "checkInDate": "2023-10-05",
    "checkOutDate": "2023-10-10"
  }
}
```

### `GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/accommodation/:accommodationId`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `destinationId` (string): **Required.** The ID of the destination.
- `accommodationId` (string): **Required.** The ID of the accommodation.

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/accommodation/accom001
```

#### GET Response:

```json
{
  "success": true,
  "data": {
    "accommodationId": "accom001",
    "destinationId": "dest001",
    "name": "Madrid Hotel",
    "address": "123 Main St, Madrid",
    "checkInDate": "2023-10-01",
    "checkOutDate": "2023-10-05"
  }
}
```

#### PUT Request Body:

```json
{
  "name": "Madrid Luxury Hotel",
  "address": "Updated Address, Madrid"
}
```

#### PUT Response:

```json
{
  "success": true,
  "data": {
    "accommodationId": "accom001",
    "destinationId": "dest001",
    "name": "Madrid Luxury Hotel",
    "address": "Updated Address, Madrid",
    "checkInDate": "2023-10-01",
    "checkOutDate": "2023-10-05"
  }
}
```

#### DELETE Response:

```json
{
  "success": true,
  "message": "Accommodation deleted successfully."
}
```

---

## Activity

### `GET/POST /planner/:plannerId/destination/:destinationId/activity`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `destinationId` (string): **Required.** The ID of the destination.

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/activity
```

#### GET Response:

```json
{
  "success": true,
  "data": [
    {
      "activityId": "activity001",
      "destinationId": "dest001",
      "name": "Visit Prado Museum",
      "date": "2023-10-02",
      "time": "10:00",
      "locations": ["loc001"],
      "votes": ["vote001"],
      "comments": ["comment001"]
    }
    // ... more activities
  ]
}
```

#### POST Request Body:

```json
{
  "name": "Sagrada Familia Tour",
  "date": "2023-10-06",
  "time": "14:00"
}
```

#### POST Response:

```json
{
  "success": true,
  "data": {
    "activityId": "activity002",
    "destinationId": "dest002",
    "name": "Sagrada Familia Tour",
    "date": "2023-10-06",
    "time": "14:00",
    "locations": [],
    "votes": [],
    "comments": []
  }
}
```

### `GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/activity/:activityId`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `destinationId` (string): **Required.** The ID of the destination.
- `activityId` (string): **Required.** The ID of the activity.

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/activity/activity001
```

#### GET Response:

```json
{
  "success": true,
  "data": {
    "activityId": "activity001",
    "destinationId": "dest001",
    "name": "Visit Prado Museum",
    "date": "2023-10-02",
    "time": "10:00",
    "locations": ["loc001"],
    "votes": ["vote001"],
    "comments": ["comment001"]
  }
}
```

#### PUT Request Body:

```json
{
  "time": "11:00" // Updated time
}
```

#### PUT Response:

```json
{
  "success": true,
  "data": {
    "activityId": "activity001",
    "destinationId": "dest001",
    "name": "Visit Prado Museum",
    "date": "2023-10-02",
    "time": "11:00",
    "locations": ["loc001"],
    "votes": ["vote001"],
    "comments": ["comment001"]
  }
}
```

#### DELETE Response:

```json
{
  "success": true,
  "message": "Activity deleted successfully."
}
```

---

## Location

### `GET/POST /planner/:plannerId/destination/:destinationId/activity/:activityId/location`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `destinationId` (string): **Required.** The ID of the destination.
- `activityId` (string): **Required.** The ID of the activity.

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/activity/activity001/location
```

#### GET Response:

```json
{
  "success": true,
  "data": [
    {
      "locationId": "loc001",
      "activityId": "activity001",
      "createdBy": "user123",
      "name": "Prado Museum",
      "address": "C. de Ruiz de Alarcón, 23, 28014 Madrid"
    }
    // ... more locations
  ]
}
```

#### POST Request Body:

```json
{
  "createdBy": "user123",
  "name": "Retiro Park",
  "address": "Plaza de la Independencia, 7, 28001 Madrid"
}
```

#### POST Response:

```json
{
  "success": true,
  "data": {
    "locationId": "loc002",
    "activityId": "activity001",
    "createdBy": "user123",
    "name": "Retiro Park",
    "address": "Plaza de la Independencia, 7, 28001 Madrid"
  }
}
```

### `GET/PUT/DELETE /planner/:plannerId/destination/:destinationId/activity/:activityId/location/:locationId`

#### Parameters:

- `plannerId` (string): **Required.** The ID of the planner.
- `destinationId` (string): **Required.** The ID of the destination.
- `activityId` (string): **Required.** The ID of the activity.
- `locationId` (string): **Required.** The ID of the location.

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/activity/activity001/location/loc001
```

#### GET Response:

```json
{
  "success": true,
  "data": {
    "locationId": "loc001",
    "activityId": "activity001",
    "createdBy": "user123",
    "name": "Prado Museum",
    "address": "C. de Ruiz de Alarcón, 23, 28014 Madrid"
  }
}
```

#### PUT Request Body:

```json
{
  "name": "The Prado National Museum"
}
```

#### PUT Response:

```json
{
  "success": true,
  "data": {
    "locationId": "loc001",
    "activityId": "activity001",
    "createdBy": "user123",
    "name": "The Prado National Museum",
    "address": "C. de Ruiz de Alarcón, 23, 28014 Madrid"
  }
}
```

#### DELETE Response:

```json
{
  "success": true,
  "message": "Location deleted successfully."
}
```

---

## Vote

### `GET /planner/:plannerId/destination/:destinationId/activity/:activityId/vote`

Retrieve all votes for a specific activity.

#### Parameters:

- `plannerId` (string): **Required.**
- `destinationId` (string): **Required.**
- `activityId` (string): **Required.**

#### Example Request:

```
GET /planner/planner001/destination/dest001/activity/activity001/vote
```

#### Response:

```json
{
  "success": true,
  "data": [
    {
      "voteId": "vote001",
      "activityId": "activity001",
      "createdBy": "user456",
      "voteType": "upvote"
    }
    // ... more votes
  ]
}
```

### `POST /planner/:plannerId/destination/:destinationId/activity/:activityId/vote`

Cast a vote on an activity.

#### Parameters:

- `plannerId` (string): **Required.**
- `destinationId` (string): **Required.**
- `activityId` (string): **Required.**

#### Request Body:

```json
{
  "createdBy": "user789",
  "voteType": "downvote" // Options: "upvote", "downvote"
}
```

#### Response:

```json
{
  "success": true,
  "data": {
    "voteId": "vote002",
    "activityId": "activity001",
    "createdBy": "user789",
    "voteType": "downvote"
  }
}
```

---

## Comment

### `GET/POST /planner/:plannerId/destination/:destinationId/activity/:activityId/comment`

#### Parameters:

- `plannerId` (string): **Required.**
- `destinationId` (string): **Required.**
- `activityId` (string): **Required.**

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/activity/activity001/comment
```

#### GET Response:

```json
{
  "success": true,
  "data": [
    {
      "commentId": "comment001",
      "activityId": "activity001",
      "createdBy": "user456",
      "content": "Can't wait to visit!"
    }
    // ... more comments
  ]
}
```

#### POST Request Body:

```json
{
  "createdBy": "user789",
  "content": "This place looks amazing!"
}
```

#### POST Response:

```json
{
  "success": true,
  "data": {
    "commentId": "comment002",
    "activityId": "activity001",
    "createdBy": "user789",
    "content": "This place looks amazing!"
  }
}
```

### `GET/PUT /planner/:plannerId/destination/:destinationId/activity/:activityId/comment/:commentId`

#### Parameters:

- `plannerId` (string): **Required.**
- `destinationId` (string): **Required.**
- `activityId` (string): **Required.**
- `commentId` (string): **Required.**

#### GET Example Request:

```
GET /planner/planner001/destination/dest001/activity/activity001/comment/comment001
```

#### GET Response:

```json
{
  "success": true,
  "data": {
    "commentId": "comment001",
    "activityId": "activity001",
    "createdBy": "user456",
    "content": "Can't wait to visit!"
  }
}
```

#### PUT Request Body:

```json
{
  "content": "Really excited about this visit!"
}
```

#### PUT Response:

```json
{
  "success": true,
  "data": {
    "commentId": "comment001",
    "activityId": "activity001",
    "createdBy": "user456",
    "content": "Really excited about this visit!"
  }
}
```

---

Please ensure that all dates are in ISO 8601 format and times are in 24-hour notation where applicable. All IDs (`plannerId`, `destinationId`, etc.) are strings uniquely identifying the respective resource.

When making requests, replace placeholders like `:plannerId` with actual IDs. For example, `/planner/planner001/destination` refers to the destinations of the planner with ID `planner001`.

---