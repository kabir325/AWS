# Amazon ElastiCache & MemoryDB

> Managed in-memory caching with Redis OSS / Valkey and Memcached; MemoryDB for durable Redis-compatible primary database.

Category: **Database** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Engines](#engines)
- [Caching patterns](#caching-patterns)
- [Security and HA](#security-and-ha)
- [Amazon MemoryDB](#amazon-memorydb)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Engines

- **Redis OSS / Valkey** - Rich data structures (sorted sets, lists, hashes), replication, Multi-AZ automatic failover, persistence (AOF, snapshots), backups, pub/sub, transactions, Lua, cluster mode for sharding. Encryption and Redis AUTH / IAM auth.
- **Memcached** - Simple key-value, multi-threaded, sharding across nodes, no replication, no persistence, no backups. Simple horizontal cache.
- **ElastiCache Serverless** - No cluster sizing; scales automatically; pay for data stored and compute used.

## Caching patterns

- **Lazy loading (cache-aside)** - Read from cache; on miss read DB and populate cache. Only requested data cached; stale data possible; miss penalty.
- **Write-through** - Write to cache whenever writing to DB. Cache always fresh; writes slower; caches data never read (use TTL).
- **TTL** - Expire keys to limit staleness and memory.
- **Session store** - Store user sessions in ElastiCache so web tier stays stateless.
- **Leaderboards** - Redis sorted sets for real-time gaming leaderboards.
- **Requires code changes** - Unlike DAX, the application must implement caching logic.

## Security and HA

- **Network** - VPC-only, security groups. No IAM for data plane in Memcached; Redis supports AUTH tokens, RBAC and IAM auth.
- **Encryption** - In-transit TLS and at-rest KMS for Redis/Valkey.
- **Multi-AZ** - Redis replicas in other AZs with automatic failover. Global Datastore for cross-region replication.

## Amazon MemoryDB

- **What** - Redis/Valkey-compatible, durable in-memory DATABASE with multi-AZ transaction log. Microsecond reads, single-digit ms writes.
- **When** - Need Redis API as the primary database with durability, not just a cache.

## Exam tips

- Reduce read load / latency on RDS -> ElastiCache in front (code change needed).
- Need HA, persistence, backups, complex data types, pub/sub, sorted sets -> Redis/Valkey. Simplest multithreaded cache -> Memcached.
- Externalize sessions for stateless web tier -> ElastiCache (or DynamoDB).
- Redis-compatible durable primary database -> MemoryDB.

## Practice questions

**Q1.** An RDS database is overloaded by repeated identical read queries from a web application. What is the BEST way to reduce the load?

- A. Enable Multi-AZ
- B. Add an ElastiCache cluster and implement caching in the application
- C. Increase storage size
- D. Enable automated backups

<details><summary>Answer</summary>

**B** - ElastiCache serves repeated reads from memory and reduces database load.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A gaming company needs a real-time leaderboard with ranking that remains available if a node fails. Which option fits?

- A. ElastiCache for Memcached
- B. ElastiCache for Redis with Multi-AZ, using sorted sets
- C. DynamoDB Scan
- D. RDS with read replicas

<details><summary>Answer</summary>

**B** - Redis sorted sets are ideal for leaderboards, and Redis supports replication with automatic failover.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** Which caching strategy ensures cached data is never stale relative to the database but may cache data that is never read?

- A. Lazy loading
- B. Write-through
- C. TTL only
- D. Cache-aside

<details><summary>Answer</summary>

**B** - Write-through updates the cache on every DB write, so data is fresh but may include unread data.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A company wants the Redis API with microsecond reads as its primary database and needs durability across AZs. Which service is BEST?

- A. ElastiCache for Memcached
- B. Amazon MemoryDB
- C. DynamoDB with DAX
- D. Amazon Neptune

<details><summary>Answer</summary>

**B** - MemoryDB is a durable, Redis-compatible in-memory database with a multi-AZ transactional log.

_Domain: Design High-Performing Architectures_

</details>
