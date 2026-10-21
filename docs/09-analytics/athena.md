# Amazon Athena

> Serverless interactive SQL queries directly on data in S3; pay per data scanned.

Category: **Analytics & Machine Learning** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Performance and cost optimization](#performance-and-cost-optimization)
- [Features](#features)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **What** - Serverless query engine (Trino/Presto based) using standard SQL on S3 data: CSV, JSON, Parquet, ORC, Avro, logs. No infrastructure, no loading.
- **Pricing** - About $5 per TB scanned (or provisioned capacity). Optimize to scan less.
- **Catalog** - Uses AWS Glue Data Catalog for table definitions (crawlers can create them).
- **Use cases** - Ad-hoc analysis, query VPC Flow Logs, CloudTrail, ALB/CloudFront logs, CUR billing data; BI with QuickSight.

## Performance and cost optimization

- **Columnar formats** - Convert to Parquet or ORC (with Glue ETL or Firehose): scan only needed columns, huge cost savings.
- **Compression** - Compress data (Snappy, GZIP) to scan fewer bytes.
- **Partitioning** - Organize S3 by partition keys (s3://bucket/year=2026/month=10/) and filter on them; partition projection to avoid managing partitions.
- **Larger files** - Use fewer larger files (> 128 MB) rather than many small files.
- **Query result reuse** - Reuse cached results for repeated queries.

## Features

- **Federated Query** - Query data in RDS, DynamoDB, Redshift, on-prem databases, etc. via Lambda data source connectors and join with S3 data.
- **Workgroups** - Separate users/teams, enforce per-query data scan limits, track costs.
- **CTAS** - CREATE TABLE AS SELECT to transform and write results in Parquet.
- **Apache Spark** - Run interactive Spark notebooks in Athena.
- **Security** - IAM, Lake Formation fine-grained permissions, encrypted results.

## Exam tips

- Ad-hoc SQL on S3 data, serverless, no loading -> Athena.
- Reduce Athena cost / improve speed -> Parquet/ORC + compression + partitioning.
- Analyze VPC Flow Logs / CloudTrail / ALB logs in S3 -> Athena.
- Query across S3 and other databases -> Athena Federated Query.
- Complex BI on large structured data with joins and consistent heavy usage -> Redshift instead.

## Practice questions

**Q1.** A company stores application logs in S3 and wants to run occasional SQL queries on them without managing infrastructure. What is the MOST cost-effective solution?

- A. Load the data into Redshift
- B. Use Amazon Athena
- C. Launch an EMR cluster
- D. Load into RDS

<details><summary>Answer</summary>

**B** - Athena queries S3 data in place, serverless, paying only per data scanned.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q2.** Athena queries on large CSV datasets are slow and expensive. Which actions reduce cost and improve performance? (Choose TWO)

- A. Convert the data to Apache Parquet
- B. Partition data in S3 by date and filter on partition columns
- C. Store data in S3 Glacier
- D. Use more, smaller files
- E. Disable compression

<details><summary>Answer</summary>

**A, B** - Columnar formats and partitioning reduce bytes scanned, lowering cost and latency.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** An analyst wants to join customer data in DynamoDB with clickstream data in S3 using SQL without moving data. What should be used?

- A. Athena Federated Query
- B. S3 Select
- C. Redshift COPY
- D. AWS DMS

<details><summary>Answer</summary>

**A** - Federated Query uses connectors to query and join external sources such as DynamoDB with S3.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A company wants to limit how much data each team can scan in Athena per query to control costs. What should be used?

- A. IAM policies only
- B. Athena workgroups with data usage controls
- C. S3 lifecycle rules
- D. Glue crawlers

<details><summary>Answer</summary>

**B** - Workgroups can enforce per-query and per-workgroup data scan limits.

_Domain: Design Cost-Optimized Architectures_

</details>
