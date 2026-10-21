# Amazon EMR

> Managed big data frameworks (Spark, Hadoop, Hive, Presto, HBase, Flink) on EC2, EKS or Serverless.

Category: **Analytics & Machine Learning** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Fundamentals](#fundamentals)
- [Cost and operations](#cost-and-operations)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Fundamentals

- **What** - Managed clusters for big data processing, ML and ETL using open-source frameworks. Petabyte-scale.
- **Node types** - Primary (master) node: coordinates. Core nodes: run tasks and store HDFS data (long-running). Task nodes: compute only, no HDFS: ideal for Spot.
- **Storage** - HDFS (ephemeral, on cluster) or EMRFS on S3 (durable, decoupled; cluster can be terminated).
- **Deployment options** - EMR on EC2, EMR on EKS, EMR Serverless (no cluster management).

## Cost and operations

- **Purchasing** - On-Demand/Reserved for primary and core, Spot for task nodes. Instance fleets with multiple instance types.
- **Transient vs long-running** - Transient clusters terminate after the job (cheaper, data in S3). Long-running for interactive/persistent workloads.
- **Managed scaling** - Automatically resize cluster based on workload.
- **Security** - IAM roles, security configurations (encryption at rest/in transit), Kerberos, Lake Formation integration, private subnets.

## Exam tips

- Existing Hadoop/Spark jobs, big data processing with control over frameworks -> EMR.
- Cheapest EMR -> Spot for task nodes, transient clusters with data in S3.
- No cluster management for Spark/Hive -> EMR Serverless (or Glue for ETL).

## Practice questions

**Q1.** A company is migrating on-premises Hadoop and Spark jobs to AWS with minimal code changes. Which service should be used?

- A. Amazon EMR
- B. AWS Glue DataBrew
- C. Amazon Athena
- D. Amazon Redshift

<details><summary>Answer</summary>

**A** - EMR runs Hadoop, Spark and other open-source frameworks as a managed service.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** To reduce the cost of an EMR cluster that runs fault-tolerant batch jobs, which nodes are BEST suited for Spot Instances?

- A. Primary node
- B. Core nodes storing HDFS data
- C. Task nodes
- D. All nodes

<details><summary>Answer</summary>

**C** - Task nodes do not store HDFS data, so interruption only loses compute progress.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** A nightly EMR job processes data and the cluster sits idle the rest of the day. How can cost be minimized?

- A. Use transient clusters that store data in S3 (EMRFS) and terminate after the job
- B. Use Reserved Instances for all nodes
- C. Increase core nodes
- D. Use HDFS for persistence

<details><summary>Answer</summary>

**A** - Transient clusters with S3 storage avoid paying for idle clusters.

_Domain: Design Cost-Optimized Architectures_

</details>
