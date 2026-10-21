# Amazon VPC

> Your private network in AWS: CIDRs, subnets, route tables, gateways, NAT, security groups vs NACLs, endpoints, peering, flow logs.

Category: **Networking & Content Delivery** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Building blocks](#building-blocks)
- [Gateways and NAT](#gateways-and-nat)
- [Security groups vs NACLs](#security-groups-vs-nacls)
- [VPC endpoints and PrivateLink](#vpc-endpoints-and-privatelink)
- [Connecting VPCs](#connecting-vpcs)
- [Monitoring and other features](#monitoring-and-other-features)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Building blocks

- **VPC** - Regional, spans all AZs. IPv4 CIDR between /16 and /28 (up to 5 CIDRs), optional IPv6. Use RFC 1918 ranges and avoid overlap with other networks you will connect to. Default limit 5 VPCs per region.
- **Subnet** - Lives in one AZ. AWS reserves 5 IPs per subnet (first 4 and last 1): a /24 gives 251 usable addresses.
- **Public subnet** - Route table has 0.0.0.0/0 -> Internet Gateway; instances need public or Elastic IPs.
- **Private subnet** - No route to IGW; outbound internet via NAT gateway.
- **Route tables** - Associated with subnets; most specific route wins. The "local" route enables all intra-VPC traffic and cannot be removed.
- **Default VPC** - One per region with public subnets in every AZ; fine for testing, create custom VPCs for production.

## Gateways and NAT

- **Internet Gateway (IGW)** - Horizontally scaled, redundant, one per VPC. Performs 1:1 NAT for public IPs.
- **Egress-only Internet Gateway** - IPv6 equivalent of NAT: outbound-only IPv6 internet access.
- **NAT Gateway** - Managed, highly available WITHIN one AZ, scales to 100 Gbps, placed in a public subnet with an Elastic IP. No security groups. Charged per hour + per GB processed. For resilience deploy one per AZ and route each private subnet to its local NAT.
- **NAT instance** - Legacy self-managed EC2: disable source/destination check, manage HA yourself; supports security groups and port forwarding.
- **Bastion host** - Jump box in a public subnet for SSH into private instances. Modern answer: SSM Session Manager (no open ports).

## Security groups vs NACLs

- **Security group** - Instance/ENI level, STATEFUL (return traffic automatic), ALLOW rules only, all rules evaluated. Can reference other security groups (e.g. allow DB port only from the app SG). Default: deny inbound, allow outbound.
- **Network ACL** - Subnet level, STATELESS (must allow return traffic on ephemeral ports 1024-65535), ALLOW and DENY rules, evaluated in number order (lowest first, first match wins). Default NACL allows all; custom NACL denies all until rules added.
- **Blocking an IP** - Use a NACL DENY rule (security groups cannot deny). At the edge use WAF IP sets.
- **Layering** - Defense in depth: NACL at subnet + SG at instance.

## VPC endpoints and PrivateLink

- **Gateway endpoint** - S3 and DynamoDB only. Target in route table, free, same region. Cannot be accessed from on-prem or peered VPCs.
- **Interface endpoint (PrivateLink)** - ENI with private IP in your subnet for most AWS services (and S3). Uses security groups; hourly + per GB charge; reachable from on-prem over DX/VPN; private DNS.
- **Endpoint policies** - Restrict which resources/actions can be used through the endpoint; combine with S3 bucket policy aws:sourceVpce.
- **PrivateLink endpoint service** - Expose your own service (behind NLB or GWLB) privately to thousands of other VPCs/accounts without peering, no CIDR overlap issues, one-directional.

## Connecting VPCs

- **VPC peering** - Private connection between two VPCs (cross-account, cross-region). NOT transitive. CIDRs must not overlap. Update route tables on both sides; can reference peer security groups (same region).
- **Transit Gateway** - Hub-and-spoke router for thousands of VPCs and on-prem connections; transitive; route tables for segmentation; inter-region peering; supports multicast and ECMP for VPN. See Hybrid Connectivity.
- **Shared VPC (RAM)** - Share subnets with other accounts in the organization; they launch resources into centrally managed subnets.

## Monitoring and other features

- **VPC Flow Logs** - Capture IP traffic metadata (accept/reject) at VPC, subnet or ENI level to CloudWatch Logs, S3 or Firehose. Troubleshoot SG/NACL issues; analyze with Athena. Not packet contents.
- **Traffic Mirroring** - Copy actual packets from ENIs to monitoring appliances for deep inspection.
- **Reachability Analyzer** - Analyze network path configuration between two resources without sending packets.
- **Network Access Analyzer** - Identify unintended network access paths.
- **AWS Network Firewall** - Managed stateful firewall for the VPC: L3-L7 filtering, domain allow/deny lists, IPS (Suricata rules). Deployed in a firewall subnet; route traffic through it. Central inspection via Transit Gateway.
- **DNS settings** - enableDnsSupport and enableDnsHostnames needed for private hosted zones and interface endpoint private DNS.
- **IPAM** - Plan, track and allocate IP addresses across the organization.

## Exam tips

- Private instances need outbound internet -> NAT gateway in a public subnet (one per AZ for HA).
- Block a specific malicious IP -> NACL deny (SGs cannot deny).
- Return traffic blocked with custom NACL -> open ephemeral ports 1024-65535 outbound/inbound.
- Private access to S3/DynamoDB at no cost -> gateway endpoint. Other services or on-prem access -> interface endpoint.
- Expose a service to many VPCs/accounts without peering or overlapping CIDR issues -> PrivateLink with NLB.
- Many VPCs to interconnect transitively -> Transit Gateway. Two VPCs -> peering.
- Troubleshoot rejected connections -> VPC Flow Logs.
- Allow DB access only from app tier -> reference app security group in DB security group.

## Practice questions

**Q1.** EC2 instances in a private subnet need to download software updates from the internet but must not be reachable from the internet. What should be configured?

- A. Attach an internet gateway to the private subnet
- B. Create a NAT gateway in a public subnet and add a 0.0.0.0/0 route to it from the private subnet
- C. Assign Elastic IPs to the instances
- D. Create a gateway VPC endpoint

<details><summary>Answer</summary>

**B** - NAT gateways allow outbound-initiated connections from private subnets while blocking unsolicited inbound traffic.

_Domain: Design Secure Architectures_

</details>

**Q2.** A security team needs to block traffic from a specific malicious IP address to all instances in a subnet. What should they use?

- A. Security group deny rule
- B. Network ACL deny rule
- C. IAM policy
- D. Route table blackhole

<details><summary>Answer</summary>

**B** - NACLs support explicit deny rules; security groups only support allow rules.

_Domain: Design Secure Architectures_

</details>

**Q3.** A custom network ACL allows inbound HTTP on port 80 but users cannot load the website. Security groups are correct. What is the MOST likely cause?

- A. The NACL outbound rules do not allow ephemeral ports 1024-65535
- B. Security groups are stateless
- C. The internet gateway is missing a security group
- D. The subnet has too few IP addresses

<details><summary>Answer</summary>

**A** - NACLs are stateless; responses go back to the client on ephemeral ports which must be allowed outbound.

_Domain: Design Resilient Architectures_

</details>

**Q4.** An application in a private subnet uploads large amounts of data to S3 and the NAT gateway data processing costs are high. How can costs be reduced?

- A. Use a NAT instance
- B. Create an S3 gateway VPC endpoint
- C. Use S3 Transfer Acceleration
- D. Move instances to a public subnet

<details><summary>Answer</summary>

**B** - Gateway endpoints for S3 are free and bypass the NAT gateway.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q5.** A SaaS provider wants to expose its application to hundreds of customer VPCs privately, without VPC peering and regardless of overlapping CIDR ranges. What should be used?

- A. VPC peering
- B. Transit Gateway
- C. AWS PrivateLink with a Network Load Balancer
- D. Site-to-Site VPN

<details><summary>Answer</summary>

**C** - PrivateLink endpoint services expose a service behind an NLB to consumer VPCs via interface endpoints, with no CIDR overlap concerns.

_Domain: Design Secure Architectures_

</details>

**Q6.** VPC A is peered with VPC B, and VPC B is peered with VPC C. Instances in VPC A cannot reach VPC C. Why?

- A. Security groups block traffic
- B. VPC peering is not transitive
- C. Peering only works in the same account
- D. Route tables cannot contain peering routes

<details><summary>Answer</summary>

**B** - Peering is non-transitive; A must peer directly with C or use a Transit Gateway.

_Domain: Design Resilient Architectures_

</details>

**Q7.** A NAT gateway architecture must remain available if an AZ fails. What is the correct design?

- A. One NAT gateway in a single AZ with an Elastic IP
- B. One NAT gateway per AZ, with each private subnet routing to the NAT gateway in its own AZ
- C. NAT gateway in a private subnet
- D. Two NAT gateways in the same AZ

<details><summary>Answer</summary>

**B** - A NAT gateway is redundant only within its AZ. Deploy one per AZ for zone-independent architecture.

_Domain: Design Resilient Architectures_

</details>

**Q8.** A database tier should accept MySQL traffic only from instances in the application tier, even as application instances scale. What is the BEST approach?

- A. Allow the application subnet CIDR in the NACL
- B. Allow port 3306 in the DB security group with the application security group as the source
- C. Allow 0.0.0.0/0 on port 3306
- D. Use VPC Flow Logs

<details><summary>Answer</summary>

**B** - Referencing a security group as the source automatically covers all instances in that group.

_Domain: Design Secure Architectures_

</details>

**Q9.** A network engineer needs to see which connections to an instance are being rejected. What should be enabled?

- A. AWS CloudTrail
- B. VPC Flow Logs
- C. AWS Config
- D. Amazon Inspector

<details><summary>Answer</summary>

**B** - Flow Logs record accepted and rejected IP traffic at the VPC, subnet or ENI level.

_Domain: Design Secure Architectures_

</details>
