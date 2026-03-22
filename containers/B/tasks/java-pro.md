# Tasks

## Task 1

Migrate this Java 8 code to Java 21 idioms:
```java
List<String> names = new ArrayList<>();
for (User user : users) {
    if (user.getAge() > 18 && user.isActive()) {
        names.add(user.getName().toUpperCase());
    }
}
Optional<String> result = names.isEmpty() ? Optional.empty() : Optional.of(names.get(0));
```

## Task 2

Our Spring Boot 3 app takes 25 seconds to start. It has 200+ beans,
JPA with 50 entities, and uses component scanning. How to reduce startup time?

## Task 3

Implement a retry mechanism for HTTP calls to an unreliable external API.
Requirements: exponential backoff, max 3 retries, circuit breaker when
failure rate exceeds 50%.

## Task 4

We have a memory leak in production. Heap grows from 512MB to 4GB over
24 hours, then OOM. The app processes Kafka messages and stores results
in a ConcurrentHashMap cache. How to diagnose and fix?

## Task 5

Design a solution for processing 1 million records from a database,
transforming each, and writing to another database. Must handle failures
gracefully and be resumable.
