# SAA-C03 Cheat Sheet

[Back to index](README.md)

## Exam strategy

1. The exam has 65 questions (50 scored, 15 unscored) in 130 minutes: about 2 minutes per question. Passing score is 720 / 1000.
2. Read the LAST sentence first: it tells you what is being optimized (cost, performance, availability, security, least operational overhead).
3. Underline constraints: "minimal downtime", "without code changes", "most cost-effective", "in the shortest time", "highly available", "least privilege".
4. Eliminate options that are technically wrong first (e.g. WAF on NLB, Lambda > 15 min, CNAME at zone apex, SQS for ordering without FIFO).
5. Between two working answers, pick the managed / serverless / native AWS feature over custom scripts or EC2-based solutions.
6. "Highly available" means Multi-AZ. "Disaster recovery" usually means multi-region.
7. Security answers: IAM roles over keys, least privilege, encryption with KMS, private subnets, VPC endpoints, no public access.
8. Cost answers: right-size, Spot for fault-tolerant, Savings Plans for steady, lifecycle to cheaper storage, delete unused resources, gateway endpoints.
9. Multiple response questions state how many to choose. Each option is independently true/false for the scenario.
10. Flag long or uncertain questions, answer everything (no penalty for guessing), then come back.
11. Beware of answers that are true statements but do not address the requirement.
12. If two options differ only in one service, focus on that difference and the keyword it matches.

## If the question says... pick

| Keyword | Answer |
| --- | --- |
| "Least operational overhead" | **Managed or serverless service (Lambda, Fargate, DynamoDB, Aurora Serverless, S3)** |
| "Decouple" / "buffer" / "spiky writes" | **SQS** |
| "Fan-out" / "multiple subscribers" | **SNS (+ SQS)** |
| "Real-time streaming" / "replay" | **Kinesis Data Streams** |
| "Load streaming data into S3/Redshift" | **Data Firehose** |
| "Orchestrate" / "workflow" / "human approval" | **Step Functions** |
| "Serverless cron" | **EventBridge Scheduler + Lambda** |
| "Ad-hoc SQL on S3" | **Athena** |
| "Data warehouse" / "OLAP" / "BI" | **Redshift (+ QuickSight)** |
| "Full-text search" | **OpenSearch** |
| "Graph" / "relationships" | **Neptune** |
| "MongoDB" | **DocumentDB** |
| "Cassandra" | **Keyspaces** |
| "Time series" / "IoT metrics" | **Timestream** |
| "Microsecond latency for DynamoDB" | **DAX** |
| "Session state" / "cache DB reads" | **ElastiCache** |
| "Global relational DB, < 1 s replication" | **Aurora Global Database** |
| "Multi-region active-active NoSQL" | **DynamoDB global tables** |
| "Unpredictable DB workload" | **Aurora Serverless v2 / DynamoDB on-demand** |
| "Too many DB connections from Lambda" | **RDS Proxy** |
| "Rotate DB credentials automatically" | **Secrets Manager** |
| "Shared file system Linux" | **EFS** |
| "Windows file share / SMB / AD" | **FSx for Windows File Server** |
| "HPC file system" | **FSx for Lustre** |
| "On-prem app needs cloud storage via NFS/SMB" | **S3 File Gateway** |
| "Replace tape library" | **Tape Gateway** |
| "Move petabytes offline" | **Snowball Edge** |
| "Online transfer / sync NFS to S3" | **DataSync** |
| "SFTP into S3" | **Transfer Family** |
| "Lift and shift servers" | **Application Migration Service (MGN)** |
| "Migrate database with minimal downtime" | **DMS (+ SCT if different engines)** |
| "Static IP for global app" / "UDP global" | **Global Accelerator** |
| "Cache content globally" | **CloudFront** |
| "S3 only via CloudFront" | **Origin Access Control (OAC)** |
| "Restrict by country" | **CloudFront geo restriction / Route 53 geolocation / WAF geo match** |
| "SQL injection / XSS" | **AWS WAF** |
| "DDoS + response team + cost protection" | **Shield Advanced** |
| "Central firewall rules across accounts" | **Firewall Manager** |
| "Threat detection from logs" | **GuardDuty** |
| "Vulnerability scanning EC2/ECR/Lambda" | **Inspector** |
| "PII in S3" | **Macie** |
| "Who made this API call" | **CloudTrail** |
| "Configuration history / compliance" | **Config** |
| "Restrict member accounts / regions" | **SCP (Organizations)** |
| "Access for all accounts in org" | **aws:PrincipalOrgID condition** |
| "Cross-account access" | **IAM role with trust policy (External ID for third parties)** |
| "Temporary credentials for mobile users" | **Cognito identity pool** |
| "App sign-up / sign-in" | **Cognito user pool** |
| "Workforce SSO to many accounts" | **IAM Identity Center** |
| "Private access to S3/DynamoDB from VPC, free" | **Gateway VPC endpoint** |
| "Expose service to many VPCs privately" | **PrivateLink (NLB + endpoint service)** |
| "Connect many VPCs + on-prem" | **Transit Gateway** |
| "Private dedicated connection" | **Direct Connect (+ VPN for encryption/backup)** |
| "Shell access without SSH/bastion" | **SSM Session Manager** |
| "Memory/disk metrics on EC2" | **CloudWatch agent** |
| "Cannot delete for N years, even root" | **S3 Object Lock compliance mode / Backup Vault Lock** |
| "Uploads without credentials" | **S3 pre-signed URL** |
| "Lowest latency between instances" | **Cluster placement group (+ EFA)** |
| "Interruptible / fault-tolerant / cheapest" | **Spot Instances** |
| "BYOL per socket/core" | **Dedicated Hosts** |
| "Alert on forecasted spend" | **AWS Budgets** |
| "Right-size resources" | **Compute Optimizer** |

## Storage options

| Service | Type | Scope | Access | Best for |
| --- | --- | --- | --- | --- |
| S3 | Object | Regional (multi-AZ) | HTTP API, many clients | Static content, data lakes, backups, archives |
| EBS | Block | Single AZ | One instance (io1/io2 Multi-Attach) | Boot volumes, databases on EC2 |
| Instance store | Block (ephemeral) | Host | One instance | Cache, scratch, buffers, highest IOPS |
| EFS | File (NFS) | Regional (multi-AZ) | Thousands of Linux clients | Shared Linux files, containers, CMS |
| FSx for Windows | File (SMB) | Single or Multi-AZ | Windows clients, AD | Windows shares, SQL Server, SharePoint |
| FSx for Lustre | Parallel file | Single AZ | Linux HPC clients | HPC, ML training, S3-linked processing |
| FSx for ONTAP | File + block | Single or Multi-AZ | NFS, SMB, iSCSI | NetApp migrations, multi-protocol |

## S3 storage classes

| Class | AZs | Min duration | Retrieval | Use |
| --- | --- | --- | --- | --- |
| Standard | 3+ | None | ms, no fee | Frequently accessed |
| Intelligent-Tiering | 3+ | None | ms, no fee (archive tiers optional) | Unknown or changing access |
| Standard-IA | 3+ | 30 days | ms, per-GB fee | Infrequent, needs fast access |
| One Zone-IA | 1 | 30 days | ms, per-GB fee | Re-creatable infrequent data |
| Glacier Instant Retrieval | 3+ | 90 days | ms | Archive accessed quarterly |
| Glacier Flexible Retrieval | 3+ | 90 days | 1-5 min / 3-5 h / 5-12 h | Archive, occasional restore |
| Glacier Deep Archive | 3+ | 180 days | 12 h / 48 h | Long-term compliance, tape replacement |
| Express One Zone | 1 | None | Single-digit ms | Ultra-low latency hot data |

## Messaging and streaming

| Service | Model | Ordering | Persistence / replay | Pick when |
| --- | --- | --- | --- | --- |
| SQS Standard | Queue (pull) | Best effort | Up to 14 days, deleted after processing | Decouple, buffer, max throughput |
| SQS FIFO | Queue (pull) | Strict per group | Up to 14 days | Ordering + exactly-once |
| SNS | Pub/sub (push) | FIFO topics only | No (retries only) | Fan-out, notifications, email/SMS |
| EventBridge | Event bus (push) | No | Archive and replay | AWS/SaaS events, content routing, schedules |
| Kinesis Data Streams | Stream (pull) | Per shard | 24 h - 365 days, replay | Real-time analytics, multiple consumers |
| Data Firehose | Delivery | No | No | Load streams into S3/Redshift/OpenSearch |
| Amazon MQ | Broker | Yes | Yes | Migrate JMS/AMQP/MQTT apps |
| Amazon MSK | Kafka | Per partition | Configurable | Existing Kafka workloads |

## Load balancers

| Type | Layer | Protocols | Static IP | Key features |
| --- | --- | --- | --- | --- |
| ALB | 7 | HTTP, HTTPS, gRPC, WebSocket | No | Path/host routing, Lambda targets, Cognito auth, WAF |
| NLB | 4 | TCP, UDP, TLS | Yes (EIP per AZ) | Millions rps, source IP preserved, PrivateLink |
| GWLB | 3 | IP (GENEVE 6081) | No | Inline third-party appliances (firewalls, IDS) |
| CLB | 4/7 | HTTP, HTTPS, TCP | No | Legacy - migrate |

## RDS / Aurora availability and scaling

| Feature | Replication | Readable | Purpose |
| --- | --- | --- | --- |
| RDS Multi-AZ instance | Synchronous | No | HA, automatic failover 60-120 s |
| RDS Multi-AZ DB cluster | Semi-synchronous | Yes (2 standbys) | HA with faster failover + reads |
| RDS read replica | Asynchronous | Yes | Read scaling, cross-region DR |
| Aurora replica | Shared storage | Yes (up to 15) | Read scaling and failover < 30 s |
| Aurora Global Database | Storage-level < 1 s | Yes (secondary regions) | Global reads, regional DR (RTO ~1 min) |
| DynamoDB global tables | Async multi-active | Read + write | Multi-region active-active |

## Disaster recovery strategies

| Strategy | RPO | RTO | Cost | What runs in DR |
| --- | --- | --- | --- | --- |
| Backup and restore | Hours | Hours (24 h or less) | $ | Nothing - only backups |
| Pilot light | Minutes | Tens of minutes | $$ | Data replication only (core) |
| Warm standby | Seconds | Minutes | $$$ | Scaled-down full stack |
| Multi-site active-active | Near zero | Near zero | $$$$ | Full production stack |

## Security groups vs network ACLs

| Aspect | Security group | Network ACL |
| --- | --- | --- |
| Level | Instance / ENI | Subnet |
| State | Stateful | Stateless (allow ephemeral ports) |
| Rules | Allow only | Allow and deny |
| Evaluation | All rules | In number order, first match |
| Default | Deny in, allow out | Default NACL allows all; custom denies all |

## Network connectivity

| Option | Connects | Transitive | Notes |
| --- | --- | --- | --- |
| VPC peering | VPC <-> VPC | No | No overlapping CIDRs, cross-account/region |
| Transit Gateway | Many VPCs, VPN, DX | Yes | Hub and spoke, route tables, multicast, ECMP |
| PrivateLink | Consumer VPC -> service (NLB) | N/A | One-way, overlapping CIDRs OK, scales to many consumers |
| Site-to-Site VPN | On-prem <-> VPC/TGW | - | IPsec over internet, minutes to set up, 1.25 Gbps/tunnel |
| Direct Connect | On-prem <-> AWS | - | Private, consistent, weeks to provision, not encrypted by default |
| Client VPN | Users <-> VPC | - | OpenVPN remote access |

## Monitoring and audit

| Service | Answers the question |
| --- | --- |
| CloudWatch | How is it performing? (metrics, logs, alarms) |
| CloudTrail | Who did what, when, from where? (API calls) |
| Config | What did the resource look like, and is it compliant? |
| VPC Flow Logs | What IP traffic was accepted/rejected? |
| X-Ray | Where is latency in my distributed request? |
| GuardDuty | Is something malicious happening? |
| Trusted Advisor | Am I following best practices (cost, security, limits)? |

## CloudFront vs Global Accelerator

| Aspect | CloudFront | Global Accelerator |
| --- | --- | --- |
| Caching | Yes | No |
| Protocols | HTTP/HTTPS, WebSocket | TCP and UDP |
| IPs | Dynamic edge IPs | 2 static anycast IPs |
| Failover | Origin groups | Endpoint health, < 1 min, no DNS caching |
| Use | Static/dynamic web content | Gaming, IoT, VoIP, static IP needs |

## EC2 purchasing options

| Option | Discount | Commitment | Use |
| --- | --- | --- | --- |
| On-Demand | 0% | None | Short, unpredictable, cannot be interrupted |
| Reserved Instances | Up to ~72% | 1 or 3 years | Steady state; Convertible for flexibility |
| Savings Plans | Up to ~72% | 1 or 3 years ($/h) | Compute SP spans EC2, Fargate, Lambda |
| Spot | Up to 90% | None (2-min interruption) | Fault-tolerant, flexible, batch |
| Dedicated Host | - | On-demand or reserved | Socket/core BYOL, compliance |
| Capacity Reservation | 0% (combine with SP) | None | Guaranteed capacity in an AZ |

## Numbers to remember

| Item | Value |
| --- | --- |
| S3 max object size | **5 TB (single PUT 5 GB; multipart recommended > 100 MB)** |
| S3 request rate per prefix | **3,500 writes / 5,500 reads per second** |
| S3 durability | **99.999999999% (11 nines)** |
| S3 Standard-IA / One Zone-IA minimum | **30 days, 128 KB** |
| Glacier IR / Flexible minimum | **90 days** |
| Glacier Deep Archive minimum | **180 days, retrieval 12 h (standard) / 48 h (bulk)** |
| Glacier Flexible retrieval | **Expedited 1-5 min, Standard 3-5 h, Bulk 5-12 h** |
| EBS gp3 baseline | **3,000 IOPS, 125 MiB/s** |
| EBS io2 Block Express max | **256,000 IOPS, 64 TiB** |
| EBS Multi-Attach | **io1/io2, up to 16 instances, same AZ** |
| EC2 Spot interruption notice | **2 minutes** |
| Spread placement group | **7 running instances per AZ per group** |
| Partition placement group | **Up to 7 partitions per AZ** |
| EC2 hibernation | **RAM < 150 GB, up to 60 days** |
| User data limit | **16 KB** |
| Lambda timeout | **15 minutes** |
| Lambda memory | **128 MB - 10,240 MB** |
| Lambda /tmp | **512 MB - 10 GB** |
| Lambda default concurrency | **1,000 per region (soft)** |
| Lambda container image | **Up to 10 GB** |
| API Gateway default throttle | **10,000 rps, 5,000 burst** |
| API Gateway integration timeout | **29 s (default)** |
| API Gateway payload | **10 MB** |
| SQS retention | **4 days default, 1 min - 14 days** |
| SQS visibility timeout | **30 s default, max 12 h** |
| SQS long polling | **Up to 20 s** |
| SQS delay queue | **Up to 15 min** |
| SQS FIFO throughput | **300 msg/s (3,000 with batching); higher with high-throughput mode** |
| SQS / SNS message size | **256 KB (SQS raised to 1 MiB in 2025)** |
| Kinesis shard | **1 MB/s or 1,000 rec/s in; 2 MB/s out** |
| Kinesis retention | **24 h default, up to 365 days** |
| DynamoDB item size | **400 KB** |
| DynamoDB RCU | **1 strong or 2 eventual reads/s of 4 KB** |
| DynamoDB WCU | **1 write/s of 1 KB** |
| DynamoDB indexes | **20 GSIs, 5 LSIs (LSI at creation only)** |
| DynamoDB Streams retention | **24 hours** |
| DynamoDB PITR | **Up to 35 days** |
| RDS backup retention | **0 (disabled) - 35 days** |
| RDS read replicas | **Up to 15 (MySQL, MariaDB, PostgreSQL)** |
| Aurora | **6 copies across 3 AZs, 15 replicas, 128 TiB, failover < 30 s** |
| Aurora Global Database | **< 1 s replication, RTO ~1 min** |
| Stopped RDS instance | **Restarts automatically after 7 days** |
| VPC CIDR size | **/16 to /28** |
| Reserved IPs per subnet | **5** |
| Ephemeral ports | **1024-65535** |
| Site-to-Site VPN tunnel | **1.25 Gbps** |
| Direct Connect dedicated | **1, 10, 100, 400 Gbps** |
| CloudFront default TTL | **24 hours** |
| CloudTrail event history | **90 days** |
| CloudWatch basic / detailed monitoring | **5 min / 1 min** |
| CloudWatch high-resolution metrics | **1 second** |
| KMS direct encrypt limit | **4 KB** |
| KMS key deletion waiting period | **7-30 days** |
| ELB deregistration delay default | **300 seconds** |
| ASG default cooldown | **300 seconds** |
| Route 53 multivalue | **Up to 8 healthy records** |
| Shield Advanced | **~$3,000 / month per organization** |
