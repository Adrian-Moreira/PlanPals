# PPAPI

Introduction: to be generated

## Table of Contents

- [User Endpoints](#user-endpoints)
- [Planner Endpoints](#planner-endpoints)
- [Destination Endpoints](#destination-endpoints)
- [Accommodation Endpoints](#accommodation-endpoints)
- [Activity Endpoints](#activity-endpoints)
- [Transportation Endpoints](#transportation-endpoints)
- [Vote Endpoints](#vote-endpoints)
- [Comment Endpoints](#comment-endpoints)

---

## User Endpoints

**Base URL:** `/user`

### Create a User

- **URL:** `/user`
- **Method:** `POST`
- **Description:** Creates a new user.
- **Request Body:**

  | Field          | Type   | Required | Description              |
  | -------------- | ------ | -------- | ------------------------ |
  | `userName`     | string | Yes      | The user's username.     |
  | `preferredName`| string | Yes      | The user's preferred name.|

- **Response:**

  Returns the created user object.

### Get User by Username

- **URL:** `/user/search`
- **Method:** `GET`
- **Description:** Retrieves a user by their username.
- **Query Parameters:**

  | Parameter  | Type   | Required | Description        |
  | ---------- | ------ | -------- | ------------------ |
  | `userName` | string | Yes      | The user's username.|

- **Response:**

  Returns the user object matching the provided username.

### Get User by ID

- **URL:** `/user/:userId`
- **Method:** `GET`
- **Description:** Retrieves a user by their ID.
- **Path Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID (24-character hexadecimal string). |

- **Response:**

  Returns the user object.

### Update User

- **URL:** `/user/:userId`
- **Method:** `PATCH`
- **Description:** Updates user information.
- **Path Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Request Body:**

  | Field          | Type   | Required | Description              |
  | -------------- | ------ | -------- | ------------------------ |
  | `userName`     | string | No       | The user's username.     |
  | `preferredName`| string | No       | The user's preferred name.|

- **Response:**

  Returns the updated user object.

### Delete User

- **URL:** `/user/:userId`
- **Method:** `DELETE`
- **Description:** Deletes a user by ID.
- **Path Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns confirmation of deletion.

---

## Planner Endpoints

**Base URL:** `/planner`

### Get Planners

- **URL:** `/planner`
- **Method:** `GET`
- **Description:** Retrieves planners associated with a user.
- **Query Parameters:**

  | Parameter | Type   | Required | Description                             |
  | --------- | ------ | -------- | --------------------------------------- |
  | `userId`  | string | Yes      | The user's ID.                          |
  | `access`  | string | No       | Access level (`'ro'` for read-only, `'rw'` for read-write). |

- **Response:**

  Returns a list of planners.

### Create Planner

- **URL:** `/planner`
- **Method:** `POST`
- **Description:** Creates a new planner.
- **Request Body:**

  | Field          | Type             | Required | Description                      |
  | -------------- | ---------------- | -------- | -------------------------------- |
  | `createdBy`    | string           | Yes      | ID of the user creating the planner. |
  | `name`         | string           | Yes      | Name of the planner.             |
  | `description`  | string           | No       | Description of the planner.      |
  | `startDate`    | string or Date   | Yes      | Start date of the planner.       |
  | `endDate`      | string or Date   | Yes      | End date of the planner.         |
  | `roUsers`      | array of strings | No       | IDs of read-only users.          |
  | `rwUsers`      | array of strings | No       | IDs of read-write users.         |
  | `destinations` | array of strings | No       | List of destination IDs.         |
  | `transportations` | array of strings | No    | List of transportation IDs.      |

- **Response:**

  Returns the created planner object.

### Get Planner by ID

- **URL:** `/planner/:plannerId`
- **Method:** `GET`
- **Description:** Retrieves a planner by its ID.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description                   |
  | ----------- | ------ | -------- | ----------------------------- |
  | `plannerId` | string | Yes      | The planner's ID.             |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns the planner object.

### Update Planner

- **URL:** `/planner/:plannerId`
- **Method:** `PATCH`
- **Description:** Updates a planner.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description                   |
  | ----------- | ------ | -------- | ----------------------------- |
  | `plannerId` | string | Yes      | The planner's ID.             |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Request Body:**

  | Field          | Type           | Required | Description                |
  | -------------- | -------------- | -------- | -------------------------- |
  | `name`         | string         | No       | Name of the planner.       |
  | `description`  | string         | No       | Description of the planner.|
  | `startDate`    | string or Date | No       | Start date of the planner. |
  | `endDate`      | string or Date | No       | End date of the planner.   |

- **Response:**

  Returns the updated planner object.

### Delete Planner

- **URL:** `/planner/:plannerId`
- **Method:** `DELETE`
- **Description:** Deletes a planner.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description                   |
  | ----------- | ------ | -------- | ----------------------------- |
  | `plannerId` | string | Yes      | The planner's ID.             |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns confirmation of deletion.

---

## Destination Endpoints

**Base URL:** `/planner/:plannerId/destination`

### Get Destinations by Planner ID

- **URL:** `/planner/:plannerId/destination`
- **Method:** `GET`
- **Description:** Retrieves destinations associated with a planner.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description         |
  | ----------- | ------ | -------- | ------------------- |
  | `plannerId` | string | Yes      | The planner's ID.   |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns a list of destinations.

### Create Destination

- **URL:** `/planner/:plannerId/destination`
- **Method:** `POST`
- **Description:** Creates a new destination within a planner.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description         |
  | ----------- | ------ | -------- | ------------------- |
  | `plannerId` | string | Yes      | The planner's ID.   |

- **Request Body:**

  | Field       | Type           | Required | Description                |
  | ----------- | -------------- | -------- | -------------------------- |
  | `createdBy` | string         | Yes      | ID of the user creating the destination. |
  | `startDate` | string or Date | Yes      | Start date of the destination. |
  | `endDate`   | string or Date | Yes      | End date of the destination.   |
  | `name`      | string         | Yes      | Name of the destination.   |
  | `lat`      | Number         | No      | Lat   |
  | `lon`      | Number         | No      | Lng   |
  | `country`      | string         | No      | Country code  |
  | `state`      | string         | No      | State   |

- **Response:**

  Returns the created destination object.

### Get Destination by ID

- **URL:** `/planner/:plannerId/destination/:destinationId`
- **Method:** `GET`
- **Description:** Retrieves a destination by its ID.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                  |
  | --------------- | ------ | -------- | ---------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.            |
  | `destinationId` | string | Yes      | The destination's ID.        |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns the destination object.

### Update Destination

- **URL:** `/planner/:plannerId/destination/:destinationId`
- **Method:** `PATCH`
- **Description:** Updates a destination.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                  |
  | --------------- | ------ | -------- | ---------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.            |
  | `destinationId` | string | Yes      | The destination's ID.        |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Request Body:**

  | Field       | Type           | Required | Description                |
  | ----------- | -------------- | -------- | -------------------------- |
  | `name`      | string         | No       | Name of the destination.   |
  | `startDate` | string or Date | No       | Start date of the destination. |
  | `endDate`   | string or Date | No       | End date of the destination.   |
  | `lat`      | Number         | No      | Lat |
  | `lon`      | Number         | No      | Lng   |
  | `country`      | string         | No      | Country Code   |
  | `state`      | string         | No      | State  |

- **Response:**

  Returns the updated destination object.

### Delete Destination

- **URL:** `/planner/:plannerId/destination/:destinationId`
- **Method:** `DELETE`
- **Description:** Deletes a destination.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                  |
  | --------------- | ------ | -------- | ---------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.            |
  | `destinationId` | string | Yes      | The destination's ID.        |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns confirmation of deletion.

---

## Accommodation Endpoints

**Base URL:** `/planner/:plannerId/destination/:destinationId/accommodation`

### Get Accommodations by Destination ID

- **URL:** `/planner/:plannerId/destination/:destinationId/accommodation`
- **Method:** `GET`
- **Description:** Retrieves accommodations for a destination.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                |
  | --------------- | ------ | -------- | -------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.          |
  | `destinationId` | string | Yes      | The destination's ID.      |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns a list of accommodations.

### Create Accommodation

- **URL:** `/planner/:plannerId/destination/:destinationId/accommodation`
- **Method:** `POST`
- **Description:** Creates a new accommodation within a destination.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                |
  | --------------- | ------ | -------- | -------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.          |
  | `destinationId` | string | Yes      | The destination's ID.      |

- **Request Body:**

  | Field       | Type           | Required | Description                 |
  | ----------- | -------------- | -------- | --------------------------- |
  | `name`      | string         | Yes      | Name of the accommodation.  |
  | `location`  | string         | No       | Location of the accommodation. |
  | `startDate` | string or Date | Yes      | Start date of the stay.     |
  | `endDate`   | string or Date | Yes      | End date of the stay.       |
  | `createdBy` | string         | Yes      | ID of the user creating the accommodation. |

- **Response:**

  Returns the created accommodation object.

### Get Accommodation by ID

- **URL:** `/planner/:plannerId/destination/:destinationId/accommodation/:accommodationId`
- **Method:** `GET`
- **Description:** Retrieves an accommodation by ID.
- **Path Parameters:**

  | Parameter         | Type   | Required | Description                   |
  | ----------------- | ------ | -------- | ----------------------------- |
  | `plannerId`       | string | Yes      | The planner's ID.             |
  | `destinationId`   | string | Yes      | The destination's ID.         |
  | `accommodationId` | string | Yes      | The accommodation's ID.       |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns the accommodation object.

### Update Accommodation

- **URL:** `/planner/:plannerId/destination/:destinationId/accommodation/:accommodationId`
- **Method:** `PATCH`
- **Description:** Updates an accommodation.
- **Path Parameters:**

  | Parameter         | Type   | Required | Description                   |
  | ----------------- | ------ | -------- | ----------------------------- |
  | `plannerId`       | string | Yes      | The planner's ID.             |
  | `destinationId`   | string | Yes      | The destination's ID.         |
  | `accommodationId` | string | Yes      | The accommodation's ID.       |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Request Body:**

  | Field       | Type           | Required | Description                 |
  | ----------- | -------------- | -------- | --------------------------- |
  | `name`      | string         | No       | Name of the accommodation.  |
  | `location`  | string         | No       | Location of the accommodation. |
  | `startDate` | string or Date | No       | Start date of the stay.     |
  | `endDate`   | string or Date | No       | End date of the stay.       |

- **Response:**

  Returns the updated accommodation object.

### Delete Accommodation

- **URL:** `/planner/:plannerId/destination/:destinationId/accommodation/:accommodationId`
- **Method:** `DELETE`
- **Description:** Deletes an accommodation.
- **Path Parameters:**

  | Parameter         | Type   | Required | Description                   |
  | ----------------- | ------ | -------- | ----------------------------- |
  | `plannerId`       | string | Yes      | The planner's ID.             |
  | `destinationId`   | string | Yes      | The destination's ID.         |
  | `accommodationId` | string | Yes      | The accommodation's ID.       |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns confirmation of deletion.

---

## Activity Endpoints

**Base URL:** `/planner/:plannerId/destination/:destinationId/activity`

### Get Activities by Destination ID

- **URL:** `/planner/:plannerId/destination/:destinationId/activity`
- **Method:** `GET`
- **Description:** Retrieves activities for a destination.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                |
  | --------------- | ------ | -------- | -------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.          |
  | `destinationId` | string | Yes      | The destination's ID.      |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns a list of activities.

### Create Activity

- **URL:** `/planner/:plannerId/destination/:destinationId/activity`
- **Method:** `POST`
- **Description:** Creates a new activity within a destination.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                |
  | --------------- | ------ | -------- | -------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.          |
  | `destinationId` | string | Yes      | The destination's ID.      |

- **Request Body:**

  | Field       | Type             | Required | Description                 |
  | ----------- | ---------------- | -------- | --------------------------- |
  | `createdBy` | string           | Yes      | ID of the user creating the activity. |
  | `name`      | string           | Yes      | Name of the activity.       |
  | `location`  | string           | No       | Location of the activity.   |
  | `startDate` | string or Date   | Yes      | Start date and time of the activity. |
  | `duration`  | number           | Yes      | Duration of the activity (in hours or minutes). |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns the created activity object.

### Get Activity by ID

- **URL:** `/planner/:plannerId/destination/:destinationId/activity/:activityId`
- **Method:** `GET`
- **Description:** Retrieves an activity by ID.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                |
  | --------------- | ------ | -------- | -------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.          |
  | `destinationId` | string | Yes      | The destination's ID.      |
  | `activityId`    | string | Yes      | The activity's ID.         |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns the activity object.

### Update Activity

- **URL:** `/planner/:plannerId/destination/:destinationId/activity/:activityId`
- **Method:** `PATCH`
- **Description:** Updates an activity.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                |
  | --------------- | ------ | -------- | -------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.          |
  | `destinationId` | string | Yes      | The destination's ID.      |
  | `activityId`    | string | Yes      | The activity's ID.         |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Request Body:**

  | Field       | Type             | Required | Description                 |
  | ----------- | ---------------- | -------- | --------------------------- |
  | `name`      | string           | No       | Name of the activity.       |
  | `startDate` | string or Date   | No       | Start date and time of the activity. |
  | `duration`  | number           | No       | Duration of the activity.   |
  | `location`  | string           | No       | Location of the activity.   |

- **Response:**

  Returns the updated activity object.

### Delete Activity

- **URL:** `/planner/:plannerId/destination/:destinationId/activity/:activityId`
- **Method:** `DELETE`
- **Description:** Deletes an activity.
- **Path Parameters:**

  | Parameter       | Type   | Required | Description                |
  | --------------- | ------ | -------- | -------------------------- |
  | `plannerId`     | string | Yes      | The planner's ID.          |
  | `destinationId` | string | Yes      | The destination's ID.      |
  | `activityId`    | string | Yes      | The activity's ID.         |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns confirmation of deletion.

---

## Transportation Endpoints

**Base URL:** `/planner/:plannerId/transportation`

### Get Transportations by Planner ID

- **URL:** `/planner/:plannerId/transportation`
- **Method:** `GET`
- **Description:** Retrieves transportations associated with a planner.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description         |
  | ----------- | ------ | -------- | ------------------- |
  | `plannerId` | string | Yes      | The planner's ID.   |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns a list of transportation objects.

### Create Transportation

- **URL:** `/planner/:plannerId/transportation`
- **Method:** `POST`
- **Description:** Creates a new transportation within a planner.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description         |
  | ----------- | ------ | -------- | ------------------- |
  | `plannerId` | string | Yes      | The planner's ID.   |

- **Request Body:**

  | Field          | Type           | Required | Description                   |
  | -------------- | -------------- | -------- | ----------------------------- |
  | `createdBy`    | string         | Yes      | ID of the user creating the transportation. |
  | `type`         | string         | Yes      | Type of transportation (e.g., flight, train). |
  | `details`      | string         | No       | Additional details.           |
  | `departureTime`| string or Date | Yes      | Departure time.               |
  | `arrivalTime`  | string or Date | Yes      | Arrival time.                 |
  | `vehicleId`    | string         | No       | ID of the vehicle used.       |
  | `from`      | [Number, Number]         | No      |  From LatLng  |
  | `to`      | [Number, Number]         | No      | To LatLng   |

- **Response:**

  Returns the created transportation object.

### Get Transportation by ID

- **URL:** `/planner/:plannerId/transportation/:transportationId`
- **Method:** `GET`
- **Description:** Retrieves a transportation by ID.
- **Path Parameters:**

  | Parameter         | Type   | Required | Description                   |
  | ----------------- | ------ | -------- | ----------------------------- |
  | `plannerId`       | string | Yes      | The planner's ID.             |
  | `transportationId`| string | Yes      | The transportation's ID.      |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns the transportation object.

### Update Transportation

- **URL:** `/planner/:plannerId/transportation/:transportationId`
- **Method:** `PATCH`
- **Description:** Updates a transportation.
- **Path Parameters:**

  | Parameter         | Type   | Required | Description                   |
  | ----------------- | ------ | -------- | ----------------------------- |
  | `plannerId`       | string | Yes      | The planner's ID.             |
  | `transportationId`| string | Yes      | The transportation's ID.      |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Request Body:**

  | Field          | Type           | Required | Description                   |
  | -------------- | -------------- | -------- | ----------------------------- |
  | `type`         | string         | No       | Type of transportation.       |
  | `details`      | string         | No       | Additional details.           |
  | `departureTime`| string or Date | No       | Departure time.               |
  | `arrivalTime`  | string or Date | No       | Arrival time.                 |
  | `vehicleId`    | string         | No       | ID of the vehicle used.       |
  | `from`      | [Number, Number]         | No      |  From LatLng  |
  | `to`      | [Number, Number]         | No      | To LatLng   |
- **Response:**

  Returns the updated transportation object.

### Delete Transportation

- **URL:** `/planner/:plannerId/transportation/:transportationId`
- **Method:** `DELETE`
- **Description:** Deletes a transportation.
- **Path Parameters:**

  | Parameter         | Type   | Required | Description                   |
  | ----------------- | ------ | -------- | ----------------------------- |
  | `plannerId`       | string | Yes      | The planner's ID.             |
  | `transportationId`| string | Yes      | The transportation's ID.      |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns confirmation of deletion.

---

## Vote Endpoints

**Base URL:** `/vote`

### Get Votes by Object ID

- **URL:** `/vote`
- **Method:** `GET`
- **Description:** Retrieves votes associated with a specific object.
- **Query Parameters:**

  | Parameter  | Type   | Required | Description                             |
  | ---------- | ------ | -------- | --------------------------------------- |
  | `objectId` | string | Yes      | The ID of the object being voted on.    |
  | `type`     | string | Yes      | The type of the object (e.g., 'Planner', 'Destination', 'Transport', 'Activity').  |

- **Response:**

  Returns a list of votes.

### Check if User Voted

- **URL:** `/vote/:userId`
- **Method:** `GET`
- **Description:** Checks if a user has voted on a specific object.
- **Path Parameters:**

  | Parameter | Type   | Required | Description          |
  | --------- | ------ | -------- | -------------------- |
  | `userId`  | string | Yes      | The user's ID.       |

- **Query Parameters:**

  | Parameter  | Type   | Required | Description                             |
  | ---------- | ------ | -------- | --------------------------------------- |
  | `objectId` | string | Yes      | The ID of the object being voted on.    |
  | `type`     | string | Yes      | The type of the object.                 |

- **Response:**

  Returns an object indicating if the user has upvoted or downvoted:

  ```json
  {
    "upVoted": boolean,
    "downVoted": boolean
  }
  ```

### Upvote

- **URL:** `/vote/up`
- **Method:** `POST`
- **Description:** Upvotes an object.
- **Request Body:**

  | Field       | Type   | Required | Description                     |
  | ----------- | ------ | -------- | ------------------------------- |
  | `type`      | string | Yes      | The type of the object.         |
  | `objectId`  | string | Yes      | The ID of the object.           |
  | `createdBy` | string | Yes      | ID of the user voting.          |

- **Response:**

  Returns the vote object.

### Downvote

- **URL:** `/vote/down`
- **Method:** `POST`
- **Description:** Downvotes an object.
- **Request Body:**

  | Field       | Type   | Required | Description                     |
  | ----------- | ------ | -------- | ------------------------------- |
  | `type`      | string | Yes      | The type of the object.         |
  | `objectId`  | string | Yes      | The ID of the object.           |
  | `createdBy` | string | Yes      | ID of the user voting.          |

- **Response:**

  Returns the vote object.

### Remove Vote

- **URL:** `/vote`
- **Method:** `DELETE`
- **Description:** Removes a user's vote on an object.
- **Request Body:**

  | Field      | Type   | Required | Description                     |
  | ---------- | ------ | -------- | ------------------------------- |
  | `objectId` | string | Yes      | The ID of the object.           |
  | `type`     | string | Yes      | The type of the object.         |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Response:**

  Returns confirmation of vote removal.

---

## Comment Endpoints

**Base URL:** `/comment`

### Get Comments by Object ID

- **URL:** `/comment`
- **Method:** `GET`
- **Description:** Retrieves comments associated with a specific object.
- **Query Parameters:**

  | Parameter  | Type   | Required | Description                             |
  | ---------- | ------ | -------- | --------------------------------------- |
  | `type`     | string | Yes      | The type of the object.  |
  | `objectId` | string | Yes      | The ID of the object.                   |

- **Response:**

  Returns a list of comments.

### Create Comment

- **URL:** `/comment`
- **Method:** `POST`
- **Description:** Adds a comment to an object.
- **Request Body:**

  | Field       | Type   | Required | Description                              |
  | ----------- | ------ | -------- | ---------------------------------------- |
  | `type`      | string | Yes      | The type of the object.                  |
  | `objectId`  | string | Yes      | The ID of the object.                    |
  | `createdBy` | string | Yes      | ID of the user creating the comment.     |
  | `content`   | string | Yes      | Content of the comment.                  |

- **Response:**

  Returns the created comment object.

### Get Comment by ID

- **URL:** `/comment/:commentId`
- **Method:** `GET`
- **Description:** Retrieves a comment by its ID.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description                   |
  | ----------- | ------ | -------- | ----------------------------- |
  | `commentId` | string | Yes      | The comment's ID.             |

- **Response:**

  Returns the comment object.

### Delete Comment

- **URL:** `/comment/:commentId`
- **Method:** `DELETE`
- **Description:** Deletes a comment.
- **Path Parameters:**

  | Parameter   | Type   | Required | Description                   |
  | ----------- | ------ | -------- | ----------------------------- |
  | `commentId` | string | Yes      | The comment's ID.             |

- **Query Parameters:**

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `userId`  | string | Yes      | The user's ID.     |

- **Request Body:**

  | Field      | Type   | Required | Description                      |
  | ---------- | ------ | -------- | -------------------------------- |
  | `type`     | string | Yes      | The type of the object commented on. |
  | `objectId` | string | Yes      | The ID of the object.            |

- **Response:**

  Returns confirmation of deletion.

---

# Notes

- All `userId`, `plannerId`, `destinationId`, `accommodationId`, `activityId`, `transportationId`, and `commentId` parameters are expected to be 24-character hexadecimal strings, representing MongoDB ObjectIDs.
- Dates can be provided as ISO 8601 strings or JavaScript `Date` objects.
- Ensure that you have the necessary permissions and that the user exists before making requests that require authentication.
- Response formats are generally in JSON, returning a `success` boolean, and the requested object as `data` or a confirmation message.
