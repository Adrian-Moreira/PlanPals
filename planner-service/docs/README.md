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
    - [`GET/PATCH/DELETE /planner/:plannerId/transportation/:transportationId`](#getpatchdelete-plannerplanneridtransportationtransportationid)
      - [Parameters:](#parameters-2)
      - [GET Example Request:](#get-example-request)
      - [GET Response:](#get-response)
      - [PATCH Request Body:](#patch-request-body)
      - [PATCH Response:](#patch-response)
      - [DELETE Response:](#delete-response)
  - [Destination](#destination)
    - [`GET/POST /planner/:plannerId/destination`](#getpost-plannerplanneriddestination)
      - [Parameters:](#parameters-3)
      - [GET Example Request:](#get-example-request-1)
      - [GET Response:](#get-response-1)
      - [POST Request Body:](#post-request-body)
      - [POST Response:](#post-response)
    - [`GET/PATCH/DELETE /planner/:plannerId/destination/:destinationId`](#getpatchdelete-plannerplanneriddestinationdestinationid)
      - [Parameters:](#parameters-4)
      - [GET Example Request:](#get-example-request-2)
      - [GET Response:](#get-response-2)
      - [PATCH Request Body:](#patch-request-body-1)
      - [PATCH Response:](#patch-response-1)
      - [DELETE Response:](#delete-response-1)

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

### `GET/PATCH/DELETE /planner/:plannerId/transportation/:transportationId`

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

#### PATCH Request Body:

```json
{
  "details"?: "Updated flight details",
  "vehicleId"?: "",
  "departureTime"?: "",
  "arrivalTime"?: ""
}
```

#### PATCH Response:

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

### `GET/PATCH/DELETE /planner/:plannerId/destination/:destinationId`

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

#### PATCH Request Body:

```json
{
  "name": "Madrid City",
  "endDate": "2023-10-06" // Extended stay
}
```

#### PATCH Response:

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
