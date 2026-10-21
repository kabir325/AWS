# Amazon RDS

> Managed relational databases: Multi-AZ, read replicas, backups, encryption, RDS Proxy and scaling.

Category: **Database** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [High availability: Multi-AZ](#high-availability-multi-az)
- [Read replicas](#read-replicas)
- [Backups and restore](#backups-and-restore)
- [Security](#security)
- [RDS Proxy and monitoring](#rds-proxy-and-monitoring)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **Engines** - MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, IBM Db2 (plus Aurora, covered separately).
- **Managed by AWS** - Provisioning, OS and engine patching, automated backups, monitoring, Multi-AZ failover. No SSH access (except RDS Custom).
- **RDS Custom** - For Oracle and SQL Server when you need OS / database customization and access to the underlying instance.
- **Storage** - EBS-based (gp3, io1/io2). Storage Auto Scaling grows storage automatically when free space is low (set a max threshold).
- **Scaling** - Vertical: change instance class (brief downtime, can be applied in maintenance window). Horizontal reads: read replicas.

## High availability: Multi-AZ

- **Multi-AZ instance deployment** - Synchronous replication to a standby in another AZ. Standby is NOT readable. Automatic failover (60-120 s) by flipping the DNS endpoint. For HA, not for scaling.
- **Multi-AZ DB cluster deployment** - One writer + two readable standbys in three AZs (MySQL/PostgreSQL). Faster failover (~35 s) and reader endpoint.
- **Failover triggers** - AZ outage, primary failure, instance type change, OS patching, manual reboot with failover.
- **Converting** - Single-AZ to Multi-AZ is a zero-downtime modify operation (snapshot + restore to standby behind the scenes).

## Read replicas

- **Purpose** - Scale read-heavy workloads (reporting, analytics). Up to 15 replicas (MySQL, MariaDB, PostgreSQL; fewer for Oracle/SQL Server).
- **Replication** - Asynchronous -> eventually consistent reads. Application must use the replica endpoint.
- **Placement** - Same AZ, cross-AZ or cross-region. Cross-region replicas for DR and local reads (cross-region data transfer charged; same-region replication free).
- **Promotion** - Can be promoted to a standalone DB (breaks replication). Used in DR.
- **Replica can be Multi-AZ** - Read replicas themselves can be configured Multi-AZ.

## Backups and restore

- **Automated backups** - Daily snapshot + transaction logs; point-in-time restore to any second within retention (1-35 days; 0 disables). Deleted with the instance unless retained.
- **Manual snapshots** - Kept until you delete them. Copy cross-region / share cross-account.
- **Restore** - Always creates a NEW DB instance with a new endpoint.
- **Cost tip** - For a DB used only a few hours a month, snapshot and delete it instead of stopping (stopped DBs restart automatically after 7 days).

## Security

- **Network** - Deploy in private subnets (DB subnet group); control access with security groups.
- **Encryption at rest** - KMS, chosen at creation. Encrypts storage, backups, snapshots, replicas. To encrypt an unencrypted DB: snapshot -> copy snapshot encrypted -> restore.
- **Encryption in transit** - SSL/TLS; enforce with parameters (rds.force_ssl for PostgreSQL / SQL Server, require_secure_transport for MySQL).
- **IAM DB authentication** - MySQL/PostgreSQL: authenticate with a short-lived token from IAM instead of a password.
- **Secrets Manager** - Store and automatically rotate DB credentials (native integration).
- **Audit** - Engine logs to CloudWatch Logs; Database Activity Streams (Oracle, SQL Server, Aurora).

## RDS Proxy and monitoring

- **RDS Proxy** - Fully managed connection pool: reduces DB connections (great for Lambda), cuts failover time by up to 66%, enforces IAM auth and Secrets Manager. Not publicly accessible (VPC only).
- **Enhanced Monitoring** - OS-level metrics (processes, memory) at up to 1 s granularity.
- **Performance Insights** - Visualize database load and top SQL waits.
- **Event notifications** - RDS events (failover, backup) via EventBridge/SNS.

## Exam tips

- High availability / automatic failover -> Multi-AZ. Scale reads -> read replicas. They solve different problems.
- Multi-AZ standby cannot serve reads (instance deployment). Multi-AZ DB cluster has readable standbys.
- Cross-region DR for RDS -> cross-region read replica (promote on disaster) or snapshot copy.
- Encrypting an existing unencrypted RDS -> snapshot, encrypted copy, restore.
- Too many connections from Lambda -> RDS Proxy.
- Need OS access to Oracle/SQL Server -> RDS Custom; otherwise self-managed on EC2.
- Reporting queries slow down the production DB -> send them to a read replica.

## Practice questions

**Q1.** A company needs its RDS for MySQL database to automatically fail over to another AZ with minimal data loss if the primary fails. What should be configured?

- A. A read replica in another AZ
- B. Multi-AZ deployment
- C. Automated backups with 35-day retention
- D. RDS Proxy

<details><summary>Answer</summary>

**B** - Multi-AZ maintains a synchronous standby and performs automatic failover.

_Domain: Design Resilient Architectures_

</details>

**Q2.** Reporting queries are slowing down the production RDS PostgreSQL database. What is the MOST appropriate solution?

- A. Enable Multi-AZ and point reports at the standby
- B. Create a read replica and point reporting to the replica endpoint
- C. Increase backup retention
- D. Enable storage auto scaling

<details><summary>Answer</summary>

**B** - Read replicas offload read traffic. A Multi-AZ instance standby is not readable.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A company has an unencrypted RDS instance and must encrypt it at rest. What should be done?

- A. Modify the instance and enable encryption
- B. Take a snapshot, copy it with encryption, restore a new instance from the encrypted snapshot
- C. Enable TLS
- D. Create an encrypted read replica of the unencrypted instance

<details><summary>Answer</summary>

**B** - Encryption at rest can only be set at creation. Use an encrypted snapshot copy to restore an encrypted instance.

_Domain: Design Secure Architectures_

</details>

**Q4.** A company wants a disaster recovery copy of its RDS MySQL database in another region with an RPO of minutes and the ability to promote it quickly. What should it use?

- A. Multi-AZ deployment
- B. Cross-region read replica
- C. Daily manual snapshots copied cross-region
- D. Storage auto scaling

<details><summary>Answer</summary>

**B** - Cross-region read replicas asynchronously replicate (seconds to minutes lag) and can be promoted to standalone.

_Domain: Design Resilient Architectures_

</details>

**Q5.** Database credentials for RDS must be rotated automatically every 30 days without application changes beyond fetching the secret at runtime. What should be used?

- A. SSM Parameter Store standard parameters
- B. AWS Secrets Manager with rotation enabled
- C. KMS key rotation
- D. IAM access key rotation

<details><summary>Answer</summary>

**B** - Secrets Manager has native RDS integration with automatic rotation via managed Lambda functions.

_Domain: Design Secure Architectures_

</details>

**Q6.** A development database is used only during two days each month. How can costs be minimized?

- A. Stop the instance between uses
- B. Take a snapshot and delete the instance; restore when needed
- C. Use a Multi-AZ deployment
- D. Purchase a Reserved Instance

<details><summary>Answer</summary>

**B** - Stopped RDS instances automatically start after 7 days and still incur storage costs. Snapshot + delete is cheapest for rare usage.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q7.** Which statements about RDS Multi-AZ (instance deployment) are correct? (Choose TWO)

- A. Replication to the standby is synchronous
- B. The standby can serve read traffic
- C. Failover is automatic and the endpoint DNS stays the same
- D. It replaces the need for read replicas for scaling reads
- E. Replication is asynchronous

<details><summary>Answer</summary>

**A, C** - Multi-AZ uses synchronous replication and automatic failover with the same endpoint. The standby is passive.

_Domain: Design Resilient Architectures_

</details>
