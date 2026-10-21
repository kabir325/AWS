# Amazon API Gateway

> Create, secure and scale REST, HTTP and WebSocket APIs: endpoint types, auth, throttling, caching, stages.

Category: **Application Integration** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [API types](#api-types)
- [Endpoint types](#endpoint-types)
- [Security](#security)
- [Performance and operations](#performance-and-operations)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## API types

- **REST API** - Full features: API keys, usage plans, request validation, caching, WAF, resource policies, private endpoints, mapping templates.
- **HTTP API** - Cheaper (up to ~70%), lower latency, simpler: JWT/OIDC authorizers, Lambda and HTTP proxies. Fewer features (no caching, usage plans, WAF).
- **WebSocket API** - Persistent two-way connections: chat apps, real-time dashboards, games; routes on message content; connection IDs to push back to clients.

## Endpoint types

- **Edge-optimized (default for REST)** - Requests routed through CloudFront edge locations; API lives in one region. For global clients.
- **Regional** - For clients in the same region; can put your own CloudFront in front for more control.
- **Private** - Accessible only from your VPC through an interface VPC endpoint, controlled with a resource policy.

## Security

- **IAM authorization** - SigV4-signed requests; for AWS users/roles, cross-account with resource policies.
- **Cognito user pool authorizer** - Validate JWTs from Cognito; no custom code.
- **Lambda authorizer** - Custom logic: validate third-party tokens (OAuth, SAML) or request parameters; returns an IAM policy; cacheable.
- **Resource policies** - Allow/deny by source IP, VPC endpoint, AWS account.
- **WAF and TLS** - WAF on REST APIs; mTLS; custom domain names with ACM certificates.
- **API keys & usage plans** - Identify clients and meter/throttle per customer (for monetized APIs). API keys are not an auth mechanism by themselves.

## Performance and operations

- **Throttling** - Account default 10,000 requests/s with 5,000 burst per region (soft); stage, method and usage plan limits. Exceeding returns 429.
- **Caching** - REST API stage cache (default TTL 300 s, max 3,600 s) to reduce backend calls; per-method overrides; clients can invalidate with header if allowed.
- **Timeout** - Integration timeout default 29 s (can be increased for Regional/private REST APIs). Long work -> async pattern.
- **Payload limit** - 10 MB request payload. Upload large files with S3 pre-signed URLs instead.
- **Integrations** - Lambda proxy, HTTP proxy, AWS service integrations (e.g. put directly to SQS/Kinesis/DynamoDB/Step Functions without Lambda), Mock, VPC Link to private NLB/ALB.
- **Stages and canary** - dev/test/prod stages with stage variables; canary release sends a % of traffic to a new deployment.
- **Monitoring** - CloudWatch metrics (Latency, IntegrationLatency, 4XX, 5XX, Count), access logs, X-Ray tracing.

## Exam tips

- Serverless REST API -> API Gateway + Lambda (+ DynamoDB).
- Lowest cost simple API with JWT auth -> HTTP API. Need caching, usage plans, API keys, WAF -> REST API.
- Real-time two-way communication -> WebSocket API.
- API reachable only from inside VPC -> private API + interface endpoint + resource policy.
- Throttle per customer / monetize -> usage plans + API keys.
- Reduce backend load for repeated GETs -> API Gateway caching.
- Expose private services in a VPC through API Gateway -> VPC Link (NLB/ALB).
- Buffer API writes without Lambda -> API Gateway direct integration with SQS.

## Practice questions

**Q1.** A company wants to build a REST API that is accessible only from within its VPC. What should be used?

- A. Edge-optimized API
- B. Regional API with WAF
- C. Private API with an interface VPC endpoint and resource policy
- D. HTTP API with JWT authorizer

<details><summary>Answer</summary>

**C** - Private APIs are reachable only through interface VPC endpoints and secured by resource policies.

_Domain: Design Secure Architectures_

</details>

**Q2.** A company offers a public API to paying customers and must enforce different request quotas per customer. What should be used?

- A. Lambda reserved concurrency
- B. API Gateway usage plans with API keys
- C. WAF rate-based rules
- D. CloudFront signed URLs

<details><summary>Answer</summary>

**B** - Usage plans associate API keys with throttling limits and quotas per client.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A chat application needs persistent bidirectional communication between clients and a serverless backend. Which option fits?

- A. API Gateway REST API
- B. API Gateway WebSocket API
- C. Amazon SQS
- D. Application Load Balancer with Lambda

<details><summary>Answer</summary>

**B** - WebSocket APIs maintain persistent connections and allow the backend to push messages to clients.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A read-heavy API returns the same product catalog data frequently, causing high Lambda and DynamoDB costs. What is the simplest optimization?

- A. Enable API Gateway caching on the stage
- B. Increase Lambda memory
- C. Use DynamoDB on-demand
- D. Use an HTTP API

<details><summary>Answer</summary>

**A** - Stage caching serves repeated responses without invoking the backend.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q5.** An API must validate OAuth tokens issued by a third-party identity provider using custom logic before allowing requests. Which authorizer should be used?

- A. IAM authorization
- B. Cognito user pool authorizer
- C. Lambda authorizer
- D. API key

<details><summary>Answer</summary>

**C** - Lambda authorizers run custom code to validate tokens from any provider.

_Domain: Design Secure Architectures_

</details>

**Q6.** Mobile clients must upload 500 MB videos through an API. API Gateway rejects the requests. What is the BEST solution?

- A. Increase the API Gateway payload limit
- B. Have the API return an S3 pre-signed URL and upload directly to S3
- C. Use a WebSocket API
- D. Use Lambda with more memory

<details><summary>Answer</summary>

**B** - API Gateway has a 10 MB payload limit. Pre-signed URLs let clients upload directly to S3.

_Domain: Design High-Performing Architectures_

</details>
