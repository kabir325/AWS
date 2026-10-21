# Amazon SQS

> Fully managed message queues to decouple components: Standard vs FIFO, visibility timeout, DLQ, long polling.

Category: **Application Integration** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Queue types](#queue-types)
- [Key settings and limits](#key-settings-and-limits)
- [Patterns](#patterns)
- [Security](#security)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Queue types

- **Standard** - Nearly unlimited throughput, at-least-once delivery (occasional duplicates), best-effort ordering.
- **FIFO** - Exactly-once processing and strict ordering within a message group. 300 msg/s per API action (3,000 with batching); high-throughput mode supports far more. Queue name must end in .fifo.
- **Message group ID** - FIFO ordering unit; different groups processed in parallel.
- **Deduplication ID** - FIFO deduplication within a 5-minute window (content-based or explicit).

## Key settings and limits

- **Message size** - 256 KB historically (raised to 1 MiB in 2025). For larger payloads use the Extended Client Library (payload in S3, pointer in SQS).
- **Retention** - Default 4 days, 1 minute to 14 days.
- **Visibility timeout** - Time a received message is hidden from other consumers (default 30 s, max 12 h). If processing exceeds it, the message reappears and may be processed twice. Consumer can call ChangeMessageVisibility.
- **Long polling** - ReceiveMessageWaitTimeSeconds up to 20 s: fewer empty responses, lower cost and latency. Preferred over short polling.
- **Delay queues** - Postpone delivery of new messages up to 15 minutes.
- **Dead-letter queue (DLQ)** - After maxReceiveCount failed receives, move message to a DLQ for analysis; redrive back to source later. DLQ of a FIFO queue must be FIFO.
- **Batching** - Send/receive/delete up to 10 messages per call to reduce cost.

## Patterns

- **Decoupling and buffering** - Absorb traffic spikes between producers (web tier) and consumers (workers), e.g. protect a database from write bursts.
- **Auto Scaling workers** - Scale EC2/ECS consumers on ApproximateNumberOfMessagesVisible / backlog per instance.
- **Lambda event source** - Lambda polls SQS and processes batches; partial batch failure reporting.
- **SNS fan-out** - SNS topic delivers to multiple SQS queues for parallel independent processing.
- **Request-response** - Temporary queues with the SQS Temporary Queue Client.

## Security

- **Encryption** - In transit HTTPS; at rest SSE-SQS (default) or SSE-KMS.
- **Access policies** - Resource-based queue policies for cross-account access and to allow SNS/S3 to send messages.
- **VPC endpoint** - Interface endpoint for private access.

## Exam tips

- Decouple tiers / buffer spikes / protect a database from bursts -> SQS.
- Ordering and no duplicates -> FIFO (watch the throughput limits). Max throughput, duplicates OK -> Standard.
- Messages processed twice -> increase visibility timeout (or make processing idempotent).
- Too many empty receives / high cost -> long polling.
- Poison messages -> dead-letter queue.
- Payload > SQS limit -> store in S3, send pointer (Extended Client Library).
- One event, many independent consumers -> SNS + SQS fan-out.

## Practice questions

**Q1.** An order processing system must process orders exactly once and in the order they were placed for each customer. Which solution should be used?

- A. SQS Standard queue
- B. SQS FIFO queue with the customer ID as message group ID
- C. SNS topic
- D. Kinesis Data Firehose

<details><summary>Answer</summary>

**B** - FIFO queues provide ordering per message group and exactly-once processing.

_Domain: Design Resilient Architectures_

</details>

**Q2.** Consumers occasionally process the same SQS message twice because processing takes longer than expected. What should be changed?

- A. Decrease the retention period
- B. Increase the visibility timeout
- C. Enable long polling
- D. Use a delay queue

<details><summary>Answer</summary>

**B** - If processing exceeds the visibility timeout the message becomes visible again. Increase the timeout to exceed processing time.

_Domain: Design Resilient Architectures_

</details>

**Q3.** A company wants to reduce the cost of SQS consumers making many empty ReceiveMessage calls. What should be done?

- A. Enable long polling by setting ReceiveMessageWaitTimeSeconds up to 20
- B. Use FIFO queues
- C. Decrease visibility timeout
- D. Use a DLQ

<details><summary>Answer</summary>

**A** - Long polling waits for messages to arrive, reducing empty responses and API costs.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q4.** Some messages repeatedly fail processing and block workers. How should they be handled?

- A. Increase retention to 14 days
- B. Configure a dead-letter queue with a maxReceiveCount
- C. Switch to SNS
- D. Delete the queue

<details><summary>Answer</summary>

**B** - A DLQ isolates messages that fail repeatedly for later analysis.

_Domain: Design Resilient Architectures_

</details>

**Q5.** A web application writes bursts of data to a database that cannot handle peak write volumes, causing failures. What is the MOST resilient solution?

- A. Increase the database instance size permanently
- B. Place an SQS queue between the application and a worker that writes to the database
- C. Add read replicas
- D. Use ElastiCache

<details><summary>Answer</summary>

**B** - SQS buffers bursts so workers can write at a sustainable rate, preventing data loss.

_Domain: Design Resilient Architectures_

</details>

**Q6.** An application needs to send messages of up to 50 MB through a queue. What should be done?

- A. Use SQS with the Extended Client Library storing payloads in S3
- B. Use a FIFO queue
- C. Split messages manually into 256 KB chunks in SNS
- D. Increase SQS message size to 50 MB

<details><summary>Answer</summary>

**A** - The Extended Client Library stores large payloads in S3 and sends a reference through SQS.

_Domain: Design High-Performing Architectures_

</details>
