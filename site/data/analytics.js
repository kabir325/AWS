svc({
  id: 'athena', name: 'Amazon Athena', cat: 'analytics', imp: 3,
  tag: 'Serverless interactive SQL queries directly on data in S3; pay per data scanned.',
  s: [
    { h: 'Fundamentals', i: [
      ['What', 'Serverless query engine (Trino/Presto based) using standard SQL on S3 data: CSV, JSON, Parquet, ORC, Avro, logs. No infrastructure, no loading.'],
      ['Pricing', 'About $5 per TB scanned (or provisioned capacity). Optimize to scan less.'],
      ['Catalog', 'Uses AWS Glue Data Catalog for table definitions (crawlers can create them).'],
      ['Use cases', 'Ad-hoc analysis, query VPC Flow Logs, CloudTrail, ALB/CloudFront logs, CUR billing data; BI with QuickSight.']
    ]},
    { h: 'Performance and cost optimization', i: [
      ['Columnar formats', 'Convert to Parquet or ORC (with Glue ETL or Firehose): scan only needed columns, huge cost savings.'],
      ['Compression', 'Compress data (Snappy, GZIP) to scan fewer bytes.'],
      ['Partitioning', 'Organize S3 by partition keys (s3://bucket/year=2026/month=10/) and filter on them; partition projection to avoid managing partitions.'],
      ['Larger files', 'Use fewer larger files (> 128 MB) rather than many small files.'],
      ['Query result reuse', 'Reuse cached results for repeated queries.']
    ]},
    { h: 'Features', i: [
      ['Federated Query', 'Query data in RDS, DynamoDB, Redshift, on-prem databases, etc. via Lambda data source connectors and join with S3 data.'],
      ['Workgroups', 'Separate users/teams, enforce per-query data scan limits, track costs.'],
      ['CTAS', 'CREATE TABLE AS SELECT to transform and write results in Parquet.'],
      ['Apache Spark', 'Run interactive Spark notebooks in Athena.'],
      ['Security', 'IAM, Lake Formation fine-grained permissions, encrypted results.']
    ]}
  ],
  tips: [
    'Ad-hoc SQL on S3 data, serverless, no loading -> Athena.',
    'Reduce Athena cost / improve speed -> Parquet/ORC + compression + partitioning.',
    'Analyze VPC Flow Logs / CloudTrail / ALB logs in S3 -> Athena.',
    'Query across S3 and other databases -> Athena Federated Query.',
    'Complex BI on large structured data with joins and consistent heavy usage -> Redshift instead.'
  ],
  q: [
    { q: 'A company stores application logs in S3 and wants to run occasional SQL queries on them without managing infrastructure. What is the MOST cost-effective solution?', o: ['Load the data into Redshift', 'Use Amazon Athena', 'Launch an EMR cluster', 'Load into RDS'], a: 1, e: 'Athena queries S3 data in place, serverless, paying only per data scanned.', d: 4 },
    { q: 'Athena queries on large CSV datasets are slow and expensive. Which actions reduce cost and improve performance? (Choose TWO)', o: ['Convert the data to Apache Parquet', 'Partition data in S3 by date and filter on partition columns', 'Store data in S3 Glacier', 'Use more, smaller files', 'Disable compression'], a: [0, 1], e: 'Columnar formats and partitioning reduce bytes scanned, lowering cost and latency.', d: 4 },
    { q: 'An analyst wants to join customer data in DynamoDB with clickstream data in S3 using SQL without moving data. What should be used?', o: ['Athena Federated Query', 'S3 Select', 'Redshift COPY', 'AWS DMS'], a: 0, e: 'Federated Query uses connectors to query and join external sources such as DynamoDB with S3.', d: 3 },
    { q: 'A company wants to limit how much data each team can scan in Athena per query to control costs. What should be used?', o: ['IAM policies only', 'Athena workgroups with data usage controls', 'S3 lifecycle rules', 'Glue crawlers'], a: 1, e: 'Workgroups can enforce per-query and per-workgroup data scan limits.', d: 4 }
  ]
});

svc({
  id: 'glue', name: 'AWS Glue & Lake Formation', cat: 'analytics', imp: 2,
  tag: 'Serverless ETL and data catalog; Lake Formation for building and securing data lakes with fine-grained permissions.',
  s: [
    { h: 'AWS Glue', i: [
      ['Glue Data Catalog', 'Central metadata repository (databases, tables, schemas) used by Athena, Redshift Spectrum, EMR, Lake Formation. Hive metastore compatible.'],
      ['Crawlers', 'Scan S3, JDBC, DynamoDB sources to infer schemas and create/update catalog tables and partitions.'],
      ['Glue ETL jobs', 'Serverless Apache Spark (Python/Scala) or Python shell jobs: transform, clean, convert CSV/JSON to Parquet, join datasets. Pay per DPU-hour.'],
      ['Job bookmarks', 'Track processed data to avoid reprocessing old data on incremental runs.'],
      ['Glue Studio / DataBrew', 'Visual ETL authoring; DataBrew for no-code data cleaning and normalization (250+ transformations).'],
      ['Glue Streaming ETL', 'Spark Structured Streaming on Kinesis/MSK.'],
      ['Data Quality', 'Define and monitor data quality rules.'],
      ['Triggers and workflows', 'Schedule or event-driven orchestration of crawlers and jobs.']
    ]},
    { h: 'AWS Lake Formation', i: [
      ['What', 'Build a secure data lake on S3 in days: ingest, catalog, clean, and centrally govern access.'],
      ['Fine-grained access control', 'Database, table, column, row and cell-level permissions enforced across Athena, Redshift Spectrum, EMR, Glue, QuickSight.'],
      ['Tag-based access (LF-TBAC)', 'Assign LF-tags to data and grant permissions on tags; scales across many tables.'],
      ['Cross-account sharing', 'Share catalog tables with other accounts without copying data.'],
      ['Blueprints', 'Templates to ingest from databases and logs into the lake.']
    ]}
  ],
  tips: [
    'Serverless ETL / convert formats / catalog data -> Glue.',
    'Discover schemas in S3 automatically -> Glue crawler.',
    'Avoid reprocessing old data in incremental ETL -> job bookmarks.',
    'Column/row-level security across analytics services in a data lake -> Lake Formation.',
    'No-code data preparation for analysts -> Glue DataBrew.'
  ],
  q: [
    { q: 'A company needs to transform CSV files in S3 into Parquet on a daily schedule without managing servers. What should be used?', o: ['AWS Glue ETL job', 'Amazon EMR on EC2', 'Lambda with 15-minute timeout for 1 TB', 'AWS DataSync'], a: 0, e: 'Glue provides serverless Spark ETL jobs that can be scheduled.', d: 3 },
    { q: 'A data lake must restrict analysts so they can only see certain columns and rows of tables when querying with Athena and Redshift Spectrum. What should be used?', o: ['S3 bucket policies', 'AWS Lake Formation fine-grained permissions', 'IAM policies on Glue', 'KMS key policies'], a: 1, e: 'Lake Formation provides column-, row- and cell-level security enforced across integrated analytics services.', d: 1 },
    { q: 'A daily Glue job reprocesses all files in S3 every run, wasting time and money. Only new files should be processed. What should be enabled?', o: ['Glue job bookmarks', 'S3 versioning', 'Glue crawler schedule', 'Athena workgroups'], a: 0, e: 'Job bookmarks track previously processed data.', d: 4 },
    { q: 'New datasets arrive in S3 with changing schemas. Analysts need table definitions available in Athena automatically. What should be used?', o: ['AWS Glue crawler updating the Data Catalog', 'Manual CREATE TABLE statements', 'S3 Inventory', 'Amazon Macie'], a: 0, e: 'Crawlers infer schemas and keep the Data Catalog up to date for Athena.', d: 3 }
  ]
});

svc({
  id: 'redshift', name: 'Amazon Redshift', cat: 'analytics', imp: 3,
  tag: 'Petabyte-scale columnar data warehouse (OLAP): clusters, Serverless, Spectrum, snapshots, data sharing.',
  s: [
    { h: 'Fundamentals', i: [
      ['What', 'Massively parallel processing (MPP), columnar storage data warehouse based on PostgreSQL. For OLAP / BI / complex analytical queries, not OLTP.'],
      ['Architecture', 'Leader node (query planning, aggregation) + compute nodes. RA3 nodes separate compute and managed storage (scale independently).'],
      ['Redshift Serverless', 'Automatically provisions and scales capacity; pay for usage. Intermittent or unpredictable analytics.'],
      ['Loading data', 'COPY command from S3 (parallel, best), Firehose, DMS, zero-ETL integrations from Aurora/RDS/DynamoDB.'],
      ['Distribution and sort keys', 'Distribution style (KEY, EVEN, ALL, AUTO) and sort keys optimize performance.']
    ]},
    { h: 'Features', i: [
      ['Redshift Spectrum', 'Query data directly in S3 (exabytes) from Redshift without loading; join with local tables.'],
      ['Concurrency Scaling', 'Automatically adds transient capacity for bursts of concurrent queries.'],
      ['Workload Management (WLM)', 'Queues to prioritize queries (short vs long).'],
      ['Materialized views / result caching', 'Speed up repeated queries.'],
      ['Data sharing', 'Share live data across clusters and accounts without copying.'],
      ['Federated query', 'Query live data in RDS/Aurora PostgreSQL and MySQL.'],
      ['Redshift ML', 'Create ML models with SQL (SageMaker under the hood).']
    ]},
    { h: 'Availability, backup, security', i: [
      ['Snapshots', 'Automated (every 8 hours or 5 GB, retention 1-35 days) and manual snapshots to S3; restore creates a new cluster.'],
      ['Cross-region snapshot copy', 'Automatically copy snapshots to another region for DR (KMS snapshot copy grant for encrypted clusters).'],
      ['Multi-AZ', 'RA3 clusters support Multi-AZ deployment; otherwise single AZ.'],
      ['Enhanced VPC routing', 'Force COPY/UNLOAD traffic through your VPC (VPC endpoints, NAT) instead of the internet.'],
      ['Encryption', 'KMS or HSM; audit logging to S3/CloudWatch.']
    ]}
  ],
  tips: [
    'Data warehouse / complex analytical queries / BI on structured data -> Redshift.',
    'Query S3 data from Redshift without loading -> Redshift Spectrum.',
    'Intermittent analytics without managing clusters -> Redshift Serverless.',
    'DR for Redshift -> cross-region snapshot copy.',
    'COPY/UNLOAD must not traverse the internet -> enhanced VPC routing.',
    'Burst of concurrent BI users -> Concurrency Scaling.'
  ],
  q: [
    { q: 'A company needs to run complex SQL analytics with joins and aggregations over petabytes of structured historical sales data for BI dashboards. Which service is MOST suitable?', o: ['Amazon RDS for PostgreSQL', 'Amazon Redshift', 'Amazon DynamoDB', 'Amazon ElastiCache'], a: 1, e: 'Redshift is a columnar MPP data warehouse designed for OLAP at petabyte scale.', d: 3 },
    { q: 'Analysts using Redshift need to query rarely used historical data stored in S3 without loading it into the cluster. What should be used?', o: ['Redshift Spectrum', 'S3 Select', 'COPY command', 'Glue DataBrew'], a: 0, e: 'Spectrum queries external tables in S3 directly and joins them with Redshift data.', d: 4 },
    { q: 'A company needs to be able to restore its Redshift data warehouse in another region if the primary region fails. What should be configured?', o: ['Multi-AZ RDS', 'Cross-region snapshot copy for the Redshift cluster', 'S3 Cross-Region Replication for the cluster', 'Enhanced VPC routing'], a: 1, e: 'Redshift can automatically copy snapshots to another region for DR.', d: 2 },
    { q: 'A security requirement states that Redshift COPY and UNLOAD traffic to S3 must stay within the VPC. What should be enabled?', o: ['Enhanced VPC routing', 'Concurrency Scaling', 'Spectrum', 'Data sharing'], a: 0, e: 'Enhanced VPC routing forces traffic through the VPC so you can use endpoints and controls.', d: 1 }
  ]
});

svc({
  id: 'emr', name: 'Amazon EMR', cat: 'analytics', imp: 2,
  tag: 'Managed big data frameworks (Spark, Hadoop, Hive, Presto, HBase, Flink) on EC2, EKS or Serverless.',
  s: [
    { h: 'Fundamentals', i: [
      ['What', 'Managed clusters for big data processing, ML and ETL using open-source frameworks. Petabyte-scale.'],
      ['Node types', 'Primary (master) node: coordinates. Core nodes: run tasks and store HDFS data (long-running). Task nodes: compute only, no HDFS: ideal for Spot.'],
      ['Storage', 'HDFS (ephemeral, on cluster) or EMRFS on S3 (durable, decoupled; cluster can be terminated).'],
      ['Deployment options', 'EMR on EC2, EMR on EKS, EMR Serverless (no cluster management).']
    ]},
    { h: 'Cost and operations', i: [
      ['Purchasing', 'On-Demand/Reserved for primary and core, Spot for task nodes. Instance fleets with multiple instance types.'],
      ['Transient vs long-running', 'Transient clusters terminate after the job (cheaper, data in S3). Long-running for interactive/persistent workloads.'],
      ['Managed scaling', 'Automatically resize cluster based on workload.'],
      ['Security', 'IAM roles, security configurations (encryption at rest/in transit), Kerberos, Lake Formation integration, private subnets.']
    ]}
  ],
  tips: [
    'Existing Hadoop/Spark jobs, big data processing with control over frameworks -> EMR.',
    'Cheapest EMR -> Spot for task nodes, transient clusters with data in S3.',
    'No cluster management for Spark/Hive -> EMR Serverless (or Glue for ETL).'
  ],
  q: [
    { q: 'A company is migrating on-premises Hadoop and Spark jobs to AWS with minimal code changes. Which service should be used?', o: ['Amazon EMR', 'AWS Glue DataBrew', 'Amazon Athena', 'Amazon Redshift'], a: 0, e: 'EMR runs Hadoop, Spark and other open-source frameworks as a managed service.', d: 3 },
    { q: 'To reduce the cost of an EMR cluster that runs fault-tolerant batch jobs, which nodes are BEST suited for Spot Instances?', o: ['Primary node', 'Core nodes storing HDFS data', 'Task nodes', 'All nodes'], a: 2, e: 'Task nodes do not store HDFS data, so interruption only loses compute progress.', d: 4 },
    { q: 'A nightly EMR job processes data and the cluster sits idle the rest of the day. How can cost be minimized?', o: ['Use transient clusters that store data in S3 (EMRFS) and terminate after the job', 'Use Reserved Instances for all nodes', 'Increase core nodes', 'Use HDFS for persistence'], a: 0, e: 'Transient clusters with S3 storage avoid paying for idle clusters.', d: 4 }
  ]
});

svc({
  id: 'opensearch', name: 'OpenSearch, QuickSight & Other Analytics', cat: 'analytics', imp: 2,
  tag: 'Search and log analytics with OpenSearch; BI dashboards with QuickSight; data sharing and SaaS ingestion services.',
  s: [
    { h: 'Amazon OpenSearch Service', i: [
      ['What', 'Managed OpenSearch (Elasticsearch fork): full-text search, log analytics, real-time application monitoring, OpenSearch Dashboards (Kibana).'],
      ['Deployment', 'Managed clusters (data nodes, dedicated master nodes, Multi-AZ with standby) or OpenSearch Serverless.'],
      ['Ingestion', 'Firehose, CloudWatch Logs subscriptions, OpenSearch Ingestion (Data Prepper), IoT, Lambda from DynamoDB Streams.'],
      ['Storage tiers', 'Hot, UltraWarm (S3-backed, cheaper), cold storage.'],
      ['Search on DynamoDB', 'Common pattern: DynamoDB as primary store, stream changes to OpenSearch for full-text search (zero-ETL integration).'],
      ['Security', 'VPC access, fine-grained access control, Cognito/SAML auth for Dashboards, KMS.']
    ]},
    { h: 'Amazon QuickSight', i: [
      ['What', 'Serverless BI service: interactive dashboards, embedded analytics, ML insights, natural-language Q (Amazon Q in QuickSight).'],
      ['Sources', 'Athena, Redshift, RDS/Aurora, S3, OpenSearch, Salesforce, Excel, on-prem databases.'],
      ['SPICE', 'In-memory engine for fast dashboards.'],
      ['Security', 'Row-level and column-level security; users and groups; pay-per-session pricing for readers.']
    ]},
    { h: 'Other analytics services', i: [
      ['AWS Data Exchange', 'Find, subscribe to and use third-party data sets in the cloud.'],
      ['Amazon AppFlow', 'No-code data flows from SaaS (Salesforce, SAP, Zendesk) to S3/Redshift.'],
      ['Amazon DataZone / SageMaker Unified Studio', 'Data catalog, governance and sharing across an organization.'],
      ['Typical pipeline', 'Ingest (Kinesis/Firehose/DMS/AppFlow) -> store (S3 data lake) -> catalog (Glue) -> transform (Glue/EMR) -> query (Athena/Redshift) -> visualize (QuickSight).']
    ]}
  ],
  tips: [
    'Full-text search, log analytics with dashboards -> OpenSearch.',
    'Search on DynamoDB data -> DynamoDB Streams / zero-ETL -> OpenSearch.',
    'Serverless BI dashboards / visualizations -> QuickSight.',
    'Buy third-party datasets -> Data Exchange.'
  ],
  q: [
    { q: 'An e-commerce site stores products in DynamoDB and needs full-text search with fuzzy matching across product descriptions. What should be added?', o: ['DynamoDB Scan with filters', 'Amazon OpenSearch Service fed by DynamoDB Streams or zero-ETL integration', 'Amazon Athena', 'ElastiCache'], a: 1, e: 'OpenSearch provides full-text search; DynamoDB changes are streamed to keep the index updated.', d: 3 },
    { q: 'Business users need interactive dashboards on data in Redshift and Athena without managing BI servers. Which service should be used?', o: ['Amazon QuickSight', 'Amazon OpenSearch Dashboards', 'Amazon Managed Grafana', 'AWS Glue Studio'], a: 0, e: 'QuickSight is a serverless BI service that connects to Redshift, Athena and more.', d: 3 },
    { q: 'A company wants to analyze application logs in near real time with search and visualization. Logs are generated in CloudWatch Logs. What is the BEST solution?', o: ['Export logs to S3 daily and use Athena', 'Subscribe CloudWatch Logs to OpenSearch Service (via subscription filter/Firehose) and use OpenSearch Dashboards', 'Use AWS Config', 'Use Redshift Spectrum'], a: 1, e: 'Subscription filters stream logs to OpenSearch for near-real-time search and visualization.', d: 3 }
  ]
});

svc({
  id: 'ai-ml', name: 'AI & Machine Learning Services', cat: 'analytics', imp: 2,
  tag: 'Pre-trained AI services to recognize by use case, plus SageMaker and Bedrock for custom and generative AI.',
  s: [
    { h: 'Vision, speech and language', i: [
      ['Amazon Rekognition', 'Image and video analysis: objects, faces, celebrity recognition, text in images, content moderation, PPE detection.'],
      ['Amazon Textract', 'Extract text, forms and tables from scanned documents (OCR+).'],
      ['Amazon Transcribe', 'Speech to text (with PII redaction, custom vocabulary, medical).'],
      ['Amazon Polly', 'Text to lifelike speech (SSML, lexicons).'],
      ['Amazon Translate', 'Neural machine translation between languages.'],
      ['Amazon Comprehend', 'NLP: sentiment, entities, key phrases, language detection, topic modeling, PII detection (Comprehend Medical for health text).'],
      ['Amazon Lex', 'Build conversational chatbots (voice/text), same tech as Alexa; integrates with Amazon Connect (contact center).']
    ]},
    { h: 'Search, recommendations and forecasting', i: [
      ['Amazon Kendra', 'Intelligent enterprise document search with natural language questions across many sources.'],
      ['Amazon Personalize', 'Real-time personalized recommendations (same tech as amazon.com).'],
      ['Amazon Forecast', 'Time series forecasting (demand, inventory). Note: closed to new customers; SageMaker Canvas recommended.'],
      ['Amazon Fraud Detector', 'Detect online fraud (fake accounts, payment fraud).'],
      ['Amazon Augmented AI (A2I)', 'Human review workflows for low-confidence ML predictions.']
    ]},
    { h: 'Platforms', i: [
      ['Amazon SageMaker AI', 'Build, train, tune and deploy custom ML models: notebooks, training jobs, endpoints, Ground Truth labeling, Canvas (no-code), Feature Store, Model Monitor.'],
      ['Amazon Bedrock', 'Serverless access to foundation models (Anthropic Claude, Amazon Nova/Titan, Llama, etc.) via API; knowledge bases (RAG), agents, guardrails, fine-tuning.'],
      ['Amazon Q', 'Generative AI assistant for business (Q Business) and developers (Q Developer).']
    ]}
  ],
  tips: [
    'Faces / objects / moderation in images or video -> Rekognition. Text from scanned forms -> Textract.',
    'Speech-to-text -> Transcribe. Text-to-speech -> Polly. Translation -> Translate.',
    'Sentiment / entities in text -> Comprehend. Chatbot -> Lex. Contact center -> Connect.',
    'Document search with natural language -> Kendra. Recommendations -> Personalize.',
    'Custom model training -> SageMaker. Generative AI with foundation models -> Bedrock.'
  ],
  q: [
    { q: 'A company needs to automatically detect inappropriate content in images uploaded by users. Which service should be used?', o: ['Amazon Comprehend', 'Amazon Rekognition', 'Amazon Textract', 'Amazon Polly'], a: 1, e: 'Rekognition provides image and video content moderation.', d: 3 },
    { q: 'A company wants to analyze customer reviews to determine whether they are positive or negative. Which service fits?', o: ['Amazon Comprehend', 'Amazon Lex', 'Amazon Translate', 'Amazon Kendra'], a: 0, e: 'Comprehend performs sentiment analysis on text.', d: 3 },
    { q: 'An insurance company needs to extract data from scanned claim forms including tables and key-value pairs. Which service should be used?', o: ['Amazon Rekognition', 'Amazon Textract', 'Amazon Transcribe', 'Amazon Comprehend'], a: 1, e: 'Textract extracts text, forms and tables from documents.', d: 3 },
    { q: 'A call center wants to convert recorded calls to text and then detect customer sentiment. Which combination should be used?', o: ['Polly and Lex', 'Transcribe and Comprehend', 'Textract and Translate', 'Rekognition and Kendra'], a: 1, e: 'Transcribe converts speech to text, and Comprehend analyzes sentiment.', d: 3 },
    { q: 'A company wants to build a generative AI application using foundation models through an API without managing infrastructure or training models. Which service should be used?', o: ['Amazon SageMaker training jobs', 'Amazon Bedrock', 'Amazon Personalize', 'Amazon Lex'], a: 1, e: 'Bedrock provides serverless API access to foundation models with RAG, agents and guardrails.', d: 3 }
  ]
});
