# Tasks

## Task 1

Implement a FastAPI endpoint that accepts a file upload (CSV),
validates it has the required columns (name, email, age),
and returns a summary (row count, column stats).

## Task 2

Add rate limiting to a FastAPI app. Requirements:
- 100 requests per minute per user (authenticated)
- 20 requests per minute per IP (unauthenticated)
- Return 429 with Retry-After header

## Task 3

Our FastAPI app has an N+1 query problem with SQLAlchemy async.
The endpoint loads 100 users, each with their roles (many-to-many).
Currently makes 101 queries. How to fix?

## Task 4

Implement WebSocket endpoint in FastAPI for a chat room.
Multiple users can join a room, send messages, and receive
messages from others in real-time.

## Task 5

Add background task processing to FastAPI. When a user submits
an order, return 202 immediately and process the order async.
User can check status via GET /orders/{id}/status.
