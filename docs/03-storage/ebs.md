# Amazon EBS & Instance Store

> Block storage for EC2: volume types, snapshots, encryption, Multi-Attach and when to use instance store instead.

Category: **Storage** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Volume types](#volume-types)
- [Snapshots](#snapshots)
- [Encryption](#encryption)
- [Instance store vs EBS vs EFS](#instance-store-vs-ebs-vs-efs)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **What** - Network-attached block volumes for EC2. Bound to a single AZ; persists independently of instance lifetime.
- **Attachment** - Normally one instance at a time (except io1/io2 Multi-Attach). An instance can have many volumes.
- **Delete on termination** - Root volume deleted by default on terminate; additional volumes kept by default. Configurable.
- **Moving across AZ/region** - Snapshot -> create volume in another AZ, or copy snapshot to another region.
- **Durability** - Replicated within its AZ; 99.8-99.9% durability (io2: 99.999%).

## Volume types

- **gp3 (General Purpose SSD)** - Default choice. Baseline 3,000 IOPS and 125 MiB/s regardless of size; provision IOPS and throughput independently (exam figures up to 16,000 IOPS / 1,000 MiB/s). Cheaper than gp2.
- **gp2** - Older; IOPS tied to size (3 IOPS/GB, burst to 3,000). Migrate to gp3 to save cost.
- **io2 Block Express / io1 (Provisioned IOPS SSD)** - Mission-critical, sustained high IOPS, sub-ms latency databases. io2 Block Express up to 256,000 IOPS and 64 TiB. Supports Multi-Attach.
- **st1 (Throughput Optimized HDD)** - Big data, data warehouses, log processing: large sequential I/O, up to 500 MiB/s. Cannot be a boot volume.
- **sc1 (Cold HDD)** - Lowest cost, infrequently accessed large data. Cannot be a boot volume.
- **Boot volumes** - Only SSD types (gp2/gp3/io1/io2) can be boot volumes.

## Snapshots

- **Incremental** - Point-in-time backups stored in S3 (managed); only changed blocks are saved after the first.
- **Data Lifecycle Manager (DLM)** - Automate snapshot and AMI creation, retention and cross-region copy. AWS Backup is the broader alternative.
- **Snapshot Archive** - 75% cheaper tier; restore takes 24-72 hours.
- **Recycle Bin** - Retention rules to recover accidentally deleted snapshots and AMIs.
- **Fast Snapshot Restore (FSR)** - Volumes created from snapshot are fully initialized immediately, no first-read latency. Costly.
- **Sharing** - Share snapshots with other accounts (encrypted ones need KMS key access).

## Encryption

- **What it covers** - Data at rest, data in transit between instance and volume, snapshots and volumes created from them. Uses KMS (AES-256), minimal latency impact.
- **Encryption by default** - Account/region setting to encrypt all new volumes.
- **Encrypt an existing unencrypted volume** - Snapshot -> copy snapshot with encryption enabled -> create volume from encrypted snapshot -> attach.
- **Multi-Attach** - io1/io2 attached to up to 16 Nitro instances in the same AZ; requires a cluster-aware file system.

## Instance store vs EBS vs EFS

- **Instance store** - Ephemeral, physically attached, millions of IOPS. Lost on stop/terminate. Caches, buffers, temp data, replicated clusters.
- **EBS** - Persistent block storage for one instance in one AZ. Databases, boot volumes.
- **EFS** - Shared file system for many Linux instances across AZs.
- **RAID** - RAID 0 across EBS volumes for more IOPS/throughput (no redundancy). RAID 1 for mirroring (rarely needed).

## Exam tips

- Default general purpose block storage -> gp3. Highest sustained IOPS / mission-critical DB -> io2 Block Express.
- Sequential big data at low cost -> st1. Coldest/cheapest HDD -> sc1. HDDs cannot boot.
- Encrypt an existing unencrypted volume -> snapshot, copy with encryption, restore.
- Shared block volume for a clustered app in one AZ -> io2 Multi-Attach. Shared file storage across AZs -> EFS.
- EBS is AZ-locked: use snapshots to move it.

## Practice questions

**Q1.** A company needs to encrypt an existing unencrypted EBS volume attached to a production instance. What is the correct process?

- A. Enable encryption on the volume directly
- B. Create a snapshot, copy it with encryption enabled, create a new volume from the encrypted snapshot, and attach it
- C. Enable EBS encryption by default; existing volumes are encrypted automatically
- D. Use SSE-S3

<details><summary>Answer</summary>

**B** - Existing volumes cannot be encrypted in place; use an encrypted snapshot copy to create a new encrypted volume.

_Domain: Design Secure Architectures_

</details>

**Q2.** A database requires 100,000 sustained IOPS with sub-millisecond latency. Which EBS volume type should be used?

- A. gp3
- B. st1
- C. io2 Block Express
- D. sc1

<details><summary>Answer</summary>

**C** - io2 Block Express supports up to 256,000 IOPS with consistent sub-ms latency.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A log processing workload needs high sequential throughput at the lowest cost for a non-boot volume. Which volume type should be used?

- A. st1
- B. io1
- C. gp3
- D. sc1

<details><summary>Answer</summary>

**A** - Throughput Optimized HDD (st1) is built for large sequential workloads like log processing at low cost. sc1 is for cold, infrequent data.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q4.** An application needs temporary scratch storage with the highest possible IOPS. Data loss on instance stop is acceptable. What should be used?

- A. EBS io2
- B. Instance store
- C. Amazon EFS Max I/O
- D. Amazon S3

<details><summary>Answer</summary>

**B** - Instance store provides the highest IOPS as locally attached NVMe, but is ephemeral.

_Domain: Design High-Performing Architectures_

</details>

**Q5.** A company wants to reduce the cost of many gp2 volumes without reducing performance. What should be done?

- A. Migrate to gp3 volumes
- B. Migrate to io2 volumes
- C. Migrate to sc1
- D. Increase volume size

<details><summary>Answer</summary>

**A** - gp3 is about 20% cheaper per GB than gp2 and provides a 3,000 IOPS baseline independent of size.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q6.** An EC2 instance in us-east-1a must have its data volume made available to an instance in us-east-1b. What should be done?

- A. Detach and attach the volume in us-east-1b
- B. Create a snapshot and create a new volume from it in us-east-1b
- C. Enable Multi-Attach
- D. Use S3 Transfer Acceleration

<details><summary>Answer</summary>

**B** - EBS volumes are bound to an AZ. Snapshots are regional and can create volumes in any AZ of the region.

_Domain: Design Resilient Architectures_

</details>
