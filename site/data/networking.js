svc({
  id: 'vpc', name: 'Amazon VPC', cat: 'networking', imp: 3,
  tag: 'Your private network in AWS: CIDRs, subnets, route tables, gateways, NAT, security groups vs NACLs, endpoints, peering, flow logs.',
  s: [
    { h: 'Building blocks', i: [
      ['VPC', 'Regional, spans all AZs. IPv4 CIDR between /16 and /28 (up to 5 CIDRs), optional IPv6. Use RFC 1918 ranges and avoid overlap with other networks you will connect to. Default limit 5 VPCs per region.'],
      ['Subnet', 'Lives in one AZ. AWS reserves 5 IPs per subnet (first 4 and last 1): a /24 gives 251 usable addresses.'],
      ['Public subnet', 'Route table has 0.0.0.0/0 -> Internet Gateway; instances need public or Elastic IPs.'],
      ['Private subnet', 'No route to IGW; outbound internet via NAT gateway.'],
      ['Route tables', 'Associated with subnets; most specific route wins. The "local" route enables all intra-VPC traffic and cannot be removed.'],
      ['Default VPC', 'One per region with public subnets in every AZ; fine for testing, create custom VPCs for production.']
    ]},
    { h: 'Gateways and NAT', i: [
      ['Internet Gateway (IGW)', 'Horizontally scaled, redundant, one per VPC. Performs 1:1 NAT for public IPs.'],
      ['Egress-only Internet Gateway', 'IPv6 equivalent of NAT: outbound-only IPv6 internet access.'],
      ['NAT Gateway', 'Managed, highly available WITHIN one AZ, scales to 100 Gbps, placed in a public subnet with an Elastic IP. No security groups. Charged per hour + per GB processed. For resilience deploy one per AZ and route each private subnet to its local NAT.'],
      ['NAT instance', 'Legacy self-managed EC2: disable source/destination check, manage HA yourself; supports security groups and port forwarding.'],
      ['Bastion host', 'Jump box in a public subnet for SSH into private instances. Modern answer: SSM Session Manager (no open ports).']
    ]},
    { h: 'Security groups vs NACLs', i: [
      ['Security group', 'Instance/ENI level, STATEFUL (return traffic automatic), ALLOW rules only, all rules evaluated. Can reference other security groups (e.g. allow DB port only from the app SG). Default: deny inbound, allow outbound.'],
      ['Network ACL', 'Subnet level, STATELESS (must allow return traffic on ephemeral ports 1024-65535), ALLOW and DENY rules, evaluated in number order (lowest first, first match wins). Default NACL allows all; custom NACL denies all until rules added.'],
      ['Blocking an IP', 'Use a NACL DENY rule (security groups cannot deny). At the edge use WAF IP sets.'],
      ['Layering', 'Defense in depth: NACL at subnet + SG at instance.']
    ]},
    { h: 'VPC endpoints and PrivateLink', i: [
      ['Gateway endpoint', 'S3 and DynamoDB only. Target in route table, free, same region. Cannot be accessed from on-prem or peered VPCs.'],
      ['Interface endpoint (PrivateLink)', 'ENI with private IP in your subnet for most AWS services (and S3). Uses security groups; hourly + per GB charge; reachable from on-prem over DX/VPN; private DNS.'],
      ['Endpoint policies', 'Restrict which resources/actions can be used through the endpoint; combine with S3 bucket policy aws:sourceVpce.'],
      ['PrivateLink endpoint service', 'Expose your own service (behind NLB or GWLB) privately to thousands of other VPCs/accounts without peering, no CIDR overlap issues, one-directional.']
    ]},
    { h: 'Connecting VPCs', i: [
      ['VPC peering', 'Private connection between two VPCs (cross-account, cross-region). NOT transitive. CIDRs must not overlap. Update route tables on both sides; can reference peer security groups (same region).'],
      ['Transit Gateway', 'Hub-and-spoke router for thousands of VPCs and on-prem connections; transitive; route tables for segmentation; inter-region peering; supports multicast and ECMP for VPN. See Hybrid Connectivity.'],
      ['Shared VPC (RAM)', 'Share subnets with other accounts in the organization; they launch resources into centrally managed subnets.']
    ]},
    { h: 'Monitoring and other features', i: [
      ['VPC Flow Logs', 'Capture IP traffic metadata (accept/reject) at VPC, subnet or ENI level to CloudWatch Logs, S3 or Firehose. Troubleshoot SG/NACL issues; analyze with Athena. Not packet contents.'],
      ['Traffic Mirroring', 'Copy actual packets from ENIs to monitoring appliances for deep inspection.'],
      ['Reachability Analyzer', 'Analyze network path configuration between two resources without sending packets.'],
      ['Network Access Analyzer', 'Identify unintended network access paths.'],
      ['AWS Network Firewall', 'Managed stateful firewall for the VPC: L3-L7 filtering, domain allow/deny lists, IPS (Suricata rules). Deployed in a firewall subnet; route traffic through it. Central inspection via Transit Gateway.'],
      ['DNS settings', 'enableDnsSupport and enableDnsHostnames needed for private hosted zones and interface endpoint private DNS.'],
      ['IPAM', 'Plan, track and allocate IP addresses across the organization.']
    ]}
  ],
  tips: [
    'Private instances need outbound internet -> NAT gateway in a public subnet (one per AZ for HA).',
    'Block a specific malicious IP -> NACL deny (SGs cannot deny).',
    'Return traffic blocked with custom NACL -> open ephemeral ports 1024-65535 outbound/inbound.',
    'Private access to S3/DynamoDB at no cost -> gateway endpoint. Other services or on-prem access -> interface endpoint.',
    'Expose a service to many VPCs/accounts without peering or overlapping CIDR issues -> PrivateLink with NLB.',
    'Many VPCs to interconnect transitively -> Transit Gateway. Two VPCs -> peering.',
    'Troubleshoot rejected connections -> VPC Flow Logs.',
    'Allow DB access only from app tier -> reference app security group in DB security group.'
  ],
  q: [
    { q: 'EC2 instances in a private subnet need to download software updates from the internet but must not be reachable from the internet. What should be configured?', o: ['Attach an internet gateway to the private subnet', 'Create a NAT gateway in a public subnet and add a 0.0.0.0/0 route to it from the private subnet', 'Assign Elastic IPs to the instances', 'Create a gateway VPC endpoint'], a: 1, e: 'NAT gateways allow outbound-initiated connections from private subnets while blocking unsolicited inbound traffic.', d: 1 },
    { q: 'A security team needs to block traffic from a specific malicious IP address to all instances in a subnet. What should they use?', o: ['Security group deny rule', 'Network ACL deny rule', 'IAM policy', 'Route table blackhole'], a: 1, e: 'NACLs support explicit deny rules; security groups only support allow rules.', d: 1 },
    { q: 'A custom network ACL allows inbound HTTP on port 80 but users cannot load the website. Security groups are correct. What is the MOST likely cause?', o: ['The NACL outbound rules do not allow ephemeral ports 1024-65535', 'Security groups are stateless', 'The internet gateway is missing a security group', 'The subnet has too few IP addresses'], a: 0, e: 'NACLs are stateless; responses go back to the client on ephemeral ports which must be allowed outbound.', d: 2 },
    { q: 'An application in a private subnet uploads large amounts of data to S3 and the NAT gateway data processing costs are high. How can costs be reduced?', o: ['Use a NAT instance', 'Create an S3 gateway VPC endpoint', 'Use S3 Transfer Acceleration', 'Move instances to a public subnet'], a: 1, e: 'Gateway endpoints for S3 are free and bypass the NAT gateway.', d: 4 },
    { q: 'A SaaS provider wants to expose its application to hundreds of customer VPCs privately, without VPC peering and regardless of overlapping CIDR ranges. What should be used?', o: ['VPC peering', 'Transit Gateway', 'AWS PrivateLink with a Network Load Balancer', 'Site-to-Site VPN'], a: 2, e: 'PrivateLink endpoint services expose a service behind an NLB to consumer VPCs via interface endpoints, with no CIDR overlap concerns.', d: 1 },
    { q: 'VPC A is peered with VPC B, and VPC B is peered with VPC C. Instances in VPC A cannot reach VPC C. Why?', o: ['Security groups block traffic', 'VPC peering is not transitive', 'Peering only works in the same account', 'Route tables cannot contain peering routes'], a: 1, e: 'Peering is non-transitive; A must peer directly with C or use a Transit Gateway.', d: 2 },
    { q: 'A NAT gateway architecture must remain available if an AZ fails. What is the correct design?', o: ['One NAT gateway in a single AZ with an Elastic IP', 'One NAT gateway per AZ, with each private subnet routing to the NAT gateway in its own AZ', 'NAT gateway in a private subnet', 'Two NAT gateways in the same AZ'], a: 1, e: 'A NAT gateway is redundant only within its AZ. Deploy one per AZ for zone-independent architecture.', d: 2 },
    { q: 'A database tier should accept MySQL traffic only from instances in the application tier, even as application instances scale. What is the BEST approach?', o: ['Allow the application subnet CIDR in the NACL', 'Allow port 3306 in the DB security group with the application security group as the source', 'Allow 0.0.0.0/0 on port 3306', 'Use VPC Flow Logs'], a: 1, e: 'Referencing a security group as the source automatically covers all instances in that group.', d: 1 },
    { q: 'A network engineer needs to see which connections to an instance are being rejected. What should be enabled?', o: ['AWS CloudTrail', 'VPC Flow Logs', 'AWS Config', 'Amazon Inspector'], a: 1, e: 'Flow Logs record accepted and rejected IP traffic at the VPC, subnet or ENI level.', d: 1 }
  ]
});

svc({
  id: 'hybrid-networking', name: 'Hybrid Connectivity: VPN, Direct Connect, Transit Gateway', cat: 'networking', imp: 3,
  tag: 'Connect on-premises networks and many VPCs: Site-to-Site VPN, Client VPN, Direct Connect, Transit Gateway, DX Gateway.',
  s: [
    { h: 'AWS Site-to-Site VPN', i: [
      ['What', 'IPsec encrypted tunnels over the internet between your Customer Gateway (CGW, on-prem device) and a Virtual Private Gateway (VGW) on a VPC or a Transit Gateway.'],
      ['Redundancy', 'Each connection has 2 tunnels in different AZs. Use two CGW devices for full redundancy.'],
      ['Throughput', 'Up to 1.25 Gbps per tunnel (5 Gbps with large-bandwidth tunnels on TGW). Use ECMP on Transit Gateway to aggregate multiple tunnels.'],
      ['Routing', 'Static or dynamic (BGP). Enable route propagation in route tables.'],
      ['Accelerated VPN', 'Uses Global Accelerator edge locations for better performance (TGW only).'],
      ['VPN CloudHub', 'Hub-and-spoke between multiple on-prem sites via one VGW over VPN (low-cost backup network).'],
      ['Setup time', 'Minutes. Cheap and fast; typical DX backup.']
    ]},
    { h: 'AWS Client VPN', i: [
      ['What', 'Managed OpenVPN-based remote access for individual users (laptops) into VPCs and on-prem networks. Auth via AD, SAML, certificates.']
    ]},
    { h: 'AWS Direct Connect (DX)', i: [
      ['What', 'Dedicated private physical connection from your data center to AWS via a DX location. Consistent bandwidth, lower latency, reduced data transfer out cost.'],
      ['Connection types', 'Dedicated: 1, 10, 100, 400 Gbps physical port. Hosted (via partner): 50 Mbps up to 25 Gbps.'],
      ['Lead time', 'Weeks to months to provision. Not a quick fix.'],
      ['Virtual interfaces (VIFs)', 'Private VIF: to a VPC (via VGW or DX Gateway). Public VIF: to AWS public endpoints (S3, DynamoDB) over DX. Transit VIF: to Transit Gateway via DX Gateway.'],
      ['Encryption', 'NOT encrypted by default. Run a Site-to-Site VPN over a public VIF / transit VIF for IPsec, or use MACsec (layer 2) on 10/100/400 Gbps dedicated connections.'],
      ['Resiliency', 'High: two connections at two DX locations. Maximum: two connections at each of two locations (four total). Backup VPN over the internet for cost-effective resilience.'],
      ['Direct Connect Gateway', 'Global resource: connect one DX to VPCs in multiple regions (and accounts). Does not route VPC-to-VPC.'],
      ['SiteLink', 'Send data between your own DX locations over the AWS backbone, bypassing regions.']
    ]},
    { h: 'AWS Transit Gateway (TGW)', i: [
      ['What', 'Regional cloud router: hub-and-spoke connecting thousands of VPCs, VPNs, DX gateways and SD-WAN appliances. Transitive routing.'],
      ['Route tables', 'Multiple TGW route tables to segment traffic (e.g. prod cannot reach dev, all can reach shared services).'],
      ['Inter-region peering', 'Peer TGWs across regions over the AWS backbone (encrypted).'],
      ['Sharing', 'Share TGW with other accounts via AWS RAM.'],
      ['ECMP', 'Equal-cost multi-path across multiple VPN tunnels to increase bandwidth beyond 1.25 Gbps.'],
      ['Multicast', 'Only TGW supports IP multicast in AWS.'],
      ['Centralized egress/inspection', 'Route all VPC internet traffic through a shared egress VPC with NAT gateways or Network Firewall.']
    ]}
  ],
  tips: [
    'Need connectivity today / encrypted over internet / cheap -> Site-to-Site VPN.',
    'Consistent low latency, high bandwidth, private, reduce egress cost -> Direct Connect (takes weeks).',
    'DX + encryption -> IPsec VPN over DX or MACsec.',
    'Cost-effective DX resiliency -> backup Site-to-Site VPN. Maximum resiliency -> 2 DX locations x 2 connections.',
    'One DX to VPCs in many regions -> Direct Connect Gateway.',
    'Many VPCs + on-prem, transitive, centralized routing -> Transit Gateway.',
    'Aggregate VPN bandwidth beyond 1.25 Gbps -> TGW with ECMP.',
    'IP multicast -> Transit Gateway.'
  ],
  q: [
    { q: 'A company needs to connect its data center to AWS within a day with encrypted traffic over the internet. Which solution should be used?', o: ['AWS Direct Connect', 'AWS Site-to-Site VPN', 'VPC peering', 'AWS Client VPN'], a: 1, e: 'Site-to-Site VPN can be set up in minutes and uses IPsec over the internet. Direct Connect takes weeks.', d: 2 },
    { q: 'A company requires consistent network performance and high throughput for large daily data transfers between on premises and AWS, and wants to reduce data transfer costs. What should be used?', o: ['Site-to-Site VPN', 'AWS Direct Connect', 'S3 Transfer Acceleration', 'Internet gateway'], a: 1, e: 'Direct Connect provides dedicated, consistent bandwidth and lower data transfer out pricing.', d: 3 },
    { q: 'Traffic over a Direct Connect connection must be encrypted. What should be done?', o: ['Direct Connect is encrypted by default', 'Establish an IPsec Site-to-Site VPN over the Direct Connect connection', 'Enable VPC Flow Logs', 'Use a private VIF with TLS on the DX router'], a: 1, e: 'DX is not encrypted by default. Run IPsec VPN over DX (or use MACsec on supported dedicated connections).', d: 1 },
    { q: 'A company has one Direct Connect connection and wants a cost-effective backup if it fails. What should be implemented?', o: ['A second Direct Connect at the same location', 'A Site-to-Site VPN as a backup connection', 'VPC peering', 'Global Accelerator'], a: 1, e: 'A VPN over the internet is the cost-effective backup for DX. A second DX gives higher resiliency at higher cost.', d: 4 },
    { q: 'A company has 50 VPCs across multiple accounts and an on-premises network. It needs transitive connectivity with centralized management. What should be used?', o: ['Full mesh VPC peering', 'AWS Transit Gateway shared via RAM', 'VPN CloudHub', 'Direct Connect public VIF'], a: 1, e: 'Transit Gateway provides scalable hub-and-spoke transitive routing and can be shared across accounts.', d: 2 },
    { q: 'A company with a Direct Connect connection in us-east-1 wants to reach VPCs in us-west-2 and eu-west-1 using the same connection. What should be used?', o: ['Direct Connect Gateway', 'VPC peering', 'A public VIF', 'CloudFront'], a: 0, e: 'A Direct Connect Gateway connects a DX connection to VGWs/TGWs in multiple regions.', d: 3 },
    { q: 'A company needs more than 1.25 Gbps of throughput over Site-to-Site VPN. What should it do?', o: ['Use a larger Virtual Private Gateway', 'Terminate multiple VPN tunnels on a Transit Gateway with ECMP', 'Enable jumbo frames', 'Use VPC peering'], a: 1, e: 'Transit Gateway supports ECMP to aggregate bandwidth across multiple VPN tunnels.', d: 3 }
  ]
});

svc({
  id: 'route53', name: 'Amazon Route 53', cat: 'networking', imp: 3,
  tag: 'Highly available DNS, domain registration, health checks and routing policies (failover, latency, weighted, geo...).',
  s: [
    { h: 'Basics', i: [
      ['What', 'Managed authoritative DNS with 100% availability SLA, domain registrar, health checks. Global service.'],
      ['Hosted zones', 'Public (internet) or private (one or more VPCs; requires enableDnsHostnames/Support). $0.50 per zone per month.'],
      ['TTL', 'How long resolvers cache a record. High TTL = less traffic, slower changes. Lower TTL before migrations.'],
      ['Record types', 'A (IPv4), AAAA (IPv6), CNAME (name to name, not at zone apex), NS, MX, TXT, SOA, CAA, SRV, PTR.']
    ]},
    { h: 'Alias records', i: [
      ['What', 'Route 53 extension mapping a name to an AWS resource: ELB, CloudFront, API Gateway, S3 website, Elastic Beanstalk, VPC interface endpoint, Global Accelerator, another Route 53 record.'],
      ['Advantages over CNAME', 'Works at the zone apex (example.com), free queries, automatically tracks resource IP changes, native health checks.'],
      ['Limitation', 'Cannot point to an EC2 DNS name; record type A/AAAA.']
    ]},
    { h: 'Routing policies', i: [
      ['Simple', 'One record, may return multiple values (random choice by client). No health checks.'],
      ['Weighted', 'Split traffic by percentage (e.g. 90/10): canary releases, A/B testing, gradual migration.'],
      ['Latency-based', 'Route to the region with lowest network latency for the user.'],
      ['Failover', 'Active-passive: primary with health check, secondary used when primary is unhealthy (DR).'],
      ['Geolocation', 'Route by user location (continent, country, US state): content localization, licensing restrictions, compliance. Set a default record.'],
      ['Geoproximity', 'Route by geographic distance with a bias to grow/shrink a region\'s area; requires Traffic Flow.'],
      ['IP-based', 'Route by client CIDR ranges (e.g. ISP-specific endpoints).'],
      ['Multivalue answer', 'Return up to 8 healthy records; client-side load balancing. Not a substitute for ELB.']
    ]},
    { h: 'Health checks', i: [
      ['Endpoint checks', 'HTTP/HTTPS/TCP from global checkers; healthy if > 18% of checkers report healthy. Can match string in first 5,120 bytes.'],
      ['Calculated health checks', 'Combine multiple child checks with AND/OR/threshold logic.'],
      ['CloudWatch alarm based', 'For private resources (checkers are on the internet): create a CloudWatch alarm and a health check on it.'],
      ['Integration', 'Used by failover, latency, weighted, geolocation, multivalue routing to avoid unhealthy endpoints.']
    ]},
    { h: 'Hybrid DNS and other features', i: [
      ['Route 53 Resolver', 'The VPC DNS (.2 address).'],
      ['Inbound endpoint', 'On-prem DNS servers forward queries to Route 53 Resolver to resolve AWS private hosted zones.'],
      ['Outbound endpoint', 'Resolver forwards queries for on-prem domains (forwarding rules) to on-prem DNS servers.'],
      ['Resolver DNS Firewall', 'Block or allow DNS queries to domains from your VPCs (protect against DNS exfiltration).'],
      ['Traffic Flow', 'Visual editor for complex routing trees (versioned policies).'],
      ['Application Recovery Controller', 'Readiness checks and routing controls for multi-region failover.'],
      ['Domain registration', 'Register domains; can use Route 53 as DNS for domains registered elsewhere by updating NS records at the registrar.']
    ]}
  ],
  tips: [
    'Zone apex (example.com) pointing to ALB/CloudFront -> Alias record (CNAME not allowed at apex).',
    'Active-passive DR -> failover routing with health checks. Lowest latency for global users -> latency routing.',
    'Content restricted by country / legal requirement -> geolocation. Shift traffic gradually -> weighted.',
    'Shift more traffic to one region by adjusting area -> geoproximity with bias.',
    'On-prem resolving AWS private zones -> Resolver inbound endpoint. AWS resolving on-prem names -> outbound endpoint + rules.',
    'Health check private resources -> CloudWatch alarm-based health check.'
  ],
  q: [
    { q: 'A company wants example.com (the zone apex) to point to an Application Load Balancer. Which record should be created?', o: ['CNAME record', 'Alias A record', 'MX record', 'NS record'], a: 1, e: 'CNAMEs cannot be used at the zone apex. Alias records can map the apex to AWS resources such as ALBs.', d: 3 },
    { q: 'An application runs in us-east-1 and eu-west-1. Users should be routed to the region that gives them the lowest latency. Which routing policy should be used?', o: ['Geolocation', 'Weighted', 'Latency-based', 'Simple'], a: 2, e: 'Latency-based routing directs users to the region with the lowest measured latency.', d: 3 },
    { q: 'A company must ensure that users in Germany are served only by the Frankfurt deployment for legal reasons. Which routing policy should be used?', o: ['Latency-based', 'Geolocation', 'Geoproximity', 'Multivalue answer'], a: 1, e: 'Geolocation routing routes based on the user\'s location, regardless of latency, which suits legal/compliance requirements.', d: 1 },
    { q: 'A company wants to send 10% of traffic to a new version of an application for testing while 90% goes to the current version. Which routing policy should be used?', o: ['Failover', 'Weighted', 'Latency', 'Geolocation'], a: 1, e: 'Weighted routing distributes traffic by assigned weights, ideal for canary testing.', d: 2 },
    { q: 'On-premises servers must resolve DNS names in a Route 53 private hosted zone over a VPN connection. What should be configured?', o: ['Route 53 Resolver outbound endpoint', 'Route 53 Resolver inbound endpoint and conditional forwarding on-prem', 'A public hosted zone', 'Geolocation routing'], a: 1, e: 'Inbound endpoints accept DNS queries from on-prem resolvers forwarding to AWS.', d: 3 },
    { q: 'A company needs automatic DNS failover to a static S3 maintenance website in another region if the primary ALB becomes unhealthy. Which configuration works?', o: ['Simple routing with two values', 'Failover routing with a health check on the primary record', 'Weighted routing 50/50', 'Multivalue answer routing without health checks'], a: 1, e: 'Failover routing serves the secondary record when the primary health check fails.', d: 2 }
  ]
});

svc({
  id: 'cloudfront', name: 'Amazon CloudFront', cat: 'networking', imp: 3,
  tag: 'Global CDN: origins, caching, OAC for S3, signed URLs/cookies, edge functions, geo restriction and security.',
  s: [
    { h: 'Basics', i: [
      ['What', 'Content delivery network using hundreds of edge locations and regional edge caches. Caches static and dynamic content, accelerates uploads, terminates TLS at the edge.'],
      ['Origins', 'S3 bucket, S3 website endpoint, MediaStore, ALB, EC2, API Gateway, Lambda function URL, any HTTP server (custom origin, including on-prem).'],
      ['Origin groups', 'Primary + secondary origin for automatic failover on specific HTTP error codes.'],
      ['Behaviors', 'Path patterns (/images/*, /api/*) mapped to different origins and cache settings.'],
      ['Security benefits', 'Shield Standard automatically, integrates with WAF, HTTPS, hides origin.']
    ]},
    { h: 'Caching', i: [
      ['TTL', 'Default 24 h; controlled by Cache-Control headers and cache policies (min/default/max TTL).'],
      ['Cache key', 'URL + selected headers, cookies, query strings (cache policy). Fewer elements = higher cache hit ratio.'],
      ['Origin request policy', 'Forward values to the origin without adding them to the cache key.'],
      ['Invalidations', 'Remove objects from edge caches before TTL expires (/images/*). Versioned file names are a cheaper alternative.'],
      ['Origin Shield', 'Extra caching layer in front of the origin to reduce origin load.']
    ]},
    { h: 'Securing content', i: [
      ['Origin Access Control (OAC)', 'Restrict S3 bucket so it is only readable through CloudFront (bucket policy allows the CloudFront service principal with distribution ARN). Supports SSE-KMS. Replaces legacy OAI.'],
      ['Custom origin protection', 'Have CloudFront add a secret custom header verified by the ALB, or allow only the CloudFront managed prefix list in the ALB security group.'],
      ['Signed URLs', 'Access to individual files (one URL per file). Use with trusted key groups.'],
      ['Signed cookies', 'Access to multiple restricted files (e.g. all premium videos) without changing URLs.'],
      ['Geo restriction', 'Allow or block countries (allowlist / blocklist) for licensing/compliance.'],
      ['Field-level encryption', 'Encrypt specific POST fields (e.g. credit card) at the edge with a public key; only the backend app with the private key can decrypt.'],
      ['HTTPS', 'Viewer protocol policy (redirect HTTP to HTTPS). ACM certificate must be in us-east-1.']
    ]},
    { h: 'Edge compute and pricing', i: [
      ['CloudFront Functions', 'JavaScript, sub-ms, viewer request/response: header manipulation, URL rewrites, redirects, token validation.'],
      ['Lambda@Edge', 'Node.js/Python, origin and viewer events, longer runtime, network calls, body access.'],
      ['Price classes', 'All edge locations, or Price Class 200 / 100 (exclude most expensive regions) to reduce cost.'],
      ['Real-time logs', 'Stream request logs to Kinesis Data Streams.']
    ]}
  ],
  tips: [
    'Global users, reduce latency for static content and reduce origin load -> CloudFront.',
    'S3 accessible only via CloudFront -> Origin Access Control + bucket policy.',
    'Restrict one file -> signed URL. Restrict many files / whole area -> signed cookies.',
    'Block countries -> CloudFront geo restriction (or WAF geo match).',
    'Protect sensitive form fields end to end -> field-level encryption.',
    'Origin failover -> origin groups. Region-level failover for whole app -> Route 53.',
    'CloudFront caches; Global Accelerator does not cache and works for TCP/UDP.'
  ],
  q: [
    { q: 'A company serves static content from an S3 bucket through CloudFront. Users must not be able to access the S3 bucket directly. What should be done?', o: ['Make the bucket public and use signed URLs', 'Configure Origin Access Control and a bucket policy that only allows the CloudFront distribution', 'Enable S3 Transfer Acceleration', 'Use an S3 website endpoint'], a: 1, e: 'OAC lets CloudFront sign requests to S3 and the bucket policy denies all other access.', d: 1 },
    { q: 'A video platform needs to let paying subscribers access hundreds of premium video files without generating a URL for each file. What should be used?', o: ['CloudFront signed URLs', 'CloudFront signed cookies', 'S3 pre-signed URLs', 'Geo restriction'], a: 1, e: 'Signed cookies grant access to multiple restricted files with a single credential.', d: 1 },
    { q: 'A company must prevent users in certain countries from accessing its content due to licensing. Which CloudFront feature should be used?', o: ['Field-level encryption', 'Geo restriction', 'Origin groups', 'Lambda@Edge only'], a: 1, e: 'CloudFront geo restriction blocks or allows access by country.', d: 1 },
    { q: 'A checkout form submits credit card numbers that must be encrypted so that only a specific backend service can decrypt them, even if intermediate systems log requests. What should be used?', o: ['HTTPS only', 'CloudFront field-level encryption', 'SSE-KMS on S3', 'WAF'], a: 1, e: 'Field-level encryption encrypts specific fields at the edge using a public key; only the holder of the private key can decrypt.', d: 1 },
    { q: 'A CloudFront distribution must automatically switch to a secondary origin in another region if the primary origin returns 5xx errors. What should be configured?', o: ['Origin group with failover criteria', 'Route 53 weighted routing', 'Multiple behaviors', 'Cache invalidation'], a: 0, e: 'Origin groups provide origin-level failover based on response codes.', d: 2 },
    { q: 'An ALB is used as a CloudFront origin. The company wants to ensure users cannot bypass CloudFront by calling the ALB directly. Which approaches work? (Choose TWO)', o: ['Allow only the CloudFront managed prefix list in the ALB security group', 'Configure CloudFront to add a secret custom header and have the ALB rule check it', 'Use Origin Access Control for the ALB', 'Enable S3 Block Public Access', 'Use geo restriction'], a: [0, 1], e: 'Restricting the SG to CloudFront IP ranges and validating a secret header are standard ways to protect custom origins. OAC is for S3 (and some other AWS origins), not ALB.', d: 1 }
  ]
});

svc({
  id: 'global-accelerator', name: 'AWS Global Accelerator', cat: 'networking', imp: 2,
  tag: 'Two static anycast IPs that route TCP/UDP traffic over the AWS backbone to the closest healthy regional endpoint.',
  s: [
    { h: 'How it works', i: [
      ['Anycast IPs', 'Two static IPv4 addresses (or bring your own) announced from all edge locations. Users enter the AWS network at the nearest edge.'],
      ['Endpoints', 'ALB, NLB, EC2 instances, Elastic IPs in one or more regions (endpoint groups per region with traffic dials and weights).'],
      ['Health checks', 'Automatic failover to healthy endpoints in under a minute; no DNS caching issues because IPs never change.'],
      ['Client IP preservation', 'Supported for ALB and EC2 endpoints.'],
      ['Security', 'Shield Standard by default.']
    ]},
    { h: 'Global Accelerator vs CloudFront', i: [
      ['CloudFront', 'Caches content at the edge; HTTP/HTTPS; static and dynamic web content.'],
      ['Global Accelerator', 'No caching; proxies TCP/UDP packets to regional endpoints. Gaming (UDP), IoT (MQTT), VoIP, apps needing static IPs or fast deterministic regional failover.'],
      ['Both', 'Use the AWS global network and edge locations; both integrate with Shield.']
    ]}
  ],
  tips: [
    'Static IPs for a global application + fast regional failover -> Global Accelerator.',
    'UDP gaming / VoIP / IoT globally -> Global Accelerator (CloudFront is HTTP only).',
    'Need to cache content -> CloudFront, not Global Accelerator.',
    'Partners whitelist IPs but app uses ALBs in multiple regions -> Global Accelerator.'
  ],
  q: [
    { q: 'A multiplayer gaming company uses UDP and wants to reduce latency and jitter for players worldwide while providing fast failover between regions. Which service should be used?', o: ['Amazon CloudFront', 'AWS Global Accelerator', 'Route 53 latency routing', 'S3 Transfer Acceleration'], a: 1, e: 'Global Accelerator supports UDP and routes over the AWS backbone with fast health-based failover.', d: 3 },
    { q: 'Customers must whitelist a small, fixed set of IP addresses for an application that runs behind ALBs in two regions. What should be used?', o: ['Elastic IPs on each ALB', 'AWS Global Accelerator', 'CloudFront with geo restriction', 'Route 53 multivalue answers'], a: 1, e: 'Global Accelerator provides two static anycast IPs in front of regional ALBs.', d: 3 },
    { q: 'What is a key difference between CloudFront and Global Accelerator?', o: ['Only CloudFront uses edge locations', 'Global Accelerator caches content, CloudFront does not', 'CloudFront caches content; Global Accelerator proxies TCP/UDP traffic without caching', 'Global Accelerator only supports HTTP'], a: 2, e: 'CloudFront is a caching CDN for HTTP(S). Global Accelerator improves performance for TCP/UDP apps without caching.', d: 3 }
  ]
});
