#!/usr/bin/env bash
CREATE_RESPONSE=$(curl -s --request POST --url "http://localhost:8080/user" -H "Content-Type: application/json" -d '{"userName": "fsdghj", "preferredName": "John Doe"}')

echo $CREATE_RESPONSE

USER_ID=$(echo $CREATE_RESPONSE | jq -r '.data._id')

echo $USER_ID

JSON_BODY="{\"createdBy\": \"$USER_ID\", \"startDate\": \"2024-10-11T20:50:04.741Z\", \"endDate\": \"2024-10-11T20:50:04.741Z\", \"name\": \"Trip to Spain\"}"

echo "$JSON_BODY"

curl -s --request POST --url "http://localhost:8080/planner" -H "Content-Type: application/json" -d "$JSON_BODY"

CREATED_PLANNER_ID=$(curl --request GET --url "http://localhost:8080/planner?userId=${USER_ID}" | jq -r '.data.[0]._id')

echo $CREATED_PLANNER_ID

RESULT=$(curl -s --request GET --url "http://localhost:8080/planner/${CREATED_PLANNER_ID}?userId=${USER_ID}")
RESULT_DATA=$(echo $RESULT | jq -r '.data')
RESULT_USER_ID=$(echo $RESULT_DATA | jq -r '.createdBy._id')

echo "RESULT: $(echo $RESULT | jq -r '.success')"
[[ $RESULT_USER_ID == $USER_ID ]] && echo "USER ID MATCHES IN PLANNER" || echo "USER ID MISMATCH IN PLANNER"

