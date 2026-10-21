# GuardDuty, Inspector, Macie, Security Hub, Detective

> Managed threat detection, vulnerability scanning, sensitive data discovery, findings aggregation and investigation.

Category: **Security, Identity & Compliance** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Services](#services)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Services

- **Amazon GuardDuty** - Intelligent threat detection using ML and threat intel on CloudTrail management/data events, VPC Flow Logs, DNS logs, plus optional EKS, S3, RDS login, Lambda, EBS malware scanning, runtime monitoring. No agents to start. Detects crypto-mining, compromised credentials, port scanning. Findings -> EventBridge for automated response.
- **Amazon Inspector** - Automated vulnerability management: scans EC2 (via SSM agent or agentless), ECR container images, and Lambda functions for software CVEs and network reachability. Continuous rescans with risk score.
- **Amazon Macie** - Uses ML and pattern matching to discover and protect sensitive data (PII, financial data, credentials) in S3. Findings to EventBridge / Security Hub.
- **AWS Security Hub** - Central view of security posture across accounts: aggregates findings from GuardDuty, Inspector, Macie, Config, Firewall Manager, partners; automated checks against CIS, AWS Foundational Security Best Practices, PCI DSS. Requires AWS Config.
- **Amazon Detective** - Investigate root cause of findings using graph analysis of CloudTrail, VPC Flow Logs, GuardDuty data.
- **AWS Audit Manager** - Continuously collect evidence for audits (GDPR, HIPAA, PCI).
- **AWS Artifact** - Portal to download AWS compliance reports (SOC, ISO, PCI) and accept agreements (BAA).

## Exam tips

- Detect malicious activity / compromised instances / crypto-mining from logs -> GuardDuty.
- Scan EC2, containers, Lambda for vulnerabilities (CVEs) -> Inspector.
- Find PII in S3 -> Macie.
- Single pane of glass for security findings and compliance checks -> Security Hub.
- Investigate root cause of a finding -> Detective.
- Download SOC/PCI reports for auditors -> Artifact.

## Practice questions

**Q1.** A company wants to detect if EC2 instances are communicating with known malicious IP addresses or being used for crypto mining, using existing logs and no agents. Which service should be used?

- A. Amazon Inspector
- B. Amazon GuardDuty
- C. Amazon Macie
- D. AWS Config

<details><summary>Answer</summary>

**B** - GuardDuty analyzes VPC Flow Logs, DNS logs and CloudTrail to detect threats.

_Domain: Design Secure Architectures_

</details>

**Q2.** A company needs to identify S3 buckets containing personally identifiable information. Which service should be used?

- A. Amazon Macie
- B. Amazon GuardDuty
- C. AWS Security Hub
- D. Amazon Detective

<details><summary>Answer</summary>

**A** - Macie discovers and classifies sensitive data in S3.

_Domain: Design Secure Architectures_

</details>

**Q3.** A security team wants continuous vulnerability scanning of EC2 instances and container images in ECR. Which service should be used?

- A. Amazon Inspector
- B. AWS Shield
- C. Amazon GuardDuty
- D. AWS Trusted Advisor

<details><summary>Answer</summary>

**A** - Inspector scans EC2, ECR images and Lambda for software vulnerabilities.

_Domain: Design Secure Architectures_

</details>

**Q4.** A company wants a centralized dashboard aggregating security findings from GuardDuty, Inspector and Macie across all accounts, with automated best-practice checks. What should be used?

- A. Amazon Detective
- B. AWS Security Hub
- C. Amazon CloudWatch
- D. AWS Audit Manager

<details><summary>Answer</summary>

**B** - Security Hub aggregates findings and runs automated security standard checks.

_Domain: Design Secure Architectures_

</details>

**Q5.** A GuardDuty finding indicates compromised EC2 credentials. The company wants to automatically isolate the instance. What is the BEST design?

- A. Manually review findings daily
- B. EventBridge rule on GuardDuty findings that triggers a Lambda function to change the instance security group
- C. Enable Inspector
- D. Configure CloudTrail Insights

<details><summary>Answer</summary>

**B** - GuardDuty publishes findings to EventBridge, enabling automated remediation with Lambda or SSM Automation.

_Domain: Design Secure Architectures_

</details>
