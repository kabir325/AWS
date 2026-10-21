svc({
  id: 'migration-strategy', name: 'Migration Strategy, MGN & Discovery', cat: 'migration', imp: 2,
  tag: 'The 7 Rs, discovery and planning tools, and AWS Application Migration Service for lift-and-shift.',
  s: [
    { h: 'The 7 Rs', i: [
      ['Retire', 'Turn off applications no longer needed.'],
      ['Retain', 'Keep on premises for now (not ready, compliance, recently upgraded).'],
      ['Rehost (lift and shift)', 'Move as-is to EC2 (e.g. with MGN). Fastest, no code changes.'],
      ['Relocate', 'Move infrastructure without purchasing new hardware, e.g. VMware Cloud on AWS.'],
      ['Replatform (lift, tinker and shift)', 'Small optimizations without changing core architecture, e.g. self-managed DB -> RDS, app -> Beanstalk.'],
      ['Repurchase (drop and shop)', 'Move to a different product, usually SaaS (CRM -> Salesforce).'],
      ['Refactor / re-architect', 'Redesign as cloud-native (serverless, microservices). Most effort, most benefit.']
    ]},
    { h: 'Discovery and planning', i: [
      ['AWS Application Discovery Service', 'Collect server inventory, utilization and dependencies from on-prem. Agentless (VMware vCenter collector) or agent-based (processes, network connections). Results in Migration Hub.'],
      ['AWS Migration Hub', 'Single place to track migration progress across tools; strategy recommendations; orchestrator templates.'],
      ['Migration Evaluator', 'Business case: projected cost of running on AWS based on current usage.'],
      ['AWS Transform', 'AI-assisted modernization (VMware, mainframe, .NET) - awareness.']
    ]},
    { h: 'AWS Application Migration Service (MGN)', i: [
      ['What', 'Primary lift-and-shift service (replaces Server Migration Service). Continuous block-level replication of physical, virtual or cloud servers into AWS.'],
      ['Process', 'Install replication agent -> data replicates to low-cost staging area -> launch test instances -> cutover with minimal downtime (minutes).'],
      ['Supports', 'Windows and Linux, any source infrastructure; converts boot volumes to run natively on EC2.'],
      ['vs Elastic Disaster Recovery', 'Same technology; MGN for one-time migration, DRS for ongoing DR.']
    ]},
    { h: 'Other migration helpers', i: [
      ['VM Import/Export', 'Import VM images (VMware, Hyper-V) as AMIs and export back.'],
      ['AWS DMS', 'Database migrations (see DMS).'],
      ['VMware Cloud on AWS', 'Run VMware SDDC on AWS bare metal: relocate vSphere workloads without conversion.']
    ]}
  ],
  tips: [
    'Lift-and-shift servers with minimal downtime -> AWS Application Migration Service (MGN).',
    'Discover on-prem servers, utilization and dependencies -> Application Discovery Service (agent for process-level dependencies).',
    'Move a self-managed DB to RDS without code changes -> replatform.',
    'Move to SaaS -> repurchase. Rewrite as serverless -> refactor.'
  ],
  q: [
    { q: 'A company wants to migrate 200 on-premises VMware and physical servers to AWS as-is with minimal downtime during cutover. Which service should be used?', o: ['AWS DataSync', 'AWS Application Migration Service', 'AWS DMS', 'AWS Snowball Edge'], a: 1, e: 'MGN performs continuous block-level replication and quick cutover for lift-and-shift.', d: 2 },
    { q: 'Before migrating, a company needs detailed information about running processes and network dependencies between its on-premises servers. What should be used?', o: ['Application Discovery Service agentless collector', 'Application Discovery Service agents installed on servers', 'AWS Config', 'Migration Evaluator only'], a: 1, e: 'The agent-based discovery collects process and network connection data for dependency mapping. The agentless collector gathers VM inventory and utilization.', d: 2 },
    { q: 'A company moves its self-managed MySQL database to Amazon RDS for MySQL without changing application code. Which migration strategy is this?', o: ['Rehost', 'Replatform', 'Refactor', 'Repurchase'], a: 1, e: 'Replatforming makes small optimizations, such as moving to a managed database, without changing the core architecture.', d: 3 }
  ]
});

svc({
  id: 'dms', name: 'AWS Database Migration Service (DMS)', cat: 'migration', imp: 3,
  tag: 'Migrate and replicate databases with minimal downtime; Schema Conversion for heterogeneous migrations.',
  s: [
    { h: 'Fundamentals', i: [
      ['What', 'Migrate databases to AWS while the source stays fully operational. Runs on a replication instance (or DMS Serverless).'],
      ['Migration types', 'Full load, full load + CDC (change data capture, ongoing replication), CDC only.'],
      ['Homogeneous', 'Same engine (Oracle -> RDS Oracle, MySQL -> Aurora MySQL). DMS homogeneous migrations use native tools.'],
      ['Heterogeneous', 'Different engines (Oracle -> Aurora PostgreSQL, SQL Server -> MySQL): convert schema first with DMS Schema Conversion or AWS SCT, then migrate data with DMS.'],
      ['Sources and targets', 'Sources: Oracle, SQL Server, MySQL, PostgreSQL, MongoDB, SAP, Db2, S3, Azure SQL. Targets: RDS, Aurora, Redshift, DynamoDB, S3, OpenSearch, Kinesis, DocumentDB, Neptune, Kafka.']
    ]},
    { h: 'Operations', i: [
      ['Multi-AZ replication instance', 'Synchronous standby for HA of the migration itself.'],
      ['Validation', 'Data validation compares source and target rows.'],
      ['Large databases', 'Combine with Snowball Edge: SCT extracts data to the device, ship to AWS, DMS applies ongoing changes (CDC).'],
      ['Continuous replication', 'DMS can be used for ongoing replication to analytics targets (S3, Redshift, Kinesis).']
    ]}
  ],
  tips: [
    'Migrate a database with minimal downtime -> DMS with full load + CDC.',
    'Different source and target engines -> SCT / DMS Schema Conversion + DMS.',
    'Same engine -> DMS only (or native tools).',
    'Very large DB over slow network -> Snowball Edge + DMS CDC.',
    'Replicate on-prem DB changes continuously into S3 data lake -> DMS CDC to S3.'
  ],
  q: [
    { q: 'A company must migrate an on-premises Oracle database to Amazon Aurora PostgreSQL with minimal downtime. Which combination should be used?', o: ['AWS DataSync and DMS', 'AWS Schema Conversion Tool (or DMS Schema Conversion) and AWS DMS with CDC', 'AWS Snowball and S3', 'Application Migration Service only'], a: 1, e: 'Heterogeneous migrations require schema conversion, then DMS migrates data and replicates ongoing changes.', d: 2 },
    { q: 'A company is migrating MySQL on premises to Amazon RDS for MySQL and needs the source to remain available during migration. What should DMS be configured to do?', o: ['Full load only', 'Full load plus change data capture (CDC)', 'CDC only before the full load', 'Schema conversion'], a: 1, e: 'Full load + CDC copies existing data and then continuously applies changes until cutover.', d: 2 },
    { q: 'A 50 TB database must be migrated but the network link is slow. Ongoing changes must also be captured. What is the BEST approach?', o: ['DMS over the internet only', 'Use Snowball Edge with SCT data extraction for the bulk load and DMS CDC for ongoing changes', 'Export to CSV and email', 'Use Storage Gateway'], a: 1, e: 'Snowball moves the bulk data offline, while DMS replicates changes made since extraction.', d: 3 }
  ]
});

svc({
  id: 'datasync-transfer', name: 'DataSync & Transfer Family', cat: 'migration', imp: 2,
  tag: 'Online data movement: DataSync for scheduled/bulk file transfers, Transfer Family for managed SFTP/FTPS/FTP/AS2.',
  s: [
    { h: 'AWS DataSync', i: [
      ['What', 'Online service to move large amounts of data between on-prem storage (NFS, SMB, HDFS, object storage), other clouds, and AWS storage (S3 any class, EFS, FSx).'],
      ['Agent', 'Deploy a DataSync agent VM on premises (not needed for AWS-to-AWS transfers like EFS -> EFS, S3 -> S3).'],
      ['Features', 'Up to 10 Gbps per task, scheduling (hourly/daily/weekly), bandwidth throttling, encryption in transit, data integrity validation, preserves metadata and permissions (POSIX, NTFS).'],
      ['Use cases', 'One-time migrations, recurring sync, replication for DR, archive to S3 Glacier.'],
      ['vs Storage Gateway', 'DataSync moves data; Storage Gateway provides ongoing hybrid access.']
    ]},
    { h: 'AWS Transfer Family', i: [
      ['What', 'Fully managed SFTP, FTPS, FTP and AS2 servers storing data in S3 or EFS.'],
      ['Why', 'Migrate existing file transfer workflows (partners using SFTP) without changing clients.'],
      ['Auth', 'Service-managed users, AWS Directory Service / AD, or custom IdP via Lambda/API Gateway.'],
      ['Endpoints', 'Public, VPC (internal or internet-facing with Elastic IPs).'],
      ['Managed workflows', 'Post-upload processing (copy, tag, decrypt, Lambda).']
    ]}
  ],
  tips: [
    'Online migration or scheduled sync of NFS/SMB data to S3/EFS/FSx -> DataSync.',
    'Partners exchange files via SFTP, store in S3 -> Transfer Family.',
    'Copy data between EFS file systems or regions -> DataSync (no agent).'
  ],
  q: [
    { q: 'A company needs to transfer 100 TB from an on-premises NFS server to Amazon S3 over a 10 Gbps Direct Connect link and then keep the data in sync daily. Which service should be used?', o: ['AWS DataSync', 'AWS Snowball Edge', 'S3 Transfer Acceleration', 'AWS Transfer Family'], a: 0, e: 'DataSync performs high-speed online transfers with scheduling and incremental syncs.', d: 3 },
    { q: 'External partners upload files using SFTP clients. The company wants to store them in S3 without managing servers or changing partner workflows. What should be used?', o: ['EC2 with an SFTP server', 'AWS Transfer Family', 'S3 pre-signed URLs', 'AWS DataSync'], a: 1, e: 'Transfer Family offers managed SFTP endpoints backed by S3 or EFS.', d: 3 },
    { q: 'Data must be copied from an EFS file system in us-east-1 to an EFS file system in eu-west-1 on a schedule. What is the simplest solution?', o: ['AWS DataSync task between the two EFS locations', 'rsync from an EC2 instance', 'AWS Snowball', 'S3 Cross-Region Replication'], a: 0, e: 'DataSync supports AWS-to-AWS transfers including EFS to EFS across regions on a schedule (EFS Replication is also an option).', d: 2 }
  ]
});

svc({
  id: 'snow', name: 'AWS Snow Family', cat: 'migration', imp: 2,
  tag: 'Physical devices for offline data transfer and edge computing where networks are slow, expensive or absent.',
  s: [
    { h: 'Devices', i: [
      ['Snowball Edge Storage Optimized', 'Large capacity (210 TB on current devices; older 80 TB) for bulk data migration; some compute.'],
      ['Snowball Edge Compute Optimized', 'More vCPU/memory (optional GPU) for edge computing in disconnected environments (ships, mines, military).'],
      ['Snowcone', 'Small, rugged device (8-14 TB) with DataSync agent. Discontinued for new orders (Nov 2024), may still appear in questions.'],
      ['Snowmobile', 'Exabyte-scale truck. Retired; for exam awareness only.'],
      ['Availability note', 'AWS limited Snow Family to existing customers in 2025; for new projects AWS suggests DataSync, Data Transfer Terminal, or Outposts. The exam still tests the concept.']
    ]},
    { h: 'Usage', i: [
      ['Process', 'Order in console -> device shipped -> copy data locally (Snowball client / S3 adapter / NFS) -> ship back -> data imported into S3 -> device securely erased.'],
      ['Rule of thumb', 'If transfer over the network would take more than about a week, use Snowball. 100 TB over a 1 Gbps link takes about 12+ days.'],
      ['Edge computing', 'Run EC2 instances and Lambda on the device for local processing before shipping.'],
      ['Glacier', 'Snowball cannot import directly into Glacier: import to S3, then lifecycle to Glacier.'],
      ['Security', 'Tamper-resistant, KMS encryption, chain of custody tracking.']
    ]}
  ],
  tips: [
    'Petabytes / limited bandwidth / migration would take weeks over network -> Snowball Edge.',
    'Processing data at a remote site with no connectivity -> Snowball Edge Compute Optimized.',
    'Snowball imports into S3; use a lifecycle rule to reach Glacier.',
    'Calculate: data size / bandwidth. If > ~1 week, ship it.'
  ],
  q: [
    { q: 'A company needs to migrate 500 TB of data to S3. It has a 500 Mbps internet connection that is already heavily used. What is the FASTEST and most cost-effective option?', o: ['Upload over the internet with multipart upload', 'Use multiple AWS Snowball Edge Storage Optimized devices', 'Set up a Site-to-Site VPN', 'Use S3 Transfer Acceleration'], a: 1, e: '500 TB over 500 Mbps would take months. Snowball devices move the data physically in weeks.', d: 3 },
    { q: 'A research ship collects terabytes of sensor data with no network connectivity and must pre-process data on board. Which option fits?', o: ['Snowball Edge Compute Optimized', 'AWS Outposts', 'AWS Storage Gateway', 'AWS DataSync'], a: 0, e: 'Snowball Edge Compute Optimized provides compute at disconnected edge locations and can ship data back to AWS.', d: 3 },
    { q: 'Data imported with Snowball must end up in S3 Glacier Deep Archive at the lowest cost. What should be done?', o: ['Select Glacier Deep Archive as the Snowball import target', 'Import into S3, then use a lifecycle policy to transition to Deep Archive', 'Use Storage Gateway', 'Use DataSync from Snowball to Glacier directly'], a: 1, e: 'Snowball imports into S3; lifecycle rules transition objects to Glacier classes.', d: 4 }
  ]
});
