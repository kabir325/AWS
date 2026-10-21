# Amazon CloudFront

> Global CDN: origins, caching, OAC for S3, signed URLs/cookies, edge functions, geo restriction and security.

Category: **Networking & Content Delivery** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Basics](#basics)
- [Caching](#caching)
- [Securing content](#securing-content)
- [Edge compute and pricing](#edge-compute-and-pricing)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Basics

- **What** - Content delivery network using hundreds of edge locations and regional edge caches. Caches static and dynamic content, accelerates uploads, terminates TLS at the edge.
- **Origins** - S3 bucket, S3 website endpoint, MediaStore, ALB, EC2, API Gateway, Lambda function URL, any HTTP server (custom origin, including on-prem).
- **Origin groups** - Primary + secondary origin for automatic failover on specific HTTP error codes.
- **Behaviors** - Path patterns (/images/*, /api/*) mapped to different origins and cache settings.
- **Security benefits** - Shield Standard automatically, integrates with WAF, HTTPS, hides origin.

## Caching

- **TTL** - Default 24 h; controlled by Cache-Control headers and cache policies (min/default/max TTL).
- **Cache key** - URL + selected headers, cookies, query strings (cache policy). Fewer elements = higher cache hit ratio.
- **Origin request policy** - Forward values to the origin without adding them to the cache key.
- **Invalidations** - Remove objects from edge caches before TTL expires (/images/*). Versioned file names are a cheaper alternative.
- **Origin Shield** - Extra caching layer in front of the origin to reduce origin load.

## Securing content

- **Origin Access Control (OAC)** - Restrict S3 bucket so it is only readable through CloudFront (bucket policy allows the CloudFront service principal with distribution ARN). Supports SSE-KMS. Replaces legacy OAI.
- **Custom origin protection** - Have CloudFront add a secret custom header verified by the ALB, or allow only the CloudFront managed prefix list in the ALB security group.
- **Signed URLs** - Access to individual files (one URL per file). Use with trusted key groups.
- **Signed cookies** - Access to multiple restricted files (e.g. all premium videos) without changing URLs.
- **Geo restriction** - Allow or block countries (allowlist / blocklist) for licensing/compliance.
- **Field-level encryption** - Encrypt specific POST fields (e.g. credit card) at the edge with a public key; only the backend app with the private key can decrypt.
- **HTTPS** - Viewer protocol policy (redirect HTTP to HTTPS). ACM certificate must be in us-east-1.

## Edge compute and pricing

- **CloudFront Functions** - JavaScript, sub-ms, viewer request/response: header manipulation, URL rewrites, redirects, token validation.
- **Lambda@Edge** - Node.js/Python, origin and viewer events, longer runtime, network calls, body access.
- **Price classes** - All edge locations, or Price Class 200 / 100 (exclude most expensive regions) to reduce cost.
- **Real-time logs** - Stream request logs to Kinesis Data Streams.

## Exam tips

- Global users, reduce latency for static content and reduce origin load -> CloudFront.
- S3 accessible only via CloudFront -> Origin Access Control + bucket policy.
- Restrict one file -> signed URL. Restrict many files / whole area -> signed cookies.
- Block countries -> CloudFront geo restriction (or WAF geo match).
- Protect sensitive form fields end to end -> field-level encryption.
- Origin failover -> origin groups. Region-level failover for whole app -> Route 53.
- CloudFront caches; Global Accelerator does not cache and works for TCP/UDP.

## Practice questions

**Q1.** A company serves static content from an S3 bucket through CloudFront. Users must not be able to access the S3 bucket directly. What should be done?

- A. Make the bucket public and use signed URLs
- B. Configure Origin Access Control and a bucket policy that only allows the CloudFront distribution
- C. Enable S3 Transfer Acceleration
- D. Use an S3 website endpoint

<details><summary>Answer</summary>

**B** - OAC lets CloudFront sign requests to S3 and the bucket policy denies all other access.

_Domain: Design Secure Architectures_

</details>

**Q2.** A video platform needs to let paying subscribers access hundreds of premium video files without generating a URL for each file. What should be used?

- A. CloudFront signed URLs
- B. CloudFront signed cookies
- C. S3 pre-signed URLs
- D. Geo restriction

<details><summary>Answer</summary>

**B** - Signed cookies grant access to multiple restricted files with a single credential.

_Domain: Design Secure Architectures_

</details>

**Q3.** A company must prevent users in certain countries from accessing its content due to licensing. Which CloudFront feature should be used?

- A. Field-level encryption
- B. Geo restriction
- C. Origin groups
- D. Lambda@Edge only

<details><summary>Answer</summary>

**B** - CloudFront geo restriction blocks or allows access by country.

_Domain: Design Secure Architectures_

</details>

**Q4.** A checkout form submits credit card numbers that must be encrypted so that only a specific backend service can decrypt them, even if intermediate systems log requests. What should be used?

- A. HTTPS only
- B. CloudFront field-level encryption
- C. SSE-KMS on S3
- D. WAF

<details><summary>Answer</summary>

**B** - Field-level encryption encrypts specific fields at the edge using a public key; only the holder of the private key can decrypt.

_Domain: Design Secure Architectures_

</details>

**Q5.** A CloudFront distribution must automatically switch to a secondary origin in another region if the primary origin returns 5xx errors. What should be configured?

- A. Origin group with failover criteria
- B. Route 53 weighted routing
- C. Multiple behaviors
- D. Cache invalidation

<details><summary>Answer</summary>

**A** - Origin groups provide origin-level failover based on response codes.

_Domain: Design Resilient Architectures_

</details>

**Q6.** An ALB is used as a CloudFront origin. The company wants to ensure users cannot bypass CloudFront by calling the ALB directly. Which approaches work? (Choose TWO)

- A. Allow only the CloudFront managed prefix list in the ALB security group
- B. Configure CloudFront to add a secret custom header and have the ALB rule check it
- C. Use Origin Access Control for the ALB
- D. Enable S3 Block Public Access
- E. Use geo restriction

<details><summary>Answer</summary>

**A, B** - Restricting the SG to CloudFront IP ranges and validating a secret header are standard ways to protect custom origins. OAC is for S3 (and some other AWS origins), not ALB.

_Domain: Design Secure Architectures_

</details>
