# AWS CloudFormation & IaC

> Infrastructure as code: templates, stacks, change sets, StackSets, drift detection, CDK and Service Catalog.

Category: **Management & Governance** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Concepts](#concepts)
- [Advanced features](#advanced-features)
- [Related tools](#related-tools)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Concepts

- **Template** - YAML/JSON: Parameters, Mappings, Conditions, Resources (required), Outputs. Intrinsic functions: Ref, Fn::GetAtt, Fn::Sub, Fn::ImportValue.
- **Stack** - Set of resources managed as one unit; create, update, delete together. Failed creation rolls back by default.
- **Change sets** - Preview what will change before executing an update.
- **Nested stacks / cross-stack references** - Reuse components; export outputs and import in other stacks.
- **Drift detection** - Find resources changed manually outside CloudFormation.

## Advanced features

- **StackSets** - Deploy stacks across multiple accounts and regions from one template (with Organizations auto-deployment to new accounts).
- **DeletionPolicy** - Retain or Snapshot (RDS, EBS, ElastiCache...) a resource when the stack is deleted. UpdateReplacePolicy similar for replacements.
- **Stack policies** - Protect critical resources from updates.
- **Helper scripts and signals** - cfn-init, cfn-signal with CreationPolicy / WaitCondition to wait for EC2 bootstrapping.
- **Custom resources** - Lambda-backed logic for unsupported actions (e.g. empty an S3 bucket before delete).
- **Termination protection** - Prevent accidental stack deletion.

## Related tools

- **AWS CDK** - Define infrastructure in TypeScript, Python, Java, etc.; synthesizes CloudFormation.
- **AWS SAM** - Serverless Application Model: simplified CloudFormation for Lambda, API Gateway, DynamoDB.
- **AWS Service Catalog** - Admins publish approved products (CloudFormation templates) to a portfolio; users self-service launch only approved, compliant resources with constrained permissions.
- **AWS Proton / Application Composer** - Platform templates for microservices; visual IaC designer.

## Exam tips

- Replicate infrastructure consistently in multiple environments / regions -> CloudFormation.
- Same stack in many accounts and regions -> StackSets.
- Keep the database when the stack is deleted -> DeletionPolicy: Retain or Snapshot.
- Detect manual changes -> drift detection.
- Let users launch only approved resources without broad IAM permissions -> Service Catalog.

## Practice questions

**Q1.** A company wants to deploy a standard security baseline (IAM roles, Config rules) into every account in its organization, including new accounts automatically. What should be used?

- A. CloudFormation StackSets with service-managed permissions and automatic deployment
- B. A CloudFormation stack per account created manually
- C. AWS Elastic Beanstalk
- D. AWS CodeDeploy

<details><summary>Answer</summary>

**A** - StackSets integrated with Organizations can deploy automatically to new accounts in target OUs.

_Domain: Design Secure Architectures_

</details>

**Q2.** When a CloudFormation stack is deleted, the production RDS database must be preserved as a snapshot. What should be set?

- A. Termination protection on the stack
- B. DeletionPolicy: Snapshot on the RDS resource
- C. A stack policy
- D. Drift detection

<details><summary>Answer</summary>

**B** - DeletionPolicy Snapshot creates a final snapshot before deleting the resource.

_Domain: Design Resilient Architectures_

</details>

**Q3.** An administrator wants end users to launch only pre-approved EC2 and RDS configurations without granting them broad permissions. What should be used?

- A. AWS Service Catalog
- B. AWS Config
- C. IAM Access Analyzer
- D. AWS Organizations tag policies

<details><summary>Answer</summary>

**A** - Service Catalog provides governed self-service of approved CloudFormation products with launch constraints.

_Domain: Design Secure Architectures_

</details>
