svc({
  id: 's3', name: 'Amazon S3', cat: 'storage', imp: 3,
  tag: 'Object storage with 11 nines durability: storage classes, lifecycle, security, encryption, replication, performance.',
  s: [
    { h: 'Fundamentals', i: [
      ['Buckets and objects', 'Bucket names are globally unique, bucket lives in one region. Objects are key + value + metadata. Max object size 5 TB; single PUT up to 5 GB; use multipart upload above 100 MB (required above 5 GB).'],
      ['Durability / availability', '99.999999999% (11 nines) durability for all classes. Standard: 99.99% availability, stored in 3+ AZs.'],
      ['Consistency', 'Strong read-after-write consistency for all PUTs, DELETEs and LISTs.'],
      ['Flat namespace', 'No real folders; prefixes in keys (logs/2026/10/file.gz). Prefixes matter for performance and lifecycle/replication filters.'],
      ['Static website hosting', 'Bucket website endpoint (HTTP only). For HTTPS and custom domain use CloudFront in front.']
    ]},
    { h: 'Storage classes', i: [
      ['S3 Standard', 'Frequently accessed data, ms latency, no retrieval fee.'],
      ['S3 Intelligent-Tiering', 'Unknown or changing access patterns. Moves objects automatically between frequent, infrequent (30 days), archive instant (90 days) and optional archive tiers. Small monitoring fee per object, no retrieval fees.'],
      ['S3 Standard-IA', 'Infrequent access but needs ms retrieval. Min 30 days storage, 128 KB min billable size, retrieval fee. Multi-AZ.'],
      ['S3 One Zone-IA', 'Same as Standard-IA but one AZ (20% cheaper). For re-creatable data or secondary copies. Data lost if AZ is destroyed.'],
      ['S3 Glacier Instant Retrieval', 'Archive accessed about once a quarter, ms retrieval. Min 90 days.'],
      ['S3 Glacier Flexible Retrieval', 'Archive, retrieval: Expedited 1-5 min, Standard 3-5 h, Bulk 5-12 h (free). Min 90 days.'],
      ['S3 Glacier Deep Archive', 'Cheapest. Retrieval: Standard within 12 h, Bulk within 48 h. Min 180 days. Replaces tape.'],
      ['S3 Express One Zone', 'Single-digit ms, very high request rates in a single AZ using directory buckets. ML training, analytics hot data.']
    ]},
    { h: 'Lifecycle and versioning', i: [
      ['Lifecycle rules', 'Transition actions (e.g. Standard -> Standard-IA after 30 days -> Glacier after 90) and expiration actions (delete after N days, delete old versions, abort incomplete multipart uploads). Filter by prefix or tag.'],
      ['Transition minimums', 'Objects must stay 30 days in Standard before moving to Standard-IA / One Zone-IA via lifecycle.'],
      ['Versioning', 'Keeps all versions; protects against overwrite and accidental delete (delete creates a delete marker). Once enabled can only be suspended. Required for replication.'],
      ['MFA Delete', 'Requires MFA to permanently delete a version or change versioning state. Only the root user can enable it (CLI).'],
      ['S3 Storage Lens / Storage Class Analysis', 'Analyze usage and access patterns to choose lifecycle transitions.']
    ]},
    { h: 'Security and access control', i: [
      ['IAM policies', 'Identity-based: what a user/role can do in S3.'],
      ['Bucket policies', 'Resource-based JSON: grant cross-account access, enforce encryption (deny if no SSE header), enforce TLS (aws:SecureTransport), restrict by VPC endpoint (aws:sourceVpce) or IP.'],
      ['Block Public Access', 'Account and bucket level settings that override any policy/ACL making data public. On by default.'],
      ['ACLs / Object Ownership', 'Legacy. Default "Bucket owner enforced" disables ACLs; use policies instead.'],
      ['Pre-signed URLs', 'Time-limited URL granting the signer\'s permissions to GET or PUT a specific object. Uploads/downloads without making bucket public.'],
      ['S3 Access Points', 'Named endpoints with their own policies per application/team; can be restricted to a VPC. Simplify large shared buckets.'],
      ['Object Lambda', 'Transform data on GET with a Lambda (redact PII, resize) without storing copies.'],
      ['Object Lock', 'WORM. Compliance mode: nobody (not even root) can delete/shorten retention. Governance mode: users with special permission can override. Legal hold: indefinite until removed. Needs versioning.'],
      ['Glacier Vault Lock', 'WORM policy on a Glacier vault; once locked cannot be changed.']
    ]},
    { h: 'Encryption', i: [
      ['SSE-S3', 'Default for all new objects. AES-256 keys managed by S3. Header x-amz-server-side-encryption: AES256.'],
      ['SSE-KMS', 'Keys in KMS: audit key usage in CloudTrail, control with key policies, separation of duties. Counts against KMS request quotas (use S3 Bucket Keys to reduce KMS calls and cost).'],
      ['DSSE-KMS', 'Dual-layer server-side encryption for strict compliance.'],
      ['SSE-C', 'You supply the key with every request over HTTPS; AWS does not store it.'],
      ['Client-side encryption', 'Encrypt before upload; you manage keys and process.'],
      ['In transit', 'HTTPS endpoints; enforce with bucket policy condition aws:SecureTransport = false -> Deny.']
    ]},
    { h: 'Replication', i: [
      ['CRR and SRR', 'Cross-Region Replication (compliance, lower latency, DR) and Same-Region Replication (log aggregation, prod/test sync). Asynchronous; versioning on both buckets; IAM role required.'],
      ['What is replicated', 'Only new objects after enabling. Use S3 Batch Replication for existing objects and failed replications. Delete markers optional; version deletes are not replicated. No chaining.'],
      ['Replication Time Control (RTC)', '99.99% of objects replicated within 15 minutes with SLA and metrics.'],
      ['Multi-Region Access Points', 'Single global endpoint routing to the nearest bucket replica with failover.']
    ]},
    { h: 'Performance', i: [
      ['Request rates', '3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD per second per prefix. Spread keys across prefixes to scale.'],
      ['Multipart upload', 'Parallel parts, retry failed parts. Recommended > 100 MB, required > 5 GB.'],
      ['Transfer Acceleration', 'Upload via the nearest CloudFront edge location over the AWS backbone. For long-distance uploads to a bucket.'],
      ['Byte-range fetches', 'Parallel GETs of parts of an object; retrieve only part of a file.'],
      ['S3 Select / Glacier Select', 'Server-side SQL filtering of CSV/JSON/Parquet to retrieve a subset (Athena is preferred for broad querying).'],
      ['KMS limits', 'SSE-KMS adds KMS API calls per object; heavy workloads can hit KMS quotas -> enable S3 Bucket Keys.']
    ]},
    { h: 'Events, analytics and other features', i: [
      ['Event notifications', 'On object created/removed/restored etc. to SNS, SQS, Lambda, or EventBridge (advanced filtering, many targets, archive/replay).'],
      ['Requester Pays', 'Requester pays request and data transfer costs instead of bucket owner.'],
      ['S3 Inventory', 'Daily/weekly CSV/ORC/Parquet listing of objects and metadata (encryption, replication status) for audits.'],
      ['S3 Batch Operations', 'Run an operation on billions of objects: copy, restore from Glacier, replace tags, invoke Lambda, encrypt unencrypted objects.'],
      ['Server access logs / CloudTrail data events', 'Audit requests. Never log to the same bucket (logging loop).'],
      ['Gateway VPC endpoint', 'Private, free access from a VPC to S3 without NAT or internet.']
    ]}
  ],
  tips: [
    'Unknown access pattern -> Intelligent-Tiering. Infrequent but instant -> Standard-IA. Re-creatable and infrequent -> One Zone-IA.',
    'Archive with ms retrieval -> Glacier Instant Retrieval. Hours OK -> Flexible Retrieval. Cheapest, 12-48 h OK -> Deep Archive.',
    'Users upload directly without credentials -> pre-signed URL. Private content via CDN -> CloudFront with OAC + signed URLs/cookies.',
    'Cannot be deleted by anyone including root for N years -> Object Lock in compliance mode.',
    'Audit who used the encryption key -> SSE-KMS (CloudTrail logs KMS calls).',
    'Faster long-distance uploads -> Transfer Acceleration (+ multipart).',
    'Replicate existing objects -> S3 Batch Replication; CRR only replicates new objects.',
    'Private S3 access from a VPC with no internet and no cost -> gateway endpoint.'
  ],
  q: [
    { q: 'A company stores log files that are accessed frequently for 30 days, rarely accessed afterwards but must be retrievable within milliseconds for 1 year, and then deleted. What is the MOST cost-effective solution?', o: ['Keep objects in S3 Standard and delete after 365 days', 'Lifecycle: Standard -> Standard-IA after 30 days, expire after 365 days', 'Lifecycle: Standard -> Glacier Deep Archive after 30 days, expire after 365 days', 'Store in S3 One Zone-IA from day one'], a: 1, e: 'Standard-IA provides ms retrieval at lower storage cost for infrequent access; lifecycle expiration deletes after a year. Deep Archive retrieval takes hours.', d: 4 },
    { q: 'A company needs to store regulatory records that must not be deleted or modified by any user, including the root user, for 7 years. What should be used?', o: ['S3 Versioning with MFA Delete', 'S3 Object Lock in governance mode', 'S3 Object Lock in compliance mode', 'A bucket policy denying s3:DeleteObject'], a: 2, e: 'Compliance mode prevents anyone, including root, from deleting or shortening retention.', d: 1 },
    { q: 'Users of a mobile app must upload images directly to a private S3 bucket without having AWS credentials. What is the MOST secure solution?', o: ['Make the bucket public-write', 'Generate pre-signed URLs from the backend for each upload', 'Embed IAM user keys in the app', 'Enable Transfer Acceleration'], a: 1, e: 'Pre-signed URLs grant time-limited permission to PUT a specific object without exposing credentials.', d: 1 },
    { q: 'A data set has unpredictable access patterns: some objects are read daily, others not for months. The company wants to minimize cost without operational effort. Which storage class is BEST?', o: ['S3 Standard', 'S3 Standard-IA', 'S3 Intelligent-Tiering', 'S3 Glacier Instant Retrieval'], a: 2, e: 'Intelligent-Tiering automatically moves objects between access tiers with no retrieval fees.', d: 4 },
    { q: 'A company enabled Cross-Region Replication on a bucket containing 10 million existing objects. Only new objects are being replicated. How can existing objects be replicated?', o: ['Disable and re-enable versioning', 'Use S3 Batch Replication', 'Enable Transfer Acceleration', 'Use S3 Select'], a: 1, e: 'Replication rules apply to new objects only. S3 Batch Replication replicates existing objects and retries failed ones.', d: 2 },
    { q: 'Security requires that all S3 encryption key usage be auditable and that keys can be disabled by the security team. Which encryption option should be used?', o: ['SSE-S3', 'SSE-KMS with a customer managed key', 'SSE-C', 'No encryption, use HTTPS'], a: 1, e: 'SSE-KMS with customer managed keys gives key policy control, ability to disable, and CloudTrail logging of every key use.', d: 1 },
    { q: 'Users worldwide upload large files (several GB) to a single S3 bucket in us-east-1 and complain of slow uploads. Which combination improves performance? (Choose TWO)', o: ['Enable S3 Transfer Acceleration', 'Use multipart uploads', 'Change storage class to One Zone-IA', 'Enable versioning', 'Use S3 Select'], a: [0, 1], e: 'Transfer Acceleration uses edge locations and the AWS backbone; multipart upload parallelizes parts and allows retrying individual parts.', d: 3 },
    { q: 'An application in private subnets needs to access S3 without traversing the internet and without NAT gateway data processing charges. What should be used?', o: ['Internet gateway', 'S3 gateway VPC endpoint', 'VPN connection', 'NAT instance'], a: 1, e: 'Gateway endpoints for S3 are free and route traffic privately via the route table.', d: 4 },
    { q: 'An application writes a high volume of objects to S3 using SSE-KMS and is receiving throttling errors from KMS. What is the BEST fix?', o: ['Switch to SSE-C', 'Enable S3 Bucket Keys', 'Use more prefixes', 'Enable Requester Pays'], a: 1, e: 'S3 Bucket Keys generate a bucket-level data key, drastically reducing calls to KMS and the associated cost and throttling.', d: 3 },
    { q: 'A company must archive data for 10 years at the lowest possible cost. Retrieval within 48 hours is acceptable. Which storage class should be used?', o: ['S3 Glacier Flexible Retrieval', 'S3 Glacier Deep Archive', 'S3 Standard-IA', 'S3 Glacier Instant Retrieval'], a: 1, e: 'Deep Archive is the cheapest class, with retrieval in 12 hours (standard) or 48 hours (bulk).', d: 4 }
  ]
});

svc({
  id: 'ebs', name: 'Amazon EBS & Instance Store', cat: 'storage', imp: 3,
  tag: 'Block storage for EC2: volume types, snapshots, encryption, Multi-Attach and when to use instance store instead.',
  s: [
    { h: 'Fundamentals', i: [
      ['What', 'Network-attached block volumes for EC2. Bound to a single AZ; persists independently of instance lifetime.'],
      ['Attachment', 'Normally one instance at a time (except io1/io2 Multi-Attach). An instance can have many volumes.'],
      ['Delete on termination', 'Root volume deleted by default on terminate; additional volumes kept by default. Configurable.'],
      ['Moving across AZ/region', 'Snapshot -> create volume in another AZ, or copy snapshot to another region.'],
      ['Durability', 'Replicated within its AZ; 99.8-99.9% durability (io2: 99.999%).']
    ]},
    { h: 'Volume types', i: [
      ['gp3 (General Purpose SSD)', 'Default choice. Baseline 3,000 IOPS and 125 MiB/s regardless of size; provision IOPS and throughput independently (exam figures up to 16,000 IOPS / 1,000 MiB/s). Cheaper than gp2.'],
      ['gp2', 'Older; IOPS tied to size (3 IOPS/GB, burst to 3,000). Migrate to gp3 to save cost.'],
      ['io2 Block Express / io1 (Provisioned IOPS SSD)', 'Mission-critical, sustained high IOPS, sub-ms latency databases. io2 Block Express up to 256,000 IOPS and 64 TiB. Supports Multi-Attach.'],
      ['st1 (Throughput Optimized HDD)', 'Big data, data warehouses, log processing: large sequential I/O, up to 500 MiB/s. Cannot be a boot volume.'],
      ['sc1 (Cold HDD)', 'Lowest cost, infrequently accessed large data. Cannot be a boot volume.'],
      ['Boot volumes', 'Only SSD types (gp2/gp3/io1/io2) can be boot volumes.']
    ]},
    { h: 'Snapshots', i: [
      ['Incremental', 'Point-in-time backups stored in S3 (managed); only changed blocks are saved after the first.'],
      ['Data Lifecycle Manager (DLM)', 'Automate snapshot and AMI creation, retention and cross-region copy. AWS Backup is the broader alternative.'],
      ['Snapshot Archive', '75% cheaper tier; restore takes 24-72 hours.'],
      ['Recycle Bin', 'Retention rules to recover accidentally deleted snapshots and AMIs.'],
      ['Fast Snapshot Restore (FSR)', 'Volumes created from snapshot are fully initialized immediately, no first-read latency. Costly.'],
      ['Sharing', 'Share snapshots with other accounts (encrypted ones need KMS key access).']
    ]},
    { h: 'Encryption', i: [
      ['What it covers', 'Data at rest, data in transit between instance and volume, snapshots and volumes created from them. Uses KMS (AES-256), minimal latency impact.'],
      ['Encryption by default', 'Account/region setting to encrypt all new volumes.'],
      ['Encrypt an existing unencrypted volume', 'Snapshot -> copy snapshot with encryption enabled -> create volume from encrypted snapshot -> attach.'],
      ['Multi-Attach', 'io1/io2 attached to up to 16 Nitro instances in the same AZ; requires a cluster-aware file system.']
    ]},
    { h: 'Instance store vs EBS vs EFS', i: [
      ['Instance store', 'Ephemeral, physically attached, millions of IOPS. Lost on stop/terminate. Caches, buffers, temp data, replicated clusters.'],
      ['EBS', 'Persistent block storage for one instance in one AZ. Databases, boot volumes.'],
      ['EFS', 'Shared file system for many Linux instances across AZs.'],
      ['RAID', 'RAID 0 across EBS volumes for more IOPS/throughput (no redundancy). RAID 1 for mirroring (rarely needed).']
    ]}
  ],
  tips: [
    'Default general purpose block storage -> gp3. Highest sustained IOPS / mission-critical DB -> io2 Block Express.',
    'Sequential big data at low cost -> st1. Coldest/cheapest HDD -> sc1. HDDs cannot boot.',
    'Encrypt an existing unencrypted volume -> snapshot, copy with encryption, restore.',
    'Shared block volume for a clustered app in one AZ -> io2 Multi-Attach. Shared file storage across AZs -> EFS.',
    'EBS is AZ-locked: use snapshots to move it.'
  ],
  q: [
    { q: 'A company needs to encrypt an existing unencrypted EBS volume attached to a production instance. What is the correct process?', o: ['Enable encryption on the volume directly', 'Create a snapshot, copy it with encryption enabled, create a new volume from the encrypted snapshot, and attach it', 'Enable EBS encryption by default; existing volumes are encrypted automatically', 'Use SSE-S3'], a: 1, e: 'Existing volumes cannot be encrypted in place; use an encrypted snapshot copy to create a new encrypted volume.', d: 1 },
    { q: 'A database requires 100,000 sustained IOPS with sub-millisecond latency. Which EBS volume type should be used?', o: ['gp3', 'st1', 'io2 Block Express', 'sc1'], a: 2, e: 'io2 Block Express supports up to 256,000 IOPS with consistent sub-ms latency.', d: 3 },
    { q: 'A log processing workload needs high sequential throughput at the lowest cost for a non-boot volume. Which volume type should be used?', o: ['st1', 'io1', 'gp3', 'sc1'], a: 0, e: 'Throughput Optimized HDD (st1) is built for large sequential workloads like log processing at low cost. sc1 is for cold, infrequent data.', d: 4 },
    { q: 'An application needs temporary scratch storage with the highest possible IOPS. Data loss on instance stop is acceptable. What should be used?', o: ['EBS io2', 'Instance store', 'Amazon EFS Max I/O', 'Amazon S3'], a: 1, e: 'Instance store provides the highest IOPS as locally attached NVMe, but is ephemeral.', d: 3 },
    { q: 'A company wants to reduce the cost of many gp2 volumes without reducing performance. What should be done?', o: ['Migrate to gp3 volumes', 'Migrate to io2 volumes', 'Migrate to sc1', 'Increase volume size'], a: 0, e: 'gp3 is about 20% cheaper per GB than gp2 and provides a 3,000 IOPS baseline independent of size.', d: 4 },
    { q: 'An EC2 instance in us-east-1a must have its data volume made available to an instance in us-east-1b. What should be done?', o: ['Detach and attach the volume in us-east-1b', 'Create a snapshot and create a new volume from it in us-east-1b', 'Enable Multi-Attach', 'Use S3 Transfer Acceleration'], a: 1, e: 'EBS volumes are bound to an AZ. Snapshots are regional and can create volumes in any AZ of the region.', d: 2 }
  ]
});

svc({
  id: 'efs', name: 'Amazon EFS', cat: 'storage', imp: 3,
  tag: 'Managed, elastic NFS file system for Linux, shared across thousands of clients and multiple AZs.',
  s: [
    { h: 'Fundamentals', i: [
      ['What', 'Serverless NFSv4.1 file system that grows and shrinks automatically. Pay per GB used. Linux only (POSIX), not Windows.'],
      ['Access', 'Mount targets (one per AZ) in your VPC subnets, controlled by security groups (NFS port 2049). Accessible from EC2, ECS, EKS, Fargate, Lambda and on-prem via DX/VPN.'],
      ['Regional vs One Zone', 'Regional (Standard): data stored across multiple AZs. One Zone: single AZ, cheaper, for dev or re-creatable data.'],
      ['Concurrency', 'Thousands of concurrent clients reading/writing the same files.']
    ]},
    { h: 'Performance', i: [
      ['Performance modes', 'General Purpose (default, lowest latency: web serving, CMS, home dirs). Max I/O (legacy, higher aggregate throughput, higher latency, for highly parallel big data).'],
      ['Throughput modes', 'Elastic (recommended, scales automatically, pay for usage, spiky workloads). Provisioned (fixed throughput independent of size). Bursting (scales with storage size, burst credits).']
    ]},
    { h: 'Storage classes and lifecycle', i: [
      ['Standard', 'Frequently accessed files.'],
      ['Infrequent Access (IA)', 'Lower storage cost, retrieval fee.'],
      ['Archive', 'Rarely accessed (a few times per year), lowest cost.'],
      ['Lifecycle management', 'Move files not accessed for N days to IA/Archive; optionally move back on first access. Large savings (up to ~90%).']
    ]},
    { h: 'Security and protection', i: [
      ['Encryption', 'At rest with KMS (set at creation), in transit with TLS via the EFS mount helper.'],
      ['Access points', 'Application-specific entry points enforcing a POSIX user/group and root directory; combine with IAM authorization.'],
      ['Backup and replication', 'AWS Backup integration; EFS Replication to another region or AZ (RPO minutes).']
    ]}
  ],
  tips: [
    'Shared file storage for many Linux instances across AZs -> EFS.',
    'Windows shared file storage (SMB, AD) -> FSx for Windows, not EFS.',
    'Reduce EFS cost for rarely used files -> lifecycle to IA / Archive.',
    'Spiky, unpredictable throughput -> Elastic throughput mode.'
  ],
  q: [
    { q: 'A fleet of Linux EC2 instances in an Auto Scaling group across three AZs must share a common file system for user uploads. Which service should be used?', o: ['Amazon EBS Multi-Attach', 'Amazon EFS', 'Amazon FSx for Windows File Server', 'Instance store'], a: 1, e: 'EFS is a multi-AZ NFS file system that many Linux instances can mount simultaneously.', d: 2 },
    { q: 'An EFS file system stores many files that are rarely accessed after 60 days. How can cost be reduced with minimal effort?', o: ['Move files manually to S3', 'Enable EFS lifecycle management to transition files to Infrequent Access/Archive', 'Switch to Max I/O performance mode', 'Use Provisioned throughput'], a: 1, e: 'Lifecycle policies automatically move files not accessed for a set period into cheaper storage classes.', d: 4 },
    { q: 'A workload on EFS has unpredictable spiky throughput needs. Which throughput mode should be used to avoid throttling while paying for what is used?', o: ['Bursting', 'Provisioned', 'Elastic', 'Max I/O'], a: 2, e: 'Elastic throughput automatically scales throughput up and down to match demand and you pay for usage.', d: 3 },
    { q: 'Multiple containerized applications share one EFS file system. Each must be confined to its own directory with a specific POSIX identity. What should be used?', o: ['Separate security groups', 'EFS access points', 'S3 access points', 'EFS One Zone'], a: 1, e: 'EFS access points enforce a root directory and POSIX user/group per application.', d: 1 }
  ]
});

svc({
  id: 'fsx', name: 'Amazon FSx', cat: 'storage', imp: 2,
  tag: 'Fully managed third-party file systems: Windows File Server, Lustre, NetApp ONTAP, OpenZFS.',
  s: [
    { h: 'FSx for Windows File Server', i: [
      ['What', 'Managed Windows native file system over SMB with NTFS, integrated with Microsoft Active Directory (AWS Managed AD or self-managed).'],
      ['Features', 'DFS namespaces, Windows ACLs, shadow copies, data deduplication, user quotas. Can be mounted from Linux too.'],
      ['Deployment', 'Single-AZ or Multi-AZ (active/standby across AZs). SSD or HDD storage.'],
      ['Use cases', 'Lift-and-shift Windows file shares, SharePoint, SQL Server, home directories.']
    ]},
    { h: 'FSx for Lustre', i: [
      ['What', 'High-performance parallel file system for HPC, ML training, video processing, financial modeling. Hundreds of GB/s, millions of IOPS, sub-ms latency.'],
      ['S3 integration', 'Link to an S3 bucket: S3 objects appear as files; lazy loading; write results back to S3.'],
      ['Scratch vs Persistent', 'Scratch: temporary, no replication, highest burst, cheapest (short jobs). Persistent: long-term, replicated within AZ.'],
      ['Linux only', 'Lustre client on Linux.']
    ]},
    { h: 'FSx for NetApp ONTAP', i: [
      ['What', 'Managed NetApp ONTAP: NFS, SMB and iSCSI simultaneously (multi-protocol), Linux, Windows and macOS.'],
      ['Features', 'Snapshots, SnapMirror replication, FlexClone instant clones, deduplication and compression, automatic tiering to capacity pool.'],
      ['Use case', 'Migrate existing NetApp workloads, multi-protocol access.']
    ]},
    { h: 'FSx for OpenZFS', i: [
      ['What', 'Managed OpenZFS over NFS. Up to 1M IOPS, low latency, snapshots, instant clones.'],
      ['Use case', 'Migrate ZFS/Linux NFS workloads.']
    ]}
  ],
  tips: [
    'Windows + SMB + Active Directory -> FSx for Windows File Server.',
    'HPC / ML training needing parallel high throughput, often with S3 data -> FSx for Lustre (scratch for short-lived jobs).',
    'Multi-protocol NFS + SMB + iSCSI or existing NetApp -> FSx for NetApp ONTAP.',
    'Existing ZFS -> FSx for OpenZFS.'
  ],
  q: [
    { q: 'A company is migrating Windows-based applications that use SMB file shares with Active Directory permissions. Which storage service should be used?', o: ['Amazon EFS', 'Amazon FSx for Windows File Server', 'Amazon FSx for Lustre', 'Amazon S3 File Gateway'], a: 1, e: 'FSx for Windows File Server provides native SMB, NTFS ACLs and AD integration.', d: 3 },
    { q: 'A genomics company runs short-lived HPC jobs that read input data from S3 and need extremely high throughput. Data does not need to persist after the job. Which solution is MOST cost-effective?', o: ['FSx for Lustre scratch file system linked to S3', 'FSx for Lustre persistent file system', 'Amazon EFS Max I/O', 'EBS io2 volumes'], a: 0, e: 'Scratch Lustre file systems are cheapest for temporary high-performance processing and integrate with S3.', d: 4 },
    { q: 'An application requires concurrent access to the same data using NFS from Linux clients and SMB from Windows clients. Which service fits best?', o: ['FSx for NetApp ONTAP', 'Amazon EFS', 'FSx for Lustre', 'FSx for OpenZFS'], a: 0, e: 'ONTAP supports NFS, SMB and iSCSI multi-protocol access.', d: 3 },
    { q: 'A Windows file share on FSx must remain available if an AZ fails. What should be configured?', o: ['Single-AZ deployment with backups', 'Multi-AZ deployment', 'DFS replication to S3', 'FSx for Lustre persistent'], a: 1, e: 'Multi-AZ FSx for Windows maintains a standby in another AZ with automatic failover.', d: 2 }
  ]
});

svc({
  id: 'storage-gateway', name: 'AWS Storage Gateway', cat: 'storage', imp: 2,
  tag: 'Hybrid storage: give on-premises apps access to cloud storage via file, volume and tape interfaces.',
  s: [
    { h: 'Gateway types', i: [
      ['S3 File Gateway', 'NFS/SMB file shares on premises; files stored as objects in S3 (any class via lifecycle). Local cache for recent data. AD integration for SMB.'],
      ['FSx File Gateway', 'Low-latency on-prem cache for FSx for Windows File Server shares (being phased out for new customers; know the concept).'],
      ['Volume Gateway - Cached', 'iSCSI block volumes; primary data in S3, frequently accessed data cached locally. Low on-prem footprint.'],
      ['Volume Gateway - Stored', 'iSCSI; full dataset on premises, asynchronously backed up to S3 as EBS snapshots. Low-latency access to all data.'],
      ['Tape Gateway', 'Virtual tape library (iSCSI VTL) for existing backup software (Veeam, NetBackup); tapes stored in S3 and archived to Glacier / Deep Archive.']
    ]},
    { h: 'Deployment', i: [
      ['Form factor', 'VM on VMware/Hyper-V/KVM, or EC2, or hardware appliance (ordered from AWS).'],
      ['Connectivity', 'Over internet, VPN or Direct Connect; can use VPC endpoint.'],
      ['Use cases', 'Hybrid file shares, backup to cloud, tiered storage, disaster recovery, replacing physical tape.']
    ]}
  ],
  tips: [
    'On-prem apps need NFS/SMB backed by S3 -> S3 File Gateway.',
    'Replace physical tape library with no change to backup software -> Tape Gateway.',
    'iSCSI, keep only hot data locally -> Volume Gateway cached; need all data locally with cloud backup -> stored.',
    'One-time bulk migration of data -> DataSync or Snowball, not Storage Gateway.'
  ],
  q: [
    { q: 'A company wants to replace its on-premises physical tape library with cloud storage without changing its existing backup software. Which solution should be used?', o: ['S3 File Gateway', 'Tape Gateway', 'Volume Gateway stored mode', 'AWS DataSync'], a: 1, e: 'Tape Gateway presents a virtual tape library that existing backup software uses, storing tapes in S3/Glacier.', d: 4 },
    { q: 'On-premises applications need NFS access to files that should be stored durably in Amazon S3 with frequently accessed files cached locally. Which service fits?', o: ['S3 File Gateway', 'Volume Gateway cached', 'FSx for Lustre', 'Amazon EFS'], a: 0, e: 'S3 File Gateway exposes NFS/SMB shares backed by S3 objects with a local cache.', d: 3 },
    { q: 'An on-premises application needs low-latency access to its entire 20 TB dataset over iSCSI while asynchronously backing it up to AWS. Which configuration is correct?', o: ['Volume Gateway in cached mode', 'Volume Gateway in stored mode', 'Tape Gateway', 'S3 File Gateway'], a: 1, e: 'Stored volumes keep the full dataset locally and back up point-in-time snapshots to AWS.', d: 2 }
  ]
});

svc({
  id: 'backup', name: 'AWS Backup', cat: 'storage', imp: 2,
  tag: 'Centralized, policy-based backup across AWS services and accounts, with vault lock for immutability.',
  s: [
    { h: 'Concepts', i: [
      ['Supported resources', 'EC2, EBS, S3, RDS, Aurora, DynamoDB, DocumentDB, Neptune, EFS, FSx, Storage Gateway volumes, VMware/on-prem VMs and more.'],
      ['Backup plan', 'Rules: frequency (cron), backup window, lifecycle (cold storage transition, retention), copy to other regions/accounts.'],
      ['Resource assignment', 'Select resources by tags or ARNs.'],
      ['Backup vault', 'Encrypted container for recovery points (KMS).'],
      ['Point-in-time recovery', 'Continuous backups for supported services (RDS, S3, Aurora).']
    ]},
    { h: 'Governance', i: [
      ['Vault Lock', 'WORM protection: recovery points cannot be deleted or retention shortened, even by root (compliance mode). Protects against ransomware and malicious deletion.'],
      ['Cross-account / Organizations', 'Central backup policies across the organization; copy backups to a separate backup account.'],
      ['Backup Audit Manager', 'Audit and report on backup compliance against controls.'],
      ['Restore testing', 'Automated periodic restore tests to validate recoverability.']
    ]}
  ],
  tips: [
    'Centralize and automate backups across many services and accounts -> AWS Backup.',
    'Backups must be immutable / ransomware-proof -> AWS Backup Vault Lock (compliance mode).',
    'Cross-region DR copies of backups -> backup plan copy rule.'
  ],
  q: [
    { q: 'A company needs a single solution to automate backups of EC2, RDS, DynamoDB and EFS across multiple accounts with centrally defined retention. What should be used?', o: ['Amazon Data Lifecycle Manager', 'AWS Backup with AWS Organizations backup policies', 'Custom Lambda scripts', 'S3 lifecycle policies'], a: 1, e: 'AWS Backup centrally manages backup plans across services and accounts via Organizations.', d: 2 },
    { q: 'To protect against ransomware, backups must not be deletable by anyone, including administrators, during the retention period. What should be used?', o: ['IAM deny policy on the backup vault', 'AWS Backup Vault Lock in compliance mode', 'S3 versioning', 'Encrypting backups with KMS'], a: 1, e: 'Vault Lock in compliance mode enforces WORM retention that cannot be changed, even by root.', d: 1 },
    { q: 'A company wants a copy of every nightly backup stored in a different Region for disaster recovery with minimal effort. What should be configured?', o: ['A copy rule in the AWS Backup plan', 'Manual snapshot copies each night', 'S3 Same-Region Replication', 'Multi-AZ on every database'], a: 0, e: 'AWS Backup plans support automatic cross-region (and cross-account) copy rules.', d: 2 }
  ]
});
