# Amazon FSx

> Fully managed third-party file systems: Windows File Server, Lustre, NetApp ONTAP, OpenZFS.

Category: **Storage** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [FSx for Windows File Server](#fsx-for-windows-file-server)
- [FSx for Lustre](#fsx-for-lustre)
- [FSx for NetApp ONTAP](#fsx-for-netapp-ontap)
- [FSx for OpenZFS](#fsx-for-openzfs)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## FSx for Windows File Server

- **What** - Managed Windows native file system over SMB with NTFS, integrated with Microsoft Active Directory (AWS Managed AD or self-managed).
- **Features** - DFS namespaces, Windows ACLs, shadow copies, data deduplication, user quotas. Can be mounted from Linux too.
- **Deployment** - Single-AZ or Multi-AZ (active/standby across AZs). SSD or HDD storage.
- **Use cases** - Lift-and-shift Windows file shares, SharePoint, SQL Server, home directories.

## FSx for Lustre

- **What** - High-performance parallel file system for HPC, ML training, video processing, financial modeling. Hundreds of GB/s, millions of IOPS, sub-ms latency.
- **S3 integration** - Link to an S3 bucket: S3 objects appear as files; lazy loading; write results back to S3.
- **Scratch vs Persistent** - Scratch: temporary, no replication, highest burst, cheapest (short jobs). Persistent: long-term, replicated within AZ.
- **Linux only** - Lustre client on Linux.

## FSx for NetApp ONTAP

- **What** - Managed NetApp ONTAP: NFS, SMB and iSCSI simultaneously (multi-protocol), Linux, Windows and macOS.
- **Features** - Snapshots, SnapMirror replication, FlexClone instant clones, deduplication and compression, automatic tiering to capacity pool.
- **Use case** - Migrate existing NetApp workloads, multi-protocol access.

## FSx for OpenZFS

- **What** - Managed OpenZFS over NFS. Up to 1M IOPS, low latency, snapshots, instant clones.
- **Use case** - Migrate ZFS/Linux NFS workloads.

## Exam tips

- Windows + SMB + Active Directory -> FSx for Windows File Server.
- HPC / ML training needing parallel high throughput, often with S3 data -> FSx for Lustre (scratch for short-lived jobs).
- Multi-protocol NFS + SMB + iSCSI or existing NetApp -> FSx for NetApp ONTAP.
- Existing ZFS -> FSx for OpenZFS.

## Practice questions

**Q1.** A company is migrating Windows-based applications that use SMB file shares with Active Directory permissions. Which storage service should be used?

- A. Amazon EFS
- B. Amazon FSx for Windows File Server
- C. Amazon FSx for Lustre
- D. Amazon S3 File Gateway

<details><summary>Answer</summary>

**B** - FSx for Windows File Server provides native SMB, NTFS ACLs and AD integration.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A genomics company runs short-lived HPC jobs that read input data from S3 and need extremely high throughput. Data does not need to persist after the job. Which solution is MOST cost-effective?

- A. FSx for Lustre scratch file system linked to S3
- B. FSx for Lustre persistent file system
- C. Amazon EFS Max I/O
- D. EBS io2 volumes

<details><summary>Answer</summary>

**A** - Scratch Lustre file systems are cheapest for temporary high-performance processing and integrate with S3.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** An application requires concurrent access to the same data using NFS from Linux clients and SMB from Windows clients. Which service fits best?

- A. FSx for NetApp ONTAP
- B. Amazon EFS
- C. FSx for Lustre
- D. FSx for OpenZFS

<details><summary>Answer</summary>

**A** - ONTAP supports NFS, SMB and iSCSI multi-protocol access.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A Windows file share on FSx must remain available if an AZ fails. What should be configured?

- A. Single-AZ deployment with backups
- B. Multi-AZ deployment
- C. DFS replication to S3
- D. FSx for Lustre persistent

<details><summary>Answer</summary>

**B** - Multi-AZ FSx for Windows maintains a standby in another AZ with automatic failover.

_Domain: Design Resilient Architectures_

</details>
