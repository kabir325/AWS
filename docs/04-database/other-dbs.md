# Purpose-built Databases

> DocumentDB, Neptune, Keyspaces, Timestream, QLDB and choosing the right database for the job.

Category: **Database** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Services](#services)
- [Choosing a database](#choosing-a-database)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Services

- **Amazon DocumentDB** - MongoDB-compatible JSON document database; Aurora-like storage (6 copies, 3 AZs), up to 15 replicas, elastic clusters. Migrating MongoDB workloads.
- **Amazon Neptune** - Graph database (property graph with Gremlin/openCypher, RDF with SPARQL). Social networks, fraud detection, knowledge graphs, recommendation engines. Up to 15 read replicas, Neptune Analytics.
- **Amazon Keyspaces** - Serverless Apache Cassandra-compatible (CQL) wide-column database. On-demand or provisioned, PITR.
- **Amazon Timestream** - Serverless time series database for IoT, DevOps metrics, telemetry; memory store + magnetic store tiers; also Timestream for InfluxDB.
- **Amazon QLDB** - Ledger database with immutable, cryptographically verifiable journal. End of support July 2025 (AWS suggests Aurora PostgreSQL); may still appear as "immutable verifiable history" answer.
- **Amazon Redshift** - Data warehouse for OLAP analytics (see Analytics).
- **Amazon OpenSearch Service** - Search and log analytics (see Analytics).

## Choosing a database

- **Relational, OLTP, joins, transactions** - RDS or Aurora.
- **Key-value at massive scale, serverless** - DynamoDB.
- **In-memory cache / sessions** - ElastiCache; durable in-memory -> MemoryDB.
- **Document (MongoDB)** - DocumentDB (or DynamoDB).
- **Graph relationships** - Neptune.
- **Wide-column Cassandra** - Keyspaces.
- **Time series** - Timestream.
- **Analytics / OLAP / data warehouse** - Redshift; ad-hoc SQL on S3 -> Athena.
- **Full-text search** - OpenSearch.

## Exam tips

- MongoDB -> DocumentDB. Cassandra -> Keyspaces. Graph / relationships / fraud rings -> Neptune. IoT time series -> Timestream.
- Immutable, cryptographically verifiable history -> ledger (QLDB historically).

## Practice questions

**Q1.** A company is migrating a MongoDB application to AWS and wants a fully managed compatible database. Which service should be used?

- A. Amazon DynamoDB
- B. Amazon DocumentDB
- C. Amazon Keyspaces
- D. Amazon Neptune

<details><summary>Answer</summary>

**B** - DocumentDB is MongoDB API compatible.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A social media company needs to query complex relationships between users, posts and interests to generate recommendations. Which database is BEST suited?

- A. Amazon Neptune
- B. Amazon RDS
- C. Amazon Timestream
- D. Amazon Redshift

<details><summary>Answer</summary>

**A** - Neptune is a graph database optimized for traversing highly connected data.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** An IoT platform collects trillions of sensor readings per day and needs to analyze recent and historical data by time. Which database fits best?

- A. Amazon Timestream
- B. Amazon DocumentDB
- C. Amazon Neptune
- D. Amazon Aurora

<details><summary>Answer</summary>

**A** - Timestream is purpose-built for time series data with tiered storage.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A company runs Apache Cassandra on premises and wants a serverless, compatible managed service using CQL. Which should it choose?

- A. Amazon Keyspaces
- B. DynamoDB
- C. DocumentDB
- D. ElastiCache

<details><summary>Answer</summary>

**A** - Keyspaces is serverless Cassandra-compatible and supports CQL.

_Domain: Design High-Performing Architectures_

</details>
