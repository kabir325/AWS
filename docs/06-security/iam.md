# AWS IAM

> Identities (users, groups, roles), policies, policy evaluation, STS, cross-account access and best practices.

Category: **Security, Identity & Compliance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Identities](#identities)
- [Policies](#policies)
- [Policy evaluation logic](#policy-evaluation-logic)
- [STS and federation](#sts-and-federation)
- [Security tools and best practices](#security-tools-and-best-practices)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Identities

- **Root user** - Full access; use only for a few tasks (change support plan, close account, some billing). Enable MFA, no access keys.
- **IAM users** - Long-term credentials (password, access keys) for people or apps. Prefer federation / IAM Identity Center for humans and roles for workloads.
- **Groups** - Collections of users to attach policies. Groups cannot be nested and are not principals in policies.
- **Roles** - Identity with temporary credentials assumed by users, services (EC2, Lambda), other accounts or federated identities. Trust policy defines who can assume it.
- **Service-linked roles** - Predefined roles that a service creates and uses on your behalf.

## Policies

- **Structure** - JSON: Version, Statement with Effect (Allow/Deny), Action, Resource, optional Condition and Principal (resource-based only).
- **Identity-based** - Attached to users, groups, roles. AWS managed, customer managed, or inline.
- **Resource-based** - Attached to resources (S3 bucket, SQS queue, KMS key, Lambda). Include a Principal; enable cross-account access without assuming a role.
- **Permissions boundary** - Maximum permissions an identity-based policy can grant to a user/role. Used to safely delegate role creation to developers.
- **Session policies** - Passed when assuming a role to further restrict that session.
- **Conditions** - aws:SourceIp, aws:RequestedRegion, aws:PrincipalOrgID, aws:MultiFactorAuthPresent, aws:SecureTransport, aws:PrincipalTag (ABAC), s3:prefix, etc.
- **ABAC** - Attribute-based access control: grant access when principal tags match resource tags; scales without editing policies.

## Policy evaluation logic

- **Default deny** - Everything is implicitly denied unless allowed.
- **Explicit deny wins** - An explicit Deny anywhere overrides any Allow.
- **Within an account** - Allowed if permitted by identity OR resource policy, and not blocked by SCP, RCP, permissions boundary or session policy.
- **Cross-account** - Requires allow on BOTH sides: identity policy in the caller account and resource policy (or role trust) in the target account.
- **Order to remember** - Explicit deny -> Organizations SCP/RCP -> resource-based policy -> permissions boundary -> session policy -> identity-based policy.

## STS and federation

- **AWS STS** - Issues temporary credentials: AssumeRole (cross-account, same account), AssumeRoleWithWebIdentity (OIDC; prefer Cognito), AssumeRoleWithSAML, GetSessionToken (MFA), GetFederationToken.
- **Cross-account access** - Create a role in account B trusting account A; users in A with sts:AssumeRole permission switch to it. Use External ID for third parties (confused deputy protection).
- **SAML 2.0 federation** - Corporate IdP (AD FS) users get temporary role credentials; no IAM users needed.
- **IAM Identity Center** - Recommended workforce SSO across all accounts in the organization with permission sets; connects to AD or external IdPs (see Organizations).

## Security tools and best practices

- **Least privilege** - Grant only what is needed; start from AWS managed policies then refine.
- **MFA** - Virtual, hardware TOTP or FIDO2 security keys / passkeys. Enforce with aws:MultiFactorAuthPresent.
- **Password policy** - Length, complexity, rotation, reuse prevention.
- **IAM Access Analyzer** - Finds resources shared outside your account/organization, validates policies, generates least-privilege policies from CloudTrail activity, flags unused access.
- **Credential report** - Account-level CSV of all users and status of passwords, keys, MFA.
- **Access Advisor (last accessed)** - Shows services a user/role has accessed and when: remove unused permissions.
- **Never share or embed keys** - Use roles for EC2/Lambda/ECS; rotate any remaining access keys.

## Exam tips

- Application on EC2/Lambda needs AWS access -> IAM role, never access keys.
- Access from another AWS account -> cross-account role (or resource-based policy). Third party -> role + External ID.
- Explicit deny always wins.
- Let developers create roles without escalating privileges -> permissions boundaries.
- Find resources shared externally / generate least-privilege policy -> IAM Access Analyzer.
- Scalable permissions based on tags (project, team) -> ABAC.
- Corporate identities into AWS -> IAM Identity Center or SAML federation, not IAM users.

## Practice questions

**Q1.** An application running on EC2 needs to write to a DynamoDB table. What is the MOST secure way to provide credentials?

- A. Create an IAM user and store keys in environment variables
- B. Attach an IAM role to the EC2 instance with permissions to the table
- C. Store keys in an S3 bucket
- D. Hard-code keys in the application

<details><summary>Answer</summary>

**B** - IAM roles provide temporary credentials that rotate automatically.

_Domain: Design Secure Architectures_

</details>

**Q2.** A user has an IAM policy allowing s3:* on a bucket, but the bucket policy explicitly denies s3:DeleteObject for that user. What happens when the user tries to delete an object?

- A. The delete succeeds because the IAM policy allows s3:*
- B. The delete is denied because explicit deny overrides allow
- C. The delete succeeds only with MFA
- D. It depends on the order the policies were created

<details><summary>Answer</summary>

**B** - Explicit deny always overrides allow.

_Domain: Design Secure Architectures_

</details>

**Q3.** Users in Account A must access resources in Account B. What is the recommended approach?

- A. Create IAM users in Account B for each person
- B. Create a role in Account B that trusts Account A, and allow users in A to assume it
- C. Share root credentials
- D. Use VPC peering

<details><summary>Answer</summary>

**B** - Cross-account roles provide temporary credentials and avoid duplicate users.

_Domain: Design Secure Architectures_

</details>

**Q4.** A company wants developers to create IAM roles for their Lambda functions without being able to grant more permissions than they themselves have. What should be used?

- A. Service control policies
- B. Permissions boundaries
- C. Resource-based policies
- D. IAM groups

<details><summary>Answer</summary>

**B** - Permissions boundaries cap the maximum permissions of roles/users, enabling safe delegation.

_Domain: Design Secure Architectures_

</details>

**Q5.** A third-party monitoring vendor needs read access to a company's AWS account. What protects against the confused deputy problem?

- A. Give the vendor an IAM user
- B. Create a cross-account role that requires an External ID in the trust policy
- C. Share the root account MFA
- D. Use a bucket policy

<details><summary>Answer</summary>

**B** - External ID in the role trust policy ensures only the intended customer context can assume the role through the vendor.

_Domain: Design Secure Architectures_

</details>

**Q6.** A security team wants to identify S3 buckets, KMS keys and IAM roles that are shared with external accounts. Which service should be used?

- A. IAM credential report
- B. IAM Access Analyzer
- C. AWS Trusted Advisor
- D. Amazon Inspector

<details><summary>Answer</summary>

**B** - Access Analyzer identifies resources shared with external principals.

_Domain: Design Secure Architectures_

</details>

**Q7.** A company wants permissions to scale automatically as new projects are added, granting engineers access only to resources tagged with their project. Which approach fits?

- A. Create a new policy per project
- B. Attribute-based access control using principal and resource tags
- C. Permissions boundaries
- D. One IAM group per resource

<details><summary>Answer</summary>

**B** - ABAC compares principal tags with resource tags so new projects need no new policies.

_Domain: Design Secure Architectures_

</details>
