svc({
  id: 'ec2', name: 'Amazon EC2', cat: 'compute', imp: 3,
  tag: 'Resizable virtual servers: instance families, purchasing options, placement groups, networking, AMIs and instance storage.',
  s: [
    { h: 'Instance families', i: [
      ['General purpose (M, T, Mac)', 'Balanced CPU/memory. T = burstable with CPU credits (T3/T4g unlimited mode can burst beyond credits for a fee).'],
      ['Compute optimized (C)', 'High CPU-to-memory ratio: batch processing, media transcoding, HPC, gaming servers, ML inference.'],
      ['Memory optimized (R, X, z, High Memory)', 'Large in-memory databases, real-time big data, caches (e.g. SAP HANA on X / High Memory).'],
      ['Storage optimized (I, D, H)', 'Very high local NVMe IOPS / sequential throughput: NoSQL, data warehousing, distributed file systems, OLTP.'],
      ['Accelerated computing (P, G, Inf, Trn, F)', 'GPUs for ML training (P, Trn), graphics (G), inference (Inf), FPGAs (F).'],
      ['Naming', 'm7g.2xlarge = family m, generation 7, attribute g (Graviton/ARM), size 2xlarge. Graviton = better price-performance.']
    ]},
    { h: 'Purchasing options', i: [
      ['On-Demand', 'Pay per second (Linux/Windows) with no commitment. Short, unpredictable, uninterruptible workloads.'],
      ['Reserved Instances (RI)', '1 or 3 years, up to ~72% off. Standard RI (biggest discount, can modify AZ/size within family) vs Convertible RI (can change family/OS, ~66% off). Can sell Standard RIs on the RI Marketplace. Scope: regional or zonal (zonal reserves capacity).'],
      ['Savings Plans', 'Commit to $/hour for 1 or 3 years. Compute Savings Plans: any family, region, OS, plus Fargate and Lambda (up to ~66%). EC2 Instance Savings Plans: fixed family + region (up to ~72%).'],
      ['Spot Instances', 'Spare capacity, up to 90% off, reclaimed with a 2-minute warning. For fault-tolerant, stateless, flexible workloads: batch, CI, big data, containers. Never for databases or critical single instances.'],
      ['Spot Fleet / EC2 Fleet', 'Mix of Spot and On-Demand across many instance types and AZs. Allocation strategies: price-capacity-optimized (recommended), capacity-optimized, lowest-price, diversified.'],
      ['Dedicated Hosts', 'A whole physical server dedicated to you with visibility of sockets/cores. Needed for BYOL licenses bound to sockets/cores (Windows Server, SQL Server, Oracle) and some compliance. Most expensive.'],
      ['Dedicated Instances', 'Instances on hardware dedicated to your account, but no control of placement/host visibility.'],
      ['On-Demand Capacity Reservations', 'Reserve capacity in a specific AZ for any duration with no term commitment; billed whether used or not. Combine with Savings Plans/regional RIs for a discount.']
    ]},
    { h: 'Placement groups', i: [
      ['Cluster', 'Instances packed close together in one AZ on low-latency, high-bandwidth network (up to 100 Gbps with enhanced networking). HPC, tightly coupled jobs. Risk: AZ / rack failure affects all.'],
      ['Spread', 'Each instance on distinct hardware racks. Max 7 running instances per AZ per group. Small number of critical instances that must not fail together.'],
      ['Partition', 'Instances divided into partitions (up to 7 per AZ), each on separate racks; hundreds of instances. Large distributed, replicated workloads: HDFS, HBase, Cassandra, Kafka. Instances can read their partition via metadata.']
    ]},
    { h: 'Networking', i: [
      ['ENI (Elastic Network Interface)', 'Virtual NIC bound to one AZ: primary private IPv4, secondary IPs, one Elastic IP per private IP, security groups, MAC. Can be moved between instances for failover.'],
      ['Elastic IP', 'Static public IPv4 per region. Charged (all public IPv4 addresses are now charged hourly). Prefer DNS names or load balancers instead.'],
      ['Enhanced networking (ENA)', 'SR-IOV based, up to 100+ Gbps, lower latency; default on modern instances.'],
      ['Elastic Fabric Adapter (EFA)', 'ENA plus OS-bypass for HPC / MPI and ML training on Linux; low-latency inter-node communication.'],
      ['Public vs private IP', 'Public IP changes on stop/start. Private IP stays for the life of the instance.']
    ]},
    { h: 'AMIs, launch and metadata', i: [
      ['AMI', 'Template with root volume snapshot, launch permissions and block device mapping. Regional; copy to other regions (can re-encrypt during copy). Golden AMIs reduce boot time.'],
      ['User data', 'Script run once at first boot as root (bootstrap: install packages, pull config). Limited to 16 KB.'],
      ['Instance metadata (IMDS)', 'http://169.254.169.254/latest/meta-data. IMDSv2 (session token) protects against SSRF; enforce IMDSv2. IAM role credentials are delivered here.'],
      ['IAM roles for EC2', 'Attach an instance profile instead of storing access keys on instances. Always the right answer over hard-coded keys.'],
      ['Launch templates', 'Versioned launch configuration (AMI, type, SGs, user data). Required for newer features; launch configurations are legacy.']
    ]},
    { h: 'Instance lifecycle and storage', i: [
      ['Stop / start', 'EBS-backed only. Moves to new host, keeps EBS data, loses instance store data and public IP.'],
      ['Hibernate', 'RAM saved to the encrypted EBS root volume; resumes with in-memory state and same instance ID. RAM < 150 GB, max 60 days. Fast start for apps with long initialization.'],
      ['Instance store', 'Physically attached ephemeral NVMe disks, highest IOPS, lost on stop/terminate/hardware failure. Use for caches, buffers, scratch, replicated data.'],
      ['EC2 Instance Connect / Session Manager', 'Browser or IAM-based shell access. Session Manager needs no open inbound ports, no SSH keys and no bastion.'],
      ['Status checks & auto recovery', 'System status check failure -> CloudWatch alarm action "recover" (or default auto-recovery) migrates to new hardware keeping IP, ID and EBS.']
    ]}
  ],
  tips: [
    'Steady-state 24/7 workload for 1-3 years -> Reserved Instances or Savings Plans. Flexibility across families/regions/Lambda/Fargate -> Compute Savings Plan.',
    'Interruptible, fault-tolerant, cheapest -> Spot. Anything stateful or that cannot be interrupted -> not Spot.',
    'Socket/core-based BYOL or compliance needing host visibility -> Dedicated Hosts.',
    'Need guaranteed capacity in an AZ for an event without a long commitment -> On-Demand Capacity Reservation.',
    'Low latency between nodes (HPC) -> cluster placement group (+ EFA). Few critical instances isolated -> spread. Kafka/Cassandra/HDFS -> partition.',
    'Never put access keys on EC2: use an IAM role (instance profile).',
    'Memory and disk-space metrics are NOT collected by default: install the CloudWatch agent.'
  ],
  q: [
    { q: 'A company runs a batch job every night that can be interrupted and restarted without issue. The job runs for about 3 hours. What is the MOST cost-effective purchasing option?', o: ['On-Demand Instances', 'Spot Instances', 'Standard Reserved Instances', 'Dedicated Hosts'], a: 1, e: 'Interruptible, restartable workloads are ideal for Spot, which offers up to 90% discount.', d: 4 },
    { q: 'An HPC application requires the lowest possible network latency and highest throughput between nodes. Which configuration should be used?', o: ['Spread placement group across 3 AZs', 'Partition placement group', 'Cluster placement group with Elastic Fabric Adapter', 'Instances in multiple regions behind Global Accelerator'], a: 2, e: 'A cluster placement group packs instances close together in one AZ; EFA provides OS-bypass low-latency networking for tightly coupled HPC.', d: 3 },
    { q: 'A company has a license for software that is billed per physical CPU socket and must be deployed on EC2. Which option meets this requirement?', o: ['Dedicated Instances', 'Dedicated Hosts', 'Spot Instances', 'Convertible Reserved Instances'], a: 1, e: 'Dedicated Hosts expose sockets and cores, enabling bring-your-own-license models tied to physical hardware.', d: 4 },
    { q: 'A company will run a steady workload for 3 years but expects to change instance families and may move part of the workload to AWS Fargate and Lambda. Which option provides the largest discount with this flexibility?', o: ['Standard Reserved Instances', 'EC2 Instance Savings Plans', 'Compute Savings Plans', 'Spot Fleet'], a: 2, e: 'Compute Savings Plans apply across instance families, regions, OS, and also to Fargate and Lambda.', d: 4 },
    { q: 'An application needs to keep its in-memory state when stopped overnight so that it starts quickly in the morning. What should be used?', o: ['EC2 hibernation with an encrypted EBS root volume', 'Instance store volumes', 'Stop the instance and create an AMI', 'A spread placement group'], a: 0, e: 'Hibernation writes RAM to the encrypted EBS root volume and restores it on start, preserving in-memory state.', d: 3 },
    { q: 'A Cassandra cluster of 60 instances must minimize the impact of correlated hardware failures, and nodes need to know which failure domain they are in. Which placement strategy fits?', o: ['Cluster placement group', 'Spread placement group', 'Partition placement group', 'No placement group with Dedicated Instances'], a: 2, e: 'Partition placement groups isolate groups of instances on separate racks and expose the partition number via metadata, suiting large distributed replicated systems. Spread groups are limited to 7 instances per AZ.', d: 2 },
    { q: 'An application on EC2 needs to read objects from an S3 bucket. What is the MOST secure way to grant access?', o: ['Store an IAM user access key in the application config file', 'Attach an IAM role with an S3 read policy to the instance', 'Make the bucket public', 'Store credentials in user data'], a: 1, e: 'IAM roles provide automatically rotated temporary credentials through the instance metadata service; no long-term keys on the instance.', d: 1 },
    { q: 'A company needs guaranteed EC2 capacity in a specific AZ for a two-week product launch, without a 1-year commitment. What should it use?', o: ['Zonal Reserved Instances', 'On-Demand Capacity Reservation', 'Spot Block', 'Compute Savings Plan'], a: 1, e: 'On-Demand Capacity Reservations reserve capacity in an AZ for any duration and can be cancelled anytime.', d: 2 },
    { q: 'Which EC2 storage provides the highest random I/O performance but loses data when the instance is stopped?', o: ['EBS gp3', 'EBS io2 Block Express', 'Instance store', 'Amazon EFS'], a: 2, e: 'Instance store is physically attached NVMe storage with very high IOPS but is ephemeral.', d: 3 },
    { q: 'A security team wants to mitigate SSRF attacks that try to steal IAM role credentials from EC2 instances. What should they enforce?', o: ['IMDSv2 (session-oriented metadata)', 'Disabling user data', 'Placing instances in a spread placement group', 'Using Elastic IPs'], a: 0, e: 'IMDSv2 requires a session token obtained via PUT, which blocks most SSRF-based metadata credential theft.', d: 1 }
  ]
});

svc({
  id: 'autoscaling', name: 'EC2 Auto Scaling', cat: 'compute', imp: 3,
  tag: 'Automatically maintain and scale fleets of EC2 instances across AZs using health checks and scaling policies.',
  s: [
    { h: 'Core concepts', i: [
      ['Auto Scaling group (ASG)', 'Logical group of instances with min, desired and max capacity, spread across the subnets/AZs you choose.'],
      ['Launch template', 'Defines AMI, instance type(s), key pair, security groups, user data, IAM instance profile. Supports versions and mixed instances.'],
      ['Mixed instances policy', 'Combine On-Demand base capacity with Spot across multiple instance types for cost and availability.'],
      ['Self-healing', 'Unhealthy or terminated instances are replaced automatically to keep desired capacity. Free service; you pay for resources.']
    ]},
    { h: 'Scaling policies', i: [
      ['Target tracking', 'Keep a metric at a target, e.g. average CPU 50% or ALB RequestCountPerTarget 1000. Simplest and usually recommended.'],
      ['Step scaling', 'Add/remove capacity in steps based on CloudWatch alarm breach size (e.g. +2 at 70%, +4 at 85%).'],
      ['Simple scaling', 'One adjustment per alarm, waits for cooldown. Legacy.'],
      ['Scheduled scaling', 'Change min/max/desired at known times (e.g. scale up at 8 AM Monday-Friday).'],
      ['Predictive scaling', 'Machine learning forecasts load from history and scales ahead of recurring daily/weekly patterns.'],
      ['Scale on queue depth', 'For workers: custom metric "backlog per instance" = SQS ApproximateNumberOfMessagesVisible / running instances, with target tracking.']
    ]},
    { h: 'Health, lifecycle and termination', i: [
      ['Health checks', 'EC2 status checks by default. Enable ELB health checks so instances failing the app health check are replaced. Grace period lets apps boot.'],
      ['Cooldown / warmup', 'Default cooldown 300 s for simple scaling; instance warmup for target tracking/step so new instances are not counted too early.'],
      ['Lifecycle hooks', 'Pause instances in Pending:Wait or Terminating:Wait to run scripts (install software, drain, copy logs) before InService or termination.'],
      ['Default termination policy', 'Balance AZs first, then terminate instance with oldest launch template/config, then closest to next billing hour.'],
      ['Warm pools', 'Pre-initialized stopped/hibernated instances to cut scale-out latency for apps with long boot times.'],
      ['Instance refresh', 'Rolling replacement of instances to roll out a new launch template version with minimum healthy percentage.'],
      ['Scale-in protection', 'Protect specific instances (e.g. a long-running job) from termination during scale-in.']
    ]},
    { h: 'Integrations', i: [
      ['ELB', 'ASG registers/deregisters instances in target groups automatically; deregistration delay lets connections drain.'],
      ['CloudWatch alarms', 'Drive step/simple scaling; SNS notifications on launch/terminate events.'],
      ['AWS Auto Scaling (plans)', 'Separate service to scale multiple resources (ECS, DynamoDB, Aurora replicas, Spot Fleet) together.']
    ]}
  ],
  tips: [
    'Load is predictable at known times -> scheduled scaling. Recurring pattern but not exact -> predictive scaling. Otherwise -> target tracking.',
    'Instances unhealthy at app level but ASG does not replace them -> enable ELB health checks on the ASG.',
    'Scale SQS workers on backlog per instance, not on CPU.',
    'Need to run something before an instance goes into service or is terminated -> lifecycle hook.',
    'Users get errors right after scale-out because instances need long initialization -> warm pools or golden AMI.'
  ],
  q: [
    { q: 'A web application behind an ALB experiences instances that hang and return HTTP 500 errors, but the Auto Scaling group does not replace them. What should be done?', o: ['Increase the maximum capacity', 'Configure the ASG to use ELB health checks', 'Enable detailed monitoring', 'Add a lifecycle hook'], a: 1, e: 'By default ASGs only use EC2 status checks. Enabling ELB health checks makes the ASG replace instances failing the target group health check.', d: 2 },
    { q: 'Traffic to an application increases sharply every weekday at 9 AM. Users experience slow responses for the first 10 minutes. What is the BEST solution?', o: ['Use scheduled scaling to increase capacity before 9 AM', 'Use simple scaling on CPU', 'Increase the cooldown period', 'Use larger instances all day'], a: 0, e: 'For known, time-based load changes, scheduled scaling provisions capacity ahead of demand.', d: 3 },
    { q: 'An application consumes messages from an SQS queue using EC2 instances in an ASG. Which metric should drive scaling?', o: ['Average CPU utilization', 'Network in', 'Backlog per instance (queue depth / instance count)', 'ALB request count'], a: 2, e: 'AWS recommends a custom backlog-per-instance metric with target tracking for queue workers.', d: 3 },
    { q: 'Before an instance is terminated during scale-in, an application must upload log files to S3. What should be used?', o: ['User data', 'A lifecycle hook on Terminating:Wait', 'Scale-in protection', 'A scheduled action'], a: 1, e: 'Lifecycle hooks pause the instance in Terminating:Wait so you can run scripts before termination completes.', d: 2 },
    { q: 'Which scaling policy keeps average CPU utilization at 50% with the least configuration effort?', o: ['Step scaling', 'Simple scaling', 'Target tracking scaling', 'Scheduled scaling'], a: 2, e: 'Target tracking creates and manages the alarms for you to hold the metric near the target.', d: 3 },
    { q: 'An application takes 15 minutes to initialize. The company wants faster scale-out without paying for running idle instances. What should be used?', o: ['Warm pool with stopped instances', 'Increase desired capacity permanently', 'Spot Instances', 'Spread placement group'], a: 0, e: 'Warm pools keep pre-initialized instances in a stopped (or hibernated) state; you pay only for their EBS storage while stopped.', d: 4 }
  ]
});

svc({
  id: 'elb', name: 'Elastic Load Balancing', cat: 'compute', imp: 3,
  tag: 'ALB (layer 7), NLB (layer 4), GWLB (layer 3 appliances): distribute traffic across healthy targets in multiple AZs.',
  s: [
    { h: 'Application Load Balancer (ALB)', i: [
      ['Layer 7', 'HTTP, HTTPS, HTTP/2, gRPC, WebSockets.'],
      ['Routing rules', 'Route by path (/api), host header (api.example.com), HTTP headers, query string, source IP. Ideal for microservices and containers.'],
      ['Targets', 'EC2 instances, IP addresses (incl. on-prem via private IPs), Lambda functions, ECS tasks (dynamic port mapping).'],
      ['Features', 'Redirects (HTTP->HTTPS), fixed responses, authentication with Cognito / OIDC, sticky sessions (cookies), weighted target groups (blue/green, canary).'],
      ['Client IP', 'Backend sees ALB IP; client IP is in X-Forwarded-For header (port X-Forwarded-Port, protocol X-Forwarded-Proto).'],
      ['DNS only', 'No static IP. Put Global Accelerator in front, or use NLB with ALB as target, if static IPs are required.']
    ]},
    { h: 'Network Load Balancer (NLB)', i: [
      ['Layer 4', 'TCP, UDP, TLS. Millions of requests per second, ultra-low latency.'],
      ['Static IPs', 'One static IP per AZ, can assign Elastic IPs. Good for whitelisting by IP.'],
      ['Source IP preserved', 'Client IP is visible to targets (for instance targets).'],
      ['Targets', 'Instances, IPs, ALB. Health checks TCP, HTTP or HTTPS.'],
      ['PrivateLink', 'NLB (or GWLB) is the provider side of VPC endpoint services (PrivateLink).'],
      ['Security groups', 'NLBs now support security groups (optional).']
    ]},
    { h: 'Gateway Load Balancer (GWLB)', i: [
      ['Layer 3', 'Deploy, scale and manage third-party virtual appliances: firewalls, IDS/IPS, deep packet inspection.'],
      ['How it works', 'Transparent network gateway + load balancer. Uses GENEVE protocol on port 6081. Route table sends traffic to GWLB endpoint -> appliances -> back to destination.']
    ]},
    { h: 'Common features', i: [
      ['Health checks', 'Per target group; unhealthy targets stop receiving traffic.'],
      ['Cross-zone load balancing', 'Distribute evenly across all targets in all AZs. ALB: always on, no charge. NLB/GWLB: off by default, inter-AZ data charged if enabled.'],
      ['SSL/TLS termination', 'Offload TLS at the LB with ACM certificates. SNI lets one ALB/NLB listener serve multiple certificates (multiple domains).'],
      ['Deregistration delay', 'Connection draining: in-flight requests complete before a target is removed (default 300 s).'],
      ['Sticky sessions', 'Bind a client to a target via cookie (ALB) or source IP (NLB). Can cause imbalance; prefer stateless apps.'],
      ['Internet-facing vs internal', 'Internal LBs have only private IPs, used between tiers.'],
      ['Classic Load Balancer', 'Legacy (previous generation). Migrate to ALB/NLB.']
    ]}
  ],
  tips: [
    'Path or host based routing, Lambda targets, Cognito auth -> ALB.',
    'Static IP / Elastic IP, extreme performance, UDP, preserve client IP -> NLB.',
    'Third-party firewall appliances inline -> GWLB (GENEVE 6081).',
    'Need client IP behind ALB -> read X-Forwarded-For.',
    'Multiple HTTPS domains on one load balancer -> SNI.',
    'WAF can attach to ALB but NOT to NLB.'
  ],
  q: [
    { q: 'A company runs several microservices and wants to route requests to /orders and /users to different target groups behind one load balancer. Which load balancer should be used?', o: ['Network Load Balancer', 'Application Load Balancer', 'Gateway Load Balancer', 'Classic Load Balancer'], a: 1, e: 'ALB supports path-based and host-based routing at layer 7.', d: 3 },
    { q: 'A partner requires a fixed set of IP addresses to whitelist for accessing a TCP application. Which solution meets this requirement?', o: ['ALB with an Elastic IP', 'NLB with Elastic IPs assigned per AZ', 'CloudFront distribution', 'Classic Load Balancer'], a: 1, e: 'NLBs support one static IP / Elastic IP per AZ. ALBs do not support static IPs.', d: 3 },
    { q: 'Application servers behind an ALB need to log the original client IP address. Where can they find it?', o: ['In the source IP of the TCP packet', 'In the X-Forwarded-For header', 'In VPC Flow Logs only', 'In the Host header'], a: 1, e: 'ALB terminates the connection; the client IP is passed in X-Forwarded-For.', d: 3 },
    { q: 'A security team must inspect all inbound traffic to a VPC using a fleet of third-party firewall appliances that scale automatically. Which service should be used?', o: ['Network Load Balancer', 'AWS Network Firewall', 'Gateway Load Balancer', 'Application Load Balancer with AWS WAF'], a: 2, e: 'Gateway Load Balancer is designed to deploy and scale third-party virtual appliances transparently using GENEVE.', d: 1 },
    { q: 'A company hosts three HTTPS websites with different domain names and wants to use a single load balancer. What enables this?', o: ['Multiple Elastic IPs', 'Server Name Indication (SNI) with multiple ACM certificates on the ALB listener', 'Sticky sessions', 'Cross-zone load balancing'], a: 1, e: 'SNI allows the load balancer to present the right certificate based on the hostname requested by the client.', d: 1 },
    { q: 'Which combination provides static IP addresses while still using ALB features such as path-based routing? (Choose TWO)', o: ['Place AWS Global Accelerator in front of the ALB', 'Assign an Elastic IP to the ALB', 'Register the ALB as a target of an NLB', 'Enable cross-zone load balancing', 'Use a Classic Load Balancer'], a: [0, 2], e: 'Global Accelerator provides two static anycast IPs to an ALB endpoint, and NLB supports ALB-type target groups. ALBs cannot have Elastic IPs.', d: 3 }
  ]
});

svc({
  id: 'lambda', name: 'AWS Lambda', cat: 'compute', imp: 3,
  tag: 'Serverless functions triggered by events: limits, concurrency, invocation models, VPC access and cost.',
  s: [
    { h: 'Fundamentals', i: [
      ['Model', 'Upload code (zip or container image up to 10 GB); AWS runs it on demand. Pay per request and per GB-second of duration (1 ms granularity).'],
      ['Limits to remember', 'Max timeout 15 minutes. Memory 128 MB - 10,240 MB (CPU scales with memory). /tmp ephemeral storage 512 MB - 10 GB. Deployment zip 50 MB zipped / 250 MB unzipped. Env vars 4 KB. Sync payload 6 MB, async 256 KB (raised to 1 MB in 2025).'],
      ['Runtimes', 'Node.js, Python, Java, .NET, Ruby, Go via custom runtime, any language via custom runtime or container image.'],
      ['Layers', 'Share libraries and dependencies across functions (up to 5 layers).'],
      ['Architectures', 'x86_64 or arm64 (Graviton2): up to 34% better price-performance.']
    ]},
    { h: 'Invocation models', i: [
      ['Synchronous', 'Caller waits: API Gateway, ALB, Function URLs, SDK invoke, Cognito. Errors returned to caller; caller retries.'],
      ['Asynchronous', 'Event queued internally: S3, SNS, EventBridge, CloudWatch Logs. Retries 2 times; send failures to a DLQ (SQS/SNS) or on-failure destination.'],
      ['Event source mapping (poll-based)', 'Lambda polls SQS, Kinesis, DynamoDB Streams, MSK, MQ. Batches records; for streams, failed batches block the shard until success/expiry (use bisect batch, max retry, on-failure destination).'],
      ['Destinations', 'Route success/failure results of async invocations to SQS, SNS, Lambda, EventBridge. Preferred over DLQ for richer info.'],
      ['Function URLs', 'Dedicated HTTPS endpoint for a function without API Gateway (auth: IAM or none).']
    ]},
    { h: 'Concurrency and performance', i: [
      ['Account concurrency', 'Default 1,000 concurrent executions per region (soft limit). Throttled requests get 429 errors (sync) or retries (async).'],
      ['Reserved concurrency', 'Guarantees and caps concurrency for one function; protects downstream DBs and other functions. Setting 0 disables the function.'],
      ['Provisioned concurrency', 'Pre-initialized execution environments: eliminates cold starts for latency-sensitive apps (extra cost). Can be scheduled with Application Auto Scaling.'],
      ['Cold starts', 'First invocation initializes the environment. Reduce with provisioned concurrency, SnapStart (Java, Python, .NET), smaller packages, init code outside handler.'],
      ['Execution context reuse', 'Initialize SDK clients and DB connections outside the handler to reuse them across invocations.']
    ]},
    { h: 'Networking and security', i: [
      ['Execution role', 'IAM role the function assumes to call AWS services.'],
      ['Resource-based policy', 'Allows other services/accounts to invoke the function (e.g. S3, SNS, another account).'],
      ['VPC access', 'Attach to private subnets to reach RDS/ElastiCache. Lambda uses Hyperplane ENIs. For internet access from a VPC-attached function, route through a NAT gateway (a public subnet alone does not work). Use VPC endpoints for AWS services.'],
      ['RDS Proxy', 'Pool and share DB connections so many concurrent Lambda functions do not exhaust database connections. Supports IAM auth and Secrets Manager.'],
      ['Secrets', 'Store in Secrets Manager / Parameter Store; encrypt environment variables with KMS.']
    ]},
    { h: 'Edge and integrations', i: [
      ['Lambda@Edge', 'Run Node.js/Python at CloudFront regional edge caches on viewer/origin request/response. Up to 5 s (viewer) / 30 s (origin), more memory, network access.'],
      ['CloudFront Functions', 'Lightweight JavaScript at edge locations, sub-millisecond, viewer request/response only: header manipulation, redirects, URL rewrites, simple auth. Much cheaper.'],
      ['Common patterns', 'S3 upload -> Lambda thumbnail; API Gateway + Lambda + DynamoDB serverless API; EventBridge schedule -> Lambda cron; SQS -> Lambda worker; Kinesis -> Lambda stream processing.'],
      ['Step Functions', 'Orchestrate multiple Lambda functions with retries, branching and waits; works around 15-minute limit for long workflows.']
    ]}
  ],
  tips: [
    'Job runs longer than 15 minutes -> not Lambda (use ECS/Fargate, Batch, or Step Functions to split work).',
    'Cold start latency complaints -> provisioned concurrency (or SnapStart for Java).',
    'Lambda overwhelming RDS with connections -> RDS Proxy.',
    'One function consuming all concurrency and throttling others -> reserved concurrency.',
    'VPC Lambda needs internet -> NAT gateway in a public subnet + route from private subnets.',
    'Simple header rewrite at edge, millions of requests, cheapest -> CloudFront Functions; heavier logic / network calls -> Lambda@Edge.'
  ],
  q: [
    { q: 'A data processing job takes approximately 40 minutes to complete. Which compute option is NOT suitable to run it as a single execution?', o: ['AWS Fargate task', 'AWS Batch job', 'AWS Lambda function', 'EC2 instance'], a: 2, e: 'Lambda has a hard maximum timeout of 15 minutes.', d: 3 },
    { q: 'A serverless API built with API Gateway and Lambda has unacceptable latency on the first requests after idle periods. What is the MOST effective fix?', o: ['Increase the function timeout', 'Configure provisioned concurrency', 'Configure reserved concurrency', 'Move the function into a VPC'], a: 1, e: 'Provisioned concurrency keeps execution environments initialized, eliminating cold starts.', d: 3 },
    { q: 'Hundreds of concurrent Lambda invocations are exhausting the connection limit of an Amazon RDS for MySQL database. What should a solutions architect recommend?', o: ['Increase Lambda memory', 'Use Amazon RDS Proxy', 'Enable Multi-AZ', 'Add a read replica'], a: 1, e: 'RDS Proxy pools and reuses database connections, protecting the DB from connection storms by serverless clients.', d: 3 },
    { q: 'A Lambda function attached to private subnets in a VPC must call a third-party API on the internet. What is required?', o: ['Assign a public IP to the function', 'Move the function to a public subnet', 'Route private subnet traffic through a NAT gateway in a public subnet', 'Create an interface VPC endpoint for the API'], a: 2, e: 'VPC-attached Lambda functions never receive public IPs; outbound internet requires a NAT gateway (or NAT instance).', d: 1 },
    { q: 'A critical Lambda function must always be able to scale to 100 concurrent executions even when other functions in the account are busy. What should be configured?', o: ['Provisioned concurrency of 100 on all functions', 'Reserved concurrency of 100 on the critical function', 'Increase timeout', 'Use an SQS DLQ'], a: 1, e: 'Reserved concurrency carves out capacity from the account pool for that function (and also caps it).', d: 2 },
    { q: 'A company needs to add security headers to every response served by CloudFront at the lowest cost and latency. Which option is BEST?', o: ['Lambda@Edge on origin response', 'CloudFront Functions on viewer response', 'An ALB with fixed responses', 'API Gateway mapping templates'], a: 1, e: 'CloudFront Functions are designed for lightweight, high-volume viewer request/response manipulation like headers, at a fraction of Lambda@Edge cost.', d: 4 },
    { q: 'Asynchronous Lambda invocations from S3 events occasionally fail after retries. The team wants failed events captured with details for later reprocessing. What should be configured?', o: ['An on-failure destination (SQS or EventBridge)', 'Provisioned concurrency', 'A larger /tmp', 'Synchronous invocation from S3'], a: 0, e: 'Async invocations retry twice; on-failure destinations (or a DLQ) capture failed events for reprocessing.', d: 2 }
  ]
});

svc({
  id: 'containers', name: 'Containers: ECS, EKS, Fargate, ECR', cat: 'compute', imp: 3,
  tag: 'Run Docker containers on AWS: orchestrators (ECS, EKS), serverless compute (Fargate), registry (ECR), App Runner.',
  s: [
    { h: 'Amazon ECS', i: [
      ['What', 'AWS-native container orchestrator. Simple, deeply integrated with ALB, IAM, CloudWatch.'],
      ['Task definition', 'JSON blueprint: image, CPU/memory, ports, env vars, IAM task role, logging, volumes.'],
      ['Service', 'Keeps N tasks running, integrates with ALB/NLB, supports rolling and blue/green (CodeDeploy) deployments.'],
      ['EC2 launch type', 'You manage the EC2 container instances (ECS agent, patching, capacity). Cheaper at steady scale, supports GPU and special instance needs.'],
      ['Fargate launch type', 'Serverless: no instances to manage; pay per vCPU/memory per second per task.'],
      ['Task role vs instance role', 'Task role = permissions for the app inside a task (least privilege per service). Instance role = permissions for the ECS agent on EC2.'],
      ['ECS Service Auto Scaling', 'Scale task count with target tracking (CPU, memory, ALB requests). Capacity providers scale the underlying EC2 ASG or use Fargate / Fargate Spot.']
    ]},
    { h: 'Amazon EKS', i: [
      ['What', 'Managed Kubernetes control plane. Choose when standardizing on Kubernetes, multi-cloud or migrating existing K8s workloads.'],
      ['Data plane options', 'Managed node groups (EC2), self-managed nodes, Fargate profiles, Karpenter for node autoscaling.'],
      ['Storage', 'CSI drivers for EBS, EFS, FSx.'],
      ['EKS Anywhere / ECS Anywhere', 'Run the orchestrator on your own on-prem hardware.']
    ]},
    { h: 'AWS Fargate', i: [
      ['Serverless containers', 'Works with ECS and EKS. No servers, patching or capacity planning.'],
      ['Fargate Spot', 'Interruptible Fargate tasks at up to 70% discount.'],
      ['Storage', 'Ephemeral storage up to 200 GB per task; mount EFS for persistent shared storage.'],
      ['When', 'Least operational overhead for containers. Choose EC2 launch type for GPUs, very steady large scale, or special host-level control.']
    ]},
    { h: 'Amazon ECR and App Runner', i: [
      ['ECR', 'Private/public Docker and OCI image registry, backed by S3. Image scanning (basic or enhanced with Inspector), lifecycle policies, cross-region/cross-account replication, IAM-based access.'],
      ['App Runner', 'Fully managed: give it source code or an image, it builds, deploys, load balances, scales and adds TLS. Simplest way to run a web app/API container.'],
      ['Beanstalk / Lightsail containers', 'Alternative simple options; App Runner is the modern answer for "least effort" web containers.']
    ]}
  ],
  tips: [
    'Containers with least operational overhead -> Fargate (or App Runner for a simple web app).',
    'Already using Kubernetes / want open-source tooling portability -> EKS.',
    'Different permissions per container app -> ECS task roles, not instance roles.',
    'Shared persistent storage between tasks across AZs -> EFS.',
    'Fault-tolerant container batch at lowest cost -> Fargate Spot or EC2 Spot capacity provider.'
  ],
  q: [
    { q: 'A company wants to run containerized microservices without managing servers or clusters of EC2 instances. Which option provides the LEAST operational overhead?', o: ['ECS on EC2 launch type', 'EKS with self-managed nodes', 'ECS with the Fargate launch type', 'Docker on EC2 with Auto Scaling'], a: 2, e: 'Fargate removes the need to provision, patch and scale container hosts.', d: 3 },
    { q: 'Two ECS services run on the same cluster. One needs access to an S3 bucket and the other needs access to a DynamoDB table. How should permissions be granted following least privilege?', o: ['Attach both permissions to the EC2 instance role', 'Create a separate IAM task role for each task definition', 'Use one IAM user with access keys in environment variables', 'Use security groups'], a: 1, e: 'Task roles give each task its own scoped permissions independent of the host.', d: 1 },
    { q: 'A company already runs workloads on Kubernetes on premises and wants to migrate to AWS with minimal changes to tooling. Which service should it use?', o: ['Amazon ECS', 'Amazon EKS', 'AWS App Runner', 'AWS Elastic Beanstalk'], a: 1, e: 'EKS is managed Kubernetes and works with existing Kubernetes manifests and tooling.', d: 3 },
    { q: 'Containers running in ECS tasks across multiple AZs need a shared, persistent file system. Which storage should be used?', o: ['Amazon EBS volumes', 'Instance store', 'Amazon EFS', 'Task ephemeral storage'], a: 2, e: 'EFS is a regional, multi-AZ NFS file system that can be mounted by many tasks concurrently, including on Fargate.', d: 2 },
    { q: 'A developer wants to deploy a containerized web API from source code with automatic builds, load balancing, TLS and scaling, writing no infrastructure code. Which service is simplest?', o: ['AWS App Runner', 'Amazon EKS', 'ECS on EC2', 'AWS Batch'], a: 0, e: 'App Runner is fully managed for web apps and APIs from source or image, handling build, deploy, scaling and TLS.', d: 3 }
  ]
});

svc({
  id: 'beanstalk', name: 'AWS Elastic Beanstalk', cat: 'compute', imp: 2,
  tag: 'PaaS that provisions EC2, ASG, ELB, monitoring for your web app code; you keep control of the resources.',
  s: [
    { h: 'Basics', i: [
      ['What', 'Upload code (Java, .NET, Node.js, Python, PHP, Ruby, Go, Docker) and Beanstalk provisions capacity, load balancing, scaling and health monitoring. No extra charge beyond resources.'],
      ['Components', 'Application -> versions -> environments (dev, prod). Environment tiers: Web server tier (ELB + ASG) and Worker tier (SQS queue + daemon that POSTs messages to your app).'],
      ['Configuration', '.ebextensions config files or saved configurations. Can still access underlying EC2.'],
      ['Database', 'RDS created inside the environment is deleted with it: for production create RDS separately and connect via env vars.']
    ]},
    { h: 'Deployment policies', i: [
      ['All at once', 'Fastest, deploys to all instances simultaneously, causes downtime.'],
      ['Rolling', 'Updates batches; capacity reduced during deploy; no extra cost.'],
      ['Rolling with additional batch', 'Launches an extra batch first so full capacity is maintained.'],
      ['Immutable', 'New instances in a temporary ASG; swap when healthy. Quick, safe rollback; higher cost.'],
      ['Traffic splitting', 'Canary: send a percentage of traffic to new instances for evaluation.'],
      ['Blue/green', 'Separate environment; swap environment URLs (CNAME swap) or use Route 53 weighted records. Zero downtime, easy rollback.']
    ]}
  ],
  tips: [
    'Developer wants to deploy a web app quickly without managing infrastructure but with access to it -> Elastic Beanstalk.',
    'Background jobs from a queue in Beanstalk -> worker environment tier.',
    'Zero downtime and fast rollback -> immutable or blue/green (swap URLs).',
    'Decouple RDS from the Beanstalk environment for production so it is not deleted with the environment.'
  ],
  q: [
    { q: 'A development team wants to deploy a Python web application quickly without managing load balancers or Auto Scaling configuration manually, but still wants access to the underlying EC2 instances. Which service is BEST?', o: ['AWS Lambda', 'AWS Elastic Beanstalk', 'Amazon Lightsail', 'AWS CloudFormation'], a: 1, e: 'Beanstalk provisions and manages ELB, ASG, EC2 and monitoring from your code while leaving the resources accessible.', d: 3 },
    { q: 'Which Elastic Beanstalk deployment policy maintains full capacity and allows the fastest rollback by deploying to entirely new instances?', o: ['All at once', 'Rolling', 'Immutable', 'Rolling with additional batch'], a: 2, e: 'Immutable deployments launch new instances in a separate ASG; rollback simply terminates them.', d: 2 },
    { q: 'A Beanstalk application needs to process long-running background tasks submitted by the web tier. What is the recommended architecture?', o: ['Run cron jobs on web instances', 'Create a worker environment that consumes an SQS queue', 'Use a larger web instance type', 'Use the all-at-once deployment policy'], a: 1, e: 'Worker environments pull messages from SQS and decouple background processing from the web tier.', d: 2 }
  ]
});
