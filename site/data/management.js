svc({
  id: 'cloudwatch', name: 'Amazon CloudWatch', cat: 'management', imp: 3,
  tag: 'Metrics, alarms, logs, dashboards, agent, and observability for AWS resources and applications.',
  s: [
    { h: 'Metrics', i: [
      ['Namespaces and dimensions', 'Metrics grouped by namespace (AWS/EC2) and dimensions (InstanceId). Retained up to 15 months (granularity decreases over time).'],
      ['EC2 default metrics', 'CPU, network, disk I/O (instance store), status checks every 5 minutes; detailed monitoring = 1 minute (paid).'],
      ['NOT collected by default', 'Memory utilization, disk space usage, process counts: require the CloudWatch agent (or custom metrics).'],
      ['Custom metrics', 'PutMetricData; standard 1-minute or high-resolution down to 1 second.'],
      ['Metric streams', 'Near-real-time stream of metrics to Firehose (S3, third-party tools).'],
      ['Metric math / anomaly detection', 'Combine metrics; ML band of expected values for alarms.']
    ]},
    { h: 'Alarms', i: [
      ['States', 'OK, ALARM, INSUFFICIENT_DATA. Evaluate a metric over periods (e.g. 3 of 5 datapoints).'],
      ['Actions', 'SNS notification, EC2 actions (stop, terminate, reboot, recover), Auto Scaling policy, Systems Manager OpsItem/incident, Lambda (via SNS or direct).'],
      ['Composite alarms', 'Combine multiple alarms with AND/OR to reduce noise.'],
      ['EC2 recover', 'StatusCheckFailed_System alarm with recover action moves instance to new hardware keeping IPs, EBS and metadata.'],
      ['Billing alarms', 'EstimatedCharges metric in us-east-1 (or use AWS Budgets).']
    ]},
    { h: 'CloudWatch Logs', i: [
      ['Structure', 'Log groups (retention: never expire by default, 1 day - 10 years) and log streams. KMS encryption.'],
      ['Sources', 'CloudWatch agent (EC2/on-prem), Lambda, ECS/EKS, API Gateway, VPC Flow Logs, Route 53 query logs, CloudTrail.'],
      ['Metric filters', 'Turn log patterns (e.g. "ERROR", 4xx counts) into metrics and alarm on them.'],
      ['Logs Insights', 'Interactive query language to search and aggregate logs.'],
      ['Subscription filters', 'Real-time stream to Kinesis Data Streams, Firehose, Lambda or OpenSearch; cross-account aggregation.'],
      ['Export to S3', 'Batch export (CreateExportTask, up to 12 h delay) for archival; use subscriptions for real time.'],
      ['Live Tail and Infrequent Access class', 'Real-time tail of logs; cheaper log class with fewer features.']
    ]},
    { h: 'Observability features', i: [
      ['CloudWatch agent', 'Unified agent for system-level metrics (memory, disk, swap) and logs from EC2 and on-prem servers. Config stored in SSM Parameter Store.'],
      ['Container Insights', 'Metrics and logs for ECS, EKS, Kubernetes, Fargate.'],
      ['Lambda Insights / Application Insights', 'Enhanced monitoring for serverless and common app stacks (.NET, SQL Server).'],
      ['Synthetics canaries', 'Scripted checks of endpoints and UI flows on a schedule.'],
      ['RUM / Application Signals', 'Real user monitoring and service-level observability.'],
      ['AWS X-Ray', 'Distributed tracing across microservices to find latency bottlenecks and errors (service map).'],
      ['Dashboards', 'Cross-account, cross-region dashboards.']
    ]}
  ],
  tips: [
    'Monitor memory or disk space on EC2 -> install CloudWatch agent.',
    'Automatically recover an instance from hardware failure -> CloudWatch alarm with EC2 recover action.',
    'Alert on a specific error string in logs -> metric filter + alarm.',
    'Real-time log processing / centralization -> subscription filter to Kinesis/Firehose/Lambda.',
    'Trace requests across microservices -> X-Ray.',
    'Reduce alarm noise -> composite alarms.'
  ],
  q: [
    { q: 'A company needs to monitor memory utilization of its EC2 instances and alarm when it exceeds 80%. What should be done?', o: ['Enable detailed monitoring', 'Install and configure the CloudWatch agent to publish memory metrics', 'Use the default EC2 metrics', 'Enable VPC Flow Logs'], a: 1, e: 'Memory metrics are not available by default; the CloudWatch agent publishes them as custom metrics.', d: 3 },
    { q: 'An application writes logs to CloudWatch Logs. The team wants an alarm when the word "FATAL" appears more than 5 times in 5 minutes. What should be configured?', o: ['A subscription filter to Lambda', 'A metric filter and a CloudWatch alarm', 'CloudTrail Insights', 'Logs Insights scheduled query only'], a: 1, e: 'Metric filters convert matching log events to metrics, which alarms can monitor.', d: 2 },
    { q: 'An EC2 instance must automatically be recovered onto healthy hardware if the underlying host fails, keeping the same instance ID and IP addresses. What should be used?', o: ['Auto Scaling group of size 1', 'CloudWatch alarm on StatusCheckFailed_System with the EC2 recover action', 'AWS Backup', 'Route 53 health check'], a: 1, e: 'The recover action migrates the instance to new hardware preserving ID, private IPs, Elastic IPs and EBS volumes.', d: 2 },
    { q: 'A company wants to stream logs from many accounts in real time to a central account for analysis in OpenSearch. What should be used?', o: ['CloudWatch Logs export tasks to S3', 'CloudWatch Logs subscription filters to a cross-account destination (Kinesis/Firehose)', 'CloudTrail Lake', 'AWS Config aggregator'], a: 1, e: 'Subscription filters deliver logs in real time, including cross-account via destinations.', d: 3 },
    { q: 'Developers need to identify which microservice is causing high latency in a distributed application. Which service should be used?', o: ['AWS X-Ray', 'AWS CloudTrail', 'Amazon Inspector', 'VPC Flow Logs'], a: 0, e: 'X-Ray traces requests across services and visualizes latency in a service map.', d: 3 }
  ]
});

svc({
  id: 'cloudtrail', name: 'AWS CloudTrail', cat: 'management', imp: 3,
  tag: 'Audit log of API calls and account activity: management, data and Insights events, trails, CloudTrail Lake.',
  s: [
    { h: 'Fundamentals', i: [
      ['What', 'Records API calls made via Console, SDK, CLI and AWS services: who, what, when, from where. Enabled by default.'],
      ['Event history', '90 days of management events viewable/searchable for free.'],
      ['Trails', 'Deliver events to an S3 bucket (and optionally CloudWatch Logs) for long-term retention. Apply to all regions (recommended) or one. Organization trail covers all accounts.'],
      ['Delivery', 'Events typically delivered within ~5 minutes (not real time).']
    ]},
    { h: 'Event types', i: [
      ['Management events', 'Control plane operations (CreateBucket, RunInstances, AttachRolePolicy). Logged by default. Read/write can be separated.'],
      ['Data events', 'Data plane operations (S3 GetObject/PutObject, Lambda Invoke, DynamoDB item activity). NOT logged by default (high volume, extra cost).'],
      ['Insights events', 'Detect unusual write/error activity (bursts of API calls, hitting limits) compared to baseline.'],
      ['Network activity events', 'API calls made through VPC endpoints.']
    ]},
    { h: 'Security and analysis', i: [
      ['Log file integrity validation', 'SHA-256 digest files prove logs were not modified or deleted.'],
      ['Protect logs', 'S3 bucket in a separate log-archive account, SSE-KMS, Object Lock/MFA Delete, SCP to deny StopLogging/DeleteTrail.'],
      ['Athena', 'Query CloudTrail logs in S3 with SQL.'],
      ['CloudTrail Lake', 'Managed event data lake with SQL queries, retention up to 10 years; ingest non-AWS events.'],
      ['EventBridge', 'React to specific API calls in near real time (e.g. alert when someone deletes a security group).']
    ]}
  ],
  tips: [
    'Who deleted / changed this resource? -> CloudTrail.',
    'Track S3 object-level access or Lambda invocations -> enable CloudTrail data events.',
    'Prove logs were not tampered with -> log file integrity validation.',
    'Single trail for all accounts -> organization trail in the management account.',
    'Retain beyond 90 days -> create a trail to S3 (or CloudTrail Lake).',
    'CloudTrail = API activity (who did what). Config = resource configuration and compliance over time. CloudWatch = performance metrics/logs.'
  ],
  q: [
    { q: 'A security team needs to determine which IAM user terminated a production EC2 instance yesterday. Which service should be used?', o: ['Amazon CloudWatch metrics', 'AWS CloudTrail', 'AWS Config', 'VPC Flow Logs'], a: 1, e: 'CloudTrail records API calls including the identity that called TerminateInstances.', d: 1 },
    { q: 'Auditors require a record of every GetObject request on a sensitive S3 bucket. What must be enabled?', o: ['CloudTrail management events', 'CloudTrail data events for the S3 bucket', 'S3 Inventory', 'AWS Config rules'], a: 1, e: 'Object-level operations are data events, which are not logged by default.', d: 1 },
    { q: 'A company must prove that CloudTrail log files have not been altered after delivery. What should be enabled?', o: ['S3 versioning', 'CloudTrail log file integrity validation', 'KMS rotation', 'CloudWatch Logs retention'], a: 1, e: 'Integrity validation creates signed digest files to verify logs are unchanged.', d: 1 },
    { q: 'A company with 40 accounts wants all API activity logged to one central S3 bucket with minimal setup. What should be used?', o: ['A trail in every account', 'An organization trail created from the management account', 'AWS Config aggregator', 'CloudWatch cross-account dashboards'], a: 1, e: 'Organization trails automatically log events for all member accounts.', d: 1 }
  ]
});

svc({
  id: 'config', name: 'AWS Config', cat: 'management', imp: 2,
  tag: 'Resource inventory, configuration history and compliance evaluation with managed or custom rules and auto-remediation.',
  s: [
    { h: 'Core features', i: [
      ['Configuration recorder', 'Records configuration of supported resources and changes over time (configuration items) to S3; notifications via SNS.'],
      ['Configuration timeline', 'See what a resource looked like at any point and its relationships (e.g. which SG was attached to an instance last Tuesday).'],
      ['Config rules', 'Evaluate compliance: AWS managed rules (s3-bucket-public-read-prohibited, encrypted-volumes, restricted-ssh, required-tags) or custom rules (Lambda or Guard). Triggered on change or periodically.'],
      ['Detect, do not prevent', 'Config rules flag non-compliance; they do not block actions (use SCPs/IAM for prevention).']
    ]},
    { h: 'Remediation and scale', i: [
      ['Remediation', 'Automatic or manual remediation using SSM Automation documents (e.g. re-enable bucket encryption, remove open SSH rules).'],
      ['Conformance packs', 'Collections of rules and remediations deployed as one unit (e.g. PCI, HIPAA operational best practices), across an organization.'],
      ['Aggregators', 'Multi-account, multi-region view of compliance in one account.'],
      ['Integrations', 'EventBridge for compliance change events; Security Hub uses Config; Control Tower detective controls use Config.']
    ]}
  ],
  tips: [
    'Track configuration changes and history of resources -> Config.',
    'Continuously check resources for compliance (encryption, tags, public buckets) -> Config rules.',
    'Automatically fix non-compliant resources -> Config remediation with SSM Automation.',
    'Organization-wide compliance view -> Config aggregator / conformance packs.'
  ],
  q: [
    { q: 'A company needs to know how the security group of an EC2 instance was configured two weeks ago. Which service provides this information?', o: ['AWS CloudTrail', 'AWS Config', 'Amazon Inspector', 'VPC Reachability Analyzer'], a: 1, e: 'Config records configuration history and provides a timeline of resource configurations.', d: 1 },
    { q: 'A company must continuously check that all EBS volumes are encrypted and automatically notify when a non-compliant volume is created. What should be used?', o: ['AWS Config managed rule encrypted-volumes with SNS notifications', 'IAM policy', 'AWS Trusted Advisor', 'Amazon Macie'], a: 0, e: 'Config managed rules evaluate compliance continuously and integrate with SNS/EventBridge.', d: 1 },
    { q: 'Security groups that allow SSH from 0.0.0.0/0 must be automatically corrected when detected. What is the BEST solution?', o: ['AWS Config rule restricted-ssh with automatic remediation via SSM Automation', 'Manual weekly review', 'GuardDuty', 'Shield Advanced'], a: 0, e: 'Config can automatically remediate non-compliant resources using Systems Manager Automation runbooks.', d: 1 }
  ]
});

svc({
  id: 'ssm', name: 'AWS Systems Manager', cat: 'management', imp: 2,
  tag: 'Operate fleets of EC2 and on-prem servers: Session Manager, Run Command, Patch Manager, Automation, Parameter Store, Inventory.',
  s: [
    { h: 'Capabilities', i: [
      ['SSM Agent', 'Installed on managed nodes (EC2 AMIs, on-prem servers via hybrid activations). Instance needs an IAM role with AmazonSSMManagedInstanceCore and network access to SSM endpoints (NAT or VPC endpoints).'],
      ['Session Manager', 'Browser/CLI shell access without SSH keys, bastion hosts or open inbound ports. IAM controlled; sessions logged to S3/CloudWatch.'],
      ['Run Command', 'Run scripts/commands across many instances at scale without SSH (rate control, error thresholds).'],
      ['Patch Manager', 'Automate OS and application patching with patch baselines and maintenance windows; compliance reporting.'],
      ['Automation', 'Runbooks to perform operational tasks (create AMI, restart instance, remediate Config findings).'],
      ['State Manager', 'Keep instances in a defined state (agent installed, settings applied) on a schedule.'],
      ['Parameter Store', 'Configuration and secrets storage (see Secrets entry).'],
      ['Inventory', 'Collect software and configuration metadata from instances.'],
      ['OpsCenter / Incident Manager', 'Aggregate operational issues (OpsItems) and manage incidents with response plans.'],
      ['Distributor / Fleet Manager', 'Package distribution; UI to manage nodes.']
    ]}
  ],
  tips: [
    'Shell access to private instances without SSH/bastion/open ports -> Session Manager.',
    'Patch many instances on a schedule -> Patch Manager + maintenance windows.',
    'Run a command on hundreds of instances -> Run Command.',
    'Instances not appearing in Systems Manager -> check SSM agent, IAM instance role and endpoint connectivity.'
  ],
  q: [
    { q: 'A company wants administrators to access shell sessions on private EC2 instances without opening port 22, managing SSH keys, or using bastion hosts, with full session logging. What should be used?', o: ['EC2 Instance Connect with public IPs', 'AWS Systems Manager Session Manager', 'A bastion host with MFA', 'Site-to-Site VPN'], a: 1, e: 'Session Manager provides IAM-controlled shell access through the SSM agent with logging and no inbound ports.', d: 1 },
    { q: 'An operations team must apply OS security patches to 500 EC2 instances every Sunday night and report compliance. What should be used?', o: ['SSM Patch Manager with a maintenance window', 'User data scripts', 'AWS Config', 'Amazon Inspector'], a: 0, e: 'Patch Manager automates patching using baselines and maintenance windows and reports compliance.', d: 1 },
    { q: 'EC2 instances in a private subnet without internet access do not appear as managed nodes in Systems Manager. The SSM agent is installed. What could fix this? (Choose TWO)', o: ['Attach an instance profile with the AmazonSSMManagedInstanceCore policy', 'Create interface VPC endpoints for ssm, ssmmessages and ec2messages', 'Open inbound port 22', 'Assign Elastic IPs', 'Enable detailed monitoring'], a: [0, 1], e: 'Managed nodes need IAM permissions and network connectivity to SSM endpoints (via NAT or VPC endpoints).', d: 1 }
  ]
});

svc({
  id: 'cloudformation', name: 'AWS CloudFormation & IaC', cat: 'management', imp: 2,
  tag: 'Infrastructure as code: templates, stacks, change sets, StackSets, drift detection, CDK and Service Catalog.',
  s: [
    { h: 'Concepts', i: [
      ['Template', 'YAML/JSON: Parameters, Mappings, Conditions, Resources (required), Outputs. Intrinsic functions: Ref, Fn::GetAtt, Fn::Sub, Fn::ImportValue.'],
      ['Stack', 'Set of resources managed as one unit; create, update, delete together. Failed creation rolls back by default.'],
      ['Change sets', 'Preview what will change before executing an update.'],
      ['Nested stacks / cross-stack references', 'Reuse components; export outputs and import in other stacks.'],
      ['Drift detection', 'Find resources changed manually outside CloudFormation.']
    ]},
    { h: 'Advanced features', i: [
      ['StackSets', 'Deploy stacks across multiple accounts and regions from one template (with Organizations auto-deployment to new accounts).'],
      ['DeletionPolicy', 'Retain or Snapshot (RDS, EBS, ElastiCache...) a resource when the stack is deleted. UpdateReplacePolicy similar for replacements.'],
      ['Stack policies', 'Protect critical resources from updates.'],
      ['Helper scripts and signals', 'cfn-init, cfn-signal with CreationPolicy / WaitCondition to wait for EC2 bootstrapping.'],
      ['Custom resources', 'Lambda-backed logic for unsupported actions (e.g. empty an S3 bucket before delete).'],
      ['Termination protection', 'Prevent accidental stack deletion.']
    ]},
    { h: 'Related tools', i: [
      ['AWS CDK', 'Define infrastructure in TypeScript, Python, Java, etc.; synthesizes CloudFormation.'],
      ['AWS SAM', 'Serverless Application Model: simplified CloudFormation for Lambda, API Gateway, DynamoDB.'],
      ['AWS Service Catalog', 'Admins publish approved products (CloudFormation templates) to a portfolio; users self-service launch only approved, compliant resources with constrained permissions.'],
      ['AWS Proton / Application Composer', 'Platform templates for microservices; visual IaC designer.']
    ]}
  ],
  tips: [
    'Replicate infrastructure consistently in multiple environments / regions -> CloudFormation.',
    'Same stack in many accounts and regions -> StackSets.',
    'Keep the database when the stack is deleted -> DeletionPolicy: Retain or Snapshot.',
    'Detect manual changes -> drift detection.',
    'Let users launch only approved resources without broad IAM permissions -> Service Catalog.'
  ],
  q: [
    { q: 'A company wants to deploy a standard security baseline (IAM roles, Config rules) into every account in its organization, including new accounts automatically. What should be used?', o: ['CloudFormation StackSets with service-managed permissions and automatic deployment', 'A CloudFormation stack per account created manually', 'AWS Elastic Beanstalk', 'AWS CodeDeploy'], a: 0, e: 'StackSets integrated with Organizations can deploy automatically to new accounts in target OUs.', d: 1 },
    { q: 'When a CloudFormation stack is deleted, the production RDS database must be preserved as a snapshot. What should be set?', o: ['Termination protection on the stack', 'DeletionPolicy: Snapshot on the RDS resource', 'A stack policy', 'Drift detection'], a: 1, e: 'DeletionPolicy Snapshot creates a final snapshot before deleting the resource.', d: 2 },
    { q: 'An administrator wants end users to launch only pre-approved EC2 and RDS configurations without granting them broad permissions. What should be used?', o: ['AWS Service Catalog', 'AWS Config', 'IAM Access Analyzer', 'AWS Organizations tag policies'], a: 0, e: 'Service Catalog provides governed self-service of approved CloudFormation products with launch constraints.', d: 1 }
  ]
});

svc({
  id: 'cost-management', name: 'Cost Management & Trusted Advisor', cat: 'management', imp: 3,
  tag: 'Cost Explorer, Budgets, Cost and Usage Reports, Compute Optimizer, Savings Plans, tags, Trusted Advisor and cost-optimization patterns.',
  s: [
    { h: 'Visibility and control', i: [
      ['AWS Cost Explorer', 'Visualize and analyze costs/usage over time, filter by service, account, tag; forecasts up to 12 months; RI and Savings Plans recommendations and utilization/coverage reports.'],
      ['AWS Budgets', 'Set cost, usage, RI/SP utilization or coverage budgets; alert via email/SNS when actual or forecasted spend exceeds thresholds; budget actions can apply IAM/SCP policies or stop EC2/RDS.'],
      ['Cost and Usage Report (CUR) / Data Exports', 'Most detailed billing data (hourly, per resource) delivered to S3; analyze with Athena, QuickSight.'],
      ['Cost allocation tags', 'Activate user-defined (e.g. CostCenter) and AWS-generated tags to break down costs by team/project.'],
      ['Cost Anomaly Detection', 'ML monitors spend and alerts on unusual cost spikes.'],
      ['Pricing Calculator', 'Estimate cost of planned architectures.'],
      ['Billing alarms', 'CloudWatch EstimatedCharges metric (us-east-1).']
    ]},
    { h: 'Optimization tools', i: [
      ['AWS Compute Optimizer', 'ML-based right-sizing recommendations for EC2, ASGs, EBS volumes, Lambda memory, ECS on Fargate, RDS, using CloudWatch metrics.'],
      ['AWS Trusted Advisor', 'Checks across cost optimization, performance, security, fault tolerance, service limits, operational excellence. Basic/Developer support: core security checks + service quotas. Business/Enterprise: all checks + API.'],
      ['Savings Plans & RIs', 'Commit for 1/3 years: Compute SP (most flexible), EC2 Instance SP, RIs for EC2, RDS, ElastiCache, Redshift, OpenSearch, DynamoDB reserved capacity.'],
      ['Instance Scheduler', 'Solution to stop/start EC2 and RDS on schedules (e.g. dev environments off nights/weekends).']
    ]},
    { h: 'Cost-optimization patterns', i: [
      ['Right-size', 'Downsize underutilized instances; move to Graviton; gp2 -> gp3.'],
      ['Purchase model', 'Spot for fault-tolerant, SP/RI for steady, On-Demand for spiky.'],
      ['Storage tiering', 'S3 lifecycle / Intelligent-Tiering, EFS IA, EBS snapshot archive, delete unattached EBS volumes and old snapshots, release unused Elastic IPs.'],
      ['Networking', 'VPC gateway endpoints instead of NAT for S3/DynamoDB, CloudFront to reduce egress, keep traffic in one AZ when possible.'],
      ['Serverless', 'Pay per use for intermittent workloads (Lambda, Fargate, Aurora Serverless, DynamoDB on-demand).'],
      ['Managed services', 'Reduce operational cost (TCO) by removing undifferentiated work.']
    ]}
  ],
  tips: [
    'Alert when forecasted spend exceeds budget -> AWS Budgets.',
    'Analyze historical spend and get SP/RI recommendations -> Cost Explorer.',
    'Per-resource detailed billing for custom analysis -> CUR / Data Exports + Athena.',
    'Right-size EC2/Lambda/EBS from utilization -> Compute Optimizer.',
    'Break down costs by department -> cost allocation tags (must be activated in Billing).',
    'Unexpected spend spike detection -> Cost Anomaly Detection.'
  ],
  q: [
    { q: 'A finance team wants to receive an alert when the forecasted monthly AWS spend is expected to exceed $10,000. What should be used?', o: ['AWS Cost Explorer', 'AWS Budgets with a forecasted cost alert', 'Trusted Advisor', 'Compute Optimizer'], a: 1, e: 'Budgets supports alerts on actual and forecasted spend.', d: 4 },
    { q: 'A company wants machine-learning-based recommendations to right-size its EC2 instances and Lambda function memory. Which service should be used?', o: ['AWS Compute Optimizer', 'AWS Budgets', 'Cost and Usage Report', 'AWS Config'], a: 0, e: 'Compute Optimizer analyzes utilization and recommends optimal resource configurations.', d: 4 },
    { q: 'Management wants AWS costs broken down by department. Each department tags resources with "Department". What else is required?', o: ['Activate the Department tag as a cost allocation tag in the Billing console', 'Create a separate VPC per department', 'Enable CloudTrail data events', 'Use AWS Config'], a: 0, e: 'User-defined tags must be activated as cost allocation tags to appear in billing reports.', d: 4 },
    { q: 'Development EC2 instances run 24/7 but are used only during business hours on weekdays. What is the MOST cost-effective change?', o: ['Purchase 3-year Reserved Instances', 'Stop instances outside business hours using a scheduler (e.g. Instance Scheduler or EventBridge + Lambda)', 'Move to Dedicated Hosts', 'Use larger instances'], a: 1, e: 'Stopping instances for ~70% of the week saves more than RIs for workloads that do not need to run continuously.', d: 4 },
    { q: 'Which actions reduce costs WITHOUT affecting performance? (Choose TWO)', o: ['Delete unattached EBS volumes and release unused Elastic IPs', 'Migrate gp2 volumes to gp3', 'Move production databases to Spot Instances', 'Disable Multi-AZ on production databases', 'Switch all instances to burstable T types'], a: [0, 1], e: 'Unused resources cost money for nothing, and gp3 is cheaper with equal or better baseline performance.', d: 4 }
  ]
});
