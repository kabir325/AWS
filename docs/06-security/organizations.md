# AWS Organizations, Control Tower & IAM Identity Center

> Multi-account governance: OUs, SCPs, RCPs, consolidated billing, landing zones, centralized SSO and resource sharing.

Category: **Security, Identity & Compliance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [AWS Organizations](#aws-organizations)
- [AWS Control Tower](#aws-control-tower)
- [IAM Identity Center (successor to AWS SSO)](#iam-identity-center-successor-to-aws-sso)
- [Directory and sharing services](#directory-and-sharing-services)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## AWS Organizations

- **Structure** - Management account + member accounts grouped into Organizational Units (OUs) under a root. Global service.
- **Consolidated billing** - Single bill; aggregated usage for volume discounts; RIs and Savings Plans shared across accounts (can be turned off).
- **Service Control Policies (SCPs)** - Guardrails that set the MAXIMUM permissions for accounts/OUs. They never grant permissions. Do not affect the management account. Affect root user of member accounts. Common: deny leaving the org, restrict regions, deny disabling CloudTrail.
- **Resource Control Policies (RCPs)** - Org-level max permissions on resources (S3, KMS, SQS, STS, Secrets Manager), e.g. block access from outside the organization.
- **Other policy types** - Tag policies (standardize tags), backup policies, AI opt-out policies, declarative policies.
- **aws:PrincipalOrgID** - Condition key in resource policies to allow access from any account in the organization.
- **Account creation** - Create accounts programmatically; member accounts get OrganizationAccountAccessRole for admin access from management.

## AWS Control Tower

- **What** - Automates setup of a secure multi-account landing zone based on best practices (built on Organizations).
- **Controls (guardrails)** - Preventive (SCPs), detective (Config rules), proactive (CloudFormation hooks). Mandatory, strongly recommended, elective.
- **Account Factory** - Provision new pre-configured, compliant accounts.
- **Default accounts** - Log archive and Audit accounts; centralized CloudTrail and Config.
- **Dashboard** - View compliance across accounts.

## IAM Identity Center (successor to AWS SSO)

- **What** - Single sign-on for workforce users to multiple AWS accounts and business apps (SAML 2.0).
- **Identity sources** - Built-in directory, AWS Managed Microsoft AD / AD Connector, external IdP (Okta, Entra ID) with SCIM provisioning.
- **Permission sets** - Collections of policies assigned to users/groups per account; deployed as roles.

## Directory and sharing services

- **AWS Managed Microsoft AD** - Real AD in AWS; trust relationships with on-prem AD; MFA; used by FSx Windows, RDS SQL Server, WorkSpaces.
- **AD Connector** - Proxy that redirects auth requests to on-prem AD; no data cached in AWS.
- **Simple AD** - Low-cost Samba-based AD-compatible directory; no trusts.
- **AWS RAM (Resource Access Manager)** - Share resources across accounts/OUs: VPC subnets, Transit Gateway, Route 53 Resolver rules, License Manager configs, Aurora clusters, etc.

## Exam tips

- Restrict what member accounts can do (even their root user) -> SCP. SCPs do NOT grant permissions and do NOT apply to the management account.
- Allow access to a bucket for all accounts in the org without listing them -> aws:PrincipalOrgID condition.
- Set up a governed multi-account environment quickly -> Control Tower.
- Single sign-on to all accounts with corporate identities -> IAM Identity Center.
- Share subnets or Transit Gateway across accounts -> AWS RAM.
- Users authenticate against on-prem AD without syncing -> AD Connector. Need trust and AD-aware AWS services -> AWS Managed Microsoft AD.

## Practice questions

**Q1.** A company wants to prevent all member accounts from launching resources outside two approved regions, including actions by account administrators. What should be used?

- A. IAM policies in each account
- B. A Service Control Policy attached to the root or OUs
- C. AWS Config rules
- D. Permissions boundaries

<details><summary>Answer</summary>

**B** - SCPs set maximum permissions for all principals in member accounts, including administrators and root.

_Domain: Design Secure Architectures_

</details>

**Q2.** An SCP allows only EC2 actions. An IAM user in a member account has an AdministratorAccess policy. What can the user do?

- A. Everything, because AdministratorAccess overrides SCPs
- B. Only EC2 actions
- C. Nothing
- D. Only IAM actions

<details><summary>Answer</summary>

**B** - Effective permissions are the intersection of SCP and IAM policies.

_Domain: Design Secure Architectures_

</details>

**Q3.** An S3 bucket should be accessible to all accounts in the company's AWS Organization, including accounts created in the future. What is the simplest approach?

- A. List every account ID in the bucket policy
- B. Use a bucket policy with the aws:PrincipalOrgID condition
- C. Make the bucket public
- D. Use S3 ACLs

<details><summary>Answer</summary>

**B** - aws:PrincipalOrgID allows access to any principal in the organization automatically.

_Domain: Design Secure Architectures_

</details>

**Q4.** A company needs to quickly set up a secure, well-architected multi-account environment with centralized logging and preventive and detective guardrails. Which service should be used?

- A. AWS Control Tower
- B. AWS Config
- C. AWS Service Catalog
- D. AWS Security Hub

<details><summary>Answer</summary>

**A** - Control Tower automates landing zone setup, including guardrails, log archive and audit accounts.

_Domain: Design Secure Architectures_

</details>

**Q5.** Employees should sign in once with corporate credentials from Microsoft Entra ID and access multiple AWS accounts with role-specific permissions. What should be used?

- A. IAM users in each account
- B. IAM Identity Center with Entra ID as external identity provider
- C. Amazon Cognito user pools
- D. AD Connector only

<details><summary>Answer</summary>

**B** - IAM Identity Center provides workforce SSO across accounts with permission sets and supports external IdPs.

_Domain: Design Secure Architectures_

</details>

**Q6.** A central networking account owns a VPC. Application teams in other accounts must launch EC2 instances into its subnets. What should be used?

- A. VPC peering
- B. AWS RAM to share subnets
- C. Transit Gateway
- D. PrivateLink

<details><summary>Answer</summary>

**B** - RAM supports VPC subnet sharing so participant accounts launch resources into shared subnets.

_Domain: Design Resilient Architectures_

</details>
