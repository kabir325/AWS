svc({
  id: 'global-infra', name: 'AWS Global Infrastructure', cat: 'foundations', imp: 2,
  tag: 'Regions, Availability Zones, edge locations, Local Zones, Wavelength, Outposts and the shared responsibility model.',
  s: [
    { h: 'Regions', i: [
      ['What it is', 'A separate geographic area containing multiple isolated Availability Zones. Most services are regional and data never leaves a region unless you replicate or move it.'],
      ['Choosing a region', 'Order of priority: compliance / data residency, latency to users, service and feature availability, then price (prices differ per region).'],
      ['Global services', 'IAM, Route 53, CloudFront, Organizations, Global Accelerator and WAF for CloudFront are global. Several have their control plane in us-east-1 (e.g. ACM certs for CloudFront must be in us-east-1).']
    ]},
    { h: 'Availability Zones', i: [
      ['What it is', 'One or more discrete data centers with redundant power, networking and connectivity. Regions have 3 or more AZs (typically 3-6).'],
      ['Isolation', 'AZs are physically separated but linked with low-latency, high-throughput private fiber, so synchronous replication (e.g. RDS Multi-AZ) is practical.'],
      ['AZ names vs AZ IDs', 'Names like us-east-1a are shuffled per account. Use AZ IDs (use1-az1) to line up the same physical AZ across accounts (e.g. for shared subnets via RAM).'],
      ['HA rule of thumb', 'Spread across at least two AZs. "Highly available" in a question almost always means Multi-AZ.']
    ]},
    { h: 'Edge and extended infrastructure', i: [
      ['Edge locations (PoPs)', 'Hundreds of points of presence used by CloudFront, Route 53, Global Accelerator, Shield and WAF to serve users close to them.'],
      ['Regional edge caches', 'Larger CloudFront caches between edge locations and the origin; keep less popular objects cached longer.'],
      ['Local Zones', 'Extension of a region into a metro area for single-digit millisecond latency (EC2, EBS, ECS, some RDS). Opt in, then create subnets in the Local Zone.'],
      ['Wavelength Zones', 'AWS compute embedded in telco 5G networks; traffic from mobile devices never leaves the carrier network. For ultra-low-latency mobile/edge apps.'],
      ['Outposts', 'AWS-managed racks or servers installed in your own data center. Same APIs and tools; for low latency to on-prem systems, local data processing or data residency. You own physical security and power.']
    ]},
    { h: 'Shared responsibility model', i: [
      ['AWS: security OF the cloud', 'Physical facilities, hardware, global network, hypervisor, and the software of managed services.'],
      ['Customer: security IN the cloud', 'Data, IAM, guest OS patching on EC2, security groups and NACLs, encryption choices, application code, network configuration.'],
      ['Shifts with abstraction', 'EC2 (IaaS): you patch the OS. RDS: AWS patches OS and engine; you manage users, network access, backup settings, encryption. Lambda/S3/DynamoDB: you manage code, data and permissions only.']
    ]},
    { h: 'Quotas and data transfer pricing', i: [
      ['Service quotas', 'Per-account, per-region soft limits (e.g. 5 VPCs, 5 Elastic IPs per region). Raise via Service Quotas; Trusted Advisor and CloudWatch can alert as you approach them.'],
      ['Inbound vs outbound', 'Data in from the internet is free. Data out to the internet is charged. Cross-region transfer is charged.'],
      ['Cross-AZ', 'Traffic between AZs is charged in each direction. Traffic within one AZ using private IPs is free.'],
      ['Cost levers', 'Use private IPs, keep chatty tiers in one AZ when HA is not required, use VPC gateway endpoints instead of NAT for S3/DynamoDB, use CloudFront to reduce origin egress.']
    ]}
  ],
  tips: [
    'Data residency / sovereignty requirement -> pick the region first, everything else second.',
    'Single-digit ms latency in a specific city -> Local Zones. 5G mobile devices -> Wavelength. Must run in our own data center -> Outposts.',
    'Highly available = at least 2 AZs. Disaster recovery across geography = multiple regions.',
    'ACM certificate for CloudFront must be requested/imported in us-east-1.'
  ],
  q: [
    { q: 'A media company needs single-digit millisecond latency for an editing workload used by artists in a large city that is far from the nearest AWS Region. The company does not want to manage hardware. What should a solutions architect recommend?', o: ['Deploy the workload in an AWS Local Zone near the city', 'Use larger EC2 instances in the nearest Region', 'Place Amazon CloudFront in front of the workload', 'Install AWS Outposts in a colocation facility'], a: 0, e: 'Local Zones extend a region into metro areas for single-digit ms latency and AWS manages the infrastructure. Outposts requires you to host racks; CloudFront caches content but does not run interactive compute.', d: 3 },
    { q: 'Under the shared responsibility model, which task is the customer responsible for when using Amazon RDS?', o: ['Patching the database engine', 'Replacing failed storage hardware', 'Managing database user accounts and security group rules', 'Maintaining the hypervisor'], a: 2, e: 'For managed services AWS patches the OS and engine and maintains hardware. The customer controls access: DB users, security groups, encryption choices and backup settings.', d: 1 },
    { q: 'A company must ensure that customer data never leaves Germany. What is the FIRST decision a solutions architect should make?', o: ['Enable S3 Cross-Region Replication', 'Select the eu-central-1 (Frankfurt) Region for all resources', 'Use CloudFront geo restriction', 'Encrypt all data with KMS'], a: 1, e: 'Data residency is satisfied by choosing the region. AWS does not move data out of a region unless you configure it.', d: 1 },
    { q: 'Two AWS accounts need to place resources in the same physical Availability Zone. What should they use to coordinate?', o: ['AZ names such as us-east-1a', 'AZ IDs such as use1-az1', 'Placement groups', 'Edge location codes'], a: 1, e: 'AZ names are randomly mapped per account; AZ IDs identify the same physical location across accounts.', d: 2 },
    { q: 'An application must process data locally inside a factory with strict on-premises latency requirements while using the same AWS APIs and tools as in the cloud. Which service fits?', o: ['AWS Wavelength', 'AWS Local Zones', 'AWS Outposts', 'AWS Snowball Edge in a region'], a: 2, e: 'Outposts brings AWS infrastructure and APIs into your own facility. Wavelength is for 5G carrier networks; Local Zones are AWS-operated metro locations.', d: 3 },
    { q: 'Which data transfer is typically free of charge?', o: ['Data out from EC2 to the internet', 'Data between two EC2 instances in different AZs', 'Data into AWS from the internet', 'Data replicated between regions'], a: 2, e: 'Inbound data transfer is free. Outbound to the internet, cross-AZ and cross-region transfers are charged.', d: 4 }
  ]
});

svc({
  id: 'well-architected-dr', name: 'Well-Architected & Disaster Recovery', cat: 'foundations', imp: 3,
  tag: 'The six pillars, design principles, RPO/RTO and the four DR strategies that frame most exam answers.',
  s: [
    { h: 'Six pillars', i: [
      ['Operational Excellence', 'Run and monitor systems, improve processes. Infrastructure as code, small reversible changes, anticipate failure, learn from operational events.'],
      ['Security', 'Strong identity foundation (least privilege), traceability, security at every layer, automate security, protect data in transit and at rest, prepare for incidents.'],
      ['Reliability', 'Automatically recover from failure, test recovery procedures, scale horizontally, stop guessing capacity, manage change through automation.'],
      ['Performance Efficiency', 'Use advanced technologies as managed services, go global in minutes, use serverless, experiment more often, mechanical sympathy (right tool for the job).'],
      ['Cost Optimization', 'Adopt a consumption model, measure overall efficiency, stop spending on undifferentiated heavy lifting, analyze and attribute expenditure.'],
      ['Sustainability', 'Understand impact, maximize utilization, use managed services and more efficient hardware (e.g. Graviton), reduce downstream impact.']
    ]},
    { h: 'Core design principles', i: [
      ['Loose coupling', 'Decouple tiers with queues (SQS), topics (SNS), event buses (EventBridge) so components fail and scale independently.'],
      ['Stateless compute', 'Keep session state out of instances (ElastiCache, DynamoDB) so any instance can serve any request and Auto Scaling works.'],
      ['Horizontal scaling', 'Add more smaller resources behind a load balancer rather than one bigger box (vertical scaling has a ceiling and causes downtime).'],
      ['Managed and serverless first', 'Prefer services that remove operational overhead: "least operational overhead" in a question usually points to a managed/serverless option.'],
      ['Tools', 'AWS Well-Architected Tool reviews workloads against the pillars; Lenses add domain guidance (Serverless, SaaS, etc.).']
    ]},
    { h: 'RPO and RTO', i: [
      ['RPO (Recovery Point Objective)', 'Maximum acceptable data loss measured in time. Driven by backup / replication frequency.'],
      ['RTO (Recovery Time Objective)', 'Maximum acceptable downtime. Driven by how much infrastructure is already running in the DR site.'],
      ['Trade-off', 'Lower RPO/RTO = higher cost. Pick the cheapest strategy that meets the stated objectives.']
    ]},
    { h: 'Four DR strategies (cheapest to most expensive)', i: [
      ['Backup and restore', 'Back up data (snapshots, AWS Backup, S3 CRR) to another region; rebuild everything on disaster. RPO/RTO: hours. Cheapest.'],
      ['Pilot light', 'Core data is live-replicated (e.g. RDS cross-region read replica) but app servers are off or not provisioned. Turn on and scale on disaster. RPO: minutes, RTO: tens of minutes.'],
      ['Warm standby', 'A scaled-down but fully functional copy runs all the time; scale up on disaster. RPO: seconds, RTO: minutes.'],
      ['Multi-site active-active', 'Full production in 2+ regions serving traffic (Route 53, Global Accelerator, DynamoDB global tables, Aurora Global Database). Near-zero RPO/RTO. Most expensive.']
    ]},
    { h: 'DR building blocks', i: [
      ['Data replication', 'S3 Cross-Region Replication, Aurora Global Database (<1 s lag, promote in ~1 min), DynamoDB global tables, RDS cross-region read replicas, EBS snapshot copy, AWS Backup cross-region copies.'],
      ['Traffic failover', 'Route 53 failover routing with health checks; Global Accelerator for fast IP-level failover; CloudFront origin groups.'],
      ['Infrastructure', 'CloudFormation / CDK templates and AMIs copied to the DR region to rebuild quickly.'],
      ['AWS Elastic Disaster Recovery (DRS)', 'Continuous block-level replication of servers (on-prem or cloud) into a low-cost staging area; launch recovery instances in minutes. RPO seconds, RTO minutes.']
    ]}
  ],
  tips: [
    'Read the RPO/RTO numbers first, then pick the cheapest DR strategy that meets them.',
    'RPO/RTO in hours and lowest cost -> backup and restore. Minutes and core DB always running -> pilot light. Must handle traffic immediately at reduced capacity -> warm standby.',
    'Pilot light vs warm standby: in pilot light the app tier is NOT running; in warm standby a small version of everything IS running.',
    '"Least operational overhead" -> managed or serverless service.',
    'Sustainability pillar is the newest (6th) pillar.'
  ],
  q: [
    { q: 'A company requires an RPO of 24 hours and an RTO of 12 hours for a non-critical application and wants the lowest cost. Which DR strategy should be used?', o: ['Multi-site active-active', 'Warm standby', 'Pilot light', 'Backup and restore'], a: 3, e: 'Hours-level RPO/RTO with lowest cost points to backup and restore.', d: 4 },
    { q: 'A company replicates its database to a second region continuously, but keeps application servers turned off until a disaster occurs. Which DR strategy is this?', o: ['Backup and restore', 'Pilot light', 'Warm standby', 'Active-active'], a: 1, e: 'Pilot light keeps the core (data) live while the rest of the environment is provisioned or started only during recovery.', d: 2 },
    { q: 'An application needs an RTO of a few minutes and must be able to serve some production traffic immediately after a regional failure. Budget does not allow full duplicate capacity. Which strategy fits?', o: ['Warm standby', 'Pilot light', 'Backup and restore', 'Multi-site active-active'], a: 0, e: 'Warm standby runs a scaled-down but fully functional copy that can take traffic immediately and then scale up.', d: 2 },
    { q: 'Which statement correctly defines RPO?', o: ['The maximum time a system can be down', 'The maximum acceptable amount of data loss measured in time', 'The time it takes to restore a backup', 'The frequency of DR tests'], a: 1, e: 'RPO is about data loss (how old the last recoverable data point can be). RTO is about downtime.', d: 2 },
    { q: 'A company wants to replicate on-premises physical servers to AWS continuously and recover them in minutes during a disaster with minimal infrastructure cost in AWS while idle. Which service should be used?', o: ['AWS Backup', 'AWS Elastic Disaster Recovery', 'AWS DataSync', 'AWS Application Migration Service with scheduled cutover'], a: 1, e: 'Elastic Disaster Recovery continuously replicates block data to a low-cost staging area and launches recovery instances in minutes.', d: 2 },
    { q: 'Which design principle BEST improves the ability of a web tier to scale out with Auto Scaling?', o: ['Store user sessions on the local instance disk', 'Use larger instance types', 'Make the web tier stateless by storing sessions in ElastiCache or DynamoDB', 'Use sticky sessions with long durations'], a: 2, e: 'Stateless instances can be added or removed freely. Local sessions and long sticky sessions break even distribution and lose state on scale-in.', d: 3 },
    { q: 'A workload must survive a full regional outage with near-zero downtime and near-zero data loss. Which combination is MOST appropriate? (Choose TWO)', o: ['Aurora Global Database or DynamoDB global tables', 'Nightly EBS snapshots copied to another region', 'Route 53 latency or failover routing across active stacks in two regions', 'A single Multi-AZ RDS instance', 'S3 Standard-IA for backups'], a: [0, 2], e: 'Active-active multi-region needs multi-region data replication (Aurora Global Database / DynamoDB global tables) and DNS or Global Accelerator based traffic routing across regions.', d: 2 }
  ]
});
