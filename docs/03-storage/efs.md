# Amazon EFS

> Managed, elastic NFS file system for Linux, shared across thousands of clients and multiple AZs.

Category: **Storage** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Performance](#performance)
- [Storage classes and lifecycle](#storage-classes-and-lifecycle)
- [Security and protection](#security-and-protection)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **What** - Serverless NFSv4.1 file system that grows and shrinks automatically. Pay per GB used. Linux only (POSIX), not Windows.
- **Access** - Mount targets (one per AZ) in your VPC subnets, controlled by security groups (NFS port 2049). Accessible from EC2, ECS, EKS, Fargate, Lambda and on-prem via DX/VPN.
- **Regional vs One Zone** - Regional (Standard): data stored across multiple AZs. One Zone: single AZ, cheaper, for dev or re-creatable data.
- **Concurrency** - Thousands of concurrent clients reading/writing the same files.

## Performance

- **Performance modes** - General Purpose (default, lowest latency: web serving, CMS, home dirs). Max I/O (legacy, higher aggregate throughput, higher latency, for highly parallel big data).
- **Throughput modes** - Elastic (recommended, scales automatically, pay for usage, spiky workloads). Provisioned (fixed throughput independent of size). Bursting (scales with storage size, burst credits).

## Storage classes and lifecycle

- **Standard** - Frequently accessed files.
- **Infrequent Access (IA)** - Lower storage cost, retrieval fee.
- **Archive** - Rarely accessed (a few times per year), lowest cost.
- **Lifecycle management** - Move files not accessed for N days to IA/Archive; optionally move back on first access. Large savings (up to ~90%).

## Security and protection

- **Encryption** - At rest with KMS (set at creation), in transit with TLS via the EFS mount helper.
- **Access points** - Application-specific entry points enforcing a POSIX user/group and root directory; combine with IAM authorization.
- **Backup and replication** - AWS Backup integration; EFS Replication to another region or AZ (RPO minutes).

## Exam tips

- Shared file storage for many Linux instances across AZs -> EFS.
- Windows shared file storage (SMB, AD) -> FSx for Windows, not EFS.
- Reduce EFS cost for rarely used files -> lifecycle to IA / Archive.
- Spiky, unpredictable throughput -> Elastic throughput mode.

## Practice questions

**Q1.** A fleet of Linux EC2 instances in an Auto Scaling group across three AZs must share a common file system for user uploads. Which service should be used?

- A. Amazon EBS Multi-Attach
- B. Amazon EFS
- C. Amazon FSx for Windows File Server
- D. Instance store

<details><summary>Answer</summary>

**B** - EFS is a multi-AZ NFS file system that many Linux instances can mount simultaneously.

_Domain: Design Resilient Architectures_

</details>

**Q2.** An EFS file system stores many files that are rarely accessed after 60 days. How can cost be reduced with minimal effort?

- A. Move files manually to S3
- B. Enable EFS lifecycle management to transition files to Infrequent Access/Archive
- C. Switch to Max I/O performance mode
- D. Use Provisioned throughput

<details><summary>Answer</summary>

**B** - Lifecycle policies automatically move files not accessed for a set period into cheaper storage classes.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** A workload on EFS has unpredictable spiky throughput needs. Which throughput mode should be used to avoid throttling while paying for what is used?

- A. Bursting
- B. Provisioned
- C. Elastic
- D. Max I/O

<details><summary>Answer</summary>

**C** - Elastic throughput automatically scales throughput up and down to match demand and you pay for usage.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** Multiple containerized applications share one EFS file system. Each must be confined to its own directory with a specific POSIX identity. What should be used?

- A. Separate security groups
- B. EFS access points
- C. S3 access points
- D. EFS One Zone

<details><summary>Answer</summary>

**B** - EFS access points enforce a root directory and POSIX user/group per application.

_Domain: Design Secure Architectures_

</details>
