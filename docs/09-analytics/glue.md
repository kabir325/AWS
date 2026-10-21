# AWS Glue & Lake Formation

> Serverless ETL and data catalog; Lake Formation for building and securing data lakes with fine-grained permissions.

Category: **Analytics & Machine Learning** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [AWS Glue](#aws-glue)
- [AWS Lake Formation](#aws-lake-formation)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## AWS Glue

- **Glue Data Catalog** - Central metadata repository (databases, tables, schemas) used by Athena, Redshift Spectrum, EMR, Lake Formation. Hive metastore compatible.
- **Crawlers** - Scan S3, JDBC, DynamoDB sources to infer schemas and create/update catalog tables and partitions.
- **Glue ETL jobs** - Serverless Apache Spark (Python/Scala) or Python shell jobs: transform, clean, convert CSV/JSON to Parquet, join datasets. Pay per DPU-hour.
- **Job bookmarks** - Track processed data to avoid reprocessing old data on incremental runs.
- **Glue Studio / DataBrew** - Visual ETL authoring; DataBrew for no-code data cleaning and normalization (250+ transformations).
- **Glue Streaming ETL** - Spark Structured Streaming on Kinesis/MSK.
- **Data Quality** - Define and monitor data quality rules.
- **Triggers and workflows** - Schedule or event-driven orchestration of crawlers and jobs.

## AWS Lake Formation

- **What** - Build a secure data lake on S3 in days: ingest, catalog, clean, and centrally govern access.
- **Fine-grained access control** - Database, table, column, row and cell-level permissions enforced across Athena, Redshift Spectrum, EMR, Glue, QuickSight.
- **Tag-based access (LF-TBAC)** - Assign LF-tags to data and grant permissions on tags; scales across many tables.
- **Cross-account sharing** - Share catalog tables with other accounts without copying data.
- **Blueprints** - Templates to ingest from databases and logs into the lake.

## Exam tips

- Serverless ETL / convert formats / catalog data -> Glue.
- Discover schemas in S3 automatically -> Glue crawler.
- Avoid reprocessing old data in incremental ETL -> job bookmarks.
- Column/row-level security across analytics services in a data lake -> Lake Formation.
- No-code data preparation for analysts -> Glue DataBrew.

## Practice questions

**Q1.** A company needs to transform CSV files in S3 into Parquet on a daily schedule without managing servers. What should be used?

- A. AWS Glue ETL job
- B. Amazon EMR on EC2
- C. Lambda with 15-minute timeout for 1 TB
- D. AWS DataSync

<details><summary>Answer</summary>

**A** - Glue provides serverless Spark ETL jobs that can be scheduled.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A data lake must restrict analysts so they can only see certain columns and rows of tables when querying with Athena and Redshift Spectrum. What should be used?

- A. S3 bucket policies
- B. AWS Lake Formation fine-grained permissions
- C. IAM policies on Glue
- D. KMS key policies

<details><summary>Answer</summary>

**B** - Lake Formation provides column-, row- and cell-level security enforced across integrated analytics services.

_Domain: Design Secure Architectures_

</details>

**Q3.** A daily Glue job reprocesses all files in S3 every run, wasting time and money. Only new files should be processed. What should be enabled?

- A. Glue job bookmarks
- B. S3 versioning
- C. Glue crawler schedule
- D. Athena workgroups

<details><summary>Answer</summary>

**A** - Job bookmarks track previously processed data.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q4.** New datasets arrive in S3 with changing schemas. Analysts need table definitions available in Athena automatically. What should be used?

- A. AWS Glue crawler updating the Data Catalog
- B. Manual CREATE TABLE statements
- C. S3 Inventory
- D. Amazon Macie

<details><summary>Answer</summary>

**A** - Crawlers infer schemas and keep the Data Catalog up to date for Athena.

_Domain: Design High-Performing Architectures_

</details>
