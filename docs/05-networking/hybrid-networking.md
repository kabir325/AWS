# Hybrid Connectivity: VPN, Direct Connect, Transit Gateway

> Connect on-premises networks and many VPCs: Site-to-Site VPN, Client VPN, Direct Connect, Transit Gateway, DX Gateway.

Category: **Networking & Content Delivery** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [AWS Site-to-Site VPN](#aws-site-to-site-vpn)
- [AWS Client VPN](#aws-client-vpn)
- [AWS Direct Connect (DX)](#aws-direct-connect-dx)
- [AWS Transit Gateway (TGW)](#aws-transit-gateway-tgw)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## AWS Site-to-Site VPN

- **What** - IPsec encrypted tunnels over the internet between your Customer Gateway (CGW, on-prem device) and a Virtual Private Gateway (VGW) on a VPC or a Transit Gateway.
- **Redundancy** - Each connection has 2 tunnels in different AZs. Use two CGW devices for full redundancy.
- **Throughput** - Up to 1.25 Gbps per tunnel (5 Gbps with large-bandwidth tunnels on TGW). Use ECMP on Transit Gateway to aggregate multiple tunnels.
- **Routing** - Static or dynamic (BGP). Enable route propagation in route tables.
- **Accelerated VPN** - Uses Global Accelerator edge locations for better performance (TGW only).
- **VPN CloudHub** - Hub-and-spoke between multiple on-prem sites via one VGW over VPN (low-cost backup network).
- **Setup time** - Minutes. Cheap and fast; typical DX backup.

## AWS Client VPN

- **What** - Managed OpenVPN-based remote access for individual users (laptops) into VPCs and on-prem networks. Auth via AD, SAML, certificates.

## AWS Direct Connect (DX)

- **What** - Dedicated private physical connection from your data center to AWS via a DX location. Consistent bandwidth, lower latency, reduced data transfer out cost.
- **Connection types** - Dedicated: 1, 10, 100, 400 Gbps physical port. Hosted (via partner): 50 Mbps up to 25 Gbps.
- **Lead time** - Weeks to months to provision. Not a quick fix.
- **Virtual interfaces (VIFs)** - Private VIF: to a VPC (via VGW or DX Gateway). Public VIF: to AWS public endpoints (S3, DynamoDB) over DX. Transit VIF: to Transit Gateway via DX Gateway.
- **Encryption** - NOT encrypted by default. Run a Site-to-Site VPN over a public VIF / transit VIF for IPsec, or use MACsec (layer 2) on 10/100/400 Gbps dedicated connections.
- **Resiliency** - High: two connections at two DX locations. Maximum: two connections at each of two locations (four total). Backup VPN over the internet for cost-effective resilience.
- **Direct Connect Gateway** - Global resource: connect one DX to VPCs in multiple regions (and accounts). Does not route VPC-to-VPC.
- **SiteLink** - Send data between your own DX locations over the AWS backbone, bypassing regions.

## AWS Transit Gateway (TGW)

- **What** - Regional cloud router: hub-and-spoke connecting thousands of VPCs, VPNs, DX gateways and SD-WAN appliances. Transitive routing.
- **Route tables** - Multiple TGW route tables to segment traffic (e.g. prod cannot reach dev, all can reach shared services).
- **Inter-region peering** - Peer TGWs across regions over the AWS backbone (encrypted).
- **Sharing** - Share TGW with other accounts via AWS RAM.
- **ECMP** - Equal-cost multi-path across multiple VPN tunnels to increase bandwidth beyond 1.25 Gbps.
- **Multicast** - Only TGW supports IP multicast in AWS.
- **Centralized egress/inspection** - Route all VPC internet traffic through a shared egress VPC with NAT gateways or Network Firewall.

## Exam tips

- Need connectivity today / encrypted over internet / cheap -> Site-to-Site VPN.
- Consistent low latency, high bandwidth, private, reduce egress cost -> Direct Connect (takes weeks).
- DX + encryption -> IPsec VPN over DX or MACsec.
- Cost-effective DX resiliency -> backup Site-to-Site VPN. Maximum resiliency -> 2 DX locations x 2 connections.
- One DX to VPCs in many regions -> Direct Connect Gateway.
- Many VPCs + on-prem, transitive, centralized routing -> Transit Gateway.
- Aggregate VPN bandwidth beyond 1.25 Gbps -> TGW with ECMP.
- IP multicast -> Transit Gateway.

## Practice questions

**Q1.** A company needs to connect its data center to AWS within a day with encrypted traffic over the internet. Which solution should be used?

- A. AWS Direct Connect
- B. AWS Site-to-Site VPN
- C. VPC peering
- D. AWS Client VPN

<details><summary>Answer</summary>

**B** - Site-to-Site VPN can be set up in minutes and uses IPsec over the internet. Direct Connect takes weeks.

_Domain: Design Resilient Architectures_

</details>

**Q2.** A company requires consistent network performance and high throughput for large daily data transfers between on premises and AWS, and wants to reduce data transfer costs. What should be used?

- A. Site-to-Site VPN
- B. AWS Direct Connect
- C. S3 Transfer Acceleration
- D. Internet gateway

<details><summary>Answer</summary>

**B** - Direct Connect provides dedicated, consistent bandwidth and lower data transfer out pricing.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** Traffic over a Direct Connect connection must be encrypted. What should be done?

- A. Direct Connect is encrypted by default
- B. Establish an IPsec Site-to-Site VPN over the Direct Connect connection
- C. Enable VPC Flow Logs
- D. Use a private VIF with TLS on the DX router

<details><summary>Answer</summary>

**B** - DX is not encrypted by default. Run IPsec VPN over DX (or use MACsec on supported dedicated connections).

_Domain: Design Secure Architectures_

</details>

**Q4.** A company has one Direct Connect connection and wants a cost-effective backup if it fails. What should be implemented?

- A. A second Direct Connect at the same location
- B. A Site-to-Site VPN as a backup connection
- C. VPC peering
- D. Global Accelerator

<details><summary>Answer</summary>

**B** - A VPN over the internet is the cost-effective backup for DX. A second DX gives higher resiliency at higher cost.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q5.** A company has 50 VPCs across multiple accounts and an on-premises network. It needs transitive connectivity with centralized management. What should be used?

- A. Full mesh VPC peering
- B. AWS Transit Gateway shared via RAM
- C. VPN CloudHub
- D. Direct Connect public VIF

<details><summary>Answer</summary>

**B** - Transit Gateway provides scalable hub-and-spoke transitive routing and can be shared across accounts.

_Domain: Design Resilient Architectures_

</details>

**Q6.** A company with a Direct Connect connection in us-east-1 wants to reach VPCs in us-west-2 and eu-west-1 using the same connection. What should be used?

- A. Direct Connect Gateway
- B. VPC peering
- C. A public VIF
- D. CloudFront

<details><summary>Answer</summary>

**A** - A Direct Connect Gateway connects a DX connection to VGWs/TGWs in multiple regions.

_Domain: Design High-Performing Architectures_

</details>

**Q7.** A company needs more than 1.25 Gbps of throughput over Site-to-Site VPN. What should it do?

- A. Use a larger Virtual Private Gateway
- B. Terminate multiple VPN tunnels on a Transit Gateway with ECMP
- C. Enable jumbo frames
- D. Use VPC peering

<details><summary>Answer</summary>

**B** - Transit Gateway supports ECMP to aggregate bandwidth across multiple VPN tunnels.

_Domain: Design High-Performing Architectures_

</details>
