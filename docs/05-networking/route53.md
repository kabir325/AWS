# Amazon Route 53

> Highly available DNS, domain registration, health checks and routing policies (failover, latency, weighted, geo...).

Category: **Networking & Content Delivery** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Basics](#basics)
- [Alias records](#alias-records)
- [Routing policies](#routing-policies)
- [Health checks](#health-checks)
- [Hybrid DNS and other features](#hybrid-dns-and-other-features)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Basics

- **What** - Managed authoritative DNS with 100% availability SLA, domain registrar, health checks. Global service.
- **Hosted zones** - Public (internet) or private (one or more VPCs; requires enableDnsHostnames/Support). $0.50 per zone per month.
- **TTL** - How long resolvers cache a record. High TTL = less traffic, slower changes. Lower TTL before migrations.
- **Record types** - A (IPv4), AAAA (IPv6), CNAME (name to name, not at zone apex), NS, MX, TXT, SOA, CAA, SRV, PTR.

## Alias records

- **What** - Route 53 extension mapping a name to an AWS resource: ELB, CloudFront, API Gateway, S3 website, Elastic Beanstalk, VPC interface endpoint, Global Accelerator, another Route 53 record.
- **Advantages over CNAME** - Works at the zone apex (example.com), free queries, automatically tracks resource IP changes, native health checks.
- **Limitation** - Cannot point to an EC2 DNS name; record type A/AAAA.

## Routing policies

- **Simple** - One record, may return multiple values (random choice by client). No health checks.
- **Weighted** - Split traffic by percentage (e.g. 90/10): canary releases, A/B testing, gradual migration.
- **Latency-based** - Route to the region with lowest network latency for the user.
- **Failover** - Active-passive: primary with health check, secondary used when primary is unhealthy (DR).
- **Geolocation** - Route by user location (continent, country, US state): content localization, licensing restrictions, compliance. Set a default record.
- **Geoproximity** - Route by geographic distance with a bias to grow/shrink a region's area; requires Traffic Flow.
- **IP-based** - Route by client CIDR ranges (e.g. ISP-specific endpoints).
- **Multivalue answer** - Return up to 8 healthy records; client-side load balancing. Not a substitute for ELB.

## Health checks

- **Endpoint checks** - HTTP/HTTPS/TCP from global checkers; healthy if > 18% of checkers report healthy. Can match string in first 5,120 bytes.
- **Calculated health checks** - Combine multiple child checks with AND/OR/threshold logic.
- **CloudWatch alarm based** - For private resources (checkers are on the internet): create a CloudWatch alarm and a health check on it.
- **Integration** - Used by failover, latency, weighted, geolocation, multivalue routing to avoid unhealthy endpoints.

## Hybrid DNS and other features

- **Route 53 Resolver** - The VPC DNS (.2 address).
- **Inbound endpoint** - On-prem DNS servers forward queries to Route 53 Resolver to resolve AWS private hosted zones.
- **Outbound endpoint** - Resolver forwards queries for on-prem domains (forwarding rules) to on-prem DNS servers.
- **Resolver DNS Firewall** - Block or allow DNS queries to domains from your VPCs (protect against DNS exfiltration).
- **Traffic Flow** - Visual editor for complex routing trees (versioned policies).
- **Application Recovery Controller** - Readiness checks and routing controls for multi-region failover.
- **Domain registration** - Register domains; can use Route 53 as DNS for domains registered elsewhere by updating NS records at the registrar.

## Exam tips

- Zone apex (example.com) pointing to ALB/CloudFront -> Alias record (CNAME not allowed at apex).
- Active-passive DR -> failover routing with health checks. Lowest latency for global users -> latency routing.
- Content restricted by country / legal requirement -> geolocation. Shift traffic gradually -> weighted.
- Shift more traffic to one region by adjusting area -> geoproximity with bias.
- On-prem resolving AWS private zones -> Resolver inbound endpoint. AWS resolving on-prem names -> outbound endpoint + rules.
- Health check private resources -> CloudWatch alarm-based health check.

## Practice questions

**Q1.** A company wants example.com (the zone apex) to point to an Application Load Balancer. Which record should be created?

- A. CNAME record
- B. Alias A record
- C. MX record
- D. NS record

<details><summary>Answer</summary>

**B** - CNAMEs cannot be used at the zone apex. Alias records can map the apex to AWS resources such as ALBs.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** An application runs in us-east-1 and eu-west-1. Users should be routed to the region that gives them the lowest latency. Which routing policy should be used?

- A. Geolocation
- B. Weighted
- C. Latency-based
- D. Simple

<details><summary>Answer</summary>

**C** - Latency-based routing directs users to the region with the lowest measured latency.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A company must ensure that users in Germany are served only by the Frankfurt deployment for legal reasons. Which routing policy should be used?

- A. Latency-based
- B. Geolocation
- C. Geoproximity
- D. Multivalue answer

<details><summary>Answer</summary>

**B** - Geolocation routing routes based on the user's location, regardless of latency, which suits legal/compliance requirements.

_Domain: Design Secure Architectures_

</details>

**Q4.** A company wants to send 10% of traffic to a new version of an application for testing while 90% goes to the current version. Which routing policy should be used?

- A. Failover
- B. Weighted
- C. Latency
- D. Geolocation

<details><summary>Answer</summary>

**B** - Weighted routing distributes traffic by assigned weights, ideal for canary testing.

_Domain: Design Resilient Architectures_

</details>

**Q5.** On-premises servers must resolve DNS names in a Route 53 private hosted zone over a VPN connection. What should be configured?

- A. Route 53 Resolver outbound endpoint
- B. Route 53 Resolver inbound endpoint and conditional forwarding on-prem
- C. A public hosted zone
- D. Geolocation routing

<details><summary>Answer</summary>

**B** - Inbound endpoints accept DNS queries from on-prem resolvers forwarding to AWS.

_Domain: Design High-Performing Architectures_

</details>

**Q6.** A company needs automatic DNS failover to a static S3 maintenance website in another region if the primary ALB becomes unhealthy. Which configuration works?

- A. Simple routing with two values
- B. Failover routing with a health check on the primary record
- C. Weighted routing 50/50
- D. Multivalue answer routing without health checks

<details><summary>Answer</summary>

**B** - Failover routing serves the secondary record when the primary health check fails.

_Domain: Design Resilient Architectures_

</details>
