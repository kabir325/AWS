# AWS Database Migration Service (DMS)

> Migrate and replicate databases with minimal downtime; Schema Conversion for heterogeneous migrations.

Category: **Migration & Transfer** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Operations](#operations)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **What** - Migrate databases to AWS while the source stays fully operational. Runs on a replication instance (or DMS Serverless).
- **Migration types** - Full load, full load + CDC (change data capture, ongoing replication), CDC only.
- **Homogeneous** - Same engine (Oracle -> RDS Oracle, MySQL -> Aurora MySQL). DMS homogeneous migrations use native tools.
- **Heterogeneous** - Different engines (Oracle -> Aurora PostgreSQL, SQL Server -> MySQL): convert schema first with DMS Schema Conversion or AWS SCT, then migrate data with DMS.
- **Sources and targets** - Sources: Oracle, SQL Server, MySQL, PostgreSQL, MongoDB, SAP, Db2, S3, Azure SQL. Targets: RDS, Aurora, Redshift, DynamoDB, S3, OpenSearch, Kinesis, DocumentDB, Neptune, Kafka.

## Operations

- **Multi-AZ replication instance** - Synchronous standby for HA of the migration itself.
- **Validation** - Data validation compares source and target rows.
- **Large databases** - Combine with Snowball Edge: SCT extracts data to the device, ship to AWS, DMS applies ongoing changes (CDC).
- **Continuous replication** - DMS can be used for ongoing replication to analytics targets (S3, Redshift, Kinesis).

## Exam tips

- Migrate a database with minimal downtime -> DMS with full load + CDC.
- Different source and target engines -> SCT / DMS Schema Conversion + DMS.
- Same engine -> DMS only (or native tools).
- Very large DB over slow network -> Snowball Edge + DMS CDC.
- Replicate on-prem DB changes continuously into S3 data lake -> DMS CDC to S3.

## Practice questions

**Q1.** A company must migrate an on-premises Oracle database to Amazon Aurora PostgreSQL with minimal downtime. Which combination should be used?

- A. AWS DataSync and DMS
- B. AWS Schema Conversion Tool (or DMS Schema Conversion) and AWS DMS with CDC
- C. AWS Snowball and S3
- D. Application Migration Service only

<details><summary>Answer</summary>

**B** - Heterogeneous migrations require schema conversion, then DMS migrates data and replicates ongoing changes.

_Domain: Design Resilient Architectures_

</details>

**Q2.** A company is migrating MySQL on premises to Amazon RDS for MySQL and needs the source to remain available during migration. What should DMS be configured to do?

- A. Full load only
- B. Full load plus change data capture (CDC)
- C. CDC only before the full load
- D. Schema conversion

<details><summary>Answer</summary>

**B** - Full load + CDC copies existing data and then continuously applies changes until cutover.

_Domain: Design Resilient Architectures_

</details>

**Q3.** A 50 TB database must be migrated but the network link is slow. Ongoing changes must also be captured. What is the BEST approach?

- A. DMS over the internet only
- B. Use Snowball Edge with SCT data extraction for the bulk load and DMS CDC for ongoing changes
- C. Export to CSV and email
- D. Use Storage Gateway

<details><summary>Answer</summary>

**B** - Snowball moves the bulk data offline, while DMS replicates changes made since extraction.

_Domain: Design High-Performing Architectures_

</details>
