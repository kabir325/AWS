# AWS Snow Family

> Physical devices for offline data transfer and edge computing where networks are slow, expensive or absent.

Category: **Migration & Transfer** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Devices](#devices)
- [Usage](#usage)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Devices

- **Snowball Edge Storage Optimized** - Large capacity (210 TB on current devices; older 80 TB) for bulk data migration; some compute.
- **Snowball Edge Compute Optimized** - More vCPU/memory (optional GPU) for edge computing in disconnected environments (ships, mines, military).
- **Snowcone** - Small, rugged device (8-14 TB) with DataSync agent. Discontinued for new orders (Nov 2024), may still appear in questions.
- **Snowmobile** - Exabyte-scale truck. Retired; for exam awareness only.
- **Availability note** - AWS limited Snow Family to existing customers in 2025; for new projects AWS suggests DataSync, Data Transfer Terminal, or Outposts. The exam still tests the concept.

## Usage

- **Process** - Order in console -> device shipped -> copy data locally (Snowball client / S3 adapter / NFS) -> ship back -> data imported into S3 -> device securely erased.
- **Rule of thumb** - If transfer over the network would take more than about a week, use Snowball. 100 TB over a 1 Gbps link takes about 12+ days.
- **Edge computing** - Run EC2 instances and Lambda on the device for local processing before shipping.
- **Glacier** - Snowball cannot import directly into Glacier: import to S3, then lifecycle to Glacier.
- **Security** - Tamper-resistant, KMS encryption, chain of custody tracking.

## Exam tips

- Petabytes / limited bandwidth / migration would take weeks over network -> Snowball Edge.
- Processing data at a remote site with no connectivity -> Snowball Edge Compute Optimized.
- Snowball imports into S3; use a lifecycle rule to reach Glacier.
- Calculate: data size / bandwidth. If > ~1 week, ship it.

## Practice questions

**Q1.** A company needs to migrate 500 TB of data to S3. It has a 500 Mbps internet connection that is already heavily used. What is the FASTEST and most cost-effective option?

- A. Upload over the internet with multipart upload
- B. Use multiple AWS Snowball Edge Storage Optimized devices
- C. Set up a Site-to-Site VPN
- D. Use S3 Transfer Acceleration

<details><summary>Answer</summary>

**B** - 500 TB over 500 Mbps would take months. Snowball devices move the data physically in weeks.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A research ship collects terabytes of sensor data with no network connectivity and must pre-process data on board. Which option fits?

- A. Snowball Edge Compute Optimized
- B. AWS Outposts
- C. AWS Storage Gateway
- D. AWS DataSync

<details><summary>Answer</summary>

**A** - Snowball Edge Compute Optimized provides compute at disconnected edge locations and can ship data back to AWS.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** Data imported with Snowball must end up in S3 Glacier Deep Archive at the lowest cost. What should be done?

- A. Select Glacier Deep Archive as the Snowball import target
- B. Import into S3, then use a lifecycle policy to transition to Deep Archive
- C. Use Storage Gateway
- D. Use DataSync from Snowball to Glacier directly

<details><summary>Answer</summary>

**B** - Snowball imports into S3; lifecycle rules transition objects to Glacier classes.

_Domain: Design Cost-Optimized Architectures_

</details>
