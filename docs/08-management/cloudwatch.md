# Amazon CloudWatch

> Metrics, alarms, logs, dashboards, agent, and observability for AWS resources and applications.

Category: **Management & Governance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Metrics](#metrics)
- [Alarms](#alarms)
- [CloudWatch Logs](#cloudwatch-logs)
- [Observability features](#observability-features)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Metrics

- **Namespaces and dimensions** - Metrics grouped by namespace (AWS/EC2) and dimensions (InstanceId). Retained up to 15 months (granularity decreases over time).
- **EC2 default metrics** - CPU, network, disk I/O (instance store), status checks every 5 minutes; detailed monitoring = 1 minute (paid).
- **NOT collected by default** - Memory utilization, disk space usage, process counts: require the CloudWatch agent (or custom metrics).
- **Custom metrics** - PutMetricData; standard 1-minute or high-resolution down to 1 second.
- **Metric streams** - Near-real-time stream of metrics to Firehose (S3, third-party tools).
- **Metric math / anomaly detection** - Combine metrics; ML band of expected values for alarms.

## Alarms

- **States** - OK, ALARM, INSUFFICIENT_DATA. Evaluate a metric over periods (e.g. 3 of 5 datapoints).
- **Actions** - SNS notification, EC2 actions (stop, terminate, reboot, recover), Auto Scaling policy, Systems Manager OpsItem/incident, Lambda (via SNS or direct).
- **Composite alarms** - Combine multiple alarms with AND/OR to reduce noise.
- **EC2 recover** - StatusCheckFailed_System alarm with recover action moves instance to new hardware keeping IPs, EBS and metadata.
- **Billing alarms** - EstimatedCharges metric in us-east-1 (or use AWS Budgets).

## CloudWatch Logs

- **Structure** - Log groups (retention: never expire by default, 1 day - 10 years) and log streams. KMS encryption.
- **Sources** - CloudWatch agent (EC2/on-prem), Lambda, ECS/EKS, API Gateway, VPC Flow Logs, Route 53 query logs, CloudTrail.
- **Metric filters** - Turn log patterns (e.g. "ERROR", 4xx counts) into metrics and alarm on them.
- **Logs Insights** - Interactive query language to search and aggregate logs.
- **Subscription filters** - Real-time stream to Kinesis Data Streams, Firehose, Lambda or OpenSearch; cross-account aggregation.
- **Export to S3** - Batch export (CreateExportTask, up to 12 h delay) for archival; use subscriptions for real time.
- **Live Tail and Infrequent Access class** - Real-time tail of logs; cheaper log class with fewer features.

## Observability features

- **CloudWatch agent** - Unified agent for system-level metrics (memory, disk, swap) and logs from EC2 and on-prem servers. Config stored in SSM Parameter Store.
- **Container Insights** - Metrics and logs for ECS, EKS, Kubernetes, Fargate.
- **Lambda Insights / Application Insights** - Enhanced monitoring for serverless and common app stacks (.NET, SQL Server).
- **Synthetics canaries** - Scripted checks of endpoints and UI flows on a schedule.
- **RUM / Application Signals** - Real user monitoring and service-level observability.
- **AWS X-Ray** - Distributed tracing across microservices to find latency bottlenecks and errors (service map).
- **Dashboards** - Cross-account, cross-region dashboards.

## Exam tips

- Monitor memory or disk space on EC2 -> install CloudWatch agent.
- Automatically recover an instance from hardware failure -> CloudWatch alarm with EC2 recover action.
- Alert on a specific error string in logs -> metric filter + alarm.
- Real-time log processing / centralization -> subscription filter to Kinesis/Firehose/Lambda.
- Trace requests across microservices -> X-Ray.
- Reduce alarm noise -> composite alarms.

## Practice questions

**Q1.** A company needs to monitor memory utilization of its EC2 instances and alarm when it exceeds 80%. What should be done?

- A. Enable detailed monitoring
- B. Install and configure the CloudWatch agent to publish memory metrics
- C. Use the default EC2 metrics
- D. Enable VPC Flow Logs

<details><summary>Answer</summary>

**B** - Memory metrics are not available by default; the CloudWatch agent publishes them as custom metrics.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** An application writes logs to CloudWatch Logs. The team wants an alarm when the word "FATAL" appears more than 5 times in 5 minutes. What should be configured?

- A. A subscription filter to Lambda
- B. A metric filter and a CloudWatch alarm
- C. CloudTrail Insights
- D. Logs Insights scheduled query only

<details><summary>Answer</summary>

**B** - Metric filters convert matching log events to metrics, which alarms can monitor.

_Domain: Design Resilient Architectures_

</details>

**Q3.** An EC2 instance must automatically be recovered onto healthy hardware if the underlying host fails, keeping the same instance ID and IP addresses. What should be used?

- A. Auto Scaling group of size 1
- B. CloudWatch alarm on StatusCheckFailed_System with the EC2 recover action
- C. AWS Backup
- D. Route 53 health check

<details><summary>Answer</summary>

**B** - The recover action migrates the instance to new hardware preserving ID, private IPs, Elastic IPs and EBS volumes.

_Domain: Design Resilient Architectures_

</details>

**Q4.** A company wants to stream logs from many accounts in real time to a central account for analysis in OpenSearch. What should be used?

- A. CloudWatch Logs export tasks to S3
- B. CloudWatch Logs subscription filters to a cross-account destination (Kinesis/Firehose)
- C. CloudTrail Lake
- D. AWS Config aggregator

<details><summary>Answer</summary>

**B** - Subscription filters deliver logs in real time, including cross-account via destinations.

_Domain: Design High-Performing Architectures_

</details>

**Q5.** Developers need to identify which microservice is causing high latency in a distributed application. Which service should be used?

- A. AWS X-Ray
- B. AWS CloudTrail
- C. Amazon Inspector
- D. VPC Flow Logs

<details><summary>Answer</summary>

**A** - X-Ray traces requests across services and visualizes latency in a service map.

_Domain: Design High-Performing Architectures_

</details>
