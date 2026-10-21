# Elastic Load Balancing

> ALB (layer 7), NLB (layer 4), GWLB (layer 3 appliances): distribute traffic across healthy targets in multiple AZs.

Category: **Compute** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Application Load Balancer (ALB)](#application-load-balancer-alb)
- [Network Load Balancer (NLB)](#network-load-balancer-nlb)
- [Gateway Load Balancer (GWLB)](#gateway-load-balancer-gwlb)
- [Common features](#common-features)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Application Load Balancer (ALB)

- **Layer 7** - HTTP, HTTPS, HTTP/2, gRPC, WebSockets.
- **Routing rules** - Route by path (/api), host header (api.example.com), HTTP headers, query string, source IP. Ideal for microservices and containers.
- **Targets** - EC2 instances, IP addresses (incl. on-prem via private IPs), Lambda functions, ECS tasks (dynamic port mapping).
- **Features** - Redirects (HTTP->HTTPS), fixed responses, authentication with Cognito / OIDC, sticky sessions (cookies), weighted target groups (blue/green, canary).
- **Client IP** - Backend sees ALB IP; client IP is in X-Forwarded-For header (port X-Forwarded-Port, protocol X-Forwarded-Proto).
- **DNS only** - No static IP. Put Global Accelerator in front, or use NLB with ALB as target, if static IPs are required.

## Network Load Balancer (NLB)

- **Layer 4** - TCP, UDP, TLS. Millions of requests per second, ultra-low latency.
- **Static IPs** - One static IP per AZ, can assign Elastic IPs. Good for whitelisting by IP.
- **Source IP preserved** - Client IP is visible to targets (for instance targets).
- **Targets** - Instances, IPs, ALB. Health checks TCP, HTTP or HTTPS.
- **PrivateLink** - NLB (or GWLB) is the provider side of VPC endpoint services (PrivateLink).
- **Security groups** - NLBs now support security groups (optional).

## Gateway Load Balancer (GWLB)

- **Layer 3** - Deploy, scale and manage third-party virtual appliances: firewalls, IDS/IPS, deep packet inspection.
- **How it works** - Transparent network gateway + load balancer. Uses GENEVE protocol on port 6081. Route table sends traffic to GWLB endpoint -> appliances -> back to destination.

## Common features

- **Health checks** - Per target group; unhealthy targets stop receiving traffic.
- **Cross-zone load balancing** - Distribute evenly across all targets in all AZs. ALB: always on, no charge. NLB/GWLB: off by default, inter-AZ data charged if enabled.
- **SSL/TLS termination** - Offload TLS at the LB with ACM certificates. SNI lets one ALB/NLB listener serve multiple certificates (multiple domains).
- **Deregistration delay** - Connection draining: in-flight requests complete before a target is removed (default 300 s).
- **Sticky sessions** - Bind a client to a target via cookie (ALB) or source IP (NLB). Can cause imbalance; prefer stateless apps.
- **Internet-facing vs internal** - Internal LBs have only private IPs, used between tiers.
- **Classic Load Balancer** - Legacy (previous generation). Migrate to ALB/NLB.

## Exam tips

- Path or host based routing, Lambda targets, Cognito auth -> ALB.
- Static IP / Elastic IP, extreme performance, UDP, preserve client IP -> NLB.
- Third-party firewall appliances inline -> GWLB (GENEVE 6081).
- Need client IP behind ALB -> read X-Forwarded-For.
- Multiple HTTPS domains on one load balancer -> SNI.
- WAF can attach to ALB but NOT to NLB.

## Practice questions

**Q1.** A company runs several microservices and wants to route requests to /orders and /users to different target groups behind one load balancer. Which load balancer should be used?

- A. Network Load Balancer
- B. Application Load Balancer
- C. Gateway Load Balancer
- D. Classic Load Balancer

<details><summary>Answer</summary>

**B** - ALB supports path-based and host-based routing at layer 7.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A partner requires a fixed set of IP addresses to whitelist for accessing a TCP application. Which solution meets this requirement?

- A. ALB with an Elastic IP
- B. NLB with Elastic IPs assigned per AZ
- C. CloudFront distribution
- D. Classic Load Balancer

<details><summary>Answer</summary>

**B** - NLBs support one static IP / Elastic IP per AZ. ALBs do not support static IPs.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** Application servers behind an ALB need to log the original client IP address. Where can they find it?

- A. In the source IP of the TCP packet
- B. In the X-Forwarded-For header
- C. In VPC Flow Logs only
- D. In the Host header

<details><summary>Answer</summary>

**B** - ALB terminates the connection; the client IP is passed in X-Forwarded-For.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A security team must inspect all inbound traffic to a VPC using a fleet of third-party firewall appliances that scale automatically. Which service should be used?

- A. Network Load Balancer
- B. AWS Network Firewall
- C. Gateway Load Balancer
- D. Application Load Balancer with AWS WAF

<details><summary>Answer</summary>

**C** - Gateway Load Balancer is designed to deploy and scale third-party virtual appliances transparently using GENEVE.

_Domain: Design Secure Architectures_

</details>

**Q5.** A company hosts three HTTPS websites with different domain names and wants to use a single load balancer. What enables this?

- A. Multiple Elastic IPs
- B. Server Name Indication (SNI) with multiple ACM certificates on the ALB listener
- C. Sticky sessions
- D. Cross-zone load balancing

<details><summary>Answer</summary>

**B** - SNI allows the load balancer to present the right certificate based on the hostname requested by the client.

_Domain: Design Secure Architectures_

</details>

**Q6.** Which combination provides static IP addresses while still using ALB features such as path-based routing? (Choose TWO)

- A. Place AWS Global Accelerator in front of the ALB
- B. Assign an Elastic IP to the ALB
- C. Register the ALB as a target of an NLB
- D. Enable cross-zone load balancing
- E. Use a Classic Load Balancer

<details><summary>Answer</summary>

**A, C** - Global Accelerator provides two static anycast IPs to an ALB endpoint, and NLB supports ALB-type target groups. ALBs cannot have Elastic IPs.

_Domain: Design High-Performing Architectures_

</details>
