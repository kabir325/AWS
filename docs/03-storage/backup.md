# AWS Backup

> Centralized, policy-based backup across AWS services and accounts, with vault lock for immutability.

Category: **Storage** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Concepts](#concepts)
- [Governance](#governance)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Concepts

- **Supported resources** - EC2, EBS, S3, RDS, Aurora, DynamoDB, DocumentDB, Neptune, EFS, FSx, Storage Gateway volumes, VMware/on-prem VMs and more.
- **Backup plan** - Rules: frequency (cron), backup window, lifecycle (cold storage transition, retention), copy to other regions/accounts.
- **Resource assignment** - Select resources by tags or ARNs.
- **Backup vault** - Encrypted container for recovery points (KMS).
- **Point-in-time recovery** - Continuous backups for supported services (RDS, S3, Aurora).

## Governance

- **Vault Lock** - WORM protection: recovery points cannot be deleted or retention shortened, even by root (compliance mode). Protects against ransomware and malicious deletion.
- **Cross-account / Organizations** - Central backup policies across the organization; copy backups to a separate backup account.
- **Backup Audit Manager** - Audit and report on backup compliance against controls.
- **Restore testing** - Automated periodic restore tests to validate recoverability.

## Exam tips

- Centralize and automate backups across many services and accounts -> AWS Backup.
- Backups must be immutable / ransomware-proof -> AWS Backup Vault Lock (compliance mode).
- Cross-region DR copies of backups -> backup plan copy rule.

## Practice questions

**Q1.** A company needs a single solution to automate backups of EC2, RDS, DynamoDB and EFS across multiple accounts with centrally defined retention. What should be used?

- A. Amazon Data Lifecycle Manager
- B. AWS Backup with AWS Organizations backup policies
- C. Custom Lambda scripts
- D. S3 lifecycle policies

<details><summary>Answer</summary>

**B** - AWS Backup centrally manages backup plans across services and accounts via Organizations.

_Domain: Design Resilient Architectures_

</details>

**Q2.** To protect against ransomware, backups must not be deletable by anyone, including administrators, during the retention period. What should be used?

- A. IAM deny policy on the backup vault
- B. AWS Backup Vault Lock in compliance mode
- C. S3 versioning
- D. Encrypting backups with KMS

<details><summary>Answer</summary>

**B** - Vault Lock in compliance mode enforces WORM retention that cannot be changed, even by root.

_Domain: Design Secure Architectures_

</details>

**Q3.** A company wants a copy of every nightly backup stored in a different Region for disaster recovery with minimal effort. What should be configured?

- A. A copy rule in the AWS Backup plan
- B. Manual snapshot copies each night
- C. S3 Same-Region Replication
- D. Multi-AZ on every database

<details><summary>Answer</summary>

**A** - AWS Backup plans support automatic cross-region (and cross-account) copy rules.

_Domain: Design Resilient Architectures_

</details>
