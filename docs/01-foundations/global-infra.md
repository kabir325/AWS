# AWS Global Infrastructure

> Regions, Availability Zones, edge locations, Local Zones, Wavelength, Outposts and the shared responsibility model.

Category: **Foundations** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Regions](#regions)
- [Availability Zones](#availability-zones)
- [Edge and extended infrastructure](#edge-and-extended-infrastructure)
- [Shared responsibility model](#shared-responsibility-model)
- [Quotas and data transfer pricing](#quotas-and-data-transfer-pricing)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Regions

- **What it is** - A separate geographic area containing multiple isolated Availability Zones. Most services are regional and data never leaves a region unless you replicate or move it.
- **Choosing a region** - Order of priority: compliance / data residency, latency to users, service and feature availability, then price (prices differ per region).
- **Global services** - IAM, Route 53, CloudFront, Organizations, Global Accelerator and WAF for CloudFront are global. Several have their control plane in us-east-1 (e.g. ACM certs for CloudFront must be in us-east-1).

## Availability Zones

- **What it is** - One or more discrete data centers with redundant power, networking and connectivity. Regions have 3 or more AZs (typically 3-6).
- **Isolation** - AZs are physically separated but linked with low-latency, high-throughput private fiber, so synchronous replication (e.g. RDS Multi-AZ) is practical.
- **AZ names vs AZ IDs** - Names like us-east-1a are shuffled per account. Use AZ IDs (use1-az1) to line up the same physical AZ across accounts (e.g. for shared subnets via RAM).
- **HA rule of thumb** - Spread across at least two AZs. "Highly available" in a question almost always means Multi-AZ.

## Edge and extended infrastructure

- **Edge locations (PoPs)** - Hundreds of points of presence used by CloudFront, Route 53, Global Accelerator, Shield and WAF to serve users close to them.
- **Regional edge caches** - Larger CloudFront caches between edge locations and the origin; keep less popular objects cached longer.
- **Local Zones** - Extension of a region into a metro area for single-digit millisecond latency (EC2, EBS, ECS, some RDS). Opt in, then create subnets in the Local Zone.
- **Wavelength Zones** - AWS compute embedded in telco 5G networks; traffic from mobile devices never leaves the carrier network. For ultra-low-latency mobile/edge apps.
- **Outposts** - AWS-managed racks or servers installed in your own data center. Same APIs and tools; for low latency to on-prem systems, local data processing or data residency. You own physical security and power.

## Shared responsibility model

- **AWS: security OF the cloud** - Physical facilities, hardware, global network, hypervisor, and the software of managed services.
- **Customer: security IN the cloud** - Data, IAM, guest OS patching on EC2, security groups and NACLs, encryption choices, application code, network configuration.
- **Shifts with abstraction** - EC2 (IaaS): you patch the OS. RDS: AWS patches OS and engine; you manage users, network access, backup settings, encryption. Lambda/S3/DynamoDB: you manage code, data and permissions only.

## Quotas and data transfer pricing

- **Service quotas** - Per-account, per-region soft limits (e.g. 5 VPCs, 5 Elastic IPs per region). Raise via Service Quotas; Trusted Advisor and CloudWatch can alert as you approach them.
- **Inbound vs outbound** - Data in from the internet is free. Data out to the internet is charged. Cross-region transfer is charged.
- **Cross-AZ** - Traffic between AZs is charged in each direction. Traffic within one AZ using private IPs is free.
- **Cost levers** - Use private IPs, keep chatty tiers in one AZ when HA is not required, use VPC gateway endpoints instead of NAT for S3/DynamoDB, use CloudFront to reduce origin egress.

## Exam tips

- Data residency / sovereignty requirement -> pick the region first, everything else second.
- Single-digit ms latency in a specific city -> Local Zones. 5G mobile devices -> Wavelength. Must run in our own data center -> Outposts.
- Highly available = at least 2 AZs. Disaster recovery across geography = multiple regions.
- ACM certificate for CloudFront must be requested/imported in us-east-1.

## Practice questions

**Q1.** A media company needs single-digit millisecond latency for an editing workload used by artists in a large city that is far from the nearest AWS Region. The company does not want to manage hardware. What should a solutions architect recommend?

- A. Deploy the workload in an AWS Local Zone near the city
- B. Use larger EC2 instances in the nearest Region
- C. Place Amazon CloudFront in front of the workload
- D. Install AWS Outposts in a colocation facility

<details><summary>Answer</summary>

**A** - Local Zones extend a region into metro areas for single-digit ms latency and AWS manages the infrastructure. Outposts requires you to host racks; CloudFront caches content but does not run interactive compute.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** Under the shared responsibility model, which task is the customer responsible for when using Amazon RDS?

- A. Patching the database engine
- B. Replacing failed storage hardware
- C. Managing database user accounts and security group rules
- D. Maintaining the hypervisor

<details><summary>Answer</summary>

**C** - For managed services AWS patches the OS and engine and maintains hardware. The customer controls access: DB users, security groups, encryption choices and backup settings.

_Domain: Design Secure Architectures_

</details>

**Q3.** A company must ensure that customer data never leaves Germany. What is the FIRST decision a solutions architect should make?

- A. Enable S3 Cross-Region Replication
- B. Select the eu-central-1 (Frankfurt) Region for all resources
- C. Use CloudFront geo restriction
- D. Encrypt all data with KMS

<details><summary>Answer</summary>

**B** - Data residency is satisfied by choosing the region. AWS does not move data out of a region unless you configure it.

_Domain: Design Secure Architectures_

</details>

**Q4.** Two AWS accounts need to place resources in the same physical Availability Zone. What should they use to coordinate?

- A. AZ names such as us-east-1a
- B. AZ IDs such as use1-az1
- C. Placement groups
- D. Edge location codes

<details><summary>Answer</summary>

**B** - AZ names are randomly mapped per account; AZ IDs identify the same physical location across accounts.

_Domain: Design Resilient Architectures_

</details>

**Q5.** An application must process data locally inside a factory with strict on-premises latency requirements while using the same AWS APIs and tools as in the cloud. Which service fits?

- A. AWS Wavelength
- B. AWS Local Zones
- C. AWS Outposts
- D. AWS Snowball Edge in a region

<details><summary>Answer</summary>

**C** - Outposts brings AWS infrastructure and APIs into your own facility. Wavelength is for 5G carrier networks; Local Zones are AWS-operated metro locations.

_Domain: Design High-Performing Architectures_

</details>

**Q6.** Which data transfer is typically free of charge?

- A. Data out from EC2 to the internet
- B. Data between two EC2 instances in different AZs
- C. Data into AWS from the internet
- D. Data replicated between regions

<details><summary>Answer</summary>

**C** - Inbound data transfer is free. Outbound to the internet, cross-AZ and cross-region transfers are charged.

_Domain: Design Cost-Optimized Architectures_

</details>
