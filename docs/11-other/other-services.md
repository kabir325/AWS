# Other Services to Recognize

> Services that appear as distractors or one-liners: know what each does in a sentence.

Category: **Other Services** | Exam importance: *-- | [Back to index](../README.md)

## Contents

- [Compute and end-user](#compute-and-end-user)
- [Developer and front-end](#developer-and-front-end)
- [Messaging, IoT and media](#messaging-iot-and-media)
- [Governance and operations](#governance-and-operations)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Compute and end-user

- **AWS Batch** - Managed batch computing: queues, scheduling, auto-provisioned EC2/Spot/Fargate for jobs of any duration (no 15-minute limit).
- **Amazon Lightsail** - Simple VPS bundles (compute, storage, networking) at fixed monthly price for simple apps and beginners.
- **Amazon WorkSpaces** - Managed virtual desktops (DaaS).
- **Amazon AppStream 2.0** - Stream desktop applications to a browser.
- **VMware Cloud on AWS** - Run VMware workloads natively on AWS.
- **AWS Wavelength / Local Zones / Outposts** - See Global Infrastructure.

## Developer and front-end

- **AWS AppSync** - Managed GraphQL (and Pub/Sub) APIs with real-time subscriptions and offline sync for mobile/web.
- **AWS Amplify** - Build and host full-stack web/mobile apps (hosting, auth, APIs) quickly.
- **AWS X-Ray** - Distributed tracing.
- **CodeCommit / CodeBuild / CodeDeploy / CodePipeline** - Source control (closed to new customers), build, deployment (EC2, Lambda, ECS blue/green), CI/CD orchestration.
- **AWS Cloud9 / CloudShell** - Cloud IDE (closed to new customers) / browser shell with CLI pre-authenticated.
- **AWS Device Farm** - Test apps on real mobile devices and browsers.

## Messaging, IoT and media

- **Amazon SES** - Send and receive email at scale (transactional, marketing).
- **Amazon Pinpoint** - Multichannel marketing communications (email, SMS, push, voice) with segmentation and campaigns.
- **Amazon Connect** - Cloud contact center.
- **AWS IoT Core** - Connect IoT devices with MQTT, rules engine to route data to AWS services.
- **AWS IoT Greengrass** - Run Lambda/containers on edge devices.
- **AWS Elemental MediaConvert** - File-based video transcoding.
- **Amazon Kinesis Video Streams** - Stream video from devices for analytics/ML.

## Governance and operations

- **AWS Health Dashboard** - Service health and account-specific events (scheduled maintenance, issues affecting your resources); EventBridge integration.
- **AWS License Manager** - Track and enforce software license usage (BYOL).
- **AWS Resilience Hub** - Assess application resilience against RTO/RPO targets.
- **AWS Fault Injection Service** - Chaos engineering experiments.
- **Amazon Managed Grafana / Prometheus** - Managed open-source monitoring and dashboards.
- **AWS Global View / Resource Explorer** - Find resources across regions.
- **AWS Directory Service** - See Organizations entry (Managed AD, AD Connector, Simple AD).

## Exam tips

- Long-running batch jobs with automatic compute provisioning -> AWS Batch.
- GraphQL with real-time and offline -> AppSync.
- Bulk email -> SES. Multichannel campaigns -> Pinpoint. Contact center -> Connect.
- IoT devices over MQTT -> IoT Core.

## Practice questions

**Q1.** A company needs to run thousands of containerized batch jobs that each take 2-6 hours, with automatic compute provisioning and job queues. Which service should be used?

- A. AWS Lambda
- B. AWS Batch
- C. Amazon EventBridge
- D. Amazon Lightsail

<details><summary>Answer</summary>

**B** - AWS Batch manages job queues and provisions EC2/Spot/Fargate capacity for jobs of any duration.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** A mobile app needs a GraphQL API with real-time updates and offline data synchronization. Which service fits best?

- A. API Gateway REST API
- B. AWS AppSync
- C. Amazon SNS
- D. Amazon MQ

<details><summary>Answer</summary>

**B** - AppSync provides managed GraphQL with subscriptions and offline sync.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A company needs to send millions of transactional emails such as order confirmations. Which service should be used?

- A. Amazon SNS email subscription
- B. Amazon SES
- C. Amazon Connect
- D. Amazon WorkMail

<details><summary>Answer</summary>

**B** - SES is built for high-volume transactional and marketing email.

_Domain: Design High-Performing Architectures_

</details>
