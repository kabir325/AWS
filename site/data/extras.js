svc({
  id: 'other-services', name: 'Other Services to Recognize', cat: 'other', imp: 1,
  tag: 'Services that appear as distractors or one-liners: know what each does in a sentence.',
  s: [
    { h: 'Compute and end-user', i: [
      ['AWS Batch', 'Managed batch computing: queues, scheduling, auto-provisioned EC2/Spot/Fargate for jobs of any duration (no 15-minute limit).'],
      ['Amazon Lightsail', 'Simple VPS bundles (compute, storage, networking) at fixed monthly price for simple apps and beginners.'],
      ['Amazon WorkSpaces', 'Managed virtual desktops (DaaS).'],
      ['Amazon AppStream 2.0', 'Stream desktop applications to a browser.'],
      ['VMware Cloud on AWS', 'Run VMware workloads natively on AWS.'],
      ['AWS Wavelength / Local Zones / Outposts', 'See Global Infrastructure.']
    ]},
    { h: 'Developer and front-end', i: [
      ['AWS AppSync', 'Managed GraphQL (and Pub/Sub) APIs with real-time subscriptions and offline sync for mobile/web.'],
      ['AWS Amplify', 'Build and host full-stack web/mobile apps (hosting, auth, APIs) quickly.'],
      ['AWS X-Ray', 'Distributed tracing.'],
      ['CodeCommit / CodeBuild / CodeDeploy / CodePipeline', 'Source control (closed to new customers), build, deployment (EC2, Lambda, ECS blue/green), CI/CD orchestration.'],
      ['AWS Cloud9 / CloudShell', 'Cloud IDE (closed to new customers) / browser shell with CLI pre-authenticated.'],
      ['AWS Device Farm', 'Test apps on real mobile devices and browsers.']
    ]},
    { h: 'Messaging, IoT and media', i: [
      ['Amazon SES', 'Send and receive email at scale (transactional, marketing).'],
      ['Amazon Pinpoint', 'Multichannel marketing communications (email, SMS, push, voice) with segmentation and campaigns.'],
      ['Amazon Connect', 'Cloud contact center.'],
      ['AWS IoT Core', 'Connect IoT devices with MQTT, rules engine to route data to AWS services.'],
      ['AWS IoT Greengrass', 'Run Lambda/containers on edge devices.'],
      ['AWS Elemental MediaConvert', 'File-based video transcoding.'],
      ['Amazon Kinesis Video Streams', 'Stream video from devices for analytics/ML.']
    ]},
    { h: 'Governance and operations', i: [
      ['AWS Health Dashboard', 'Service health and account-specific events (scheduled maintenance, issues affecting your resources); EventBridge integration.'],
      ['AWS License Manager', 'Track and enforce software license usage (BYOL).'],
      ['AWS Resilience Hub', 'Assess application resilience against RTO/RPO targets.'],
      ['AWS Fault Injection Service', 'Chaos engineering experiments.'],
      ['Amazon Managed Grafana / Prometheus', 'Managed open-source monitoring and dashboards.'],
      ['AWS Global View / Resource Explorer', 'Find resources across regions.'],
      ['AWS Directory Service', 'See Organizations entry (Managed AD, AD Connector, Simple AD).']
    ]}
  ],
  tips: [
    'Long-running batch jobs with automatic compute provisioning -> AWS Batch.',
    'GraphQL with real-time and offline -> AppSync.',
    'Bulk email -> SES. Multichannel campaigns -> Pinpoint. Contact center -> Connect.',
    'IoT devices over MQTT -> IoT Core.'
  ],
  q: [
    { q: 'A company needs to run thousands of containerized batch jobs that each take 2-6 hours, with automatic compute provisioning and job queues. Which service should be used?', o: ['AWS Lambda', 'AWS Batch', 'Amazon EventBridge', 'Amazon Lightsail'], a: 1, e: 'AWS Batch manages job queues and provisions EC2/Spot/Fargate capacity for jobs of any duration.', d: 3 },
    { q: 'A mobile app needs a GraphQL API with real-time updates and offline data synchronization. Which service fits best?', o: ['API Gateway REST API', 'AWS AppSync', 'Amazon SNS', 'Amazon MQ'], a: 1, e: 'AppSync provides managed GraphQL with subscriptions and offline sync.', d: 3 },
    { q: 'A company needs to send millions of transactional emails such as order confirmations. Which service should be used?', o: ['Amazon SNS email subscription', 'Amazon SES', 'Amazon Connect', 'Amazon WorkMail'], a: 1, e: 'SES is built for high-volume transactional and marketing email.', d: 3 }
  ]
});

/* ---------------- Cheat sheet ---------------- */
AWS.cheats = {
  compare: [
    {
      title: 'Storage options',
      cols: ['Service', 'Type', 'Scope', 'Access', 'Best for'],
      rows: [
        ['S3', 'Object', 'Regional (multi-AZ)', 'HTTP API, many clients', 'Static content, data lakes, backups, archives'],
        ['EBS', 'Block', 'Single AZ', 'One instance (io1/io2 Multi-Attach)', 'Boot volumes, databases on EC2'],
        ['Instance store', 'Block (ephemeral)', 'Host', 'One instance', 'Cache, scratch, buffers, highest IOPS'],
        ['EFS', 'File (NFS)', 'Regional (multi-AZ)', 'Thousands of Linux clients', 'Shared Linux files, containers, CMS'],
        ['FSx for Windows', 'File (SMB)', 'Single or Multi-AZ', 'Windows clients, AD', 'Windows shares, SQL Server, SharePoint'],
        ['FSx for Lustre', 'Parallel file', 'Single AZ', 'Linux HPC clients', 'HPC, ML training, S3-linked processing'],
        ['FSx for ONTAP', 'File + block', 'Single or Multi-AZ', 'NFS, SMB, iSCSI', 'NetApp migrations, multi-protocol']
      ]
    },
    {
      title: 'S3 storage classes',
      cols: ['Class', 'AZs', 'Min duration', 'Retrieval', 'Use'],
      rows: [
        ['Standard', '3+', 'None', 'ms, no fee', 'Frequently accessed'],
        ['Intelligent-Tiering', '3+', 'None', 'ms, no fee (archive tiers optional)', 'Unknown or changing access'],
        ['Standard-IA', '3+', '30 days', 'ms, per-GB fee', 'Infrequent, needs fast access'],
        ['One Zone-IA', '1', '30 days', 'ms, per-GB fee', 'Re-creatable infrequent data'],
        ['Glacier Instant Retrieval', '3+', '90 days', 'ms', 'Archive accessed quarterly'],
        ['Glacier Flexible Retrieval', '3+', '90 days', '1-5 min / 3-5 h / 5-12 h', 'Archive, occasional restore'],
        ['Glacier Deep Archive', '3+', '180 days', '12 h / 48 h', 'Long-term compliance, tape replacement'],
        ['Express One Zone', '1', 'None', 'Single-digit ms', 'Ultra-low latency hot data']
      ]
    },
    {
      title: 'Messaging and streaming',
      cols: ['Service', 'Model', 'Ordering', 'Persistence / replay', 'Pick when'],
      rows: [
        ['SQS Standard', 'Queue (pull)', 'Best effort', 'Up to 14 days, deleted after processing', 'Decouple, buffer, max throughput'],
        ['SQS FIFO', 'Queue (pull)', 'Strict per group', 'Up to 14 days', 'Ordering + exactly-once'],
        ['SNS', 'Pub/sub (push)', 'FIFO topics only', 'No (retries only)', 'Fan-out, notifications, email/SMS'],
        ['EventBridge', 'Event bus (push)', 'No', 'Archive and replay', 'AWS/SaaS events, content routing, schedules'],
        ['Kinesis Data Streams', 'Stream (pull)', 'Per shard', '24 h - 365 days, replay', 'Real-time analytics, multiple consumers'],
        ['Data Firehose', 'Delivery', 'No', 'No', 'Load streams into S3/Redshift/OpenSearch'],
        ['Amazon MQ', 'Broker', 'Yes', 'Yes', 'Migrate JMS/AMQP/MQTT apps'],
        ['Amazon MSK', 'Kafka', 'Per partition', 'Configurable', 'Existing Kafka workloads']
      ]
    },
    {
      title: 'Load balancers',
      cols: ['Type', 'Layer', 'Protocols', 'Static IP', 'Key features'],
      rows: [
        ['ALB', '7', 'HTTP, HTTPS, gRPC, WebSocket', 'No', 'Path/host routing, Lambda targets, Cognito auth, WAF'],
        ['NLB', '4', 'TCP, UDP, TLS', 'Yes (EIP per AZ)', 'Millions rps, source IP preserved, PrivateLink'],
        ['GWLB', '3', 'IP (GENEVE 6081)', 'No', 'Inline third-party appliances (firewalls, IDS)'],
        ['CLB', '4/7', 'HTTP, HTTPS, TCP', 'No', 'Legacy - migrate']
      ]
    },
    {
      title: 'RDS / Aurora availability and scaling',
      cols: ['Feature', 'Replication', 'Readable', 'Purpose'],
      rows: [
        ['RDS Multi-AZ instance', 'Synchronous', 'No', 'HA, automatic failover 60-120 s'],
        ['RDS Multi-AZ DB cluster', 'Semi-synchronous', 'Yes (2 standbys)', 'HA with faster failover + reads'],
        ['RDS read replica', 'Asynchronous', 'Yes', 'Read scaling, cross-region DR'],
        ['Aurora replica', 'Shared storage', 'Yes (up to 15)', 'Read scaling and failover < 30 s'],
        ['Aurora Global Database', 'Storage-level < 1 s', 'Yes (secondary regions)', 'Global reads, regional DR (RTO ~1 min)'],
        ['DynamoDB global tables', 'Async multi-active', 'Read + write', 'Multi-region active-active']
      ]
    },
    {
      title: 'Disaster recovery strategies',
      cols: ['Strategy', 'RPO', 'RTO', 'Cost', 'What runs in DR'],
      rows: [
        ['Backup and restore', 'Hours', 'Hours (24 h or less)', '$', 'Nothing - only backups'],
        ['Pilot light', 'Minutes', 'Tens of minutes', '$$', 'Data replication only (core)'],
        ['Warm standby', 'Seconds', 'Minutes', '$$$', 'Scaled-down full stack'],
        ['Multi-site active-active', 'Near zero', 'Near zero', '$$$$', 'Full production stack']
      ]
    },
    {
      title: 'Security groups vs network ACLs',
      cols: ['Aspect', 'Security group', 'Network ACL'],
      rows: [
        ['Level', 'Instance / ENI', 'Subnet'],
        ['State', 'Stateful', 'Stateless (allow ephemeral ports)'],
        ['Rules', 'Allow only', 'Allow and deny'],
        ['Evaluation', 'All rules', 'In number order, first match'],
        ['Default', 'Deny in, allow out', 'Default NACL allows all; custom denies all']
      ]
    },
    {
      title: 'Network connectivity',
      cols: ['Option', 'Connects', 'Transitive', 'Notes'],
      rows: [
        ['VPC peering', 'VPC <-> VPC', 'No', 'No overlapping CIDRs, cross-account/region'],
        ['Transit Gateway', 'Many VPCs, VPN, DX', 'Yes', 'Hub and spoke, route tables, multicast, ECMP'],
        ['PrivateLink', 'Consumer VPC -> service (NLB)', 'N/A', 'One-way, overlapping CIDRs OK, scales to many consumers'],
        ['Site-to-Site VPN', 'On-prem <-> VPC/TGW', '-', 'IPsec over internet, minutes to set up, 1.25 Gbps/tunnel'],
        ['Direct Connect', 'On-prem <-> AWS', '-', 'Private, consistent, weeks to provision, not encrypted by default'],
        ['Client VPN', 'Users <-> VPC', '-', 'OpenVPN remote access']
      ]
    },
    {
      title: 'Monitoring and audit',
      cols: ['Service', 'Answers the question'],
      rows: [
        ['CloudWatch', 'How is it performing? (metrics, logs, alarms)'],
        ['CloudTrail', 'Who did what, when, from where? (API calls)'],
        ['Config', 'What did the resource look like, and is it compliant?'],
        ['VPC Flow Logs', 'What IP traffic was accepted/rejected?'],
        ['X-Ray', 'Where is latency in my distributed request?'],
        ['GuardDuty', 'Is something malicious happening?'],
        ['Trusted Advisor', 'Am I following best practices (cost, security, limits)?']
      ]
    },
    {
      title: 'CloudFront vs Global Accelerator',
      cols: ['Aspect', 'CloudFront', 'Global Accelerator'],
      rows: [
        ['Caching', 'Yes', 'No'],
        ['Protocols', 'HTTP/HTTPS, WebSocket', 'TCP and UDP'],
        ['IPs', 'Dynamic edge IPs', '2 static anycast IPs'],
        ['Failover', 'Origin groups', 'Endpoint health, < 1 min, no DNS caching'],
        ['Use', 'Static/dynamic web content', 'Gaming, IoT, VoIP, static IP needs']
      ]
    },
    {
      title: 'EC2 purchasing options',
      cols: ['Option', 'Discount', 'Commitment', 'Use'],
      rows: [
        ['On-Demand', '0%', 'None', 'Short, unpredictable, cannot be interrupted'],
        ['Reserved Instances', 'Up to ~72%', '1 or 3 years', 'Steady state; Convertible for flexibility'],
        ['Savings Plans', 'Up to ~72%', '1 or 3 years ($/h)', 'Compute SP spans EC2, Fargate, Lambda'],
        ['Spot', 'Up to 90%', 'None (2-min interruption)', 'Fault-tolerant, flexible, batch'],
        ['Dedicated Host', '-', 'On-demand or reserved', 'Socket/core BYOL, compliance'],
        ['Capacity Reservation', '0% (combine with SP)', 'None', 'Guaranteed capacity in an AZ']
      ]
    }
  ],
  keywords: [
    ['"Least operational overhead"', 'Managed or serverless service (Lambda, Fargate, DynamoDB, Aurora Serverless, S3)'],
    ['"Decouple" / "buffer" / "spiky writes"', 'SQS'],
    ['"Fan-out" / "multiple subscribers"', 'SNS (+ SQS)'],
    ['"Real-time streaming" / "replay"', 'Kinesis Data Streams'],
    ['"Load streaming data into S3/Redshift"', 'Data Firehose'],
    ['"Orchestrate" / "workflow" / "human approval"', 'Step Functions'],
    ['"Serverless cron"', 'EventBridge Scheduler + Lambda'],
    ['"Ad-hoc SQL on S3"', 'Athena'],
    ['"Data warehouse" / "OLAP" / "BI"', 'Redshift (+ QuickSight)'],
    ['"Full-text search"', 'OpenSearch'],
    ['"Graph" / "relationships"', 'Neptune'],
    ['"MongoDB"', 'DocumentDB'],
    ['"Cassandra"', 'Keyspaces'],
    ['"Time series" / "IoT metrics"', 'Timestream'],
    ['"Microsecond latency for DynamoDB"', 'DAX'],
    ['"Session state" / "cache DB reads"', 'ElastiCache'],
    ['"Global relational DB, < 1 s replication"', 'Aurora Global Database'],
    ['"Multi-region active-active NoSQL"', 'DynamoDB global tables'],
    ['"Unpredictable DB workload"', 'Aurora Serverless v2 / DynamoDB on-demand'],
    ['"Too many DB connections from Lambda"', 'RDS Proxy'],
    ['"Rotate DB credentials automatically"', 'Secrets Manager'],
    ['"Shared file system Linux"', 'EFS'],
    ['"Windows file share / SMB / AD"', 'FSx for Windows File Server'],
    ['"HPC file system"', 'FSx for Lustre'],
    ['"On-prem app needs cloud storage via NFS/SMB"', 'S3 File Gateway'],
    ['"Replace tape library"', 'Tape Gateway'],
    ['"Move petabytes offline"', 'Snowball Edge'],
    ['"Online transfer / sync NFS to S3"', 'DataSync'],
    ['"SFTP into S3"', 'Transfer Family'],
    ['"Lift and shift servers"', 'Application Migration Service (MGN)'],
    ['"Migrate database with minimal downtime"', 'DMS (+ SCT if different engines)'],
    ['"Static IP for global app" / "UDP global"', 'Global Accelerator'],
    ['"Cache content globally"', 'CloudFront'],
    ['"S3 only via CloudFront"', 'Origin Access Control (OAC)'],
    ['"Restrict by country"', 'CloudFront geo restriction / Route 53 geolocation / WAF geo match'],
    ['"SQL injection / XSS"', 'AWS WAF'],
    ['"DDoS + response team + cost protection"', 'Shield Advanced'],
    ['"Central firewall rules across accounts"', 'Firewall Manager'],
    ['"Threat detection from logs"', 'GuardDuty'],
    ['"Vulnerability scanning EC2/ECR/Lambda"', 'Inspector'],
    ['"PII in S3"', 'Macie'],
    ['"Who made this API call"', 'CloudTrail'],
    ['"Configuration history / compliance"', 'Config'],
    ['"Restrict member accounts / regions"', 'SCP (Organizations)'],
    ['"Access for all accounts in org"', 'aws:PrincipalOrgID condition'],
    ['"Cross-account access"', 'IAM role with trust policy (External ID for third parties)'],
    ['"Temporary credentials for mobile users"', 'Cognito identity pool'],
    ['"App sign-up / sign-in"', 'Cognito user pool'],
    ['"Workforce SSO to many accounts"', 'IAM Identity Center'],
    ['"Private access to S3/DynamoDB from VPC, free"', 'Gateway VPC endpoint'],
    ['"Expose service to many VPCs privately"', 'PrivateLink (NLB + endpoint service)'],
    ['"Connect many VPCs + on-prem"', 'Transit Gateway'],
    ['"Private dedicated connection"', 'Direct Connect (+ VPN for encryption/backup)'],
    ['"Shell access without SSH/bastion"', 'SSM Session Manager'],
    ['"Memory/disk metrics on EC2"', 'CloudWatch agent'],
    ['"Cannot delete for N years, even root"', 'S3 Object Lock compliance mode / Backup Vault Lock'],
    ['"Uploads without credentials"', 'S3 pre-signed URL'],
    ['"Lowest latency between instances"', 'Cluster placement group (+ EFA)'],
    ['"Interruptible / fault-tolerant / cheapest"', 'Spot Instances'],
    ['"BYOL per socket/core"', 'Dedicated Hosts'],
    ['"Alert on forecasted spend"', 'AWS Budgets'],
    ['"Right-size resources"', 'Compute Optimizer']
  ],
  numbers: [
    ['S3 max object size', '5 TB (single PUT 5 GB; multipart recommended > 100 MB)'],
    ['S3 request rate per prefix', '3,500 writes / 5,500 reads per second'],
    ['S3 durability', '99.999999999% (11 nines)'],
    ['S3 Standard-IA / One Zone-IA minimum', '30 days, 128 KB'],
    ['Glacier IR / Flexible minimum', '90 days'],
    ['Glacier Deep Archive minimum', '180 days, retrieval 12 h (standard) / 48 h (bulk)'],
    ['Glacier Flexible retrieval', 'Expedited 1-5 min, Standard 3-5 h, Bulk 5-12 h'],
    ['EBS gp3 baseline', '3,000 IOPS, 125 MiB/s'],
    ['EBS io2 Block Express max', '256,000 IOPS, 64 TiB'],
    ['EBS Multi-Attach', 'io1/io2, up to 16 instances, same AZ'],
    ['EC2 Spot interruption notice', '2 minutes'],
    ['Spread placement group', '7 running instances per AZ per group'],
    ['Partition placement group', 'Up to 7 partitions per AZ'],
    ['EC2 hibernation', 'RAM < 150 GB, up to 60 days'],
    ['User data limit', '16 KB'],
    ['Lambda timeout', '15 minutes'],
    ['Lambda memory', '128 MB - 10,240 MB'],
    ['Lambda /tmp', '512 MB - 10 GB'],
    ['Lambda default concurrency', '1,000 per region (soft)'],
    ['Lambda container image', 'Up to 10 GB'],
    ['API Gateway default throttle', '10,000 rps, 5,000 burst'],
    ['API Gateway integration timeout', '29 s (default)'],
    ['API Gateway payload', '10 MB'],
    ['SQS retention', '4 days default, 1 min - 14 days'],
    ['SQS visibility timeout', '30 s default, max 12 h'],
    ['SQS long polling', 'Up to 20 s'],
    ['SQS delay queue', 'Up to 15 min'],
    ['SQS FIFO throughput', '300 msg/s (3,000 with batching); higher with high-throughput mode'],
    ['SQS / SNS message size', '256 KB (SQS raised to 1 MiB in 2025)'],
    ['Kinesis shard', '1 MB/s or 1,000 rec/s in; 2 MB/s out'],
    ['Kinesis retention', '24 h default, up to 365 days'],
    ['DynamoDB item size', '400 KB'],
    ['DynamoDB RCU', '1 strong or 2 eventual reads/s of 4 KB'],
    ['DynamoDB WCU', '1 write/s of 1 KB'],
    ['DynamoDB indexes', '20 GSIs, 5 LSIs (LSI at creation only)'],
    ['DynamoDB Streams retention', '24 hours'],
    ['DynamoDB PITR', 'Up to 35 days'],
    ['RDS backup retention', '0 (disabled) - 35 days'],
    ['RDS read replicas', 'Up to 15 (MySQL, MariaDB, PostgreSQL)'],
    ['Aurora', '6 copies across 3 AZs, 15 replicas, 128 TiB, failover < 30 s'],
    ['Aurora Global Database', '< 1 s replication, RTO ~1 min'],
    ['Stopped RDS instance', 'Restarts automatically after 7 days'],
    ['VPC CIDR size', '/16 to /28'],
    ['Reserved IPs per subnet', '5'],
    ['Ephemeral ports', '1024-65535'],
    ['Site-to-Site VPN tunnel', '1.25 Gbps'],
    ['Direct Connect dedicated', '1, 10, 100, 400 Gbps'],
    ['CloudFront default TTL', '24 hours'],
    ['CloudTrail event history', '90 days'],
    ['CloudWatch basic / detailed monitoring', '5 min / 1 min'],
    ['CloudWatch high-resolution metrics', '1 second'],
    ['KMS direct encrypt limit', '4 KB'],
    ['KMS key deletion waiting period', '7-30 days'],
    ['ELB deregistration delay default', '300 seconds'],
    ['ASG default cooldown', '300 seconds'],
    ['Route 53 multivalue', 'Up to 8 healthy records'],
    ['Shield Advanced', '~$3,000 / month per organization']
  ],
  strategy: [
    'The exam has 65 questions (50 scored, 15 unscored) in 130 minutes: about 2 minutes per question. Passing score is 720 / 1000.',
    'Read the LAST sentence first: it tells you what is being optimized (cost, performance, availability, security, least operational overhead).',
    'Underline constraints: "minimal downtime", "without code changes", "most cost-effective", "in the shortest time", "highly available", "least privilege".',
    'Eliminate options that are technically wrong first (e.g. WAF on NLB, Lambda > 15 min, CNAME at zone apex, SQS for ordering without FIFO).',
    'Between two working answers, pick the managed / serverless / native AWS feature over custom scripts or EC2-based solutions.',
    '"Highly available" means Multi-AZ. "Disaster recovery" usually means multi-region.',
    'Security answers: IAM roles over keys, least privilege, encryption with KMS, private subnets, VPC endpoints, no public access.',
    'Cost answers: right-size, Spot for fault-tolerant, Savings Plans for steady, lifecycle to cheaper storage, delete unused resources, gateway endpoints.',
    'Multiple response questions state how many to choose. Each option is independently true/false for the scenario.',
    'Flag long or uncertain questions, answer everything (no penalty for guessing), then come back.',
    'Beware of answers that are true statements but do not address the requirement.',
    'If two options differ only in one service, focus on that difference and the keyword it matches.'
  ]
};

/* ---------------- Cross-service scenario questions (used in mock exams) ---------------- */
AWS.scenarios = [
  { q: 'A company runs a three-tier web application on EC2 behind an ALB with a MySQL database on a single EC2 instance. It wants to improve availability of the database tier with the least operational overhead. What should a solutions architect do?', o: ['Migrate the database to Amazon RDS for MySQL Multi-AZ', 'Create an AMI of the database instance every hour', 'Add a second EC2 database instance with cron-based replication', 'Move the database to instance store volumes'], a: 0, e: 'RDS Multi-AZ provides managed synchronous replication and automatic failover with minimal operations.', d: 2 },
  { q: 'An image processing application receives uploads to S3. Each upload must be processed by a function that takes about 2 minutes. Traffic is unpredictable, with large bursts. Which architecture is MOST scalable and cost-effective?', o: ['S3 event -> SQS queue -> Lambda function', 'S3 event -> EC2 instance polling S3 every minute', 'Cron job on an EC2 instance listing the bucket', 'S3 event -> SNS -> email to operators'], a: 0, e: 'S3 events into SQS buffer bursts, and Lambda scales with the queue and charges only for usage.', d: 3 },
  { q: 'A company hosts a static website on S3 and wants HTTPS with a custom domain, low latency for global users, and to prevent direct access to the bucket. Which combination should be used? (Choose TWO)', o: ['Amazon CloudFront with an ACM certificate from us-east-1', 'Origin Access Control with a bucket policy allowing only CloudFront', 'Enable S3 Transfer Acceleration', 'An ALB in front of S3', 'Make the bucket public with an S3 website endpoint'], a: [0, 1], e: 'CloudFront provides HTTPS and global caching; OAC keeps the bucket private.', d: 1 },
  { q: 'A company processes financial transactions submitted through an API. Transactions must not be lost if the processing tier fails, and each must be processed exactly once in order per account. What should be used between the API and the processors?', o: ['Amazon SNS standard topic', 'Amazon SQS FIFO queue with message group ID = account ID', 'Amazon Kinesis Data Firehose', 'Amazon SQS standard queue'], a: 1, e: 'FIFO queues persist messages and guarantee ordered, exactly-once processing per message group.', d: 2 },
  { q: 'A company needs to give a third-party auditor read-only access to CloudTrail logs stored in an S3 bucket in the company\'s account for 30 days. What is the MOST secure method?', o: ['Create an IAM user and share its keys', 'Create a cross-account IAM role with read-only access to the bucket and an External ID; let the auditor\'s account assume it', 'Make the bucket public for 30 days', 'Email the logs daily'], a: 1, e: 'Cross-account roles with External ID provide temporary, auditable access without sharing long-term credentials.', d: 1 },
  { q: 'An application stores user uploads in S3. Objects are accessed frequently for the first week, rarely afterwards, and must be kept for 5 years for compliance with retrieval within 12 hours acceptable after the first year. What is the MOST cost-effective lifecycle?', o: ['Standard -> Standard-IA after 30 days -> Glacier Deep Archive after 365 days -> expire after 5 years', 'Standard for 5 years', 'One Zone-IA immediately -> delete after 5 years', 'Glacier Instant Retrieval immediately'], a: 0, e: 'Lifecycle transitions match the access pattern: IA for rare access with fast retrieval, then Deep Archive (12 h retrieval) for the long tail. Objects must spend 30 days in Standard before moving to IA.', d: 4 },
  { q: 'A company runs a stateless web application on EC2 in an Auto Scaling group across two AZs. During a recent AZ outage, the application became unavailable because all instances were in one AZ at that moment. What should be done?', o: ['Configure the ASG to span at least two AZs with balanced capacity and set minimum capacity to handle load with one AZ lost', 'Use a cluster placement group', 'Use larger instance types', 'Move to Dedicated Hosts'], a: 0, e: 'Multi-AZ ASGs with sufficient minimum capacity per AZ provide static stability during AZ failures.', d: 2 },
  { q: 'A company has an on-premises data center connected with Direct Connect. It must access S3 privately over DX without traversing the internet. What should be configured?', o: ['A private VIF to an S3 gateway endpoint', 'A public VIF (or an interface VPC endpoint for S3 reachable over a private VIF)', 'S3 Transfer Acceleration', 'A NAT gateway'], a: 1, e: 'Gateway endpoints cannot be used from on premises. Use a public VIF for AWS public endpoints or an S3 interface endpoint accessed through a private VIF.', d: 1 },
  { q: 'A web application must maintain user sessions when instances are added or removed by Auto Scaling. What is the BEST solution?', o: ['Enable sticky sessions with long duration', 'Store session data in ElastiCache or DynamoDB', 'Store sessions on EBS volumes', 'Use instance store'], a: 1, e: 'Externalizing session state makes the web tier stateless and resilient to scaling events.', d: 2 },
  { q: 'A company is building a serverless application that must store JSON documents with single-digit millisecond latency at any scale and automatically expire temporary data. Which database fits best?', o: ['Amazon RDS for PostgreSQL', 'Amazon DynamoDB with TTL', 'Amazon Redshift', 'Amazon Neptune'], a: 1, e: 'DynamoDB is serverless with consistent ms latency, and TTL automatically removes expired items.', d: 3 },
  { q: 'A company wants to analyze 2 years of VPC Flow Logs stored in S3 occasionally, with the lowest cost and no infrastructure management. What should be used?', o: ['Load into Redshift', 'Query with Amazon Athena (partitioned, Parquet where possible)', 'Launch an EMR cluster permanently', 'Use CloudWatch Logs Insights'], a: 1, e: 'Athena queries S3 directly and charges only for data scanned.', d: 4 },
  { q: 'An application on EC2 in private subnets needs to call AWS Secrets Manager and SQS APIs without traffic leaving the AWS network and without a NAT gateway. What should be used?', o: ['Gateway VPC endpoints for both services', 'Interface VPC endpoints (PrivateLink) for Secrets Manager and SQS', 'An internet gateway', 'VPC peering'], a: 1, e: 'Only S3 and DynamoDB have gateway endpoints; other services use interface endpoints.', d: 1 },
  { q: 'A company needs to run a containerized application that must scale quickly and has variable traffic. The team has no Kubernetes expertise and wants minimal infrastructure management. What should be used?', o: ['Amazon EKS with self-managed nodes', 'Amazon ECS with AWS Fargate behind an ALB', 'Docker on a single large EC2 instance', 'AWS Batch'], a: 1, e: 'ECS on Fargate removes server management, integrates with ALB and Service Auto Scaling.', d: 3 },
  { q: 'A global e-commerce application uses DynamoDB. Users in Asia complain about high latency. The company also wants regional fault tolerance. What should be done?', o: ['Increase provisioned capacity', 'Add DynamoDB global tables replicas in an Asian region and route users with Route 53 latency routing', 'Add a DAX cluster in us-east-1', 'Use DynamoDB Streams to S3'], a: 1, e: 'Global tables provide local read/write replicas; latency routing directs users to the nearest region.', d: 3 },
  { q: 'A company must ensure that EC2 instances can only be launched with encrypted EBS volumes across all accounts in its organization. What is the MOST effective preventive control?', o: ['AWS Config rule to detect unencrypted volumes', 'An SCP that denies ec2:RunInstances / CreateVolume when ec2:Encrypted is false, plus EBS encryption by default', 'CloudTrail alerts', 'Trusted Advisor checks'], a: 1, e: 'SCPs prevent the action; Config only detects after the fact. EBS encryption by default helps compliance.', d: 1 },
  { q: 'A company runs a nightly batch job on EC2 that can tolerate interruptions and takes 4 hours. It also has a web tier that runs 24/7 with steady load for the next 3 years. Which purchasing combination is MOST cost-effective?', o: ['Spot Instances for batch and Savings Plans or Reserved Instances for the web tier', 'On-Demand for both', 'Dedicated Hosts for both', 'Reserved Instances for batch and Spot for the web tier'], a: 0, e: 'Spot suits interruptible batch; steady 24/7 workloads benefit from 3-year commitments.', d: 4 },
  { q: 'An application writes logs to local disk on EC2. The operations team needs centralized log search and alerting on errors across hundreds of instances. What should be done?', o: ['Install the CloudWatch agent to send logs to CloudWatch Logs and create metric filters with alarms', 'SSH into instances to grep logs', 'Enable VPC Flow Logs', 'Use CloudTrail'], a: 0, e: 'The CloudWatch agent ships logs centrally; metric filters and alarms provide alerting.', d: 2 },
  { q: 'A company wants to migrate a 10 TB on-premises SQL Server database to Amazon Aurora PostgreSQL with minimal downtime. Which steps are required? (Choose TWO)', o: ['Convert the schema with AWS SCT or DMS Schema Conversion', 'Use AWS DMS with full load and ongoing replication (CDC)', 'Use AWS Application Migration Service', 'Use AWS DataSync', 'Use Snowball Edge without DMS'], a: [0, 1], e: 'Heterogeneous migrations need schema conversion followed by DMS data migration with CDC for minimal downtime.', d: 2 },
  { q: 'A REST API on API Gateway backed by Lambda experiences occasional traffic spikes of 20,000 requests per second, causing 429 errors. What should be done FIRST?', o: ['Request API Gateway account throttle and Lambda concurrency quota increases', 'Move the API to EC2', 'Enable caching on all methods with TTL 0', 'Switch to SOAP'], a: 0, e: 'The default API Gateway limit is 10,000 rps per region and Lambda concurrency is 1,000 by default; both are soft limits that can be raised.', d: 3 },
  { q: 'A company stores sensitive documents in S3. It needs to know who accessed each object and must make sure that the documents are always encrypted with keys it controls. What should be done? (Choose TWO)', o: ['Enable CloudTrail data events for the bucket', 'Use default bucket encryption with SSE-KMS using a customer managed key and deny uploads without it', 'Enable S3 Transfer Acceleration', 'Use S3 One Zone-IA', 'Enable Requester Pays'], a: [0, 1], e: 'Data events record object-level access, and SSE-KMS with a customer managed key gives control and auditing of keys.', d: 1 },
  { q: 'A company wants to reduce latency for read-heavy product pages that query an Aurora MySQL database, with the least code changes. Most reads are identical. Which option offers the biggest improvement?', o: ['Add Aurora Replicas and use the reader endpoint', 'Enable Aurora Backtrack', 'Use Aurora Global Database', 'Increase the backup retention period'], a: 0, e: 'Aurora Replicas with the reader endpoint offload reads with only a connection string change. ElastiCache would help further but requires caching code.', d: 3 },
  { q: 'A company runs an application across two regions for DR. The primary region uses an ALB. The company wants clients to fail over automatically to the secondary region if the primary becomes unhealthy, without waiting for DNS TTLs to expire on clients. What should be used?', o: ['Route 53 failover routing with a 60-second TTL', 'AWS Global Accelerator with endpoint groups in both regions', 'CloudFront with geo restriction', 'VPC peering between regions'], a: 1, e: 'Global Accelerator uses static anycast IPs and reroutes traffic in seconds based on endpoint health, avoiding client DNS caching.', d: 2 },
  { q: 'A company wants to prevent its developers from accidentally making S3 buckets public in any account, now and in the future. What is the simplest effective control?', o: ['Enable S3 Block Public Access at the account level and enforce it with an SCP denying s3:PutAccountPublicAccessBlock', 'Train developers', 'Use Macie', 'Enable versioning'], a: 0, e: 'Account-level Block Public Access overrides bucket policies and ACLs; an SCP prevents disabling it.', d: 1 },
  { q: 'A company has a monolithic application with a reporting module that consumes heavy CPU at month end and slows down the transactional part. What is the BEST long-term architectural improvement?', o: ['Scale the monolith vertically', 'Decouple the reporting module into a separate service that reads from a read replica and processes jobs from a queue', 'Run reports on the primary database at night only', 'Add more EBS volumes'], a: 1, e: 'Decoupling with queues and read replicas isolates the workloads so each scales independently.', d: 3 }
];
