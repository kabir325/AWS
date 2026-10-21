# Amazon EC2

> Resizable virtual servers: instance families, purchasing options, placement groups, networking, AMIs and instance storage.

Category: **Compute** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Instance families](#instance-families)
- [Purchasing options](#purchasing-options)
- [Placement groups](#placement-groups)
- [Networking](#networking)
- [AMIs, launch and metadata](#amis-launch-and-metadata)
- [Instance lifecycle and storage](#instance-lifecycle-and-storage)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Instance families

- **General purpose (M, T, Mac)** - Balanced CPU/memory. T = burstable with CPU credits (T3/T4g unlimited mode can burst beyond credits for a fee).
- **Compute optimized (C)** - High CPU-to-memory ratio: batch processing, media transcoding, HPC, gaming servers, ML inference.
- **Memory optimized (R, X, z, High Memory)** - Large in-memory databases, real-time big data, caches (e.g. SAP HANA on X / High Memory).
- **Storage optimized (I, D, H)** - Very high local NVMe IOPS / sequential throughput: NoSQL, data warehousing, distributed file systems, OLTP.
- **Accelerated computing (P, G, Inf, Trn, F)** - GPUs for ML training (P, Trn), graphics (G), inference (Inf), FPGAs (F).
- **Naming** - m7g.2xlarge = family m, generation 7, attribute g (Graviton/ARM), size 2xlarge. Graviton = better price-performance.

## Purchasing options

- **On-Demand** - Pay per second (Linux/Windows) with no commitment. Short, unpredictable, uninterruptible workloads.
- **Reserved Instances (RI)** - 1 or 3 years, up to ~72% off. Standard RI (biggest discount, can modify AZ/size within family) vs Convertible RI (can change family/OS, ~66% off). Can sell Standard RIs on the RI Marketplace. Scope: regional or zonal (zonal reserves capacity).
- **Savings Plans** - Commit to $/hour for 1 or 3 years. Compute Savings Plans: any family, region, OS, plus Fargate and Lambda (up to ~66%). EC2 Instance Savings Plans: fixed family + region (up to ~72%).
- **Spot Instances** - Spare capacity, up to 90% off, reclaimed with a 2-minute warning. For fault-tolerant, stateless, flexible workloads: batch, CI, big data, containers. Never for databases or critical single instances.
- **Spot Fleet / EC2 Fleet** - Mix of Spot and On-Demand across many instance types and AZs. Allocation strategies: price-capacity-optimized (recommended), capacity-optimized, lowest-price, diversified.
- **Dedicated Hosts** - A whole physical server dedicated to you with visibility of sockets/cores. Needed for BYOL licenses bound to sockets/cores (Windows Server, SQL Server, Oracle) and some compliance. Most expensive.
- **Dedicated Instances** - Instances on hardware dedicated to your account, but no control of placement/host visibility.
- **On-Demand Capacity Reservations** - Reserve capacity in a specific AZ for any duration with no term commitment; billed whether used or not. Combine with Savings Plans/regional RIs for a discount.

## Placement groups

- **Cluster** - Instances packed close together in one AZ on low-latency, high-bandwidth network (up to 100 Gbps with enhanced networking). HPC, tightly coupled jobs. Risk: AZ / rack failure affects all.
- **Spread** - Each instance on distinct hardware racks. Max 7 running instances per AZ per group. Small number of critical instances that must not fail together.
- **Partition** - Instances divided into partitions (up to 7 per AZ), each on separate racks; hundreds of instances. Large distributed, replicated workloads: HDFS, HBase, Cassandra, Kafka. Instances can read their partition via metadata.

## Networking

- **ENI (Elastic Network Interface)** - Virtual NIC bound to one AZ: primary private IPv4, secondary IPs, one Elastic IP per private IP, security groups, MAC. Can be moved between instances for failover.
- **Elastic IP** - Static public IPv4 per region. Charged (all public IPv4 addresses are now charged hourly). Prefer DNS names or load balancers instead.
- **Enhanced networking (ENA)** - SR-IOV based, up to 100+ Gbps, lower latency; default on modern instances.
- **Elastic Fabric Adapter (EFA)** - ENA plus OS-bypass for HPC / MPI and ML training on Linux; low-latency inter-node communication.
- **Public vs private IP** - Public IP changes on stop/start. Private IP stays for the life of the instance.

## AMIs, launch and metadata

- **AMI** - Template with root volume snapshot, launch permissions and block device mapping. Regional; copy to other regions (can re-encrypt during copy). Golden AMIs reduce boot time.
- **User data** - Script run once at first boot as root (bootstrap: install packages, pull config). Limited to 16 KB.
- **Instance metadata (IMDS)** - http://169.254.169.254/latest/meta-data. IMDSv2 (session token) protects against SSRF; enforce IMDSv2. IAM role credentials are delivered here.
- **IAM roles for EC2** - Attach an instance profile instead of storing access keys on instances. Always the right answer over hard-coded keys.
- **Launch templates** - Versioned launch configuration (AMI, type, SGs, user data). Required for newer features; launch configurations are legacy.

## Instance lifecycle and storage

- **Stop / start** - EBS-backed only. Moves to new host, keeps EBS data, loses instance store data and public IP.
- **Hibernate** - RAM saved to the encrypted EBS root volume; resumes with in-memory state and same instance ID. RAM < 150 GB, max 60 days. Fast start for apps with long initialization.
- **Instance store** - Physically attached ephemeral NVMe disks, highest IOPS, lost on stop/terminate/hardware failure. Use for caches, buffers, scratch, replicated data.
- **EC2 Instance Connect / Session Manager** - Browser or IAM-based shell access. Session Manager needs no open inbound ports, no SSH keys and no bastion.
- **Status checks & auto recovery** - System status check failure -> CloudWatch alarm action "recover" (or default auto-recovery) migrates to new hardware keeping IP, ID and EBS.

## Exam tips

- Steady-state 24/7 workload for 1-3 years -> Reserved Instances or Savings Plans. Flexibility across families/regions/Lambda/Fargate -> Compute Savings Plan.
- Interruptible, fault-tolerant, cheapest -> Spot. Anything stateful or that cannot be interrupted -> not Spot.
- Socket/core-based BYOL or compliance needing host visibility -> Dedicated Hosts.
- Need guaranteed capacity in an AZ for an event without a long commitment -> On-Demand Capacity Reservation.
- Low latency between nodes (HPC) -> cluster placement group (+ EFA). Few critical instances isolated -> spread. Kafka/Cassandra/HDFS -> partition.
- Never put access keys on EC2: use an IAM role (instance profile).
- Memory and disk-space metrics are NOT collected by default: install the CloudWatch agent.

## Practice questions

**Q1.** A company runs a batch job every night that can be interrupted and restarted without issue. The job runs for about 3 hours. What is the MOST cost-effective purchasing option?

- A. On-Demand Instances
- B. Spot Instances
- C. Standard Reserved Instances
- D. Dedicated Hosts

<details><summary>Answer</summary>

**B** - Interruptible, restartable workloads are ideal for Spot, which offers up to 90% discount.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q2.** An HPC application requires the lowest possible network latency and highest throughput between nodes. Which configuration should be used?

- A. Spread placement group across 3 AZs
- B. Partition placement group
- C. Cluster placement group with Elastic Fabric Adapter
- D. Instances in multiple regions behind Global Accelerator

<details><summary>Answer</summary>

**C** - A cluster placement group packs instances close together in one AZ; EFA provides OS-bypass low-latency networking for tightly coupled HPC.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A company has a license for software that is billed per physical CPU socket and must be deployed on EC2. Which option meets this requirement?

- A. Dedicated Instances
- B. Dedicated Hosts
- C. Spot Instances
- D. Convertible Reserved Instances

<details><summary>Answer</summary>

**B** - Dedicated Hosts expose sockets and cores, enabling bring-your-own-license models tied to physical hardware.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q4.** A company will run a steady workload for 3 years but expects to change instance families and may move part of the workload to AWS Fargate and Lambda. Which option provides the largest discount with this flexibility?

- A. Standard Reserved Instances
- B. EC2 Instance Savings Plans
- C. Compute Savings Plans
- D. Spot Fleet

<details><summary>Answer</summary>

**C** - Compute Savings Plans apply across instance families, regions, OS, and also to Fargate and Lambda.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q5.** An application needs to keep its in-memory state when stopped overnight so that it starts quickly in the morning. What should be used?

- A. EC2 hibernation with an encrypted EBS root volume
- B. Instance store volumes
- C. Stop the instance and create an AMI
- D. A spread placement group

<details><summary>Answer</summary>

**A** - Hibernation writes RAM to the encrypted EBS root volume and restores it on start, preserving in-memory state.

_Domain: Design High-Performing Architectures_

</details>

**Q6.** A Cassandra cluster of 60 instances must minimize the impact of correlated hardware failures, and nodes need to know which failure domain they are in. Which placement strategy fits?

- A. Cluster placement group
- B. Spread placement group
- C. Partition placement group
- D. No placement group with Dedicated Instances

<details><summary>Answer</summary>

**C** - Partition placement groups isolate groups of instances on separate racks and expose the partition number via metadata, suiting large distributed replicated systems. Spread groups are limited to 7 instances per AZ.

_Domain: Design Resilient Architectures_

</details>

**Q7.** An application on EC2 needs to read objects from an S3 bucket. What is the MOST secure way to grant access?

- A. Store an IAM user access key in the application config file
- B. Attach an IAM role with an S3 read policy to the instance
- C. Make the bucket public
- D. Store credentials in user data

<details><summary>Answer</summary>

**B** - IAM roles provide automatically rotated temporary credentials through the instance metadata service; no long-term keys on the instance.

_Domain: Design Secure Architectures_

</details>

**Q8.** A company needs guaranteed EC2 capacity in a specific AZ for a two-week product launch, without a 1-year commitment. What should it use?

- A. Zonal Reserved Instances
- B. On-Demand Capacity Reservation
- C. Spot Block
- D. Compute Savings Plan

<details><summary>Answer</summary>

**B** - On-Demand Capacity Reservations reserve capacity in an AZ for any duration and can be cancelled anytime.

_Domain: Design Resilient Architectures_

</details>

**Q9.** Which EC2 storage provides the highest random I/O performance but loses data when the instance is stopped?

- A. EBS gp3
- B. EBS io2 Block Express
- C. Instance store
- D. Amazon EFS

<details><summary>Answer</summary>

**C** - Instance store is physically attached NVMe storage with very high IOPS but is ephemeral.

_Domain: Design High-Performing Architectures_

</details>

**Q10.** A security team wants to mitigate SSRF attacks that try to steal IAM role credentials from EC2 instances. What should they enforce?

- A. IMDSv2 (session-oriented metadata)
- B. Disabling user data
- C. Placing instances in a spread placement group
- D. Using Elastic IPs

<details><summary>Answer</summary>

**A** - IMDSv2 requires a session token obtained via PUT, which blocks most SSRF-based metadata credential theft.

_Domain: Design Secure Architectures_

</details>
