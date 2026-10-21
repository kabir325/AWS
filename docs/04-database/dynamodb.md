# Amazon DynamoDB

> Serverless key-value / document NoSQL with single-digit ms latency: keys, indexes, capacity modes, DAX, streams, global tables.

Category: **Database** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Data model](#data-model)
- [Capacity modes](#capacity-modes)
- [Indexes](#indexes)
- [Features](#features)
- [Backup, security and integration](#backup-security-and-integration)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Data model

- **Tables, items, attributes** - Schemaless items up to 400 KB. Table needs a primary key.
- **Partition key** - Simple primary key; hashed to distribute data. Choose high-cardinality keys to avoid hot partitions.
- **Partition + sort key** - Composite primary key; items with the same partition key are sorted by sort key, enabling range queries.
- **Query vs Scan** - Query uses keys (efficient). Scan reads the whole table (expensive); avoid.
- **Large items** - Store large objects in S3 and keep the S3 key in DynamoDB.

## Capacity modes

- **On-demand** - Pay per request, instantly accommodates traffic, no planning. Unpredictable or new workloads.
- **Provisioned** - Specify RCU/WCU, optionally with auto scaling. Cheaper for predictable traffic; reserved capacity available.
- **RCU** - 1 strongly consistent read/s or 2 eventually consistent reads/s of up to 4 KB. Transactional read = 2 RCU.
- **WCU** - 1 write/s of up to 1 KB. Transactional write = 2 WCU.
- **Throttling** - ProvisionedThroughputExceededException; fix with better keys, auto scaling, on-demand, or DAX for reads.

## Indexes

- **Global Secondary Index (GSI)** - Different partition and sort key; can be added any time; own capacity; eventually consistent only. Up to 20 per table.
- **Local Secondary Index (LSI)** - Same partition key, different sort key; must be created with the table; supports strong consistency. Up to 5.
- **Projection** - Choose which attributes are copied into the index (keys only, include, all).

## Features

- **DAX** - In-memory write-through cache for DynamoDB: microsecond reads, API compatible, no app logic changes. Good for read-heavy, hot keys.
- **DynamoDB Streams** - Ordered item-level change log (24 h retention) consumed by Lambda: triggers, replication, aggregations. Kinesis Data Streams option for longer retention.
- **Global tables** - Multi-region, multi-active (read/write everywhere) replication; requires Streams. Low-latency global access and DR. Multi-region strong consistency now available.
- **TTL** - Expire items automatically at a timestamp attribute (no WCU cost): sessions, temporary data.
- **Transactions** - ACID across multiple items/tables (TransactWriteItems / TransactGetItems).
- **Conditional writes** - Optimistic locking and prevent overwrites.
- **PartiQL** - SQL-compatible query language.

## Backup, security and integration

- **Point-in-time recovery (PITR)** - Continuous backups, restore to any second in the last 35 days (configurable 1-35) into a new table.
- **On-demand backups** - Full backups retained until deleted; also via AWS Backup (cross-region, cold storage).
- **Export to S3** - Export from PITR without consuming capacity; query with Athena. Import from S3 into a new table.
- **Security** - IAM fine-grained access (condition dynamodb:LeadingKeys for per-user rows), encryption at rest by default (AWS owned, AWS managed, or customer managed KMS keys), gateway VPC endpoint.
- **Table classes** - Standard and Standard-IA (lower storage cost for rarely accessed tables).

## Exam tips

- Serverless, millisecond latency at any scale, key-value or session data -> DynamoDB.
- Microsecond read latency on DynamoDB with no code change -> DAX (ElastiCache needs app changes).
- React to item changes -> DynamoDB Streams + Lambda.
- Multi-region active-active writes -> global tables.
- Unpredictable traffic -> on-demand. Steady predictable traffic -> provisioned with auto scaling (cheaper).
- Automatically delete old sessions -> TTL.
- Need a different query pattern after table creation -> GSI (LSI only at creation).

## Practice questions

**Q1.** An application needs microsecond read latency for frequently accessed DynamoDB items without changing application logic significantly. What should be used?

- A. ElastiCache for Redis
- B. DynamoDB Accelerator (DAX)
- C. Add a GSI
- D. Switch to on-demand capacity

<details><summary>Answer</summary>

**B** - DAX is an API-compatible in-memory cache for DynamoDB delivering microsecond reads.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A company needs to send a welcome email whenever a new user item is inserted into a DynamoDB table. What is the MOST efficient serverless design?

- A. Scan the table every minute with Lambda
- B. Enable DynamoDB Streams and trigger a Lambda function
- C. Use DynamoDB TTL
- D. Create a GSI on the email attribute

<details><summary>Answer</summary>

**B** - Streams capture item-level changes and can invoke Lambda for each new insert.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A new mobile game has completely unpredictable traffic that may spike suddenly. Which DynamoDB capacity mode should be used?

- A. Provisioned without auto scaling
- B. Provisioned with reserved capacity
- C. On-demand
- D. Provisioned with DAX

<details><summary>Answer</summary>

**C** - On-demand mode instantly adapts to traffic without capacity planning.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A company needs users in North America, Europe and Asia to both read and write to the same DynamoDB data with low latency. What should be used?

- A. DynamoDB global tables
- B. Cross-region read replicas
- C. DAX clusters in each region
- D. DynamoDB Streams to S3

<details><summary>Answer</summary>

**A** - Global tables provide multi-region, multi-active replication with local read/write.

_Domain: Design High-Performing Architectures_

</details>

**Q5.** Session data stored in DynamoDB should be removed automatically 24 hours after creation at no extra cost. What should be used?

- A. A Lambda function on a schedule
- B. DynamoDB TTL
- C. DynamoDB Streams
- D. S3 lifecycle policies

<details><summary>Answer</summary>

**B** - TTL deletes expired items automatically without consuming write capacity.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q6.** A team needs to query a DynamoDB table by an attribute that is not part of the primary key. The table already exists. What should they create?

- A. Local Secondary Index
- B. Global Secondary Index
- C. A new table with Streams
- D. A DAX cluster

<details><summary>Answer</summary>

**B** - GSIs can be added to existing tables with a different partition/sort key; LSIs must be created with the table.

_Domain: Design High-Performing Architectures_

</details>

**Q7.** A company accidentally deleted items from a DynamoDB table 2 hours ago and must recover the data. Which feature allows restoring the table to that moment?

- A. DynamoDB Streams
- B. Point-in-time recovery
- C. TTL
- D. Global tables

<details><summary>Answer</summary>

**B** - PITR enables restoring to any second within the retention window into a new table.

_Domain: Design Resilient Architectures_

</details>
