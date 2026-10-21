# Cross-service scenario questions

[Back to index](README.md)

**Q1.** A company runs a three-tier web application on EC2 behind an ALB with a MySQL database on a single EC2 instance. It wants to improve availability of the database tier with the least operational overhead. What should a solutions architect do?

- A. Migrate the database to Amazon RDS for MySQL Multi-AZ
- B. Create an AMI of the database instance every hour
- C. Add a second EC2 database instance with cron-based replication
- D. Move the database to instance store volumes

<details><summary>Answer</summary>

**A** - RDS Multi-AZ provides managed synchronous replication and automatic failover with minimal operations.

_Domain: Design Resilient Architectures_

</details>

**Q2.** An image processing application receives uploads to S3. Each upload must be processed by a function that takes about 2 minutes. Traffic is unpredictable, with large bursts. Which architecture is MOST scalable and cost-effective?

- A. S3 event -> SQS queue -> Lambda function
- B. S3 event -> EC2 instance polling S3 every minute
- C. Cron job on an EC2 instance listing the bucket
- D. S3 event -> SNS -> email to operators

<details><summary>Answer</summary>

**A** - S3 events into SQS buffer bursts, and Lambda scales with the queue and charges only for usage.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A company hosts a static website on S3 and wants HTTPS with a custom domain, low latency for global users, and to prevent direct access to the bucket. Which combination should be used? (Choose TWO)

- A. Amazon CloudFront with an ACM certificate from us-east-1
- B. Origin Access Control with a bucket policy allowing only CloudFront
- C. Enable S3 Transfer Acceleration
- D. An ALB in front of S3
- E. Make the bucket public with an S3 website endpoint

<details><summary>Answer</summary>

**A, B** - CloudFront provides HTTPS and global caching; OAC keeps the bucket private.

_Domain: Design Secure Architectures_

</details>

**Q4.** A company processes financial transactions submitted through an API. Transactions must not be lost if the processing tier fails, and each must be processed exactly once in order per account. What should be used between the API and the processors?

- A. Amazon SNS standard topic
- B. Amazon SQS FIFO queue with message group ID = account ID
- C. Amazon Kinesis Data Firehose
- D. Amazon SQS standard queue

<details><summary>Answer</summary>

**B** - FIFO queues persist messages and guarantee ordered, exactly-once processing per message group.

_Domain: Design Resilient Architectures_

</details>

**Q5.** A company needs to give a third-party auditor read-only access to CloudTrail logs stored in an S3 bucket in the company's account for 30 days. What is the MOST secure method?

- A. Create an IAM user and share its keys
- B. Create a cross-account IAM role with read-only access to the bucket and an External ID; let the auditor's account assume it
- C. Make the bucket public for 30 days
- D. Email the logs daily

<details><summary>Answer</summary>

**B** - Cross-account roles with External ID provide temporary, auditable access without sharing long-term credentials.

_Domain: Design Secure Architectures_

</details>

**Q6.** An application stores user uploads in S3. Objects are accessed frequently for the first week, rarely afterwards, and must be kept for 5 years for compliance with retrieval within 12 hours acceptable after the first year. What is the MOST cost-effective lifecycle?

- A. Standard -> Standard-IA after 30 days -> Glacier Deep Archive after 365 days -> expire after 5 years
- B. Standard for 5 years
- C. One Zone-IA immediately -> delete after 5 years
- D. Glacier Instant Retrieval immediately

<details><summary>Answer</summary>

**A** - Lifecycle transitions match the access pattern: IA for rare access with fast retrieval, then Deep Archive (12 h retrieval) for the long tail. Objects must spend 30 days in Standard before moving to IA.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q7.** A company runs a stateless web application on EC2 in an Auto Scaling group across two AZs. During a recent AZ outage, the application became unavailable because all instances were in one AZ at that moment. What should be done?

- A. Configure the ASG to span at least two AZs with balanced capacity and set minimum capacity to handle load with one AZ lost
- B. Use a cluster placement group
- C. Use larger instance types
- D. Move to Dedicated Hosts

<details><summary>Answer</summary>

**A** - Multi-AZ ASGs with sufficient minimum capacity per AZ provide static stability during AZ failures.

_Domain: Design Resilient Architectures_

</details>

**Q8.** A company has an on-premises data center connected with Direct Connect. It must access S3 privately over DX without traversing the internet. What should be configured?

- A. A private VIF to an S3 gateway endpoint
- B. A public VIF (or an interface VPC endpoint for S3 reachable over a private VIF)
- C. S3 Transfer Acceleration
- D. A NAT gateway

<details><summary>Answer</summary>

**B** - Gateway endpoints cannot be used from on premises. Use a public VIF for AWS public endpoints or an S3 interface endpoint accessed through a private VIF.

_Domain: Design Secure Architectures_

</details>

**Q9.** A web application must maintain user sessions when instances are added or removed by Auto Scaling. What is the BEST solution?

- A. Enable sticky sessions with long duration
- B. Store session data in ElastiCache or DynamoDB
- C. Store sessions on EBS volumes
- D. Use instance store

<details><summary>Answer</summary>

**B** - Externalizing session state makes the web tier stateless and resilient to scaling events.

_Domain: Design Resilient Architectures_

</details>

**Q10.** A company is building a serverless application that must store JSON documents with single-digit millisecond latency at any scale and automatically expire temporary data. Which database fits best?

- A. Amazon RDS for PostgreSQL
- B. Amazon DynamoDB with TTL
- C. Amazon Redshift
- D. Amazon Neptune

<details><summary>Answer</summary>

**B** - DynamoDB is serverless with consistent ms latency, and TTL automatically removes expired items.

_Domain: Design High-Performing Architectures_

</details>

**Q11.** A company wants to analyze 2 years of VPC Flow Logs stored in S3 occasionally, with the lowest cost and no infrastructure management. What should be used?

- A. Load into Redshift
- B. Query with Amazon Athena (partitioned, Parquet where possible)
- C. Launch an EMR cluster permanently
- D. Use CloudWatch Logs Insights

<details><summary>Answer</summary>

**B** - Athena queries S3 directly and charges only for data scanned.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q12.** An application on EC2 in private subnets needs to call AWS Secrets Manager and SQS APIs without traffic leaving the AWS network and without a NAT gateway. What should be used?

- A. Gateway VPC endpoints for both services
- B. Interface VPC endpoints (PrivateLink) for Secrets Manager and SQS
- C. An internet gateway
- D. VPC peering

<details><summary>Answer</summary>

**B** - Only S3 and DynamoDB have gateway endpoints; other services use interface endpoints.

_Domain: Design Secure Architectures_

</details>

**Q13.** A company needs to run a containerized application that must scale quickly and has variable traffic. The team has no Kubernetes expertise and wants minimal infrastructure management. What should be used?

- A. Amazon EKS with self-managed nodes
- B. Amazon ECS with AWS Fargate behind an ALB
- C. Docker on a single large EC2 instance
- D. AWS Batch

<details><summary>Answer</summary>

**B** - ECS on Fargate removes server management, integrates with ALB and Service Auto Scaling.

_Domain: Design High-Performing Architectures_

</details>

**Q14.** A global e-commerce application uses DynamoDB. Users in Asia complain about high latency. The company also wants regional fault tolerance. What should be done?

- A. Increase provisioned capacity
- B. Add DynamoDB global tables replicas in an Asian region and route users with Route 53 latency routing
- C. Add a DAX cluster in us-east-1
- D. Use DynamoDB Streams to S3

<details><summary>Answer</summary>

**B** - Global tables provide local read/write replicas; latency routing directs users to the nearest region.

_Domain: Design High-Performing Architectures_

</details>

**Q15.** A company must ensure that EC2 instances can only be launched with encrypted EBS volumes across all accounts in its organization. What is the MOST effective preventive control?

- A. AWS Config rule to detect unencrypted volumes
- B. An SCP that denies ec2:RunInstances / CreateVolume when ec2:Encrypted is false, plus EBS encryption by default
- C. CloudTrail alerts
- D. Trusted Advisor checks

<details><summary>Answer</summary>

**B** - SCPs prevent the action; Config only detects after the fact. EBS encryption by default helps compliance.

_Domain: Design Secure Architectures_

</details>

**Q16.** A company runs a nightly batch job on EC2 that can tolerate interruptions and takes 4 hours. It also has a web tier that runs 24/7 with steady load for the next 3 years. Which purchasing combination is MOST cost-effective?

- A. Spot Instances for batch and Savings Plans or Reserved Instances for the web tier
- B. On-Demand for both
- C. Dedicated Hosts for both
- D. Reserved Instances for batch and Spot for the web tier

<details><summary>Answer</summary>

**A** - Spot suits interruptible batch; steady 24/7 workloads benefit from 3-year commitments.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q17.** An application writes logs to local disk on EC2. The operations team needs centralized log search and alerting on errors across hundreds of instances. What should be done?

- A. Install the CloudWatch agent to send logs to CloudWatch Logs and create metric filters with alarms
- B. SSH into instances to grep logs
- C. Enable VPC Flow Logs
- D. Use CloudTrail

<details><summary>Answer</summary>

**A** - The CloudWatch agent ships logs centrally; metric filters and alarms provide alerting.

_Domain: Design Resilient Architectures_

</details>

**Q18.** A company wants to migrate a 10 TB on-premises SQL Server database to Amazon Aurora PostgreSQL with minimal downtime. Which steps are required? (Choose TWO)

- A. Convert the schema with AWS SCT or DMS Schema Conversion
- B. Use AWS DMS with full load and ongoing replication (CDC)
- C. Use AWS Application Migration Service
- D. Use AWS DataSync
- E. Use Snowball Edge without DMS

<details><summary>Answer</summary>

**A, B** - Heterogeneous migrations need schema conversion followed by DMS data migration with CDC for minimal downtime.

_Domain: Design Resilient Architectures_

</details>

**Q19.** A REST API on API Gateway backed by Lambda experiences occasional traffic spikes of 20,000 requests per second, causing 429 errors. What should be done FIRST?

- A. Request API Gateway account throttle and Lambda concurrency quota increases
- B. Move the API to EC2
- C. Enable caching on all methods with TTL 0
- D. Switch to SOAP

<details><summary>Answer</summary>

**A** - The default API Gateway limit is 10,000 rps per region and Lambda concurrency is 1,000 by default; both are soft limits that can be raised.

_Domain: Design High-Performing Architectures_

</details>

**Q20.** A company stores sensitive documents in S3. It needs to know who accessed each object and must make sure that the documents are always encrypted with keys it controls. What should be done? (Choose TWO)

- A. Enable CloudTrail data events for the bucket
- B. Use default bucket encryption with SSE-KMS using a customer managed key and deny uploads without it
- C. Enable S3 Transfer Acceleration
- D. Use S3 One Zone-IA
- E. Enable Requester Pays

<details><summary>Answer</summary>

**A, B** - Data events record object-level access, and SSE-KMS with a customer managed key gives control and auditing of keys.

_Domain: Design Secure Architectures_

</details>

**Q21.** A company wants to reduce latency for read-heavy product pages that query an Aurora MySQL database, with the least code changes. Most reads are identical. Which option offers the biggest improvement?

- A. Add Aurora Replicas and use the reader endpoint
- B. Enable Aurora Backtrack
- C. Use Aurora Global Database
- D. Increase the backup retention period

<details><summary>Answer</summary>

**A** - Aurora Replicas with the reader endpoint offload reads with only a connection string change. ElastiCache would help further but requires caching code.

_Domain: Design High-Performing Architectures_

</details>

**Q22.** A company runs an application across two regions for DR. The primary region uses an ALB. The company wants clients to fail over automatically to the secondary region if the primary becomes unhealthy, without waiting for DNS TTLs to expire on clients. What should be used?

- A. Route 53 failover routing with a 60-second TTL
- B. AWS Global Accelerator with endpoint groups in both regions
- C. CloudFront with geo restriction
- D. VPC peering between regions

<details><summary>Answer</summary>

**B** - Global Accelerator uses static anycast IPs and reroutes traffic in seconds based on endpoint health, avoiding client DNS caching.

_Domain: Design Resilient Architectures_

</details>

**Q23.** A company wants to prevent its developers from accidentally making S3 buckets public in any account, now and in the future. What is the simplest effective control?

- A. Enable S3 Block Public Access at the account level and enforce it with an SCP denying s3:PutAccountPublicAccessBlock
- B. Train developers
- C. Use Macie
- D. Enable versioning

<details><summary>Answer</summary>

**A** - Account-level Block Public Access overrides bucket policies and ACLs; an SCP prevents disabling it.

_Domain: Design Secure Architectures_

</details>

**Q24.** A company has a monolithic application with a reporting module that consumes heavy CPU at month end and slows down the transactional part. What is the BEST long-term architectural improvement?

- A. Scale the monolith vertically
- B. Decouple the reporting module into a separate service that reads from a read replica and processes jobs from a queue
- C. Run reports on the primary database at night only
- D. Add more EBS volumes

<details><summary>Answer</summary>

**B** - Decoupling with queues and read replicas isolates the workloads so each scales independently.

_Domain: Design High-Performing Architectures_

</details>
