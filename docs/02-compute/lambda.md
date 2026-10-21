# AWS Lambda

> Serverless functions triggered by events: limits, concurrency, invocation models, VPC access and cost.

Category: **Compute** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Invocation models](#invocation-models)
- [Concurrency and performance](#concurrency-and-performance)
- [Networking and security](#networking-and-security)
- [Edge and integrations](#edge-and-integrations)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **Model** - Upload code (zip or container image up to 10 GB); AWS runs it on demand. Pay per request and per GB-second of duration (1 ms granularity).
- **Limits to remember** - Max timeout 15 minutes. Memory 128 MB - 10,240 MB (CPU scales with memory). /tmp ephemeral storage 512 MB - 10 GB. Deployment zip 50 MB zipped / 250 MB unzipped. Env vars 4 KB. Sync payload 6 MB, async 256 KB (raised to 1 MB in 2025).
- **Runtimes** - Node.js, Python, Java, .NET, Ruby, Go via custom runtime, any language via custom runtime or container image.
- **Layers** - Share libraries and dependencies across functions (up to 5 layers).
- **Architectures** - x86_64 or arm64 (Graviton2): up to 34% better price-performance.

## Invocation models

- **Synchronous** - Caller waits: API Gateway, ALB, Function URLs, SDK invoke, Cognito. Errors returned to caller; caller retries.
- **Asynchronous** - Event queued internally: S3, SNS, EventBridge, CloudWatch Logs. Retries 2 times; send failures to a DLQ (SQS/SNS) or on-failure destination.
- **Event source mapping (poll-based)** - Lambda polls SQS, Kinesis, DynamoDB Streams, MSK, MQ. Batches records; for streams, failed batches block the shard until success/expiry (use bisect batch, max retry, on-failure destination).
- **Destinations** - Route success/failure results of async invocations to SQS, SNS, Lambda, EventBridge. Preferred over DLQ for richer info.
- **Function URLs** - Dedicated HTTPS endpoint for a function without API Gateway (auth: IAM or none).

## Concurrency and performance

- **Account concurrency** - Default 1,000 concurrent executions per region (soft limit). Throttled requests get 429 errors (sync) or retries (async).
- **Reserved concurrency** - Guarantees and caps concurrency for one function; protects downstream DBs and other functions. Setting 0 disables the function.
- **Provisioned concurrency** - Pre-initialized execution environments: eliminates cold starts for latency-sensitive apps (extra cost). Can be scheduled with Application Auto Scaling.
- **Cold starts** - First invocation initializes the environment. Reduce with provisioned concurrency, SnapStart (Java, Python, .NET), smaller packages, init code outside handler.
- **Execution context reuse** - Initialize SDK clients and DB connections outside the handler to reuse them across invocations.

## Networking and security

- **Execution role** - IAM role the function assumes to call AWS services.
- **Resource-based policy** - Allows other services/accounts to invoke the function (e.g. S3, SNS, another account).
- **VPC access** - Attach to private subnets to reach RDS/ElastiCache. Lambda uses Hyperplane ENIs. For internet access from a VPC-attached function, route through a NAT gateway (a public subnet alone does not work). Use VPC endpoints for AWS services.
- **RDS Proxy** - Pool and share DB connections so many concurrent Lambda functions do not exhaust database connections. Supports IAM auth and Secrets Manager.
- **Secrets** - Store in Secrets Manager / Parameter Store; encrypt environment variables with KMS.

## Edge and integrations

- **Lambda@Edge** - Run Node.js/Python at CloudFront regional edge caches on viewer/origin request/response. Up to 5 s (viewer) / 30 s (origin), more memory, network access.
- **CloudFront Functions** - Lightweight JavaScript at edge locations, sub-millisecond, viewer request/response only: header manipulation, redirects, URL rewrites, simple auth. Much cheaper.
- **Common patterns** - S3 upload -> Lambda thumbnail; API Gateway + Lambda + DynamoDB serverless API; EventBridge schedule -> Lambda cron; SQS -> Lambda worker; Kinesis -> Lambda stream processing.
- **Step Functions** - Orchestrate multiple Lambda functions with retries, branching and waits; works around 15-minute limit for long workflows.

## Exam tips

- Job runs longer than 15 minutes -> not Lambda (use ECS/Fargate, Batch, or Step Functions to split work).
- Cold start latency complaints -> provisioned concurrency (or SnapStart for Java).
- Lambda overwhelming RDS with connections -> RDS Proxy.
- One function consuming all concurrency and throttling others -> reserved concurrency.
- VPC Lambda needs internet -> NAT gateway in a public subnet + route from private subnets.
- Simple header rewrite at edge, millions of requests, cheapest -> CloudFront Functions; heavier logic / network calls -> Lambda@Edge.

## Practice questions

**Q1.** A data processing job takes approximately 40 minutes to complete. Which compute option is NOT suitable to run it as a single execution?

- A. AWS Fargate task
- B. AWS Batch job
- C. AWS Lambda function
- D. EC2 instance

<details><summary>Answer</summary>

**C** - Lambda has a hard maximum timeout of 15 minutes.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A serverless API built with API Gateway and Lambda has unacceptable latency on the first requests after idle periods. What is the MOST effective fix?

- A. Increase the function timeout
- B. Configure provisioned concurrency
- C. Configure reserved concurrency
- D. Move the function into a VPC

<details><summary>Answer</summary>

**B** - Provisioned concurrency keeps execution environments initialized, eliminating cold starts.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** Hundreds of concurrent Lambda invocations are exhausting the connection limit of an Amazon RDS for MySQL database. What should a solutions architect recommend?

- A. Increase Lambda memory
- B. Use Amazon RDS Proxy
- C. Enable Multi-AZ
- D. Add a read replica

<details><summary>Answer</summary>

**B** - RDS Proxy pools and reuses database connections, protecting the DB from connection storms by serverless clients.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A Lambda function attached to private subnets in a VPC must call a third-party API on the internet. What is required?

- A. Assign a public IP to the function
- B. Move the function to a public subnet
- C. Route private subnet traffic through a NAT gateway in a public subnet
- D. Create an interface VPC endpoint for the API

<details><summary>Answer</summary>

**C** - VPC-attached Lambda functions never receive public IPs; outbound internet requires a NAT gateway (or NAT instance).

_Domain: Design Secure Architectures_

</details>

**Q5.** A critical Lambda function must always be able to scale to 100 concurrent executions even when other functions in the account are busy. What should be configured?

- A. Provisioned concurrency of 100 on all functions
- B. Reserved concurrency of 100 on the critical function
- C. Increase timeout
- D. Use an SQS DLQ

<details><summary>Answer</summary>

**B** - Reserved concurrency carves out capacity from the account pool for that function (and also caps it).

_Domain: Design Resilient Architectures_

</details>

**Q6.** A company needs to add security headers to every response served by CloudFront at the lowest cost and latency. Which option is BEST?

- A. Lambda@Edge on origin response
- B. CloudFront Functions on viewer response
- C. An ALB with fixed responses
- D. API Gateway mapping templates

<details><summary>Answer</summary>

**B** - CloudFront Functions are designed for lightweight, high-volume viewer request/response manipulation like headers, at a fraction of Lambda@Edge cost.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q7.** Asynchronous Lambda invocations from S3 events occasionally fail after retries. The team wants failed events captured with details for later reprocessing. What should be configured?

- A. An on-failure destination (SQS or EventBridge)
- B. Provisioned concurrency
- C. A larger /tmp
- D. Synchronous invocation from S3

<details><summary>Answer</summary>

**A** - Async invocations retry twice; on-failure destinations (or a DLQ) capture failed events for reprocessing.

_Domain: Design Resilient Architectures_

</details>
