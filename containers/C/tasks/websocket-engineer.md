# Tasks

## Task 1

Design a WebSocket architecture for a real-time collaborative text editor
supporting 500 concurrent users per document. What are the key challenges
and how to address them?

## Task 2

Our WebSocket server drops connections after ~60 seconds of inactivity.
Clients use the browser WebSocket API. How to fix?

## Task 3

How to authenticate WebSocket connections? Our REST API uses JWT Bearer tokens.

## Task 4

We need to scale our Socket.IO server beyond a single Node.js process.
Currently using in-memory adapter. 10K concurrent connections expected.

## Task 5

Implement rate limiting for WebSocket messages. Users can send max
10 messages per second. How to handle violations?
