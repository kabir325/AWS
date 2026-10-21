# AWS CloudTrail

> Audit log of API calls and account activity: management, data and Insights events, trails, CloudTrail Lake.

Category: **Management & Governance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Event types](#event-types)
- [Security and analysis](#security-and-analysis)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **What** - Records API calls made via Console, SDK, CLI and AWS services: who, what, when, from where. Enabled by default.
- **Event history** - 90 days of management events viewable/searchable for free.
- **Trails** - Deliver events to an S3 bucket (and optionally CloudWatch Logs) for long-term retention. Apply to all regions (recommended) or one. Organization trail covers all accounts.
- **Delivery** - Events typically delivered within ~5 minutes (not real time).

## Event types

- **Management events** - Control plane operations (CreateBucket, RunInstances, AttachRolePolicy). Logged by default. Read/write can be separated.
- **Data events** - Data plane operations (S3 GetObject/PutObject, Lambda Invoke, DynamoDB item activity). NOT logged by default (high volume, extra cost).
- **Insights events** - Detect unusual write/error activity (bursts of API calls, hitting limits) compared to baseline.
- **Network activity events** - API calls made through VPC endpoints.

## Security and analysis

- **Log file integrity validation** - SHA-256 digest files prove logs were not modified or deleted.
- **Protect logs** - S3 bucket in a separate log-archive account, SSE-KMS, Object Lock/MFA Delete, SCP to deny StopLogging/DeleteTrail.
- **Athena** - Query CloudTrail logs in S3 with SQL.
- **CloudTrail Lake** - Managed event data lake with SQL queries, retention up to 10 years; ingest non-AWS events.
- **EventBridge** - React to specific API calls in near real time (e.g. alert when someone deletes a security group).

## Exam tips

- Who deleted / changed this resource? -> CloudTrail.
- Track S3 object-level access or Lambda invocations -> enable CloudTrail data events.
- Prove logs were not tampered with -> log file integrity validation.
- Single trail for all accounts -> organization trail in the management account.
- Retain beyond 90 days -> create a trail to S3 (or CloudTrail Lake).
- CloudTrail = API activity (who did what). Config = resource configuration and compliance over time. CloudWatch = performance metrics/logs.

## Practice questions

**Q1.** A security team needs to determine which IAM user terminated a production EC2 instance yesterday. Which service should be used?

- A. Amazon CloudWatch metrics
- B. AWS CloudTrail
- C. AWS Config
- D. VPC Flow Logs

<details><summary>Answer</summary>

**B** - CloudTrail records API calls including the identity that called TerminateInstances.

_Domain: Design Secure Architectures_

</details>

**Q2.** Auditors require a record of every GetObject request on a sensitive S3 bucket. What must be enabled?

- A. CloudTrail management events
- B. CloudTrail data events for the S3 bucket
- C. S3 Inventory
- D. AWS Config rules

<details><summary>Answer</summary>

**B** - Object-level operations are data events, which are not logged by default.

_Domain: Design Secure Architectures_

</details>

**Q3.** A company must prove that CloudTrail log files have not been altered after delivery. What should be enabled?

- A. S3 versioning
- B. CloudTrail log file integrity validation
- C. KMS rotation
- D. CloudWatch Logs retention

<details><summary>Answer</summary>

**B** - Integrity validation creates signed digest files to verify logs are unchanged.

_Domain: Design Secure Architectures_

</details>

**Q4.** A company with 40 accounts wants all API activity logged to one central S3 bucket with minimal setup. What should be used?

- A. A trail in every account
- B. An organization trail created from the management account
- C. AWS Config aggregator
- D. CloudWatch cross-account dashboards

<details><summary>Answer</summary>

**B** - Organization trails automatically log events for all member accounts.

_Domain: Design Secure Architectures_

</details>
