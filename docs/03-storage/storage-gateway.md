# AWS Storage Gateway

> Hybrid storage: give on-premises apps access to cloud storage via file, volume and tape interfaces.

Category: **Storage** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Gateway types](#gateway-types)
- [Deployment](#deployment)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Gateway types

- **S3 File Gateway** - NFS/SMB file shares on premises; files stored as objects in S3 (any class via lifecycle). Local cache for recent data. AD integration for SMB.
- **FSx File Gateway** - Low-latency on-prem cache for FSx for Windows File Server shares (being phased out for new customers; know the concept).
- **Volume Gateway - Cached** - iSCSI block volumes; primary data in S3, frequently accessed data cached locally. Low on-prem footprint.
- **Volume Gateway - Stored** - iSCSI; full dataset on premises, asynchronously backed up to S3 as EBS snapshots. Low-latency access to all data.
- **Tape Gateway** - Virtual tape library (iSCSI VTL) for existing backup software (Veeam, NetBackup); tapes stored in S3 and archived to Glacier / Deep Archive.

## Deployment

- **Form factor** - VM on VMware/Hyper-V/KVM, or EC2, or hardware appliance (ordered from AWS).
- **Connectivity** - Over internet, VPN or Direct Connect; can use VPC endpoint.
- **Use cases** - Hybrid file shares, backup to cloud, tiered storage, disaster recovery, replacing physical tape.

## Exam tips

- On-prem apps need NFS/SMB backed by S3 -> S3 File Gateway.
- Replace physical tape library with no change to backup software -> Tape Gateway.
- iSCSI, keep only hot data locally -> Volume Gateway cached; need all data locally with cloud backup -> stored.
- One-time bulk migration of data -> DataSync or Snowball, not Storage Gateway.

## Practice questions

**Q1.** A company wants to replace its on-premises physical tape library with cloud storage without changing its existing backup software. Which solution should be used?

- A. S3 File Gateway
- B. Tape Gateway
- C. Volume Gateway stored mode
- D. AWS DataSync

<details><summary>Answer</summary>

**B** - Tape Gateway presents a virtual tape library that existing backup software uses, storing tapes in S3/Glacier.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q2.** On-premises applications need NFS access to files that should be stored durably in Amazon S3 with frequently accessed files cached locally. Which service fits?

- A. S3 File Gateway
- B. Volume Gateway cached
- C. FSx for Lustre
- D. Amazon EFS

<details><summary>Answer</summary>

**A** - S3 File Gateway exposes NFS/SMB shares backed by S3 objects with a local cache.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** An on-premises application needs low-latency access to its entire 20 TB dataset over iSCSI while asynchronously backing it up to AWS. Which configuration is correct?

- A. Volume Gateway in cached mode
- B. Volume Gateway in stored mode
- C. Tape Gateway
- D. S3 File Gateway

<details><summary>Answer</summary>

**B** - Stored volumes keep the full dataset locally and back up point-in-time snapshots to AWS.

_Domain: Design Resilient Architectures_

</details>
