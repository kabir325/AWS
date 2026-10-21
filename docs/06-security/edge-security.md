# WAF, Shield, Firewall Manager & Network Firewall

> Protect applications from web exploits and DDoS, and manage firewall rules centrally across accounts.

Category: **Security, Identity & Compliance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [AWS WAF](#aws-waf)
- [AWS Shield](#aws-shield)
- [AWS Firewall Manager](#aws-firewall-manager)
- [AWS Network Firewall](#aws-network-firewall)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## AWS WAF

- **What** - Layer 7 web application firewall. Web ACLs with rules attached to CloudFront, ALB, API Gateway (REST), AppSync, Cognito user pools, App Runner, Verified Access. NOT NLB or EC2 directly.
- **Rules** - IP sets (allow/block), geo match, SQL injection, XSS, size constraints, string/regex match on headers/body/URI, rate-based rules (throttle IPs exceeding N requests per 5 min).
- **Managed rule groups** - AWS Managed Rules (Core rule set, known bad inputs, IP reputation, Bot Control, Account Takeover Prevention) and Marketplace rules.
- **Logging** - Logs to CloudWatch Logs, S3 or Firehose.
- **Static IP needed with WAF** - Use Global Accelerator + ALB with WAF, since NLB does not support WAF.

## AWS Shield

- **Shield Standard** - Free, automatic protection against common layer 3/4 DDoS attacks (SYN/UDP floods, reflection) for all customers.
- **Shield Advanced** - ~$3,000/month per organization: enhanced detection and mitigation for EC2, ELB, CloudFront, Global Accelerator, Route 53; 24/7 Shield Response Team (SRT); cost protection against scaling charges during attacks; automatic application-layer mitigation with WAF; health-based detection.
- **DDoS resilient architecture** - CloudFront + Route 53 at the edge, WAF rate limiting, ELB + Auto Scaling to absorb, keep origins private.

## AWS Firewall Manager

- **What** - Centrally configure and enforce WAF rules, Shield Advanced protections, security groups, Network Firewall, Route 53 Resolver DNS Firewall policies across all accounts in an Organization.
- **Auto-apply** - New accounts and resources automatically get the policies. Requires Organizations and AWS Config.

## AWS Network Firewall

- **What** - Managed stateful network firewall and IPS for VPC traffic (layer 3-7): stateless/stateful rules, domain filtering (allow only *.example.com egress), Suricata-compatible IPS rules.
- **Deployment** - Firewall endpoints in dedicated subnets; route tables steer traffic through them. Centralized inspection VPC with Transit Gateway.

## Exam tips

- SQL injection / XSS / block IPs or countries at layer 7 -> AWS WAF.
- Throttle abusive IPs (HTTP floods) -> WAF rate-based rule.
- Advanced DDoS protection, 24/7 response team, cost protection -> Shield Advanced.
- Enforce WAF / SG rules across all accounts automatically -> Firewall Manager.
- Filter VPC egress traffic by domain name or IPS for VPC -> Network Firewall.
- WAF cannot attach to NLB.

## Practice questions

**Q1.** A web application behind an ALB is receiving SQL injection attempts. Which service should be used to block them?

- A. AWS Shield Standard
- B. AWS WAF with managed rule groups
- C. Security groups
- D. Network ACLs

<details><summary>Answer</summary>

**B** - WAF inspects HTTP requests and provides SQL injection protection rules.

_Domain: Design Secure Architectures_

</details>

**Q2.** A company wants protection from large DDoS attacks, 24/7 access to AWS DDoS experts, and reimbursement for scaling costs incurred during attacks. What should it use?

- A. AWS Shield Standard
- B. AWS Shield Advanced
- C. AWS WAF
- D. Amazon GuardDuty

<details><summary>Answer</summary>

**B** - Shield Advanced includes the Shield Response Team and DDoS cost protection.

_Domain: Design Secure Architectures_

</details>

**Q3.** A company with 100 accounts needs to ensure all ALBs and CloudFront distributions have a standard set of WAF rules, including resources created in the future. What should be used?

- A. AWS Config
- B. AWS Firewall Manager
- C. CloudFormation StackSets only
- D. AWS Security Hub

<details><summary>Answer</summary>

**B** - Firewall Manager centrally deploys and enforces WAF policies across accounts and new resources.

_Domain: Design Secure Architectures_

</details>

**Q4.** An API is being hit by a few IP addresses sending thousands of requests per minute. How can these clients be throttled automatically?

- A. NACL deny rules updated manually
- B. WAF rate-based rule
- C. Shield Standard
- D. Security group rules

<details><summary>Answer</summary>

**B** - Rate-based rules block IPs exceeding a request threshold over a 5-minute window.

_Domain: Design Secure Architectures_

</details>

**Q5.** A company must allow EC2 instances to reach only a list of approved external domains (e.g. *.amazonaws.com and a partner domain) and block all other egress traffic. Which service should be used?

- A. AWS WAF
- B. Security groups
- C. AWS Network Firewall with domain list rules
- D. Shield Advanced

<details><summary>Answer</summary>

**C** - Network Firewall supports stateful domain allow/deny lists for outbound traffic. Security groups only filter by IP/port.

_Domain: Design Secure Architectures_

</details>
