# Amazon Aurora

> Cloud-native MySQL/PostgreSQL-compatible database: 6-way replicated storage, 15 replicas, Global Database, Serverless v2.

Category: **Database** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Architecture](#architecture)
- [Endpoints](#endpoints)
- [Advanced features](#advanced-features)
- [Security and backups](#security-and-backups)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Architecture

- **Compatibility** - MySQL and PostgreSQL compatible; up to 5x MySQL / 3x PostgreSQL performance.
- **Storage** - Shared cluster volume, 6 copies across 3 AZs (4/6 needed for writes, 3/6 for reads), self-healing, auto-grows in 10 GB increments up to 128 TiB.
- **Replicas** - Up to 15 Aurora Replicas sharing the same storage (replica lag typically < 10-20 ms). Any replica can be promoted.
- **Failover** - Automatic failover to a replica usually in under 30 seconds; set failover priority tiers.
- **Cost** - About 20% more than RDS per instance but more efficient; pay for storage used and I/O (or Aurora I/O-Optimized for I/O-heavy workloads with no I/O charges).

## Endpoints

- **Cluster (writer) endpoint** - Always points to the current primary.
- **Reader endpoint** - Load-balances connections across replicas (connection-level).
- **Custom endpoints** - Subset of instances, e.g. larger replicas for analytics queries.
- **Instance endpoints** - Specific instance; rarely recommended.

## Advanced features

- **Aurora Replicas Auto Scaling** - Add/remove replicas based on CPU or connections.
- **Aurora Serverless v2** - Scales capacity in fine-grained ACUs in seconds; for variable, unpredictable or intermittent workloads; can mix with provisioned instances.
- **Aurora Global Database** - One primary region + up to 5 (now 10) secondary read-only regions with storage-level replication < 1 second. Promote a secondary in about a minute (RTO < 1 min). Write forwarding optional.
- **Backtrack (MySQL)** - Rewind the cluster to a point in time in place, without restoring from backup.
- **Cloning** - Copy-on-write clone created in minutes; ideal for test/staging from production.
- **Aurora ML** - Call SageMaker / Bedrock / Comprehend from SQL.
- **Zero-ETL to Redshift** - Near-real-time replication of Aurora data into Redshift for analytics.
- **Aurora DSQL / Limitless** - Newer distributed options for multi-region active-active and horizontal write scaling (awareness only).

## Security and backups

- **Same as RDS** - KMS encryption at rest (set at creation), TLS, security groups, IAM auth, Secrets Manager.
- **Backups** - Continuous automated backups with PITR (1-35 days); manual snapshots; Database Activity Streams for auditing.

## Exam tips

- Need MySQL/PostgreSQL with highest availability and performance -> Aurora.
- Cross-region DR with RPO ~1 s and RTO ~1 min, or global low-latency reads -> Aurora Global Database.
- Unpredictable / intermittent DB load -> Aurora Serverless v2.
- Test environment from production data quickly -> Aurora cloning.
- Undo a bad change fast without restore -> Backtrack (Aurora MySQL).
- Analytics queries on separate replicas -> custom endpoint.

## Practice questions

**Q1.** A global application needs a relational database with read latency under a second in multiple regions and the ability to recover from a regional outage in about one minute. Which solution fits?

- A. RDS MySQL with cross-region read replicas
- B. Aurora Global Database
- C. DynamoDB global tables
- D. Aurora Multi-AZ in one region

<details><summary>Answer</summary>

**B** - Aurora Global Database replicates storage across regions in under a second and supports promotion with RTO around one minute.

_Domain: Design Resilient Architectures_

</details>

**Q2.** A new application has unpredictable, spiky database usage with long idle periods. The team wants a MySQL-compatible database that scales automatically. Which option is BEST?

- A. Aurora Serverless v2
- B. RDS MySQL with Multi-AZ
- C. Provisioned Aurora with 15 replicas
- D. MySQL on EC2

<details><summary>Answer</summary>

**A** - Aurora Serverless v2 scales capacity automatically in fine increments according to demand.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** Analysts run heavy queries that should not affect the replicas used by the application. How can this be done in Aurora?

- A. Use the reader endpoint for all traffic
- B. Create a custom endpoint pointing to dedicated larger replicas for analytics
- C. Use the cluster endpoint
- D. Enable Backtrack

<details><summary>Answer</summary>

**B** - Custom endpoints route connections to a defined subset of instances.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** How many copies of data does Aurora maintain and across how many AZs?

- A. 2 copies across 2 AZs
- B. 3 copies across 3 AZs
- C. 6 copies across 3 AZs
- D. 6 copies across 6 AZs

<details><summary>Answer</summary>

**C** - Aurora storage keeps six copies of data across three AZs.

_Domain: Design Resilient Architectures_

</details>

**Q5.** A developer needs a full copy of a 5 TB production Aurora database for testing, created quickly and cost-effectively. What should be used?

- A. Restore from a snapshot
- B. Aurora cloning
- C. AWS DMS full load
- D. mysqldump

<details><summary>Answer</summary>

**B** - Aurora clones use copy-on-write and are created in minutes without copying all the data up front.

_Domain: Design Cost-Optimized Architectures_

</details>
