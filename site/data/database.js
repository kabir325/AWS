svc({
  id: 'rds', name: 'Amazon RDS', cat: 'database', imp: 3,
  tag: 'Managed relational databases: Multi-AZ, read replicas, backups, encryption, RDS Proxy and scaling.',
  s: [
    { h: 'Fundamentals', i: [
      ['Engines', 'MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, IBM Db2 (plus Aurora, covered separately).'],
      ['Managed by AWS', 'Provisioning, OS and engine patching, automated backups, monitoring, Multi-AZ failover. No SSH access (except RDS Custom).'],
      ['RDS Custom', 'For Oracle and SQL Server when you need OS / database customization and access to the underlying instance.'],
      ['Storage', 'EBS-based (gp3, io1/io2). Storage Auto Scaling grows storage automatically when free space is low (set a max threshold).'],
      ['Scaling', 'Vertical: change instance class (brief downtime, can be applied in maintenance window). Horizontal reads: read replicas.']
    ]},
    { h: 'High availability: Multi-AZ', i: [
      ['Multi-AZ instance deployment', 'Synchronous replication to a standby in another AZ. Standby is NOT readable. Automatic failover (60-120 s) by flipping the DNS endpoint. For HA, not for scaling.'],
      ['Multi-AZ DB cluster deployment', 'One writer + two readable standbys in three AZs (MySQL/PostgreSQL). Faster failover (~35 s) and reader endpoint.'],
      ['Failover triggers', 'AZ outage, primary failure, instance type change, OS patching, manual reboot with failover.'],
      ['Converting', 'Single-AZ to Multi-AZ is a zero-downtime modify operation (snapshot + restore to standby behind the scenes).']
    ]},
    { h: 'Read replicas', i: [
      ['Purpose', 'Scale read-heavy workloads (reporting, analytics). Up to 15 replicas (MySQL, MariaDB, PostgreSQL; fewer for Oracle/SQL Server).'],
      ['Replication', 'Asynchronous -> eventually consistent reads. Application must use the replica endpoint.'],
      ['Placement', 'Same AZ, cross-AZ or cross-region. Cross-region replicas for DR and local reads (cross-region data transfer charged; same-region replication free).'],
      ['Promotion', 'Can be promoted to a standalone DB (breaks replication). Used in DR.'],
      ['Replica can be Multi-AZ', 'Read replicas themselves can be configured Multi-AZ.']
    ]},
    { h: 'Backups and restore', i: [
      ['Automated backups', 'Daily snapshot + transaction logs; point-in-time restore to any second within retention (1-35 days; 0 disables). Deleted with the instance unless retained.'],
      ['Manual snapshots', 'Kept until you delete them. Copy cross-region / share cross-account.'],
      ['Restore', 'Always creates a NEW DB instance with a new endpoint.'],
      ['Cost tip', 'For a DB used only a few hours a month, snapshot and delete it instead of stopping (stopped DBs restart automatically after 7 days).']
    ]},
    { h: 'Security', i: [
      ['Network', 'Deploy in private subnets (DB subnet group); control access with security groups.'],
      ['Encryption at rest', 'KMS, chosen at creation. Encrypts storage, backups, snapshots, replicas. To encrypt an unencrypted DB: snapshot -> copy snapshot encrypted -> restore.'],
      ['Encryption in transit', 'SSL/TLS; enforce with parameters (rds.force_ssl for PostgreSQL / SQL Server, require_secure_transport for MySQL).'],
      ['IAM DB authentication', 'MySQL/PostgreSQL: authenticate with a short-lived token from IAM instead of a password.'],
      ['Secrets Manager', 'Store and automatically rotate DB credentials (native integration).'],
      ['Audit', 'Engine logs to CloudWatch Logs; Database Activity Streams (Oracle, SQL Server, Aurora).']
    ]},
    { h: 'RDS Proxy and monitoring', i: [
      ['RDS Proxy', 'Fully managed connection pool: reduces DB connections (great for Lambda), cuts failover time by up to 66%, enforces IAM auth and Secrets Manager. Not publicly accessible (VPC only).'],
      ['Enhanced Monitoring', 'OS-level metrics (processes, memory) at up to 1 s granularity.'],
      ['Performance Insights', 'Visualize database load and top SQL waits.'],
      ['Event notifications', 'RDS events (failover, backup) via EventBridge/SNS.']
    ]}
  ],
  tips: [
    'High availability / automatic failover -> Multi-AZ. Scale reads -> read replicas. They solve different problems.',
    'Multi-AZ standby cannot serve reads (instance deployment). Multi-AZ DB cluster has readable standbys.',
    'Cross-region DR for RDS -> cross-region read replica (promote on disaster) or snapshot copy.',
    'Encrypting an existing unencrypted RDS -> snapshot, encrypted copy, restore.',
    'Too many connections from Lambda -> RDS Proxy.',
    'Need OS access to Oracle/SQL Server -> RDS Custom; otherwise self-managed on EC2.',
    'Reporting queries slow down the production DB -> send them to a read replica.'
  ],
  q: [
    { q: 'A company needs its RDS for MySQL database to automatically fail over to another AZ with minimal data loss if the primary fails. What should be configured?', o: ['A read replica in another AZ', 'Multi-AZ deployment', 'Automated backups with 35-day retention', 'RDS Proxy'], a: 1, e: 'Multi-AZ maintains a synchronous standby and performs automatic failover.', d: 2 },
    { q: 'Reporting queries are slowing down the production RDS PostgreSQL database. What is the MOST appropriate solution?', o: ['Enable Multi-AZ and point reports at the standby', 'Create a read replica and point reporting to the replica endpoint', 'Increase backup retention', 'Enable storage auto scaling'], a: 1, e: 'Read replicas offload read traffic. A Multi-AZ instance standby is not readable.', d: 3 },
    { q: 'A company has an unencrypted RDS instance and must encrypt it at rest. What should be done?', o: ['Modify the instance and enable encryption', 'Take a snapshot, copy it with encryption, restore a new instance from the encrypted snapshot', 'Enable TLS', 'Create an encrypted read replica of the unencrypted instance'], a: 1, e: 'Encryption at rest can only be set at creation. Use an encrypted snapshot copy to restore an encrypted instance.', d: 1 },
    { q: 'A company wants a disaster recovery copy of its RDS MySQL database in another region with an RPO of minutes and the ability to promote it quickly. What should it use?', o: ['Multi-AZ deployment', 'Cross-region read replica', 'Daily manual snapshots copied cross-region', 'Storage auto scaling'], a: 1, e: 'Cross-region read replicas asynchronously replicate (seconds to minutes lag) and can be promoted to standalone.', d: 2 },
    { q: 'Database credentials for RDS must be rotated automatically every 30 days without application changes beyond fetching the secret at runtime. What should be used?', o: ['SSM Parameter Store standard parameters', 'AWS Secrets Manager with rotation enabled', 'KMS key rotation', 'IAM access key rotation'], a: 1, e: 'Secrets Manager has native RDS integration with automatic rotation via managed Lambda functions.', d: 1 },
    { q: 'A development database is used only during two days each month. How can costs be minimized?', o: ['Stop the instance between uses', 'Take a snapshot and delete the instance; restore when needed', 'Use a Multi-AZ deployment', 'Purchase a Reserved Instance'], a: 1, e: 'Stopped RDS instances automatically start after 7 days and still incur storage costs. Snapshot + delete is cheapest for rare usage.', d: 4 },
    { q: 'Which statements about RDS Multi-AZ (instance deployment) are correct? (Choose TWO)', o: ['Replication to the standby is synchronous', 'The standby can serve read traffic', 'Failover is automatic and the endpoint DNS stays the same', 'It replaces the need for read replicas for scaling reads', 'Replication is asynchronous'], a: [0, 2], e: 'Multi-AZ uses synchronous replication and automatic failover with the same endpoint. The standby is passive.', d: 2 }
  ]
});

svc({
  id: 'aurora', name: 'Amazon Aurora', cat: 'database', imp: 3,
  tag: 'Cloud-native MySQL/PostgreSQL-compatible database: 6-way replicated storage, 15 replicas, Global Database, Serverless v2.',
  s: [
    { h: 'Architecture', i: [
      ['Compatibility', 'MySQL and PostgreSQL compatible; up to 5x MySQL / 3x PostgreSQL performance.'],
      ['Storage', 'Shared cluster volume, 6 copies across 3 AZs (4/6 needed for writes, 3/6 for reads), self-healing, auto-grows in 10 GB increments up to 128 TiB.'],
      ['Replicas', 'Up to 15 Aurora Replicas sharing the same storage (replica lag typically < 10-20 ms). Any replica can be promoted.'],
      ['Failover', 'Automatic failover to a replica usually in under 30 seconds; set failover priority tiers.'],
      ['Cost', 'About 20% more than RDS per instance but more efficient; pay for storage used and I/O (or Aurora I/O-Optimized for I/O-heavy workloads with no I/O charges).']
    ]},
    { h: 'Endpoints', i: [
      ['Cluster (writer) endpoint', 'Always points to the current primary.'],
      ['Reader endpoint', 'Load-balances connections across replicas (connection-level).'],
      ['Custom endpoints', 'Subset of instances, e.g. larger replicas for analytics queries.'],
      ['Instance endpoints', 'Specific instance; rarely recommended.']
    ]},
    { h: 'Advanced features', i: [
      ['Aurora Replicas Auto Scaling', 'Add/remove replicas based on CPU or connections.'],
      ['Aurora Serverless v2', 'Scales capacity in fine-grained ACUs in seconds; for variable, unpredictable or intermittent workloads; can mix with provisioned instances.'],
      ['Aurora Global Database', 'One primary region + up to 5 (now 10) secondary read-only regions with storage-level replication < 1 second. Promote a secondary in about a minute (RTO < 1 min). Write forwarding optional.'],
      ['Backtrack (MySQL)', 'Rewind the cluster to a point in time in place, without restoring from backup.'],
      ['Cloning', 'Copy-on-write clone created in minutes; ideal for test/staging from production.'],
      ['Aurora ML', 'Call SageMaker / Bedrock / Comprehend from SQL.'],
      ['Zero-ETL to Redshift', 'Near-real-time replication of Aurora data into Redshift for analytics.'],
      ['Aurora DSQL / Limitless', 'Newer distributed options for multi-region active-active and horizontal write scaling (awareness only).']
    ]},
    { h: 'Security and backups', i: [
      ['Same as RDS', 'KMS encryption at rest (set at creation), TLS, security groups, IAM auth, Secrets Manager.'],
      ['Backups', 'Continuous automated backups with PITR (1-35 days); manual snapshots; Database Activity Streams for auditing.']
    ]}
  ],
  tips: [
    'Need MySQL/PostgreSQL with highest availability and performance -> Aurora.',
    'Cross-region DR with RPO ~1 s and RTO ~1 min, or global low-latency reads -> Aurora Global Database.',
    'Unpredictable / intermittent DB load -> Aurora Serverless v2.',
    'Test environment from production data quickly -> Aurora cloning.',
    'Undo a bad change fast without restore -> Backtrack (Aurora MySQL).',
    'Analytics queries on separate replicas -> custom endpoint.'
  ],
  q: [
    { q: 'A global application needs a relational database with read latency under a second in multiple regions and the ability to recover from a regional outage in about one minute. Which solution fits?', o: ['RDS MySQL with cross-region read replicas', 'Aurora Global Database', 'DynamoDB global tables', 'Aurora Multi-AZ in one region'], a: 1, e: 'Aurora Global Database replicates storage across regions in under a second and supports promotion with RTO around one minute.', d: 2 },
    { q: 'A new application has unpredictable, spiky database usage with long idle periods. The team wants a MySQL-compatible database that scales automatically. Which option is BEST?', o: ['Aurora Serverless v2', 'RDS MySQL with Multi-AZ', 'Provisioned Aurora with 15 replicas', 'MySQL on EC2'], a: 0, e: 'Aurora Serverless v2 scales capacity automatically in fine increments according to demand.', d: 4 },
    { q: 'Analysts run heavy queries that should not affect the replicas used by the application. How can this be done in Aurora?', o: ['Use the reader endpoint for all traffic', 'Create a custom endpoint pointing to dedicated larger replicas for analytics', 'Use the cluster endpoint', 'Enable Backtrack'], a: 1, e: 'Custom endpoints route connections to a defined subset of instances.', d: 3 },
    { q: 'How many copies of data does Aurora maintain and across how many AZs?', o: ['2 copies across 2 AZs', '3 copies across 3 AZs', '6 copies across 3 AZs', '6 copies across 6 AZs'], a: 2, e: 'Aurora storage keeps six copies of data across three AZs.', d: 2 },
    { q: 'A developer needs a full copy of a 5 TB production Aurora database for testing, created quickly and cost-effectively. What should be used?', o: ['Restore from a snapshot', 'Aurora cloning', 'AWS DMS full load', 'mysqldump'], a: 1, e: 'Aurora clones use copy-on-write and are created in minutes without copying all the data up front.', d: 4 }
  ]
});

svc({
  id: 'dynamodb', name: 'Amazon DynamoDB', cat: 'database', imp: 3,
  tag: 'Serverless key-value / document NoSQL with single-digit ms latency: keys, indexes, capacity modes, DAX, streams, global tables.',
  s: [
    { h: 'Data model', i: [
      ['Tables, items, attributes', 'Schemaless items up to 400 KB. Table needs a primary key.'],
      ['Partition key', 'Simple primary key; hashed to distribute data. Choose high-cardinality keys to avoid hot partitions.'],
      ['Partition + sort key', 'Composite primary key; items with the same partition key are sorted by sort key, enabling range queries.'],
      ['Query vs Scan', 'Query uses keys (efficient). Scan reads the whole table (expensive); avoid.'],
      ['Large items', 'Store large objects in S3 and keep the S3 key in DynamoDB.']
    ]},
    { h: 'Capacity modes', i: [
      ['On-demand', 'Pay per request, instantly accommodates traffic, no planning. Unpredictable or new workloads.'],
      ['Provisioned', 'Specify RCU/WCU, optionally with auto scaling. Cheaper for predictable traffic; reserved capacity available.'],
      ['RCU', '1 strongly consistent read/s or 2 eventually consistent reads/s of up to 4 KB. Transactional read = 2 RCU.'],
      ['WCU', '1 write/s of up to 1 KB. Transactional write = 2 WCU.'],
      ['Throttling', 'ProvisionedThroughputExceededException; fix with better keys, auto scaling, on-demand, or DAX for reads.']
    ]},
    { h: 'Indexes', i: [
      ['Global Secondary Index (GSI)', 'Different partition and sort key; can be added any time; own capacity; eventually consistent only. Up to 20 per table.'],
      ['Local Secondary Index (LSI)', 'Same partition key, different sort key; must be created with the table; supports strong consistency. Up to 5.'],
      ['Projection', 'Choose which attributes are copied into the index (keys only, include, all).']
    ]},
    { h: 'Features', i: [
      ['DAX', 'In-memory write-through cache for DynamoDB: microsecond reads, API compatible, no app logic changes. Good for read-heavy, hot keys.'],
      ['DynamoDB Streams', 'Ordered item-level change log (24 h retention) consumed by Lambda: triggers, replication, aggregations. Kinesis Data Streams option for longer retention.'],
      ['Global tables', 'Multi-region, multi-active (read/write everywhere) replication; requires Streams. Low-latency global access and DR. Multi-region strong consistency now available.'],
      ['TTL', 'Expire items automatically at a timestamp attribute (no WCU cost): sessions, temporary data.'],
      ['Transactions', 'ACID across multiple items/tables (TransactWriteItems / TransactGetItems).'],
      ['Conditional writes', 'Optimistic locking and prevent overwrites.'],
      ['PartiQL', 'SQL-compatible query language.']
    ]},
    { h: 'Backup, security and integration', i: [
      ['Point-in-time recovery (PITR)', 'Continuous backups, restore to any second in the last 35 days (configurable 1-35) into a new table.'],
      ['On-demand backups', 'Full backups retained until deleted; also via AWS Backup (cross-region, cold storage).'],
      ['Export to S3', 'Export from PITR without consuming capacity; query with Athena. Import from S3 into a new table.'],
      ['Security', 'IAM fine-grained access (condition dynamodb:LeadingKeys for per-user rows), encryption at rest by default (AWS owned, AWS managed, or customer managed KMS keys), gateway VPC endpoint.'],
      ['Table classes', 'Standard and Standard-IA (lower storage cost for rarely accessed tables).']
    ]}
  ],
  tips: [
    'Serverless, millisecond latency at any scale, key-value or session data -> DynamoDB.',
    'Microsecond read latency on DynamoDB with no code change -> DAX (ElastiCache needs app changes).',
    'React to item changes -> DynamoDB Streams + Lambda.',
    'Multi-region active-active writes -> global tables.',
    'Unpredictable traffic -> on-demand. Steady predictable traffic -> provisioned with auto scaling (cheaper).',
    'Automatically delete old sessions -> TTL.',
    'Need a different query pattern after table creation -> GSI (LSI only at creation).'
  ],
  q: [
    { q: 'An application needs microsecond read latency for frequently accessed DynamoDB items without changing application logic significantly. What should be used?', o: ['ElastiCache for Redis', 'DynamoDB Accelerator (DAX)', 'Add a GSI', 'Switch to on-demand capacity'], a: 1, e: 'DAX is an API-compatible in-memory cache for DynamoDB delivering microsecond reads.', d: 3 },
    { q: 'A company needs to send a welcome email whenever a new user item is inserted into a DynamoDB table. What is the MOST efficient serverless design?', o: ['Scan the table every minute with Lambda', 'Enable DynamoDB Streams and trigger a Lambda function', 'Use DynamoDB TTL', 'Create a GSI on the email attribute'], a: 1, e: 'Streams capture item-level changes and can invoke Lambda for each new insert.', d: 3 },
    { q: 'A new mobile game has completely unpredictable traffic that may spike suddenly. Which DynamoDB capacity mode should be used?', o: ['Provisioned without auto scaling', 'Provisioned with reserved capacity', 'On-demand', 'Provisioned with DAX'], a: 2, e: 'On-demand mode instantly adapts to traffic without capacity planning.', d: 3 },
    { q: 'A company needs users in North America, Europe and Asia to both read and write to the same DynamoDB data with low latency. What should be used?', o: ['DynamoDB global tables', 'Cross-region read replicas', 'DAX clusters in each region', 'DynamoDB Streams to S3'], a: 0, e: 'Global tables provide multi-region, multi-active replication with local read/write.', d: 3 },
    { q: 'Session data stored in DynamoDB should be removed automatically 24 hours after creation at no extra cost. What should be used?', o: ['A Lambda function on a schedule', 'DynamoDB TTL', 'DynamoDB Streams', 'S3 lifecycle policies'], a: 1, e: 'TTL deletes expired items automatically without consuming write capacity.', d: 4 },
    { q: 'A team needs to query a DynamoDB table by an attribute that is not part of the primary key. The table already exists. What should they create?', o: ['Local Secondary Index', 'Global Secondary Index', 'A new table with Streams', 'A DAX cluster'], a: 1, e: 'GSIs can be added to existing tables with a different partition/sort key; LSIs must be created with the table.', d: 3 },
    { q: 'A company accidentally deleted items from a DynamoDB table 2 hours ago and must recover the data. Which feature allows restoring the table to that moment?', o: ['DynamoDB Streams', 'Point-in-time recovery', 'TTL', 'Global tables'], a: 1, e: 'PITR enables restoring to any second within the retention window into a new table.', d: 2 }
  ]
});

svc({
  id: 'elasticache', name: 'Amazon ElastiCache & MemoryDB', cat: 'database', imp: 3,
  tag: 'Managed in-memory caching with Redis OSS / Valkey and Memcached; MemoryDB for durable Redis-compatible primary database.',
  s: [
    { h: 'Engines', i: [
      ['Redis OSS / Valkey', 'Rich data structures (sorted sets, lists, hashes), replication, Multi-AZ automatic failover, persistence (AOF, snapshots), backups, pub/sub, transactions, Lua, cluster mode for sharding. Encryption and Redis AUTH / IAM auth.'],
      ['Memcached', 'Simple key-value, multi-threaded, sharding across nodes, no replication, no persistence, no backups. Simple horizontal cache.'],
      ['ElastiCache Serverless', 'No cluster sizing; scales automatically; pay for data stored and compute used.']
    ]},
    { h: 'Caching patterns', i: [
      ['Lazy loading (cache-aside)', 'Read from cache; on miss read DB and populate cache. Only requested data cached; stale data possible; miss penalty.'],
      ['Write-through', 'Write to cache whenever writing to DB. Cache always fresh; writes slower; caches data never read (use TTL).'],
      ['TTL', 'Expire keys to limit staleness and memory.'],
      ['Session store', 'Store user sessions in ElastiCache so web tier stays stateless.'],
      ['Leaderboards', 'Redis sorted sets for real-time gaming leaderboards.'],
      ['Requires code changes', 'Unlike DAX, the application must implement caching logic.']
    ]},
    { h: 'Security and HA', i: [
      ['Network', 'VPC-only, security groups. No IAM for data plane in Memcached; Redis supports AUTH tokens, RBAC and IAM auth.'],
      ['Encryption', 'In-transit TLS and at-rest KMS for Redis/Valkey.'],
      ['Multi-AZ', 'Redis replicas in other AZs with automatic failover. Global Datastore for cross-region replication.']
    ]},
    { h: 'Amazon MemoryDB', i: [
      ['What', 'Redis/Valkey-compatible, durable in-memory DATABASE with multi-AZ transaction log. Microsecond reads, single-digit ms writes.'],
      ['When', 'Need Redis API as the primary database with durability, not just a cache.']
    ]}
  ],
  tips: [
    'Reduce read load / latency on RDS -> ElastiCache in front (code change needed).',
    'Need HA, persistence, backups, complex data types, pub/sub, sorted sets -> Redis/Valkey. Simplest multithreaded cache -> Memcached.',
    'Externalize sessions for stateless web tier -> ElastiCache (or DynamoDB).',
    'Redis-compatible durable primary database -> MemoryDB.'
  ],
  q: [
    { q: 'An RDS database is overloaded by repeated identical read queries from a web application. What is the BEST way to reduce the load?', o: ['Enable Multi-AZ', 'Add an ElastiCache cluster and implement caching in the application', 'Increase storage size', 'Enable automated backups'], a: 1, e: 'ElastiCache serves repeated reads from memory and reduces database load.', d: 3 },
    { q: 'A gaming company needs a real-time leaderboard with ranking that remains available if a node fails. Which option fits?', o: ['ElastiCache for Memcached', 'ElastiCache for Redis with Multi-AZ, using sorted sets', 'DynamoDB Scan', 'RDS with read replicas'], a: 1, e: 'Redis sorted sets are ideal for leaderboards, and Redis supports replication with automatic failover.', d: 3 },
    { q: 'Which caching strategy ensures cached data is never stale relative to the database but may cache data that is never read?', o: ['Lazy loading', 'Write-through', 'TTL only', 'Cache-aside'], a: 1, e: 'Write-through updates the cache on every DB write, so data is fresh but may include unread data.', d: 3 },
    { q: 'A company wants the Redis API with microsecond reads as its primary database and needs durability across AZs. Which service is BEST?', o: ['ElastiCache for Memcached', 'Amazon MemoryDB', 'DynamoDB with DAX', 'Amazon Neptune'], a: 1, e: 'MemoryDB is a durable, Redis-compatible in-memory database with a multi-AZ transactional log.', d: 3 }
  ]
});

svc({
  id: 'other-dbs', name: 'Purpose-built Databases', cat: 'database', imp: 2,
  tag: 'DocumentDB, Neptune, Keyspaces, Timestream, QLDB and choosing the right database for the job.',
  s: [
    { h: 'Services', i: [
      ['Amazon DocumentDB', 'MongoDB-compatible JSON document database; Aurora-like storage (6 copies, 3 AZs), up to 15 replicas, elastic clusters. Migrating MongoDB workloads.'],
      ['Amazon Neptune', 'Graph database (property graph with Gremlin/openCypher, RDF with SPARQL). Social networks, fraud detection, knowledge graphs, recommendation engines. Up to 15 read replicas, Neptune Analytics.'],
      ['Amazon Keyspaces', 'Serverless Apache Cassandra-compatible (CQL) wide-column database. On-demand or provisioned, PITR.'],
      ['Amazon Timestream', 'Serverless time series database for IoT, DevOps metrics, telemetry; memory store + magnetic store tiers; also Timestream for InfluxDB.'],
      ['Amazon QLDB', 'Ledger database with immutable, cryptographically verifiable journal. End of support July 2025 (AWS suggests Aurora PostgreSQL); may still appear as "immutable verifiable history" answer.'],
      ['Amazon Redshift', 'Data warehouse for OLAP analytics (see Analytics).'],
      ['Amazon OpenSearch Service', 'Search and log analytics (see Analytics).']
    ]},
    { h: 'Choosing a database', i: [
      ['Relational, OLTP, joins, transactions', 'RDS or Aurora.'],
      ['Key-value at massive scale, serverless', 'DynamoDB.'],
      ['In-memory cache / sessions', 'ElastiCache; durable in-memory -> MemoryDB.'],
      ['Document (MongoDB)', 'DocumentDB (or DynamoDB).'],
      ['Graph relationships', 'Neptune.'],
      ['Wide-column Cassandra', 'Keyspaces.'],
      ['Time series', 'Timestream.'],
      ['Analytics / OLAP / data warehouse', 'Redshift; ad-hoc SQL on S3 -> Athena.'],
      ['Full-text search', 'OpenSearch.']
    ]}
  ],
  tips: [
    'MongoDB -> DocumentDB. Cassandra -> Keyspaces. Graph / relationships / fraud rings -> Neptune. IoT time series -> Timestream.',
    'Immutable, cryptographically verifiable history -> ledger (QLDB historically).'
  ],
  q: [
    { q: 'A company is migrating a MongoDB application to AWS and wants a fully managed compatible database. Which service should be used?', o: ['Amazon DynamoDB', 'Amazon DocumentDB', 'Amazon Keyspaces', 'Amazon Neptune'], a: 1, e: 'DocumentDB is MongoDB API compatible.', d: 3 },
    { q: 'A social media company needs to query complex relationships between users, posts and interests to generate recommendations. Which database is BEST suited?', o: ['Amazon Neptune', 'Amazon RDS', 'Amazon Timestream', 'Amazon Redshift'], a: 0, e: 'Neptune is a graph database optimized for traversing highly connected data.', d: 3 },
    { q: 'An IoT platform collects trillions of sensor readings per day and needs to analyze recent and historical data by time. Which database fits best?', o: ['Amazon Timestream', 'Amazon DocumentDB', 'Amazon Neptune', 'Amazon Aurora'], a: 0, e: 'Timestream is purpose-built for time series data with tiered storage.', d: 3 },
    { q: 'A company runs Apache Cassandra on premises and wants a serverless, compatible managed service using CQL. Which should it choose?', o: ['Amazon Keyspaces', 'DynamoDB', 'DocumentDB', 'ElastiCache'], a: 0, e: 'Keyspaces is serverless Cassandra-compatible and supports CQL.', d: 3 }
  ]
});
