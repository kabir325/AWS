# Amazon Cognito

> Customer identity for web and mobile apps: user pools for sign-in, identity pools for temporary AWS credentials.

Category: **Security, Identity & Compliance** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [User pools (authentication)](#user-pools-authentication)
- [Identity pools (authorization to AWS)](#identity-pools-authorization-to-aws)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## User pools (authentication)

- **What** - Serverless user directory: sign-up, sign-in, MFA, password reset, email/phone verification, hosted UI / managed login.
- **Federation** - Social (Google, Facebook, Apple, Amazon) and enterprise (SAML, OIDC) identity providers.
- **Tokens** - Issues JWTs (ID, access, refresh tokens).
- **Integrations** - API Gateway Cognito authorizer and ALB authentication validate tokens directly.
- **Advanced security** - Adaptive authentication, compromised credential detection, Lambda triggers for custom flows.

## Identity pools (authorization to AWS)

- **What** - Exchange a token (from user pool, social, SAML, or guest/unauthenticated) for temporary AWS credentials via STS.
- **Roles** - Map authenticated/unauthenticated users to IAM roles; use policy variables (${cognito-identity.amazonaws.com:sub}) for per-user access, e.g. own S3 prefix or DynamoDB rows.
- **Use case** - Mobile app directly accesses S3/DynamoDB securely without a backend.

## Exam tips

- Sign-up / sign-in for millions of app users -> Cognito user pool.
- App users need temporary AWS credentials to access S3/DynamoDB directly -> Cognito identity pool.
- Authenticate users at the ALB or API Gateway -> Cognito user pool integration.
- Workforce SSO to AWS accounts is IAM Identity Center, not Cognito.

## Practice questions

**Q1.** A mobile app needs user sign-up and sign-in with social logins (Google, Facebook) and MFA, with minimal development effort. Which service should be used?

- A. IAM users
- B. Amazon Cognito user pools
- C. IAM Identity Center
- D. AWS STS GetFederationToken

<details><summary>Answer</summary>

**B** - Cognito user pools provide managed sign-up/sign-in, social federation and MFA.

_Domain: Design Secure Architectures_

</details>

**Q2.** Authenticated mobile users must upload files directly to their own prefix in an S3 bucket using temporary credentials. What should be used?

- A. Cognito identity pool with an IAM role using a policy variable for the user identity
- B. A shared IAM user embedded in the app
- C. S3 public write
- D. API keys from API Gateway

<details><summary>Answer</summary>

**A** - Identity pools exchange tokens for temporary credentials; policy variables restrict each user to their own prefix.

_Domain: Design Secure Architectures_

</details>

**Q3.** A REST API in API Gateway must only accept requests from users who have signed in to the company's app. What is the simplest solution?

- A. Lambda authorizer that queries a database
- B. Cognito user pool authorizer
- C. Resource policy with IP allow list
- D. Usage plans with API keys

<details><summary>Answer</summary>

**B** - A Cognito user pool authorizer validates JWTs issued at sign-in without custom code.

_Domain: Design Secure Architectures_

</details>
