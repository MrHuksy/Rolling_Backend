# Rollin Backend

Simple serverless Task API built with NestJS + CQRS, deployed on AWS Lambda + API Gateway + DynamoDB.

Backend Base URL (prod): https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com

Frontend URL (prod): https://master.d1rdlry2cpntlj.amplifyapp.com/

## Stack
- NestJS 11
- node 20
- @nestjs/cqrs for command/query separation
- AWS Lambda + API Gateway (HTTP API)
- DynamoDB table: `TasksTable` (PK: `id`)
- TypeScript
- Serverless Framework v3

## Data Model
Task item
```
{
  id: string,          // required, unique
  title: string,       // required
  description: string, // required
  created: string,     // DD/MM/YYYY
  due: string,         // ISO date string
  complete: boolean
}
```

## Validation Notes
- `created` must match DD/MM/YYYY (e.g. 05/10/2025)
- `due` must be a valid ISO date string (class-validator IsDateString)
- All string fields non-empty

## Endpoints
All endpoints are under `/tasks`.

### Create Task
POST /tasks
Full URL:
```
POST https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks
```
Body JSON:
```
{
  "id": "task-123",
  "title": "Title",
  "description": "Something to do",
  "created": "02/10/2025",
  "due": "2025-10-15T00:00:00.000Z",
  "complete": false
}
```
Responses:
- 201 OK (API Gateway may show 200) -> task object
- 409 if id already exists
- 400 validation errors

### Get All Tasks
GET /tasks
Full URL:
```
GET https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks
```
Response: `Task[]` (empty array if none)

### Get Task By Id
GET /tasks/{id}
Full URL pattern:
```
GET https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks/{id}
```
Example:
```
GET https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks/1
```
Returns single task or `null` (API may 200 with empty body if not found)

### Update Task
PATCH /tasks/{id}
Full URL pattern:
```
PATCH https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks/{id}
```
Example:
```
PATCH https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks/task-123
```
Body: partial or full TaskDto. Currently service overwrites whole item with provided fields merged over existing
```
{
  "title": "New Title",
  "complete": true
}
```
Responses:
- 200 updated task
- 404 if not found

### Delete Task
DELETE /tasks/{id}
Full URL pattern:
```
DELETE https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks/{id}
```
Example:
```
DELETE https://rd1ng5uol1.execute-api.ap-southeast-2.amazonaws.com/tasks/task-123
```
Responses:
- 200 { "message": "Task deleted successfully" }
- 404 if not found

## DynamoDB Table
Table name: `TasksTable`
Billing: PAY_PER_REQUEST
Primary key: `id` (string)
No GSIs / LSIs.

## Local Development
Install deps:
```
yarn
```
Run offline (compiles then spins up HTTP API):
```
yarn offline
```
Run tests:
```
yarn test
```
Watch tests:
```
yarn test:watch
```
Build (emit to dist/):
```
yarn build
```
Deploy (ensure AWS creds configured):
```
serverless deploy
```

## Future Improvements
- Add health endpoint
- Add pagination (DynamoDB Scan with LastEvaluatedKey)
- Auth layer (API key / Auth0)
- local e2e test using localstack + docker.
