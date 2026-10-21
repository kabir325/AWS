# Secrets Manager, Parameter Store & ACM

> Store and rotate secrets, manage configuration, and provision free TLS certificates.

Category: **Security, Identity & Compliance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [AWS Secrets Manager](#aws-secrets-manager)
- [SSM Parameter Store](#ssm-parameter-store)
- [AWS Certificate Manager (ACM)](#aws-certificate-manager-acm)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## AWS Secrets Manager

- **What** - Store, retrieve and automatically rotate secrets (DB credentials, API keys). Encrypted with KMS.
- **Rotation** - Built-in rotation for RDS, Aurora, Redshift, DocumentDB using managed Lambda functions; custom Lambda for others.
- **Cross-region replication** - Replicate secrets to other regions for DR / multi-region apps.
- **Access** - IAM + resource policies; cross-account sharing; VPC interface endpoint.
- **Cost** - Per secret per month + API calls.

## SSM Parameter Store

- **What** - Hierarchical storage for configuration data and secrets (/app/prod/db-url). Part of Systems Manager.
- **Tiers** - Standard: free, 4 KB values, 10,000 parameters. Advanced: 8 KB, parameter policies (expiration, notifications), charged.
- **SecureString** - Encrypted with KMS.
- **Rotation** - No native rotation (use Secrets Manager or custom automation). Can reference Secrets Manager secrets.
- **Integrations** - CloudFormation dynamic references, ECS/EKS, Lambda, versioning, EventBridge notifications.

## AWS Certificate Manager (ACM)

- **What** - Provision, manage and deploy public and private SSL/TLS certificates. Public certificates are free and auto-renew (DNS validation recommended).
- **Integrations** - ELB (ALB/NLB), CloudFront, API Gateway, App Runner, Elastic Beanstalk. Historically cannot be installed on EC2 directly (exportable paid certificates now exist).
- **Region** - Regional: request in the same region as the ALB/API. For CloudFront (and edge-optimized API Gateway) request in us-east-1.
- **Imported certificates** - Third-party certs can be imported but do not auto-renew; ACM / Config can alert before expiry.
- **AWS Private CA** - Managed private certificate authority for internal TLS / mTLS.

## Exam tips

- Automatic rotation of DB credentials -> Secrets Manager.
- Free, simple config or secret storage without rotation -> Parameter Store (SecureString).
- Free TLS certs with auto-renewal for ALB/CloudFront -> ACM. CloudFront needs the cert in us-east-1.
- Imported certificates expiring -> they do not auto-renew; set up alerts (Config rule / EventBridge).

## Practice questions

**Q1.** A company needs to store database credentials and rotate them automatically every 30 days with the least operational overhead. What should be used?

- A. SSM Parameter Store SecureString
- B. AWS Secrets Manager
- C. KMS
- D. Encrypted S3 object

<details><summary>Answer</summary>

**B** - Secrets Manager provides managed rotation for RDS and other databases.

_Domain: Design Secure Architectures_

</details>

**Q2.** A team needs to store non-sensitive application configuration values and a few encrypted API keys at no additional cost. Rotation is not required. What should be used?

- A. AWS Secrets Manager
- B. SSM Parameter Store standard parameters with SecureString
- C. DynamoDB
- D. AWS AppConfig only

<details><summary>Answer</summary>

**B** - Parameter Store standard tier is free and supports KMS-encrypted SecureString parameters.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** A company wants to enable HTTPS on a CloudFront distribution using a free certificate that renews automatically. Where must the certificate be requested?

- A. In the same region as the origin
- B. In ACM in us-east-1
- C. In any region
- D. In IAM certificate store only

<details><summary>Answer</summary>

**B** - CloudFront uses ACM certificates from the us-east-1 region.

_Domain: Design Secure Architectures_

</details>

**Q4.** A multi-region application needs the same database secret available in two regions for disaster recovery. What should be used?

- A. Secrets Manager with secret replication to the second region
- B. Parameter Store with cross-region replication
- C. S3 Cross-Region Replication of a text file
- D. KMS multi-Region keys only

<details><summary>Answer</summary>

**A** - Secrets Manager can replicate secrets to multiple regions and keep them in sync.

_Domain: Design Resilient Architectures_

</details>
