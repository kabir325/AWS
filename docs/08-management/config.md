# AWS Config

> Resource inventory, configuration history and compliance evaluation with managed or custom rules and auto-remediation.

Category: **Management & Governance** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Core features](#core-features)
- [Remediation and scale](#remediation-and-scale)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Core features

- **Configuration recorder** - Records configuration of supported resources and changes over time (configuration items) to S3; notifications via SNS.
- **Configuration timeline** - See what a resource looked like at any point and its relationships (e.g. which SG was attached to an instance last Tuesday).
- **Config rules** - Evaluate compliance: AWS managed rules (s3-bucket-public-read-prohibited, encrypted-volumes, restricted-ssh, required-tags) or custom rules (Lambda or Guard). Triggered on change or periodically.
- **Detect, do not prevent** - Config rules flag non-compliance; they do not block actions (use SCPs/IAM for prevention).

## Remediation and scale

- **Remediation** - Automatic or manual remediation using SSM Automation documents (e.g. re-enable bucket encryption, remove open SSH rules).
- **Conformance packs** - Collections of rules and remediations deployed as one unit (e.g. PCI, HIPAA operational best practices), across an organization.
- **Aggregators** - Multi-account, multi-region view of compliance in one account.
- **Integrations** - EventBridge for compliance change events; Security Hub uses Config; Control Tower detective controls use Config.

## Exam tips

- Track configuration changes and history of resources -> Config.
- Continuously check resources for compliance (encryption, tags, public buckets) -> Config rules.
- Automatically fix non-compliant resources -> Config remediation with SSM Automation.
- Organization-wide compliance view -> Config aggregator / conformance packs.

## Practice questions

**Q1.** A company needs to know how the security group of an EC2 instance was configured two weeks ago. Which service provides this information?

- A. AWS CloudTrail
- B. AWS Config
- C. Amazon Inspector
- D. VPC Reachability Analyzer

<details><summary>Answer</summary>

**B** - Config records configuration history and provides a timeline of resource configurations.

_Domain: Design Secure Architectures_

</details>

**Q2.** A company must continuously check that all EBS volumes are encrypted and automatically notify when a non-compliant volume is created. What should be used?

- A. AWS Config managed rule encrypted-volumes with SNS notifications
- B. IAM policy
- C. AWS Trusted Advisor
- D. Amazon Macie

<details><summary>Answer</summary>

**A** - Config managed rules evaluate compliance continuously and integrate with SNS/EventBridge.

_Domain: Design Secure Architectures_

</details>

**Q3.** Security groups that allow SSH from 0.0.0.0/0 must be automatically corrected when detected. What is the BEST solution?

- A. AWS Config rule restricted-ssh with automatic remediation via SSM Automation
- B. Manual weekly review
- C. GuardDuty
- D. Shield Advanced

<details><summary>Answer</summary>

**A** - Config can automatically remediate non-compliant resources using Systems Manager Automation runbooks.

_Domain: Design Secure Architectures_

</details>
