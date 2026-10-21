# Amazon EventBridge

> Serverless event bus: rules with pattern matching, schedules, SaaS partner events, cross-account buses, Pipes and Scheduler.

Category: **Application Integration** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Concepts](#concepts)
- [Features](#features)
- [Common uses](#common-uses)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Concepts

- **Event buses** - Default bus (AWS service events), custom buses (your apps), partner buses (SaaS: Zendesk, Datadog, Shopify...).
- **Rules** - Match events with JSON event patterns and route to up to 5 targets per rule: Lambda, SQS, SNS, Step Functions, Kinesis, ECS tasks, API destinations (HTTP), another event bus, etc.
- **Schedules** - Cron/rate rules or EventBridge Scheduler (one-time and recurring schedules at scale, time zones) to invoke targets: serverless cron jobs.
- **Formerly CloudWatch Events** - Same underlying service with more features.

## Features

- **Archive and replay** - Archive events and replay them later (debugging, reprocessing).
- **Schema registry** - Discover event schemas and generate code bindings.
- **Cross-account / cross-region** - Send events to a bus in another account/region via resource policy (central event bus, aggregate GuardDuty findings).
- **EventBridge Pipes** - Point-to-point integration from a source (SQS, Kinesis, DynamoDB Streams, MQ, MSK) with optional filtering, enrichment (Lambda, API) to a target. Less glue code.
- **Input transformation** - Reshape events before delivering to targets.
- **Retries and DLQ** - Retries up to 24 h; DLQ for undeliverable events.

## Common uses

- **React to AWS changes** - EC2 state change, GuardDuty finding, CodePipeline failure, S3 object created -> trigger automation.
- **Scheduled tasks** - Run Lambda every night, stop dev instances at 7 PM.
- **Event-driven microservices** - Decouple producers/consumers with content-based routing.
- **EventBridge vs SNS** - EventBridge: rich content filtering, many AWS/SaaS sources, schema registry, archive/replay. SNS: higher fan-out throughput, mobile/SMS/email delivery.

## Exam tips

- Serverless cron job -> EventBridge schedule / Scheduler + Lambda.
- React to AWS service events (e.g. EC2 state changes, GuardDuty findings) -> EventBridge rule.
- Integrate SaaS application events -> EventBridge partner event bus.
- Reprocess past events -> EventBridge archive and replay.
- Centralize events from many accounts -> cross-account event bus.

## Practice questions

**Q1.** A company wants to run a Lambda function every day at 2 AM UTC without managing servers. What should be used?

- A. A cron job on an EC2 instance
- B. An EventBridge scheduled rule (or EventBridge Scheduler)
- C. SQS delay queue
- D. CloudWatch Logs subscription

<details><summary>Answer</summary>

**B** - EventBridge schedules provide serverless cron to invoke Lambda.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** An operations team wants to be notified and run remediation automatically whenever an EC2 instance changes to the stopped state. What should be used?

- A. CloudTrail Insights
- B. An EventBridge rule matching EC2 state-change events targeting SNS and Lambda
- C. AWS Config conformance packs
- D. VPC Flow Logs

<details><summary>Answer</summary>

**B** - EC2 emits state-change events to EventBridge; rules can trigger multiple targets.

_Domain: Design Resilient Architectures_

</details>

**Q3.** A company needs to receive events from a SaaS provider (e.g. Zendesk) and route them to AWS services without building polling integrations. What should be used?

- A. Amazon SQS
- B. EventBridge partner event source
- C. API Gateway WebSocket
- D. Amazon AppFlow only

<details><summary>Answer</summary>

**B** - EventBridge integrates with SaaS partners via partner event buses.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A bug in a consumer caused events to be processed incorrectly over the past day. The team wants to reprocess those events after fixing the bug. Which feature helps?

- A. SQS DLQ redrive
- B. EventBridge archive and replay
- C. SNS message filtering
- D. Kinesis enhanced fan-out

<details><summary>Answer</summary>

**B** - EventBridge archives can replay past events to a bus.

_Domain: Design Resilient Architectures_

</details>
