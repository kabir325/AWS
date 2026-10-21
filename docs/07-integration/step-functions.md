# AWS Step Functions & Amazon MQ

> Serverless workflow orchestration with state machines; Amazon MQ for lift-and-shift of existing message brokers.

Category: **Application Integration** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [AWS Step Functions](#aws-step-functions)
- [Amazon MQ](#amazon-mq)
- [Related: Amazon SWF and AppFlow](#related-amazon-swf-and-appflow)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## AWS Step Functions

- **What** - Visual state machines (Amazon States Language JSON) orchestrating Lambda, ECS, Batch, Glue, SNS, SQS, DynamoDB and 200+ services via SDK integrations.
- **States** - Task, Choice, Parallel, Map (iterate, distributed map over millions of S3 objects), Wait, Pass, Succeed, Fail.
- **Error handling** - Built-in Retry with backoff and Catch to fallback states, so functions stay simple.
- **Standard workflows** - Up to 1 year duration, exactly-once execution, full history; priced per state transition. Long-running business processes.
- **Express workflows** - Up to 5 minutes, high volume (100k+/s), at-least-once, priced per execution/duration. Streaming/IoT ingestion, microservice orchestration.
- **Human approval** - Wait for callback with task token (e.g. approval via email link).
- **Integration patterns** - Request-response, run a job (.sync waits for completion), wait for callback (.waitForTaskToken).

## Amazon MQ

- **What** - Managed message broker for Apache ActiveMQ and RabbitMQ.
- **Why** - Migrate existing apps using industry-standard protocols (JMS, AMQP, MQTT, STOMP, OpenWire) without rewriting to SQS/SNS.
- **HA** - Active/standby brokers across two AZs (ActiveMQ) with shared storage (EFS) or RabbitMQ clusters across 3 AZs.
- **Limitation** - Runs on broker instances, does not scale like SQS/SNS. For new cloud-native apps use SQS/SNS.

## Related: Amazon SWF and AppFlow

- **Amazon SWF** - Legacy workflow service; choose Step Functions for new designs (SWF only if external signals/child processes legacy requirement).
- **Amazon AppFlow** - No-code bi-directional data transfer between SaaS apps (Salesforce, SAP, Slack, ServiceNow) and AWS (S3, Redshift).

## Exam tips

- Orchestrate multiple Lambda functions with retries, branching, human approval -> Step Functions.
- Long-running workflow (days/months) -> Standard workflow. High-volume short -> Express.
- Migrating apps that use JMS/AMQP/MQTT brokers -> Amazon MQ (not SQS).
- Sync SaaS data (Salesforce) to S3 without code -> AppFlow.

## Practice questions

**Q1.** An order workflow calls several Lambda functions in sequence with conditional branching, retries on failure, and a manual approval step that can take days. Which service should orchestrate it?

- A. Amazon SQS
- B. AWS Step Functions Standard workflow
- C. Step Functions Express workflow
- D. Amazon EventBridge rules

<details><summary>Answer</summary>

**B** - Standard workflows run up to a year and support retries, branching and callback patterns for approvals.

_Domain: Design Resilient Architectures_

</details>

**Q2.** A company is migrating an on-premises application that uses Apache ActiveMQ with JMS and MQTT. It wants a managed service with minimal code changes. What should be used?

- A. Amazon SQS
- B. Amazon SNS
- C. Amazon MQ
- D. Amazon Kinesis

<details><summary>Answer</summary>

**C** - Amazon MQ supports ActiveMQ/RabbitMQ and standard protocols, avoiding rewrites.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A company needs to process millions of S3 objects in parallel with a workflow that calls Lambda for each object. Which Step Functions feature helps?

- A. Wait state
- B. Distributed Map state
- C. Choice state
- D. Express workflow callback

<details><summary>Answer</summary>

**B** - Distributed Map runs large-scale parallel processing over items such as S3 objects.

_Domain: Design High-Performing Architectures_

</details>
