# Amazon Kinesis & Data Streaming

> Real-time streaming: Kinesis Data Streams, Amazon Data Firehose, Managed Service for Apache Flink, and MSK.

Category: **Application Integration** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Kinesis Data Streams (KDS)](#kinesis-data-streams-kds)
- [Amazon Data Firehose (Kinesis Data Firehose)](#amazon-data-firehose-kinesis-data-firehose)
- [Analytics on streams](#analytics-on-streams)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Kinesis Data Streams (KDS)

- **What** - Real-time, ordered, replayable stream. Producers write records; multiple consumers read independently.
- **Shards** - Provisioned mode: each shard 1 MB/s or 1,000 records/s in; 2 MB/s out (shared). Scale by splitting/merging shards. On-demand mode scales automatically.
- **Partition key** - Determines shard; ordering guaranteed per partition key within a shard. Use high-cardinality keys to avoid hot shards.
- **Retention** - 24 hours default, up to 365 days. Data can be replayed; records immutable.
- **Consumers** - Lambda, KCL apps on EC2/ECS, Firehose, Flink. Enhanced fan-out: dedicated 2 MB/s per shard per consumer with push (low latency, many consumers).
- **Record size** - Up to 1 MB per record (now up to 10 MiB).
- **Security** - KMS at rest, TLS in transit, IAM, VPC endpoints.

## Amazon Data Firehose (Kinesis Data Firehose)

- **What** - Fully managed delivery of streaming data to destinations; no shards, auto scaling, pay per GB.
- **Destinations** - S3, Redshift (via S3 COPY), OpenSearch, Splunk, Apache Iceberg tables, Snowflake, Datadog/New Relic, generic HTTP endpoints.
- **Near real time** - Buffers by size/time (buffer interval configurable, including zero buffering for low latency).
- **Transformations** - Lambda transformation, format conversion to Parquet/ORC (with Glue catalog), compression, dynamic partitioning in S3.
- **No replay / storage** - Does not store data for replay; failed records go to S3 backup.
- **Sources** - Direct PUT, KDS, MSK, CloudWatch Logs, AWS IoT, EventBridge.

## Analytics on streams

- **Managed Service for Apache Flink** - Formerly Kinesis Data Analytics. Real-time SQL/Java/Python analytics on KDS or MSK: windowed aggregations, anomaly detection, streaming ETL.
- **Amazon MSK** - Managed Apache Kafka (provisioned or serverless). Choose for existing Kafka apps, larger messages (configurable, default 1 MB), Kafka ecosystem. MSK Connect for connectors.
- **KDS vs SQS** - KDS: ordered per shard, multiple consumers replay the same data, real-time analytics. SQS: per-message processing, deleted after consumption, no replay.
- **KDS vs Firehose** - KDS: custom real-time consumers, ms latency, replay. Firehose: load data into storage/analytics with no code, near-real-time.

## Exam tips

- Real-time processing with multiple consumers and replay -> Kinesis Data Streams.
- Load streaming data into S3/Redshift/OpenSearch/Splunk with no code -> Data Firehose.
- Convert streaming JSON to Parquet in S3 -> Firehose format conversion.
- Real-time SQL / windowed analytics on streams -> Managed Service for Apache Flink.
- Existing Kafka workloads -> Amazon MSK.
- ProvisionedThroughputExceeded on KDS -> add shards (or on-demand), better partition keys.
- Many consumers each need full read throughput -> enhanced fan-out.

## Practice questions

**Q1.** A company collects clickstream data and needs to load it into Amazon S3 in Parquet format with minimal management. Which service should be used?

- A. Kinesis Data Streams with custom consumers
- B. Amazon Data Firehose with record format conversion
- C. Amazon SQS
- D. AWS Glue crawler

<details><summary>Answer</summary>

**B** - Firehose is fully managed and can convert JSON to Parquet/ORC before delivering to S3.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** An application needs to ingest real-time IoT data, allow multiple applications to process the same data independently, and replay data from the past 7 days. Which service is BEST?

- A. Amazon SQS Standard
- B. Kinesis Data Streams with 7-day retention
- C. Amazon Data Firehose
- D. Amazon SNS

<details><summary>Answer</summary>

**B** - KDS supports multiple consumers and configurable retention for replay.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A Kinesis data stream is throwing ProvisionedThroughputExceededException errors for writes. What should be done? (Choose TWO)

- A. Increase the number of shards or switch to on-demand mode
- B. Use a partition key with higher cardinality to distribute writes
- C. Increase retention period
- D. Enable enhanced fan-out
- E. Reduce the number of consumers

<details><summary>Answer</summary>

**A, B** - Write throughput depends on shard count and even key distribution. Enhanced fan-out helps consumers, not producers.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** A company is migrating an on-premises Apache Kafka cluster and wants to keep using Kafka APIs with minimal changes. Which service should be used?

- A. Kinesis Data Streams
- B. Amazon MSK
- C. Amazon SQS
- D. Amazon MQ

<details><summary>Answer</summary>

**B** - Amazon MSK is managed Apache Kafka.

_Domain: Design High-Performing Architectures_

</details>

**Q5.** A company needs to compute rolling 5-minute averages on streaming sensor data in real time and send alerts. Which service fits best?

- A. Amazon Athena
- B. Managed Service for Apache Flink
- C. AWS Glue batch job
- D. Amazon Redshift

<details><summary>Answer</summary>

**B** - Apache Flink performs real-time windowed analytics on streams.

_Domain: Design High-Performing Architectures_

</details>
