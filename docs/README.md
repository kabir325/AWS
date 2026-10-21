# AWS Solutions Architect Associate (SAA-C03) - Revision Docs

54 services/topics, 285 practice questions. Generated from `site/data` by `tools/build-docs.js` - edit the data files, then re-run the script.

## Exam at a glance

- 65 questions (50 scored), 130 minutes, pass mark 720/1000
- Multiple choice (1 correct of 4) and multiple response (2+ correct of 5+)
- Domain 1: Design Secure Architectures - 30%
- Domain 2: Design Resilient Architectures - 26%
- Domain 3: Design High-Performing Architectures - 24%
- Domain 4: Design Cost-Optimized Architectures - 20%

## Quick links

- [Cheat sheet](cheat-sheet.md)
- [Cross-service scenario questions](scenarios.md)

## Foundations

_Global infrastructure, Well-Architected Framework, disaster recovery_

- [AWS Global Infrastructure](01-foundations/global-infra.md) ** - Regions, Availability Zones, edge locations, Local Zones, Wavelength, Outposts and the shared responsibility model.
- [Well-Architected & Disaster Recovery](01-foundations/well-architected-dr.md) *** - The six pillars, design principles, RPO/RTO and the four DR strategies that frame most exam answers.

## Compute

_EC2, Auto Scaling, load balancing, Lambda, containers_

- [Amazon EC2](02-compute/ec2.md) *** - Resizable virtual servers: instance families, purchasing options, placement groups, networking, AMIs and instance storage.
- [EC2 Auto Scaling](02-compute/autoscaling.md) *** - Automatically maintain and scale fleets of EC2 instances across AZs using health checks and scaling policies.
- [Elastic Load Balancing](02-compute/elb.md) *** - ALB (layer 7), NLB (layer 4), GWLB (layer 3 appliances): distribute traffic across healthy targets in multiple AZs.
- [AWS Lambda](02-compute/lambda.md) *** - Serverless functions triggered by events: limits, concurrency, invocation models, VPC access and cost.
- [Containers: ECS, EKS, Fargate, ECR](02-compute/containers.md) *** - Run Docker containers on AWS: orchestrators (ECS, EKS), serverless compute (Fargate), registry (ECR), App Runner.
- [AWS Elastic Beanstalk](02-compute/beanstalk.md) ** - PaaS that provisions EC2, ASG, ELB, monitoring for your web app code; you keep control of the resources.

## Storage

_S3, EBS, EFS, FSx, hybrid storage, backup_

- [Amazon S3](03-storage/s3.md) *** - Object storage with 11 nines durability: storage classes, lifecycle, security, encryption, replication, performance.
- [Amazon EBS & Instance Store](03-storage/ebs.md) *** - Block storage for EC2: volume types, snapshots, encryption, Multi-Attach and when to use instance store instead.
- [Amazon EFS](03-storage/efs.md) *** - Managed, elastic NFS file system for Linux, shared across thousands of clients and multiple AZs.
- [Amazon FSx](03-storage/fsx.md) ** - Fully managed third-party file systems: Windows File Server, Lustre, NetApp ONTAP, OpenZFS.
- [AWS Storage Gateway](03-storage/storage-gateway.md) ** - Hybrid storage: give on-premises apps access to cloud storage via file, volume and tape interfaces.
- [AWS Backup](03-storage/backup.md) ** - Centralized, policy-based backup across AWS services and accounts, with vault lock for immutability.

## Database

_RDS, Aurora, DynamoDB, ElastiCache, purpose-built DBs_

- [Amazon RDS](04-database/rds.md) *** - Managed relational databases: Multi-AZ, read replicas, backups, encryption, RDS Proxy and scaling.
- [Amazon Aurora](04-database/aurora.md) *** - Cloud-native MySQL/PostgreSQL-compatible database: 6-way replicated storage, 15 replicas, Global Database, Serverless v2.
- [Amazon DynamoDB](04-database/dynamodb.md) *** - Serverless key-value / document NoSQL with single-digit ms latency: keys, indexes, capacity modes, DAX, streams, global tables.
- [Amazon ElastiCache & MemoryDB](04-database/elasticache.md) *** - Managed in-memory caching with Redis OSS / Valkey and Memcached; MemoryDB for durable Redis-compatible primary database.
- [Purpose-built Databases](04-database/other-dbs.md) ** - DocumentDB, Neptune, Keyspaces, Timestream, QLDB and choosing the right database for the job.

## Networking & Content Delivery

_VPC, hybrid connectivity, Route 53, CloudFront, Global Accelerator_

- [Amazon VPC](05-networking/vpc.md) *** - Your private network in AWS: CIDRs, subnets, route tables, gateways, NAT, security groups vs NACLs, endpoints, peering, flow logs.
- [Hybrid Connectivity: VPN, Direct Connect, Transit Gateway](05-networking/hybrid-networking.md) *** - Connect on-premises networks and many VPCs: Site-to-Site VPN, Client VPN, Direct Connect, Transit Gateway, DX Gateway.
- [Amazon Route 53](05-networking/route53.md) *** - Highly available DNS, domain registration, health checks and routing policies (failover, latency, weighted, geo...).
- [Amazon CloudFront](05-networking/cloudfront.md) *** - Global CDN: origins, caching, OAC for S3, signed URLs/cookies, edge functions, geo restriction and security.
- [AWS Global Accelerator](05-networking/global-accelerator.md) ** - Two static anycast IPs that route TCP/UDP traffic over the AWS backbone to the closest healthy regional endpoint.

## Security, Identity & Compliance

_IAM, Organizations, KMS, secrets, Cognito, edge and threat protection_

- [AWS IAM](06-security/iam.md) *** - Identities (users, groups, roles), policies, policy evaluation, STS, cross-account access and best practices.
- [AWS Organizations, Control Tower & IAM Identity Center](06-security/organizations.md) *** - Multi-account governance: OUs, SCPs, RCPs, consolidated billing, landing zones, centralized SSO and resource sharing.
- [AWS KMS & CloudHSM](06-security/kms.md) *** - Managed encryption keys: key types, key policies, envelope encryption, rotation, multi-region keys; CloudHSM for dedicated HSMs.
- [Secrets Manager, Parameter Store & ACM](06-security/secrets.md) *** - Store and rotate secrets, manage configuration, and provision free TLS certificates.
- [Amazon Cognito](06-security/cognito.md) ** - Customer identity for web and mobile apps: user pools for sign-in, identity pools for temporary AWS credentials.
- [WAF, Shield, Firewall Manager & Network Firewall](06-security/edge-security.md) *** - Protect applications from web exploits and DDoS, and manage firewall rules centrally across accounts.
- [GuardDuty, Inspector, Macie, Security Hub, Detective](06-security/threat-detection.md) ** - Managed threat detection, vulnerability scanning, sensitive data discovery, findings aggregation and investigation.

## Application Integration

_SQS, SNS, EventBridge, Kinesis, Step Functions, API Gateway_

- [Amazon SQS](07-integration/sqs.md) *** - Fully managed message queues to decouple components: Standard vs FIFO, visibility timeout, DLQ, long polling.
- [Amazon SNS](07-integration/sns.md) *** - Pub/sub messaging: push one message to many subscribers (SQS, Lambda, HTTP, email, SMS, mobile push).
- [Amazon EventBridge](07-integration/eventbridge.md) *** - Serverless event bus: rules with pattern matching, schedules, SaaS partner events, cross-account buses, Pipes and Scheduler.
- [Amazon Kinesis & Data Streaming](07-integration/kinesis.md) *** - Real-time streaming: Kinesis Data Streams, Amazon Data Firehose, Managed Service for Apache Flink, and MSK.
- [AWS Step Functions & Amazon MQ](07-integration/step-functions.md) ** - Serverless workflow orchestration with state machines; Amazon MQ for lift-and-shift of existing message brokers.
- [Amazon API Gateway](07-integration/api-gateway.md) *** - Create, secure and scale REST, HTTP and WebSocket APIs: endpoint types, auth, throttling, caching, stages.

## Management & Governance

_CloudWatch, CloudTrail, Config, Systems Manager, CloudFormation, cost_

- [Amazon CloudWatch](08-management/cloudwatch.md) *** - Metrics, alarms, logs, dashboards, agent, and observability for AWS resources and applications.
- [AWS CloudTrail](08-management/cloudtrail.md) *** - Audit log of API calls and account activity: management, data and Insights events, trails, CloudTrail Lake.
- [AWS Config](08-management/config.md) ** - Resource inventory, configuration history and compliance evaluation with managed or custom rules and auto-remediation.
- [AWS Systems Manager](08-management/ssm.md) ** - Operate fleets of EC2 and on-prem servers: Session Manager, Run Command, Patch Manager, Automation, Parameter Store, Inventory.
- [AWS CloudFormation & IaC](08-management/cloudformation.md) ** - Infrastructure as code: templates, stacks, change sets, StackSets, drift detection, CDK and Service Catalog.
- [Cost Management & Trusted Advisor](08-management/cost-management.md) *** - Cost Explorer, Budgets, Cost and Usage Reports, Compute Optimizer, Savings Plans, tags, Trusted Advisor and cost-optimization patterns.

## Analytics & Machine Learning

_Athena, Glue, Redshift, EMR, OpenSearch, AI services_

- [Amazon Athena](09-analytics/athena.md) *** - Serverless interactive SQL queries directly on data in S3; pay per data scanned.
- [AWS Glue & Lake Formation](09-analytics/glue.md) ** - Serverless ETL and data catalog; Lake Formation for building and securing data lakes with fine-grained permissions.
- [Amazon Redshift](09-analytics/redshift.md) *** - Petabyte-scale columnar data warehouse (OLAP): clusters, Serverless, Spectrum, snapshots, data sharing.
- [Amazon EMR](09-analytics/emr.md) ** - Managed big data frameworks (Spark, Hadoop, Hive, Presto, HBase, Flink) on EC2, EKS or Serverless.
- [OpenSearch, QuickSight & Other Analytics](09-analytics/opensearch.md) ** - Search and log analytics with OpenSearch; BI dashboards with QuickSight; data sharing and SaaS ingestion services.
- [AI & Machine Learning Services](09-analytics/ai-ml.md) ** - Pre-trained AI services to recognize by use case, plus SageMaker and Bedrock for custom and generative AI.

## Migration & Transfer

_DMS, MGN, DataSync, Transfer Family, Snow Family_

- [Migration Strategy, MGN & Discovery](10-migration/migration-strategy.md) ** - The 7 Rs, discovery and planning tools, and AWS Application Migration Service for lift-and-shift.
- [AWS Database Migration Service (DMS)](10-migration/dms.md) *** - Migrate and replicate databases with minimal downtime; Schema Conversion for heterogeneous migrations.
- [DataSync & Transfer Family](10-migration/datasync-transfer.md) ** - Online data movement: DataSync for scheduled/bulk file transfers, Transfer Family for managed SFTP/FTPS/FTP/AS2.
- [AWS Snow Family](10-migration/snow.md) ** - Physical devices for offline data transfer and edge computing where networks are slow, expensive or absent.

## Other Services

_Services you only need to recognize_

- [Other Services to Recognize](11-other/other-services.md) * - Services that appear as distractors or one-liners: know what each does in a sentence.
