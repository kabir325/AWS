# Amazon Redshift

> Petabyte-scale columnar data warehouse (OLAP): clusters, Serverless, Spectrum, snapshots, data sharing.

Category: **Analytics & Machine Learning** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Features](#features)
- [Availability, backup, security](#availability-backup-security)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **What** - Massively parallel processing (MPP), columnar storage data warehouse based on PostgreSQL. For OLAP / BI / complex analytical queries, not OLTP.
- **Architecture** - Leader node (query planning, aggregation) + compute nodes. RA3 nodes separate compute and managed storage (scale independently).
- **Redshift Serverless** - Automatically provisions and scales capacity; pay for usage. Intermittent or unpredictable analytics.
- **Loading data** - COPY command from S3 (parallel, best), Firehose, DMS, zero-ETL integrations from Aurora/RDS/DynamoDB.
- **Distribution and sort keys** - Distribution style (KEY, EVEN, ALL, AUTO) and sort keys optimize performance.

## Features

- **Redshift Spectrum** - Query data directly in S3 (exabytes) from Redshift without loading; join with local tables.
- **Concurrency Scaling** - Automatically adds transient capacity for bursts of concurrent queries.
- **Workload Management (WLM)** - Queues to prioritize queries (short vs long).
- **Materialized views / result caching** - Speed up repeated queries.
- **Data sharing** - Share live data across clusters and accounts without copying.
- **Federated query** - Query live data in RDS/Aurora PostgreSQL and MySQL.
- **Redshift ML** - Create ML models with SQL (SageMaker under the hood).

## Availability, backup, security

- **Snapshots** - Automated (every 8 hours or 5 GB, retention 1-35 days) and manual snapshots to S3; restore creates a new cluster.
- **Cross-region snapshot copy** - Automatically copy snapshots to another region for DR (KMS snapshot copy grant for encrypted clusters).
- **Multi-AZ** - RA3 clusters support Multi-AZ deployment; otherwise single AZ.
- **Enhanced VPC routing** - Force COPY/UNLOAD traffic through your VPC (VPC endpoints, NAT) instead of the internet.
- **Encryption** - KMS or HSM; audit logging to S3/CloudWatch.

## Exam tips

- Data warehouse / complex analytical queries / BI on structured data -> Redshift.
- Query S3 data from Redshift without loading -> Redshift Spectrum.
- Intermittent analytics without managing clusters -> Redshift Serverless.
- DR for Redshift -> cross-region snapshot copy.
- COPY/UNLOAD must not traverse the internet -> enhanced VPC routing.
- Burst of concurrent BI users -> Concurrency Scaling.

## Practice questions

**Q1.** A company needs to run complex SQL analytics with joins and aggregations over petabytes of structured historical sales data for BI dashboards. Which service is MOST suitable?

- A. Amazon RDS for PostgreSQL
- B. Amazon Redshift
- C. Amazon DynamoDB
- D. Amazon ElastiCache

<details><summary>Answer</summary>

**B** - Redshift is a columnar MPP data warehouse designed for OLAP at petabyte scale.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** Analysts using Redshift need to query rarely used historical data stored in S3 without loading it into the cluster. What should be used?

- A. Redshift Spectrum
- B. S3 Select
- C. COPY command
- D. Glue DataBrew

<details><summary>Answer</summary>

**A** - Spectrum queries external tables in S3 directly and joins them with Redshift data.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** A company needs to be able to restore its Redshift data warehouse in another region if the primary region fails. What should be configured?

- A. Multi-AZ RDS
- B. Cross-region snapshot copy for the Redshift cluster
- C. S3 Cross-Region Replication for the cluster
- D. Enhanced VPC routing

<details><summary>Answer</summary>

**B** - Redshift can automatically copy snapshots to another region for DR.

_Domain: Design Resilient Architectures_

</details>

**Q4.** A security requirement states that Redshift COPY and UNLOAD traffic to S3 must stay within the VPC. What should be enabled?

- A. Enhanced VPC routing
- B. Concurrency Scaling
- C. Spectrum
- D. Data sharing

<details><summary>Answer</summary>

**A** - Enhanced VPC routing forces traffic through the VPC so you can use endpoints and controls.

_Domain: Design Secure Architectures_

</details>
