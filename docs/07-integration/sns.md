# Amazon SNS

> Pub/sub messaging: push one message to many subscribers (SQS, Lambda, HTTP, email, SMS, mobile push).

Category: **Application Integration** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Reliability and security](#reliability-and-security)
- [Patterns](#patterns)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **Topics** - Publishers send to a topic; all subscribers receive a copy (push). Up to millions of subscriptions per topic.
- **Subscribers** - SQS, Lambda, Kinesis Data Firehose, HTTP/S endpoints, email, SMS, mobile push (APNs, FCM).
- **Message filtering** - Subscription filter policies (on attributes or body) so each subscriber receives only relevant messages.
- **FIFO topics** - Ordering and deduplication; subscribers can be SQS FIFO (and Standard) queues.
- **Message size** - 256 KB; Extended Client Library with S3 for larger.

## Reliability and security

- **Delivery retries** - Retry policies for HTTP; DLQ (SQS) per subscription for undeliverable messages.
- **Encryption** - In transit HTTPS, at rest with KMS.
- **Access policies** - Topic policies for cross-account publishing and to allow services (S3 events, CloudWatch alarms) to publish.
- **Message archiving / replay** - For FIFO topics.

## Patterns

- **Fan-out (SNS + SQS)** - Publish once to SNS, deliver to multiple SQS queues for parallel, independent, durable processing (e.g. order -> fulfillment, analytics, email queues). Queue access policy must allow SNS.
- **S3 event to multiple consumers** - S3 supports one destination per event type/prefix combination; send to SNS and fan out (or use EventBridge).
- **Alarms and notifications** - CloudWatch alarms -> SNS -> email/SMS/PagerDuty.
- **SNS vs SQS** - SNS pushes to many subscribers, no persistence. SQS stores messages until a consumer pulls them.

## Exam tips

- One message to many consumers -> SNS. Durable parallel processing per consumer -> SNS + SQS fan-out.
- Subscribers need only some message types -> SNS message filtering.
- Ordered fan-out -> SNS FIFO + SQS FIFO.
- Email/SMS notifications from alarms -> SNS.

## Practice questions

**Q1.** When an order is placed, three independent services (billing, shipping, analytics) must each process it reliably, even if one service is temporarily down. What is the BEST architecture?

- A. Send the order to one SQS queue read by all three services
- B. Publish to an SNS topic with three subscribed SQS queues (one per service)
- C. Have the web tier call each service directly
- D. Write to a DynamoDB table and poll

<details><summary>Answer</summary>

**B** - SNS + SQS fan-out delivers a copy to each queue; each service processes independently and messages persist while a service is down.

_Domain: Design Resilient Architectures_

</details>

**Q2.** An SNS topic receives events for all product categories, but one subscriber should receive only "electronics" events. What should be used?

- A. A separate topic per category only
- B. An SNS subscription filter policy
- C. An SQS delay queue
- D. A Lambda function that discards events

<details><summary>Answer</summary>

**B** - Filter policies on subscriptions deliver only matching messages.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** An S3 bucket must trigger two different processing pipelines when objects are created. What is a valid design?

- A. Configure S3 event notification to an SNS topic and subscribe two SQS queues
- B. Configure two identical S3 event notifications with the same prefix
- C. Use S3 Inventory
- D. Use S3 Select

<details><summary>Answer</summary>

**A** - Fan-out via SNS (or EventBridge) delivers the same S3 event to multiple consumers.

_Domain: Design Resilient Architectures_

</details>
