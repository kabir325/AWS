svc({
  id: 'iam', name: 'AWS IAM', cat: 'security', imp: 3,
  tag: 'Identities (users, groups, roles), policies, policy evaluation, STS, cross-account access and best practices.',
  s: [
    { h: 'Identities', i: [
      ['Root user', 'Full access; use only for a few tasks (change support plan, close account, some billing). Enable MFA, no access keys.'],
      ['IAM users', 'Long-term credentials (password, access keys) for people or apps. Prefer federation / IAM Identity Center for humans and roles for workloads.'],
      ['Groups', 'Collections of users to attach policies. Groups cannot be nested and are not principals in policies.'],
      ['Roles', 'Identity with temporary credentials assumed by users, services (EC2, Lambda), other accounts or federated identities. Trust policy defines who can assume it.'],
      ['Service-linked roles', 'Predefined roles that a service creates and uses on your behalf.']
    ]},
    { h: 'Policies', i: [
      ['Structure', 'JSON: Version, Statement with Effect (Allow/Deny), Action, Resource, optional Condition and Principal (resource-based only).'],
      ['Identity-based', 'Attached to users, groups, roles. AWS managed, customer managed, or inline.'],
      ['Resource-based', 'Attached to resources (S3 bucket, SQS queue, KMS key, Lambda). Include a Principal; enable cross-account access without assuming a role.'],
      ['Permissions boundary', 'Maximum permissions an identity-based policy can grant to a user/role. Used to safely delegate role creation to developers.'],
      ['Session policies', 'Passed when assuming a role to further restrict that session.'],
      ['Conditions', 'aws:SourceIp, aws:RequestedRegion, aws:PrincipalOrgID, aws:MultiFactorAuthPresent, aws:SecureTransport, aws:PrincipalTag (ABAC), s3:prefix, etc.'],
      ['ABAC', 'Attribute-based access control: grant access when principal tags match resource tags; scales without editing policies.']
    ]},
    { h: 'Policy evaluation logic', i: [
      ['Default deny', 'Everything is implicitly denied unless allowed.'],
      ['Explicit deny wins', 'An explicit Deny anywhere overrides any Allow.'],
      ['Within an account', 'Allowed if permitted by identity OR resource policy, and not blocked by SCP, RCP, permissions boundary or session policy.'],
      ['Cross-account', 'Requires allow on BOTH sides: identity policy in the caller account and resource policy (or role trust) in the target account.'],
      ['Order to remember', 'Explicit deny -> Organizations SCP/RCP -> resource-based policy -> permissions boundary -> session policy -> identity-based policy.']
    ]},
    { h: 'STS and federation', i: [
      ['AWS STS', 'Issues temporary credentials: AssumeRole (cross-account, same account), AssumeRoleWithWebIdentity (OIDC; prefer Cognito), AssumeRoleWithSAML, GetSessionToken (MFA), GetFederationToken.'],
      ['Cross-account access', 'Create a role in account B trusting account A; users in A with sts:AssumeRole permission switch to it. Use External ID for third parties (confused deputy protection).'],
      ['SAML 2.0 federation', 'Corporate IdP (AD FS) users get temporary role credentials; no IAM users needed.'],
      ['IAM Identity Center', 'Recommended workforce SSO across all accounts in the organization with permission sets; connects to AD or external IdPs (see Organizations).']
    ]},
    { h: 'Security tools and best practices', i: [
      ['Least privilege', 'Grant only what is needed; start from AWS managed policies then refine.'],
      ['MFA', 'Virtual, hardware TOTP or FIDO2 security keys / passkeys. Enforce with aws:MultiFactorAuthPresent.'],
      ['Password policy', 'Length, complexity, rotation, reuse prevention.'],
      ['IAM Access Analyzer', 'Finds resources shared outside your account/organization, validates policies, generates least-privilege policies from CloudTrail activity, flags unused access.'],
      ['Credential report', 'Account-level CSV of all users and status of passwords, keys, MFA.'],
      ['Access Advisor (last accessed)', 'Shows services a user/role has accessed and when: remove unused permissions.'],
      ['Never share or embed keys', 'Use roles for EC2/Lambda/ECS; rotate any remaining access keys.']
    ]}
  ],
  tips: [
    'Application on EC2/Lambda needs AWS access -> IAM role, never access keys.',
    'Access from another AWS account -> cross-account role (or resource-based policy). Third party -> role + External ID.',
    'Explicit deny always wins.',
    'Let developers create roles without escalating privileges -> permissions boundaries.',
    'Find resources shared externally / generate least-privilege policy -> IAM Access Analyzer.',
    'Scalable permissions based on tags (project, team) -> ABAC.',
    'Corporate identities into AWS -> IAM Identity Center or SAML federation, not IAM users.'
  ],
  q: [
    { q: 'An application running on EC2 needs to write to a DynamoDB table. What is the MOST secure way to provide credentials?', o: ['Create an IAM user and store keys in environment variables', 'Attach an IAM role to the EC2 instance with permissions to the table', 'Store keys in an S3 bucket', 'Hard-code keys in the application'], a: 1, e: 'IAM roles provide temporary credentials that rotate automatically.', d: 1 },
    { q: 'A user has an IAM policy allowing s3:* on a bucket, but the bucket policy explicitly denies s3:DeleteObject for that user. What happens when the user tries to delete an object?', o: ['The delete succeeds because the IAM policy allows s3:*', 'The delete is denied because explicit deny overrides allow', 'The delete succeeds only with MFA', 'It depends on the order the policies were created'], a: 1, e: 'Explicit deny always overrides allow.', d: 1 },
    { q: 'Users in Account A must access resources in Account B. What is the recommended approach?', o: ['Create IAM users in Account B for each person', 'Create a role in Account B that trusts Account A, and allow users in A to assume it', 'Share root credentials', 'Use VPC peering'], a: 1, e: 'Cross-account roles provide temporary credentials and avoid duplicate users.', d: 1 },
    { q: 'A company wants developers to create IAM roles for their Lambda functions without being able to grant more permissions than they themselves have. What should be used?', o: ['Service control policies', 'Permissions boundaries', 'Resource-based policies', 'IAM groups'], a: 1, e: 'Permissions boundaries cap the maximum permissions of roles/users, enabling safe delegation.', d: 1 },
    { q: 'A third-party monitoring vendor needs read access to a company\'s AWS account. What protects against the confused deputy problem?', o: ['Give the vendor an IAM user', 'Create a cross-account role that requires an External ID in the trust policy', 'Share the root account MFA', 'Use a bucket policy'], a: 1, e: 'External ID in the role trust policy ensures only the intended customer context can assume the role through the vendor.', d: 1 },
    { q: 'A security team wants to identify S3 buckets, KMS keys and IAM roles that are shared with external accounts. Which service should be used?', o: ['IAM credential report', 'IAM Access Analyzer', 'AWS Trusted Advisor', 'Amazon Inspector'], a: 1, e: 'Access Analyzer identifies resources shared with external principals.', d: 1 },
    { q: 'A company wants permissions to scale automatically as new projects are added, granting engineers access only to resources tagged with their project. Which approach fits?', o: ['Create a new policy per project', 'Attribute-based access control using principal and resource tags', 'Permissions boundaries', 'One IAM group per resource'], a: 1, e: 'ABAC compares principal tags with resource tags so new projects need no new policies.', d: 1 }
  ]
});

svc({
  id: 'organizations', name: 'AWS Organizations, Control Tower & IAM Identity Center', cat: 'security', imp: 3,
  tag: 'Multi-account governance: OUs, SCPs, RCPs, consolidated billing, landing zones, centralized SSO and resource sharing.',
  s: [
    { h: 'AWS Organizations', i: [
      ['Structure', 'Management account + member accounts grouped into Organizational Units (OUs) under a root. Global service.'],
      ['Consolidated billing', 'Single bill; aggregated usage for volume discounts; RIs and Savings Plans shared across accounts (can be turned off).'],
      ['Service Control Policies (SCPs)', 'Guardrails that set the MAXIMUM permissions for accounts/OUs. They never grant permissions. Do not affect the management account. Affect root user of member accounts. Common: deny leaving the org, restrict regions, deny disabling CloudTrail.'],
      ['Resource Control Policies (RCPs)', 'Org-level max permissions on resources (S3, KMS, SQS, STS, Secrets Manager), e.g. block access from outside the organization.'],
      ['Other policy types', 'Tag policies (standardize tags), backup policies, AI opt-out policies, declarative policies.'],
      ['aws:PrincipalOrgID', 'Condition key in resource policies to allow access from any account in the organization.'],
      ['Account creation', 'Create accounts programmatically; member accounts get OrganizationAccountAccessRole for admin access from management.']
    ]},
    { h: 'AWS Control Tower', i: [
      ['What', 'Automates setup of a secure multi-account landing zone based on best practices (built on Organizations).'],
      ['Controls (guardrails)', 'Preventive (SCPs), detective (Config rules), proactive (CloudFormation hooks). Mandatory, strongly recommended, elective.'],
      ['Account Factory', 'Provision new pre-configured, compliant accounts.'],
      ['Default accounts', 'Log archive and Audit accounts; centralized CloudTrail and Config.'],
      ['Dashboard', 'View compliance across accounts.']
    ]},
    { h: 'IAM Identity Center (successor to AWS SSO)', i: [
      ['What', 'Single sign-on for workforce users to multiple AWS accounts and business apps (SAML 2.0).'],
      ['Identity sources', 'Built-in directory, AWS Managed Microsoft AD / AD Connector, external IdP (Okta, Entra ID) with SCIM provisioning.'],
      ['Permission sets', 'Collections of policies assigned to users/groups per account; deployed as roles.']
    ]},
    { h: 'Directory and sharing services', i: [
      ['AWS Managed Microsoft AD', 'Real AD in AWS; trust relationships with on-prem AD; MFA; used by FSx Windows, RDS SQL Server, WorkSpaces.'],
      ['AD Connector', 'Proxy that redirects auth requests to on-prem AD; no data cached in AWS.'],
      ['Simple AD', 'Low-cost Samba-based AD-compatible directory; no trusts.'],
      ['AWS RAM (Resource Access Manager)', 'Share resources across accounts/OUs: VPC subnets, Transit Gateway, Route 53 Resolver rules, License Manager configs, Aurora clusters, etc.']
    ]}
  ],
  tips: [
    'Restrict what member accounts can do (even their root user) -> SCP. SCPs do NOT grant permissions and do NOT apply to the management account.',
    'Allow access to a bucket for all accounts in the org without listing them -> aws:PrincipalOrgID condition.',
    'Set up a governed multi-account environment quickly -> Control Tower.',
    'Single sign-on to all accounts with corporate identities -> IAM Identity Center.',
    'Share subnets or Transit Gateway across accounts -> AWS RAM.',
    'Users authenticate against on-prem AD without syncing -> AD Connector. Need trust and AD-aware AWS services -> AWS Managed Microsoft AD.'
  ],
  q: [
    { q: 'A company wants to prevent all member accounts from launching resources outside two approved regions, including actions by account administrators. What should be used?', o: ['IAM policies in each account', 'A Service Control Policy attached to the root or OUs', 'AWS Config rules', 'Permissions boundaries'], a: 1, e: 'SCPs set maximum permissions for all principals in member accounts, including administrators and root.', d: 1 },
    { q: 'An SCP allows only EC2 actions. An IAM user in a member account has an AdministratorAccess policy. What can the user do?', o: ['Everything, because AdministratorAccess overrides SCPs', 'Only EC2 actions', 'Nothing', 'Only IAM actions'], a: 1, e: 'Effective permissions are the intersection of SCP and IAM policies.', d: 1 },
    { q: 'An S3 bucket should be accessible to all accounts in the company\'s AWS Organization, including accounts created in the future. What is the simplest approach?', o: ['List every account ID in the bucket policy', 'Use a bucket policy with the aws:PrincipalOrgID condition', 'Make the bucket public', 'Use S3 ACLs'], a: 1, e: 'aws:PrincipalOrgID allows access to any principal in the organization automatically.', d: 1 },
    { q: 'A company needs to quickly set up a secure, well-architected multi-account environment with centralized logging and preventive and detective guardrails. Which service should be used?', o: ['AWS Control Tower', 'AWS Config', 'AWS Service Catalog', 'AWS Security Hub'], a: 0, e: 'Control Tower automates landing zone setup, including guardrails, log archive and audit accounts.', d: 1 },
    { q: 'Employees should sign in once with corporate credentials from Microsoft Entra ID and access multiple AWS accounts with role-specific permissions. What should be used?', o: ['IAM users in each account', 'IAM Identity Center with Entra ID as external identity provider', 'Amazon Cognito user pools', 'AD Connector only'], a: 1, e: 'IAM Identity Center provides workforce SSO across accounts with permission sets and supports external IdPs.', d: 1 },
    { q: 'A central networking account owns a VPC. Application teams in other accounts must launch EC2 instances into its subnets. What should be used?', o: ['VPC peering', 'AWS RAM to share subnets', 'Transit Gateway', 'PrivateLink'], a: 1, e: 'RAM supports VPC subnet sharing so participant accounts launch resources into shared subnets.', d: 2 }
  ]
});

svc({
  id: 'kms', name: 'AWS KMS & CloudHSM', cat: 'security', imp: 3,
  tag: 'Managed encryption keys: key types, key policies, envelope encryption, rotation, multi-region keys; CloudHSM for dedicated HSMs.',
  s: [
    { h: 'KMS key types', i: [
      ['AWS owned keys', 'Used by services internally (e.g. default DynamoDB encryption). Not visible, free.'],
      ['AWS managed keys', 'aws/s3, aws/ebs, aws/rds... created for you, rotated yearly automatically, cannot change policy.'],
      ['Customer managed keys (CMK)', 'You create and control: key policy, rotation, enable/disable, schedule deletion (7-30 days). Needed for cross-account sharing and fine control. $1/month + API calls.'],
      ['Symmetric vs asymmetric', 'Symmetric AES-256 (default; key never leaves KMS; used by AWS services). Asymmetric RSA/ECC for sign/verify or encryption by clients outside AWS with the public key.'],
      ['Imported key material / custom key store', 'Bring your own key material (you manage durability and can delete it); custom key store backed by CloudHSM or an external key manager (XKS).']
    ]},
    { h: 'How encryption works', i: [
      ['Direct encryption limit', 'KMS Encrypt API handles up to 4 KB of data.'],
      ['Envelope encryption', 'GenerateDataKey returns a plaintext + encrypted data key; encrypt data locally with the plaintext key, store the encrypted key with the data. Used by S3, EBS, etc.'],
      ['Regional', 'Keys are regional. Copying encrypted snapshots across regions re-encrypts with a key in the destination region.'],
      ['Multi-Region keys', 'Same key ID and material replicated across regions: encrypt in one region, decrypt in another (global DynamoDB, client-side encryption, DR). Not global; each replica managed independently.'],
      ['Quotas', 'Shared request rate quotas per region (thousands per second); throttling possible: use data key caching / S3 Bucket Keys.']
    ]},
    { h: 'Access control', i: [
      ['Key policy', 'Primary resource policy on every key. Default policy gives the account root full access so IAM policies can grant permissions.'],
      ['Grants', 'Temporary, programmatic delegation of key usage (used by services like EBS).'],
      ['Cross-account use', 'Key policy must allow the other account AND the other account\'s IAM policy must allow using the key.'],
      ['Auditing', 'Every API call logged in CloudTrail.'],
      ['Rotation', 'Automatic rotation for customer managed symmetric keys (default yearly, configurable 90-2,560 days, or on-demand); old key material kept to decrypt old data. Manual rotation = new key + alias update.']
    ]},
    { h: 'AWS CloudHSM', i: [
      ['What', 'Dedicated, single-tenant hardware security modules in your VPC, FIPS 140-3 Level 3 validated. You manage keys and users; AWS cannot access your keys.'],
      ['Use cases', 'Regulatory need for exclusive key control, SSL/TLS offload, Oracle TDE, custom key store for KMS, PKCS#11/JCE/CNG apps.'],
      ['HA', 'Cluster of HSMs across AZs. If you lose credentials, keys are unrecoverable.']
    ]}
  ],
  tips: [
    'Control, audit, disable or rotate keys yourself -> customer managed KMS key.',
    'Encrypt data larger than 4 KB -> envelope encryption with data keys.',
    'Share encrypted snapshot/AMI cross-account -> use a customer managed key and share it via key policy.',
    'Encrypt in one region, decrypt in another with same key -> multi-region keys.',
    'Single-tenant HSM, full customer control, FIPS Level 3 with exclusive access -> CloudHSM.',
    'KMS throttling with S3 -> S3 Bucket Keys.'
  ],
  q: [
    { q: 'A company must be able to audit every use of encryption keys and disable keys immediately if compromised. Which option meets this with the least effort?', o: ['SSE-S3', 'KMS customer managed keys', 'AWS owned keys', 'Client-side encryption with local keys'], a: 1, e: 'Customer managed keys can be disabled at any time and all usage is logged in CloudTrail.', d: 1 },
    { q: 'An encrypted EBS snapshot (using the AWS managed key aws/ebs) must be shared with another account. What must be done?', o: ['Share the snapshot directly', 'Copy the snapshot re-encrypting with a customer managed key, share the key via key policy, then share the snapshot', 'Decrypt the snapshot first', 'Use S3 Cross-Region Replication'], a: 1, e: 'AWS managed key policies cannot be changed to allow other accounts. Re-encrypt with a customer managed key and share both.', d: 1 },
    { q: 'An application must encrypt 2 GB files using KMS. What is the correct approach?', o: ['Call KMS Encrypt directly on the file', 'Use envelope encryption with GenerateDataKey and encrypt locally', 'Split the file into 4 KB chunks and call Encrypt', 'Use an asymmetric key'], a: 1, e: 'KMS Encrypt handles up to 4 KB; envelope encryption is used for larger data.', d: 1 },
    { q: 'Regulations require that encryption keys are stored in single-tenant hardware that the company exclusively controls, with AWS having no access. What should be used?', o: ['AWS KMS with AWS managed keys', 'AWS CloudHSM', 'AWS Secrets Manager', 'SSE-S3'], a: 1, e: 'CloudHSM provides dedicated HSMs where only the customer manages keys and users.', d: 1 },
    { q: 'A client application encrypts data in us-east-1 and the data must be decrypted in eu-west-1 during DR without re-encryption. What should be used?', o: ['Two separate KMS keys', 'A KMS multi-Region key', 'CloudHSM in each region', 'SSE-S3'], a: 1, e: 'Multi-Region keys share key material across regions so ciphertext can be decrypted in the replica region.', d: 2 }
  ]
});

svc({
  id: 'secrets', name: 'Secrets Manager, Parameter Store & ACM', cat: 'security', imp: 3,
  tag: 'Store and rotate secrets, manage configuration, and provision free TLS certificates.',
  s: [
    { h: 'AWS Secrets Manager', i: [
      ['What', 'Store, retrieve and automatically rotate secrets (DB credentials, API keys). Encrypted with KMS.'],
      ['Rotation', 'Built-in rotation for RDS, Aurora, Redshift, DocumentDB using managed Lambda functions; custom Lambda for others.'],
      ['Cross-region replication', 'Replicate secrets to other regions for DR / multi-region apps.'],
      ['Access', 'IAM + resource policies; cross-account sharing; VPC interface endpoint.'],
      ['Cost', 'Per secret per month + API calls.']
    ]},
    { h: 'SSM Parameter Store', i: [
      ['What', 'Hierarchical storage for configuration data and secrets (/app/prod/db-url). Part of Systems Manager.'],
      ['Tiers', 'Standard: free, 4 KB values, 10,000 parameters. Advanced: 8 KB, parameter policies (expiration, notifications), charged.'],
      ['SecureString', 'Encrypted with KMS.'],
      ['Rotation', 'No native rotation (use Secrets Manager or custom automation). Can reference Secrets Manager secrets.'],
      ['Integrations', 'CloudFormation dynamic references, ECS/EKS, Lambda, versioning, EventBridge notifications.']
    ]},
    { h: 'AWS Certificate Manager (ACM)', i: [
      ['What', 'Provision, manage and deploy public and private SSL/TLS certificates. Public certificates are free and auto-renew (DNS validation recommended).'],
      ['Integrations', 'ELB (ALB/NLB), CloudFront, API Gateway, App Runner, Elastic Beanstalk. Historically cannot be installed on EC2 directly (exportable paid certificates now exist).'],
      ['Region', 'Regional: request in the same region as the ALB/API. For CloudFront (and edge-optimized API Gateway) request in us-east-1.'],
      ['Imported certificates', 'Third-party certs can be imported but do not auto-renew; ACM / Config can alert before expiry.'],
      ['AWS Private CA', 'Managed private certificate authority for internal TLS / mTLS.']
    ]}
  ],
  tips: [
    'Automatic rotation of DB credentials -> Secrets Manager.',
    'Free, simple config or secret storage without rotation -> Parameter Store (SecureString).',
    'Free TLS certs with auto-renewal for ALB/CloudFront -> ACM. CloudFront needs the cert in us-east-1.',
    'Imported certificates expiring -> they do not auto-renew; set up alerts (Config rule / EventBridge).'
  ],
  q: [
    { q: 'A company needs to store database credentials and rotate them automatically every 30 days with the least operational overhead. What should be used?', o: ['SSM Parameter Store SecureString', 'AWS Secrets Manager', 'KMS', 'Encrypted S3 object'], a: 1, e: 'Secrets Manager provides managed rotation for RDS and other databases.', d: 1 },
    { q: 'A team needs to store non-sensitive application configuration values and a few encrypted API keys at no additional cost. Rotation is not required. What should be used?', o: ['AWS Secrets Manager', 'SSM Parameter Store standard parameters with SecureString', 'DynamoDB', 'AWS AppConfig only'], a: 1, e: 'Parameter Store standard tier is free and supports KMS-encrypted SecureString parameters.', d: 4 },
    { q: 'A company wants to enable HTTPS on a CloudFront distribution using a free certificate that renews automatically. Where must the certificate be requested?', o: ['In the same region as the origin', 'In ACM in us-east-1', 'In any region', 'In IAM certificate store only'], a: 1, e: 'CloudFront uses ACM certificates from the us-east-1 region.', d: 1 },
    { q: 'A multi-region application needs the same database secret available in two regions for disaster recovery. What should be used?', o: ['Secrets Manager with secret replication to the second region', 'Parameter Store with cross-region replication', 'S3 Cross-Region Replication of a text file', 'KMS multi-Region keys only'], a: 0, e: 'Secrets Manager can replicate secrets to multiple regions and keep them in sync.', d: 2 }
  ]
});

svc({
  id: 'cognito', name: 'Amazon Cognito', cat: 'security', imp: 2,
  tag: 'Customer identity for web and mobile apps: user pools for sign-in, identity pools for temporary AWS credentials.',
  s: [
    { h: 'User pools (authentication)', i: [
      ['What', 'Serverless user directory: sign-up, sign-in, MFA, password reset, email/phone verification, hosted UI / managed login.'],
      ['Federation', 'Social (Google, Facebook, Apple, Amazon) and enterprise (SAML, OIDC) identity providers.'],
      ['Tokens', 'Issues JWTs (ID, access, refresh tokens).'],
      ['Integrations', 'API Gateway Cognito authorizer and ALB authentication validate tokens directly.'],
      ['Advanced security', 'Adaptive authentication, compromised credential detection, Lambda triggers for custom flows.']
    ]},
    { h: 'Identity pools (authorization to AWS)', i: [
      ['What', 'Exchange a token (from user pool, social, SAML, or guest/unauthenticated) for temporary AWS credentials via STS.'],
      ['Roles', 'Map authenticated/unauthenticated users to IAM roles; use policy variables (${cognito-identity.amazonaws.com:sub}) for per-user access, e.g. own S3 prefix or DynamoDB rows.'],
      ['Use case', 'Mobile app directly accesses S3/DynamoDB securely without a backend.']
    ]}
  ],
  tips: [
    'Sign-up / sign-in for millions of app users -> Cognito user pool.',
    'App users need temporary AWS credentials to access S3/DynamoDB directly -> Cognito identity pool.',
    'Authenticate users at the ALB or API Gateway -> Cognito user pool integration.',
    'Workforce SSO to AWS accounts is IAM Identity Center, not Cognito.'
  ],
  q: [
    { q: 'A mobile app needs user sign-up and sign-in with social logins (Google, Facebook) and MFA, with minimal development effort. Which service should be used?', o: ['IAM users', 'Amazon Cognito user pools', 'IAM Identity Center', 'AWS STS GetFederationToken'], a: 1, e: 'Cognito user pools provide managed sign-up/sign-in, social federation and MFA.', d: 1 },
    { q: 'Authenticated mobile users must upload files directly to their own prefix in an S3 bucket using temporary credentials. What should be used?', o: ['Cognito identity pool with an IAM role using a policy variable for the user identity', 'A shared IAM user embedded in the app', 'S3 public write', 'API keys from API Gateway'], a: 0, e: 'Identity pools exchange tokens for temporary credentials; policy variables restrict each user to their own prefix.', d: 1 },
    { q: 'A REST API in API Gateway must only accept requests from users who have signed in to the company\'s app. What is the simplest solution?', o: ['Lambda authorizer that queries a database', 'Cognito user pool authorizer', 'Resource policy with IP allow list', 'Usage plans with API keys'], a: 1, e: 'A Cognito user pool authorizer validates JWTs issued at sign-in without custom code.', d: 1 }
  ]
});

svc({
  id: 'edge-security', name: 'WAF, Shield, Firewall Manager & Network Firewall', cat: 'security', imp: 3,
  tag: 'Protect applications from web exploits and DDoS, and manage firewall rules centrally across accounts.',
  s: [
    { h: 'AWS WAF', i: [
      ['What', 'Layer 7 web application firewall. Web ACLs with rules attached to CloudFront, ALB, API Gateway (REST), AppSync, Cognito user pools, App Runner, Verified Access. NOT NLB or EC2 directly.'],
      ['Rules', 'IP sets (allow/block), geo match, SQL injection, XSS, size constraints, string/regex match on headers/body/URI, rate-based rules (throttle IPs exceeding N requests per 5 min).'],
      ['Managed rule groups', 'AWS Managed Rules (Core rule set, known bad inputs, IP reputation, Bot Control, Account Takeover Prevention) and Marketplace rules.'],
      ['Logging', 'Logs to CloudWatch Logs, S3 or Firehose.'],
      ['Static IP needed with WAF', 'Use Global Accelerator + ALB with WAF, since NLB does not support WAF.']
    ]},
    { h: 'AWS Shield', i: [
      ['Shield Standard', 'Free, automatic protection against common layer 3/4 DDoS attacks (SYN/UDP floods, reflection) for all customers.'],
      ['Shield Advanced', '~$3,000/month per organization: enhanced detection and mitigation for EC2, ELB, CloudFront, Global Accelerator, Route 53; 24/7 Shield Response Team (SRT); cost protection against scaling charges during attacks; automatic application-layer mitigation with WAF; health-based detection.'],
      ['DDoS resilient architecture', 'CloudFront + Route 53 at the edge, WAF rate limiting, ELB + Auto Scaling to absorb, keep origins private.']
    ]},
    { h: 'AWS Firewall Manager', i: [
      ['What', 'Centrally configure and enforce WAF rules, Shield Advanced protections, security groups, Network Firewall, Route 53 Resolver DNS Firewall policies across all accounts in an Organization.'],
      ['Auto-apply', 'New accounts and resources automatically get the policies. Requires Organizations and AWS Config.']
    ]},
    { h: 'AWS Network Firewall', i: [
      ['What', 'Managed stateful network firewall and IPS for VPC traffic (layer 3-7): stateless/stateful rules, domain filtering (allow only *.example.com egress), Suricata-compatible IPS rules.'],
      ['Deployment', 'Firewall endpoints in dedicated subnets; route tables steer traffic through them. Centralized inspection VPC with Transit Gateway.']
    ]}
  ],
  tips: [
    'SQL injection / XSS / block IPs or countries at layer 7 -> AWS WAF.',
    'Throttle abusive IPs (HTTP floods) -> WAF rate-based rule.',
    'Advanced DDoS protection, 24/7 response team, cost protection -> Shield Advanced.',
    'Enforce WAF / SG rules across all accounts automatically -> Firewall Manager.',
    'Filter VPC egress traffic by domain name or IPS for VPC -> Network Firewall.',
    'WAF cannot attach to NLB.'
  ],
  q: [
    { q: 'A web application behind an ALB is receiving SQL injection attempts. Which service should be used to block them?', o: ['AWS Shield Standard', 'AWS WAF with managed rule groups', 'Security groups', 'Network ACLs'], a: 1, e: 'WAF inspects HTTP requests and provides SQL injection protection rules.', d: 1 },
    { q: 'A company wants protection from large DDoS attacks, 24/7 access to AWS DDoS experts, and reimbursement for scaling costs incurred during attacks. What should it use?', o: ['AWS Shield Standard', 'AWS Shield Advanced', 'AWS WAF', 'Amazon GuardDuty'], a: 1, e: 'Shield Advanced includes the Shield Response Team and DDoS cost protection.', d: 1 },
    { q: 'A company with 100 accounts needs to ensure all ALBs and CloudFront distributions have a standard set of WAF rules, including resources created in the future. What should be used?', o: ['AWS Config', 'AWS Firewall Manager', 'CloudFormation StackSets only', 'AWS Security Hub'], a: 1, e: 'Firewall Manager centrally deploys and enforces WAF policies across accounts and new resources.', d: 1 },
    { q: 'An API is being hit by a few IP addresses sending thousands of requests per minute. How can these clients be throttled automatically?', o: ['NACL deny rules updated manually', 'WAF rate-based rule', 'Shield Standard', 'Security group rules'], a: 1, e: 'Rate-based rules block IPs exceeding a request threshold over a 5-minute window.', d: 1 },
    { q: 'A company must allow EC2 instances to reach only a list of approved external domains (e.g. *.amazonaws.com and a partner domain) and block all other egress traffic. Which service should be used?', o: ['AWS WAF', 'Security groups', 'AWS Network Firewall with domain list rules', 'Shield Advanced'], a: 2, e: 'Network Firewall supports stateful domain allow/deny lists for outbound traffic. Security groups only filter by IP/port.', d: 1 }
  ]
});

svc({
  id: 'threat-detection', name: 'GuardDuty, Inspector, Macie, Security Hub, Detective', cat: 'security', imp: 2,
  tag: 'Managed threat detection, vulnerability scanning, sensitive data discovery, findings aggregation and investigation.',
  s: [
    { h: 'Services', i: [
      ['Amazon GuardDuty', 'Intelligent threat detection using ML and threat intel on CloudTrail management/data events, VPC Flow Logs, DNS logs, plus optional EKS, S3, RDS login, Lambda, EBS malware scanning, runtime monitoring. No agents to start. Detects crypto-mining, compromised credentials, port scanning. Findings -> EventBridge for automated response.'],
      ['Amazon Inspector', 'Automated vulnerability management: scans EC2 (via SSM agent or agentless), ECR container images, and Lambda functions for software CVEs and network reachability. Continuous rescans with risk score.'],
      ['Amazon Macie', 'Uses ML and pattern matching to discover and protect sensitive data (PII, financial data, credentials) in S3. Findings to EventBridge / Security Hub.'],
      ['AWS Security Hub', 'Central view of security posture across accounts: aggregates findings from GuardDuty, Inspector, Macie, Config, Firewall Manager, partners; automated checks against CIS, AWS Foundational Security Best Practices, PCI DSS. Requires AWS Config.'],
      ['Amazon Detective', 'Investigate root cause of findings using graph analysis of CloudTrail, VPC Flow Logs, GuardDuty data.'],
      ['AWS Audit Manager', 'Continuously collect evidence for audits (GDPR, HIPAA, PCI).'],
      ['AWS Artifact', 'Portal to download AWS compliance reports (SOC, ISO, PCI) and accept agreements (BAA).']
    ]}
  ],
  tips: [
    'Detect malicious activity / compromised instances / crypto-mining from logs -> GuardDuty.',
    'Scan EC2, containers, Lambda for vulnerabilities (CVEs) -> Inspector.',
    'Find PII in S3 -> Macie.',
    'Single pane of glass for security findings and compliance checks -> Security Hub.',
    'Investigate root cause of a finding -> Detective.',
    'Download SOC/PCI reports for auditors -> Artifact.'
  ],
  q: [
    { q: 'A company wants to detect if EC2 instances are communicating with known malicious IP addresses or being used for crypto mining, using existing logs and no agents. Which service should be used?', o: ['Amazon Inspector', 'Amazon GuardDuty', 'Amazon Macie', 'AWS Config'], a: 1, e: 'GuardDuty analyzes VPC Flow Logs, DNS logs and CloudTrail to detect threats.', d: 1 },
    { q: 'A company needs to identify S3 buckets containing personally identifiable information. Which service should be used?', o: ['Amazon Macie', 'Amazon GuardDuty', 'AWS Security Hub', 'Amazon Detective'], a: 0, e: 'Macie discovers and classifies sensitive data in S3.', d: 1 },
    { q: 'A security team wants continuous vulnerability scanning of EC2 instances and container images in ECR. Which service should be used?', o: ['Amazon Inspector', 'AWS Shield', 'Amazon GuardDuty', 'AWS Trusted Advisor'], a: 0, e: 'Inspector scans EC2, ECR images and Lambda for software vulnerabilities.', d: 1 },
    { q: 'A company wants a centralized dashboard aggregating security findings from GuardDuty, Inspector and Macie across all accounts, with automated best-practice checks. What should be used?', o: ['Amazon Detective', 'AWS Security Hub', 'Amazon CloudWatch', 'AWS Audit Manager'], a: 1, e: 'Security Hub aggregates findings and runs automated security standard checks.', d: 1 },
    { q: 'A GuardDuty finding indicates compromised EC2 credentials. The company wants to automatically isolate the instance. What is the BEST design?', o: ['Manually review findings daily', 'EventBridge rule on GuardDuty findings that triggers a Lambda function to change the instance security group', 'Enable Inspector', 'Configure CloudTrail Insights'], a: 1, e: 'GuardDuty publishes findings to EventBridge, enabling automated remediation with Lambda or SSM Automation.', d: 1 }
  ]
});
