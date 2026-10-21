svc({
  id: 'sqs', name: 'Amazon SQS', cat: 'integration', imp: 3,
  tag: 'Fully managed message queues to decouple components: Standard vs FIFO, visibility timeout, DLQ, long polling.',
  s: [
    { h: 'Queue types', i: [
      ['Standard', 'Nearly unlimited throughput, at-least-once delivery (occasional duplicates), best-effort ordering.'],
      ['FIFO', 'Exactly-once processing and strict ordering within a message group. 300 msg/s per API action (3,000 with batching); high-throughput mode supports far more. Queue name must end in .fifo.'],
      ['Message group ID', 'FIFO ordering unit; different groups processed in parallel.'],
      ['Deduplication ID', 'FIFO deduplication within a 5-minute window (content-based or explicit).']
    ]},
    { h: 'Key settings and limits', i: [
      ['Message size', '256 KB historically (raised to 1 MiB in 2025). For larger payloads use the Extended Client Library (payload in S3, pointer in SQS).'],
      ['Retention', 'Default 4 days, 1 minute to 14 days.'],
      ['Visibility timeout', 'Time a received message is hidden from other consumers (default 30 s, max 12 h). If processing exceeds it, the message reappears and may be processed twice. Consumer can call ChangeMessageVisibility.'],
      ['Long polling', 'ReceiveMessageWaitTimeSeconds up to 20 s: fewer empty responses, lower cost and latency. Preferred over short polling.'],
      ['Delay queues', 'Postpone delivery of new messages up to 15 minutes.'],
      ['Dead-letter queue (DLQ)', 'After maxReceiveCount failed receives, move message to a DLQ for analysis; redrive back to source later. DLQ of a FIFO queue must be FIFO.'],
      ['Batching', 'Send/receive/delete up to 10 messages per call to reduce cost.']
    ]},
    { h: 'Patterns', i: [
      ['Decoupling and buffering', 'Absorb traffic spikes between producers (web tier) and consumers (workers), e.g. protect a database from write bursts.'],
      ['Auto Scaling workers', 'Scale EC2/ECS consumers on ApproximateNumberOfMessagesVisible / backlog per instance.'],
      ['Lambda event source', 'Lambda polls SQS and processes batches; partial batch failure reporting.'],
      ['SNS fan-out', 'SNS topic delivers to multiple SQS queues for parallel independent processing.'],
      ['Request-response', 'Temporary queues with the SQS Temporary Queue Client.']
    ]},
    { h: 'Security', i: [
      ['Encryption', 'In transit HTTPS; at rest SSE-SQS (default) or SSE-KMS.'],
      ['Access policies', 'Resource-based queue policies for cross-account access and to allow SNS/S3 to send messages.'],
      ['VPC endpoint', 'Interface endpoint for private access.']
    ]}
  ],
  tips: [
    'Decouple tiers / buffer spikes / protect a database from bursts -> SQS.',
    'Ordering and no duplicates -> FIFO (watch the throughput limits). Max throughput, duplicates OK -> Standard.',
    'Messages processed twice -> increase visibility timeout (or make processing idempotent).',
    'Too many empty receives / high cost -> long polling.',
    'Poison messages -> dead-letter queue.',
    'Payload > SQS limit -> store in S3, send pointer (Extended Client Library).',
    'One event, many independent consumers -> SNS + SQS fan-out.'
  ],
  q: [
    { q: 'An order processing system must process orders exactly once and in the order they were placed for each customer. Which solution should be used?', o: ['SQS Standard queue', 'SQS FIFO queue with the customer ID as message group ID', 'SNS topic', 'Kinesis Data Firehose'], a: 1, e: 'FIFO queues provide ordering per message group and exactly-once processing.', d: 2 },
    { q: 'Consumers occasionally process the same SQS message twice because processing takes longer than expected. What should be changed?', o: ['Decrease the retention period', 'Increase the visibility timeout', 'Enable long polling', 'Use a delay queue'], a: 1, e: 'If processing exceeds the visibility timeout the message becomes visible again. Increase the timeout to exceed processing time.', d: 2 },
    { q: 'A company wants to reduce the cost of SQS consumers making many empty ReceiveMessage calls. What should be done?', o: ['Enable long polling by setting ReceiveMessageWaitTimeSeconds up to 20', 'Use FIFO queues', 'Decrease visibility timeout', 'Use a DLQ'], a: 0, e: 'Long polling waits for messages to arrive, reducing empty responses and API costs.', d: 4 },
    { q: 'Some messages repeatedly fail processing and block workers. How should they be handled?', o: ['Increase retention to 14 days', 'Configure a dead-letter queue with a maxReceiveCount', 'Switch to SNS', 'Delete the queue'], a: 1, e: 'A DLQ isolates messages that fail repeatedly for later analysis.', d: 2 },
    { q: 'A web application writes bursts of data to a database that cannot handle peak write volumes, causing failures. What is the MOST resilient solution?', o: ['Increase the database instance size permanently', 'Place an SQS queue between the application and a worker that writes to the database', 'Add read replicas', 'Use ElastiCache'], a: 1, e: 'SQS buffers bursts so workers can write at a sustainable rate, preventing data loss.', d: 2 },
    { q: 'An application needs to send messages of up to 50 MB through a queue. What should be done?', o: ['Use SQS with the Extended Client Library storing payloads in S3', 'Use a FIFO queue', 'Split messages manually into 256 KB chunks in SNS', 'Increase SQS message size to 50 MB'], a: 0, e: 'The Extended Client Library stores large payloads in S3 and sends a reference through SQS.', d: 3 }
  ]
});

svc({
  id: 'sns', name: 'Amazon SNS', cat: 'integration', imp: 3,
  tag: 'Pub/sub messaging: push one message to many subscribers (SQS, Lambda, HTTP, email, SMS, mobile push).',
  s: [
    { h: 'Fundamentals', i: [
      ['Topics', 'Publishers send to a topic; all subscribers receive a copy (push). Up to millions of subscriptions per topic.'],
      ['Subscribers', 'SQS, Lambda, Kinesis Data Firehose, HTTP/S endpoints, email, SMS, mobile push (APNs, FCM).'],
      ['Message filtering', 'Subscription filter policies (on attributes or body) so each subscriber receives only relevant messages.'],
      ['FIFO topics', 'Ordering and deduplication; subscribers can be SQS FIFO (and Standard) queues.'],
      ['Message size', '256 KB; Extended Client Library with S3 for larger.']
    ]},
    { h: 'Reliability and security', i: [
      ['Delivery retries', 'Retry policies for HTTP; DLQ (SQS) per subscription for undeliverable messages.'],
      ['Encryption', 'In transit HTTPS, at rest with KMS.'],
      ['Access policies', 'Topic policies for cross-account publishing and to allow services (S3 events, CloudWatch alarms) to publish.'],
      ['Message archiving / replay', 'For FIFO topics.']
    ]},
    { h: 'Patterns', i: [
      ['Fan-out (SNS + SQS)', 'Publish once to SNS, deliver to multiple SQS queues for parallel, independent, durable processing (e.g. order -> fulfillment, analytics, email queues). Queue access policy must allow SNS.'],
      ['S3 event to multiple consumers', 'S3 supports one destination per event type/prefix combination; send to SNS and fan out (or use EventBridge).'],
      ['Alarms and notifications', 'CloudWatch alarms -> SNS -> email/SMS/PagerDuty.'],
      ['SNS vs SQS', 'SNS pushes to many subscribers, no persistence. SQS stores messages until a consumer pulls them.']
    ]}
  ],
  tips: [
    'One message to many consumers -> SNS. Durable parallel processing per consumer -> SNS + SQS fan-out.',
    'Subscribers need only some message types -> SNS message filtering.',
    'Ordered fan-out -> SNS FIFO + SQS FIFO.',
    'Email/SMS notifications from alarms -> SNS.'
  ],
  q: [
    { q: 'When an order is placed, three independent services (billing, shipping, analytics) must each process it reliably, even if one service is temporarily down. What is the BEST architecture?', o: ['Send the order to one SQS queue read by all three services', 'Publish to an SNS topic with three subscribed SQS queues (one per service)', 'Have the web tier call each service directly', 'Write to a DynamoDB table and poll'], a: 1, e: 'SNS + SQS fan-out delivers a copy to each queue; each service processes independently and messages persist while a service is down.', d: 2 },
    { q: 'An SNS topic receives events for all product categories, but one subscriber should receive only "electronics" events. What should be used?', o: ['A separate topic per category only', 'An SNS subscription filter policy', 'An SQS delay queue', 'A Lambda function that discards events'], a: 1, e: 'Filter policies on subscriptions deliver only matching messages.', d: 3 },
    { q: 'An S3 bucket must trigger two different processing pipelines when objects are created. What is a valid design?', o: ['Configure S3 event notification to an SNS topic and subscribe two SQS queues', 'Configure two identical S3 event notifications with the same prefix', 'Use S3 Inventory', 'Use S3 Select'], a: 0, e: 'Fan-out via SNS (or EventBridge) delivers the same S3 event to multiple consumers.', d: 2 }
  ]
});

svc({
  id: 'eventbridge', name: 'Amazon EventBridge', cat: 'integration', imp: 3,
  tag: 'Serverless event bus: rules with pattern matching, schedules, SaaS partner events, cross-account buses, Pipes and Scheduler.',
  s: [
    { h: 'Concepts', i: [
      ['Event buses', 'Default bus (AWS service events), custom buses (your apps), partner buses (SaaS: Zendesk, Datadog, Shopify...).'],
      ['Rules', 'Match events with JSON event patterns and route to up to 5 targets per rule: Lambda, SQS, SNS, Step Functions, Kinesis, ECS tasks, API destinations (HTTP), another event bus, etc.'],
      ['Schedules', 'Cron/rate rules or EventBridge Scheduler (one-time and recurring schedules at scale, time zones) to invoke targets: serverless cron jobs.'],
      ['Formerly CloudWatch Events', 'Same underlying service with more features.']
    ]},
    { h: 'Features', i: [
      ['Archive and replay', 'Archive events and replay them later (debugging, reprocessing).'],
      ['Schema registry', 'Discover event schemas and generate code bindings.'],
      ['Cross-account / cross-region', 'Send events to a bus in another account/region via resource policy (central event bus, aggregate GuardDuty findings).'],
      ['EventBridge Pipes', 'Point-to-point integration from a source (SQS, Kinesis, DynamoDB Streams, MQ, MSK) with optional filtering, enrichment (Lambda, API) to a target. Less glue code.'],
      ['Input transformation', 'Reshape events before delivering to targets.'],
      ['Retries and DLQ', 'Retries up to 24 h; DLQ for undeliverable events.']
    ]},
    { h: 'Common uses', i: [
      ['React to AWS changes', 'EC2 state change, GuardDuty finding, CodePipeline failure, S3 object created -> trigger automation.'],
      ['Scheduled tasks', 'Run Lambda every night, stop dev instances at 7 PM.'],
      ['Event-driven microservices', 'Decouple producers/consumers with content-based routing.'],
      ['EventBridge vs SNS', 'EventBridge: rich content filtering, many AWS/SaaS sources, schema registry, archive/replay. SNS: higher fan-out throughput, mobile/SMS/email delivery.']
    ]}
  ],
  tips: [
    'Serverless cron job -> EventBridge schedule / Scheduler + Lambda.',
    'React to AWS service events (e.g. EC2 state changes, GuardDuty findings) -> EventBridge rule.',
    'Integrate SaaS application events -> EventBridge partner event bus.',
    'Reprocess past events -> EventBridge archive and replay.',
    'Centralize events from many accounts -> cross-account event bus.'
  ],
  q: [
    { q: 'A company wants to run a Lambda function every day at 2 AM UTC without managing servers. What should be used?', o: ['A cron job on an EC2 instance', 'An EventBridge scheduled rule (or EventBridge Scheduler)', 'SQS delay queue', 'CloudWatch Logs subscription'], a: 1, e: 'EventBridge schedules provide serverless cron to invoke Lambda.', d: 3 },
    { q: 'An operations team wants to be notified and run remediation automatically whenever an EC2 instance changes to the stopped state. What should be used?', o: ['CloudTrail Insights', 'An EventBridge rule matching EC2 state-change events targeting SNS and Lambda', 'AWS Config conformance packs', 'VPC Flow Logs'], a: 1, e: 'EC2 emits state-change events to EventBridge; rules can trigger multiple targets.', d: 2 },
    { q: 'A company needs to receive events from a SaaS provider (e.g. Zendesk) and route them to AWS services without building polling integrations. What should be used?', o: ['Amazon SQS', 'EventBridge partner event source', 'API Gateway WebSocket', 'Amazon AppFlow only'], a: 1, e: 'EventBridge integrates with SaaS partners via partner event buses.', d: 3 },
    { q: 'A bug in a consumer caused events to be processed incorrectly over the past day. The team wants to reprocess those events after fixing the bug. Which feature helps?', o: ['SQS DLQ redrive', 'EventBridge archive and replay', 'SNS message filtering', 'Kinesis enhanced fan-out'], a: 1, e: 'EventBridge archives can replay past events to a bus.', d: 2 }
  ]
});

svc({
  id: 'kinesis', name: 'Amazon Kinesis & Data Streaming', cat: 'integration', imp: 3,
  tag: 'Real-time streaming: Kinesis Data Streams, Amazon Data Firehose, Managed Service for Apache Flink, and MSK.',
  s: [
    { h: 'Kinesis Data Streams (KDS)', i: [
      ['What', 'Real-time, ordered, replayable stream. Producers write records; multiple consumers read independently.'],
      ['Shards', 'Provisioned mode: each shard 1 MB/s or 1,000 records/s in; 2 MB/s out (shared). Scale by splitting/merging shards. On-demand mode scales automatically.'],
      ['Partition key', 'Determines shard; ordering guaranteed per partition key within a shard. Use high-cardinality keys to avoid hot shards.'],
      ['Retention', '24 hours default, up to 365 days. Data can be replayed; records immutable.'],
      ['Consumers', 'Lambda, KCL apps on EC2/ECS, Firehose, Flink. Enhanced fan-out: dedicated 2 MB/s per shard per consumer with push (low latency, many consumers).'],
      ['Record size', 'Up to 1 MB per record (now up to 10 MiB).'],
      ['Security', 'KMS at rest, TLS in transit, IAM, VPC endpoints.']
    ]},
    { h: 'Amazon Data Firehose (Kinesis Data Firehose)', i: [
      ['What', 'Fully managed delivery of streaming data to destinations; no shards, auto scaling, pay per GB.'],
      ['Destinations', 'S3, Redshift (via S3 COPY), OpenSearch, Splunk, Apache Iceberg tables, Snowflake, Datadog/New Relic, generic HTTP endpoints.'],
      ['Near real time', 'Buffers by size/time (buffer interval configurable, including zero buffering for low latency).'],
      ['Transformations', 'Lambda transformation, format conversion to Parquet/ORC (with Glue catalog), compression, dynamic partitioning in S3.'],
      ['No replay / storage', 'Does not store data for replay; failed records go to S3 backup.'],
      ['Sources', 'Direct PUT, KDS, MSK, CloudWatch Logs, AWS IoT, EventBridge.']
    ]},
    { h: 'Analytics on streams', i: [
      ['Managed Service for Apache Flink', 'Formerly Kinesis Data Analytics. Real-time SQL/Java/Python analytics on KDS or MSK: windowed aggregations, anomaly detection, streaming ETL.'],
      ['Amazon MSK', 'Managed Apache Kafka (provisioned or serverless). Choose for existing Kafka apps, larger messages (configurable, default 1 MB), Kafka ecosystem. MSK Connect for connectors.'],
      ['KDS vs SQS', 'KDS: ordered per shard, multiple consumers replay the same data, real-time analytics. SQS: per-message processing, deleted after consumption, no replay.'],
      ['KDS vs Firehose', 'KDS: custom real-time consumers, ms latency, replay. Firehose: load data into storage/analytics with no code, near-real-time.']
    ]}
  ],
  tips: [
    'Real-time processing with multiple consumers and replay -> Kinesis Data Streams.',
    'Load streaming data into S3/Redshift/OpenSearch/Splunk with no code -> Data Firehose.',
    'Convert streaming JSON to Parquet in S3 -> Firehose format conversion.',
    'Real-time SQL / windowed analytics on streams -> Managed Service for Apache Flink.',
    'Existing Kafka workloads -> Amazon MSK.',
    'ProvisionedThroughputExceeded on KDS -> add shards (or on-demand), better partition keys.',
    'Many consumers each need full read throughput -> enhanced fan-out.'
  ],
  q: [
    { q: 'A company collects clickstream data and needs to load it into Amazon S3 in Parquet format with minimal management. Which service should be used?', o: ['Kinesis Data Streams with custom consumers', 'Amazon Data Firehose with record format conversion', 'Amazon SQS', 'AWS Glue crawler'], a: 1, e: 'Firehose is fully managed and can convert JSON to Parquet/ORC before delivering to S3.', d: 3 },
    { q: 'An application needs to ingest real-time IoT data, allow multiple applications to process the same data independently, and replay data from the past 7 days. Which service is BEST?', o: ['Amazon SQS Standard', 'Kinesis Data Streams with 7-day retention', 'Amazon Data Firehose', 'Amazon SNS'], a: 1, e: 'KDS supports multiple consumers and configurable retention for replay.', d: 3 },
    { q: 'A Kinesis data stream is throwing ProvisionedThroughputExceededException errors for writes. What should be done? (Choose TWO)', o: ['Increase the number of shards or switch to on-demand mode', 'Use a partition key with higher cardinality to distribute writes', 'Increase retention period', 'Enable enhanced fan-out', 'Reduce the number of consumers'], a: [0, 1], e: 'Write throughput depends on shard count and even key distribution. Enhanced fan-out helps consumers, not producers.', d: 3 },
    { q: 'A company is migrating an on-premises Apache Kafka cluster and wants to keep using Kafka APIs with minimal changes. Which service should be used?', o: ['Kinesis Data Streams', 'Amazon MSK', 'Amazon SQS', 'Amazon MQ'], a: 1, e: 'Amazon MSK is managed Apache Kafka.', d: 3 },
    { q: 'A company needs to compute rolling 5-minute averages on streaming sensor data in real time and send alerts. Which service fits best?', o: ['Amazon Athena', 'Managed Service for Apache Flink', 'AWS Glue batch job', 'Amazon Redshift'], a: 1, e: 'Apache Flink performs real-time windowed analytics on streams.', d: 3 }
  ]
});

svc({
  id: 'step-functions', name: 'AWS Step Functions & Amazon MQ', cat: 'integration', imp: 2,
  tag: 'Serverless workflow orchestration with state machines; Amazon MQ for lift-and-shift of existing message brokers.',
  s: [
    { h: 'AWS Step Functions', i: [
      ['What', 'Visual state machines (Amazon States Language JSON) orchestrating Lambda, ECS, Batch, Glue, SNS, SQS, DynamoDB and 200+ services via SDK integrations.'],
      ['States', 'Task, Choice, Parallel, Map (iterate, distributed map over millions of S3 objects), Wait, Pass, Succeed, Fail.'],
      ['Error handling', 'Built-in Retry with backoff and Catch to fallback states, so functions stay simple.'],
      ['Standard workflows', 'Up to 1 year duration, exactly-once execution, full history; priced per state transition. Long-running business processes.'],
      ['Express workflows', 'Up to 5 minutes, high volume (100k+/s), at-least-once, priced per execution/duration. Streaming/IoT ingestion, microservice orchestration.'],
      ['Human approval', 'Wait for callback with task token (e.g. approval via email link).'],
      ['Integration patterns', 'Request-response, run a job (.sync waits for completion), wait for callback (.waitForTaskToken).']
    ]},
    { h: 'Amazon MQ', i: [
      ['What', 'Managed message broker for Apache ActiveMQ and RabbitMQ.'],
      ['Why', 'Migrate existing apps using industry-standard protocols (JMS, AMQP, MQTT, STOMP, OpenWire) without rewriting to SQS/SNS.'],
      ['HA', 'Active/standby brokers across two AZs (ActiveMQ) with shared storage (EFS) or RabbitMQ clusters across 3 AZs.'],
      ['Limitation', 'Runs on broker instances, does not scale like SQS/SNS. For new cloud-native apps use SQS/SNS.']
    ]},
    { h: 'Related: Amazon SWF and AppFlow', i: [
      ['Amazon SWF', 'Legacy workflow service; choose Step Functions for new designs (SWF only if external signals/child processes legacy requirement).'],
      ['Amazon AppFlow', 'No-code bi-directional data transfer between SaaS apps (Salesforce, SAP, Slack, ServiceNow) and AWS (S3, Redshift).']
    ]}
  ],
  tips: [
    'Orchestrate multiple Lambda functions with retries, branching, human approval -> Step Functions.',
    'Long-running workflow (days/months) -> Standard workflow. High-volume short -> Express.',
    'Migrating apps that use JMS/AMQP/MQTT brokers -> Amazon MQ (not SQS).',
    'Sync SaaS data (Salesforce) to S3 without code -> AppFlow.'
  ],
  q: [
    { q: 'An order workflow calls several Lambda functions in sequence with conditional branching, retries on failure, and a manual approval step that can take days. Which service should orchestrate it?', o: ['Amazon SQS', 'AWS Step Functions Standard workflow', 'Step Functions Express workflow', 'Amazon EventBridge rules'], a: 1, e: 'Standard workflows run up to a year and support retries, branching and callback patterns for approvals.', d: 2 },
    { q: 'A company is migrating an on-premises application that uses Apache ActiveMQ with JMS and MQTT. It wants a managed service with minimal code changes. What should be used?', o: ['Amazon SQS', 'Amazon SNS', 'Amazon MQ', 'Amazon Kinesis'], a: 2, e: 'Amazon MQ supports ActiveMQ/RabbitMQ and standard protocols, avoiding rewrites.', d: 3 },
    { q: 'A company needs to process millions of S3 objects in parallel with a workflow that calls Lambda for each object. Which Step Functions feature helps?', o: ['Wait state', 'Distributed Map state', 'Choice state', 'Express workflow callback'], a: 1, e: 'Distributed Map runs large-scale parallel processing over items such as S3 objects.', d: 3 }
  ]
});

svc({
  id: 'api-gateway', name: 'Amazon API Gateway', cat: 'integration', imp: 3,
  tag: 'Create, secure and scale REST, HTTP and WebSocket APIs: endpoint types, auth, throttling, caching, stages.',
  s: [
    { h: 'API types', i: [
      ['REST API', 'Full features: API keys, usage plans, request validation, caching, WAF, resource policies, private endpoints, mapping templates.'],
      ['HTTP API', 'Cheaper (up to ~70%), lower latency, simpler: JWT/OIDC authorizers, Lambda and HTTP proxies. Fewer features (no caching, usage plans, WAF).'],
      ['WebSocket API', 'Persistent two-way connections: chat apps, real-time dashboards, games; routes on message content; connection IDs to push back to clients.']
    ]},
    { h: 'Endpoint types', i: [
      ['Edge-optimized (default for REST)', 'Requests routed through CloudFront edge locations; API lives in one region. For global clients.'],
      ['Regional', 'For clients in the same region; can put your own CloudFront in front for more control.'],
      ['Private', 'Accessible only from your VPC through an interface VPC endpoint, controlled with a resource policy.']
    ]},
    { h: 'Security', i: [
      ['IAM authorization', 'SigV4-signed requests; for AWS users/roles, cross-account with resource policies.'],
      ['Cognito user pool authorizer', 'Validate JWTs from Cognito; no custom code.'],
      ['Lambda authorizer', 'Custom logic: validate third-party tokens (OAuth, SAML) or request parameters; returns an IAM policy; cacheable.'],
      ['Resource policies', 'Allow/deny by source IP, VPC endpoint, AWS account.'],
      ['WAF and TLS', 'WAF on REST APIs; mTLS; custom domain names with ACM certificates.'],
      ['API keys & usage plans', 'Identify clients and meter/throttle per customer (for monetized APIs). API keys are not an auth mechanism by themselves.']
    ]},
    { h: 'Performance and operations', i: [
      ['Throttling', 'Account default 10,000 requests/s with 5,000 burst per region (soft); stage, method and usage plan limits. Exceeding returns 429.'],
      ['Caching', 'REST API stage cache (default TTL 300 s, max 3,600 s) to reduce backend calls; per-method overrides; clients can invalidate with header if allowed.'],
      ['Timeout', 'Integration timeout default 29 s (can be increased for Regional/private REST APIs). Long work -> async pattern.'],
      ['Payload limit', '10 MB request payload. Upload large files with S3 pre-signed URLs instead.'],
      ['Integrations', 'Lambda proxy, HTTP proxy, AWS service integrations (e.g. put directly to SQS/Kinesis/DynamoDB/Step Functions without Lambda), Mock, VPC Link to private NLB/ALB.'],
      ['Stages and canary', 'dev/test/prod stages with stage variables; canary release sends a % of traffic to a new deployment.'],
      ['Monitoring', 'CloudWatch metrics (Latency, IntegrationLatency, 4XX, 5XX, Count), access logs, X-Ray tracing.']
    ]}
  ],
  tips: [
    'Serverless REST API -> API Gateway + Lambda (+ DynamoDB).',
    'Lowest cost simple API with JWT auth -> HTTP API. Need caching, usage plans, API keys, WAF -> REST API.',
    'Real-time two-way communication -> WebSocket API.',
    'API reachable only from inside VPC -> private API + interface endpoint + resource policy.',
    'Throttle per customer / monetize -> usage plans + API keys.',
    'Reduce backend load for repeated GETs -> API Gateway caching.',
    'Expose private services in a VPC through API Gateway -> VPC Link (NLB/ALB).',
    'Buffer API writes without Lambda -> API Gateway direct integration with SQS.'
  ],
  q: [
    { q: 'A company wants to build a REST API that is accessible only from within its VPC. What should be used?', o: ['Edge-optimized API', 'Regional API with WAF', 'Private API with an interface VPC endpoint and resource policy', 'HTTP API with JWT authorizer'], a: 2, e: 'Private APIs are reachable only through interface VPC endpoints and secured by resource policies.', d: 1 },
    { q: 'A company offers a public API to paying customers and must enforce different request quotas per customer. What should be used?', o: ['Lambda reserved concurrency', 'API Gateway usage plans with API keys', 'WAF rate-based rules', 'CloudFront signed URLs'], a: 1, e: 'Usage plans associate API keys with throttling limits and quotas per client.', d: 3 },
    { q: 'A chat application needs persistent bidirectional communication between clients and a serverless backend. Which option fits?', o: ['API Gateway REST API', 'API Gateway WebSocket API', 'Amazon SQS', 'Application Load Balancer with Lambda'], a: 1, e: 'WebSocket APIs maintain persistent connections and allow the backend to push messages to clients.', d: 3 },
    { q: 'A read-heavy API returns the same product catalog data frequently, causing high Lambda and DynamoDB costs. What is the simplest optimization?', o: ['Enable API Gateway caching on the stage', 'Increase Lambda memory', 'Use DynamoDB on-demand', 'Use an HTTP API'], a: 0, e: 'Stage caching serves repeated responses without invoking the backend.', d: 4 },
    { q: 'An API must validate OAuth tokens issued by a third-party identity provider using custom logic before allowing requests. Which authorizer should be used?', o: ['IAM authorization', 'Cognito user pool authorizer', 'Lambda authorizer', 'API key'], a: 2, e: 'Lambda authorizers run custom code to validate tokens from any provider.', d: 1 },
    { q: 'Mobile clients must upload 500 MB videos through an API. API Gateway rejects the requests. What is the BEST solution?', o: ['Increase the API Gateway payload limit', 'Have the API return an S3 pre-signed URL and upload directly to S3', 'Use a WebSocket API', 'Use Lambda with more memory'], a: 1, e: 'API Gateway has a 10 MB payload limit. Pre-signed URLs let clients upload directly to S3.', d: 3 }
  ]
});
