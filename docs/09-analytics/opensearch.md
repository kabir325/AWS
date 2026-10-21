# OpenSearch, QuickSight & Other Analytics

> Search and log analytics with OpenSearch; BI dashboards with QuickSight; data sharing and SaaS ingestion services.

Category: **Analytics & Machine Learning** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Amazon OpenSearch Service](#amazon-opensearch-service)
- [Amazon QuickSight](#amazon-quicksight)
- [Other analytics services](#other-analytics-services)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Amazon OpenSearch Service

- **What** - Managed OpenSearch (Elasticsearch fork): full-text search, log analytics, real-time application monitoring, OpenSearch Dashboards (Kibana).
- **Deployment** - Managed clusters (data nodes, dedicated master nodes, Multi-AZ with standby) or OpenSearch Serverless.
- **Ingestion** - Firehose, CloudWatch Logs subscriptions, OpenSearch Ingestion (Data Prepper), IoT, Lambda from DynamoDB Streams.
- **Storage tiers** - Hot, UltraWarm (S3-backed, cheaper), cold storage.
- **Search on DynamoDB** - Common pattern: DynamoDB as primary store, stream changes to OpenSearch for full-text search (zero-ETL integration).
- **Security** - VPC access, fine-grained access control, Cognito/SAML auth for Dashboards, KMS.

## Amazon QuickSight

- **What** - Serverless BI service: interactive dashboards, embedded analytics, ML insights, natural-language Q (Amazon Q in QuickSight).
- **Sources** - Athena, Redshift, RDS/Aurora, S3, OpenSearch, Salesforce, Excel, on-prem databases.
- **SPICE** - In-memory engine for fast dashboards.
- **Security** - Row-level and column-level security; users and groups; pay-per-session pricing for readers.

## Other analytics services

- **AWS Data Exchange** - Find, subscribe to and use third-party data sets in the cloud.
- **Amazon AppFlow** - No-code data flows from SaaS (Salesforce, SAP, Zendesk) to S3/Redshift.
- **Amazon DataZone / SageMaker Unified Studio** - Data catalog, governance and sharing across an organization.
- **Typical pipeline** - Ingest (Kinesis/Firehose/DMS/AppFlow) -> store (S3 data lake) -> catalog (Glue) -> transform (Glue/EMR) -> query (Athena/Redshift) -> visualize (QuickSight).

## Exam tips

- Full-text search, log analytics with dashboards -> OpenSearch.
- Search on DynamoDB data -> DynamoDB Streams / zero-ETL -> OpenSearch.
- Serverless BI dashboards / visualizations -> QuickSight.
- Buy third-party datasets -> Data Exchange.

## Practice questions

**Q1.** An e-commerce site stores products in DynamoDB and needs full-text search with fuzzy matching across product descriptions. What should be added?

- A. DynamoDB Scan with filters
- B. Amazon OpenSearch Service fed by DynamoDB Streams or zero-ETL integration
- C. Amazon Athena
- D. ElastiCache

<details><summary>Answer</summary>

**B** - OpenSearch provides full-text search; DynamoDB changes are streamed to keep the index updated.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** Business users need interactive dashboards on data in Redshift and Athena without managing BI servers. Which service should be used?

- A. Amazon QuickSight
- B. Amazon OpenSearch Dashboards
- C. Amazon Managed Grafana
- D. AWS Glue Studio

<details><summary>Answer</summary>

**A** - QuickSight is a serverless BI service that connects to Redshift, Athena and more.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** A company wants to analyze application logs in near real time with search and visualization. Logs are generated in CloudWatch Logs. What is the BEST solution?

- A. Export logs to S3 daily and use Athena
- B. Subscribe CloudWatch Logs to OpenSearch Service (via subscription filter/Firehose) and use OpenSearch Dashboards
- C. Use AWS Config
- D. Use Redshift Spectrum

<details><summary>Answer</summary>

**B** - Subscription filters stream logs to OpenSearch for near-real-time search and visualization.

_Domain: Design High-Performing Architectures_

</details>
