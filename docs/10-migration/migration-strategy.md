# Migration Strategy, MGN & Discovery

> The 7 Rs, discovery and planning tools, and AWS Application Migration Service for lift-and-shift.

Category: **Migration & Transfer** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [The 7 Rs](#the-7-rs)
- [Discovery and planning](#discovery-and-planning)
- [AWS Application Migration Service (MGN)](#aws-application-migration-service-mgn)
- [Other migration helpers](#other-migration-helpers)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## The 7 Rs

- **Retire** - Turn off applications no longer needed.
- **Retain** - Keep on premises for now (not ready, compliance, recently upgraded).
- **Rehost (lift and shift)** - Move as-is to EC2 (e.g. with MGN). Fastest, no code changes.
- **Relocate** - Move infrastructure without purchasing new hardware, e.g. VMware Cloud on AWS.
- **Replatform (lift, tinker and shift)** - Small optimizations without changing core architecture, e.g. self-managed DB -> RDS, app -> Beanstalk.
- **Repurchase (drop and shop)** - Move to a different product, usually SaaS (CRM -> Salesforce).
- **Refactor / re-architect** - Redesign as cloud-native (serverless, microservices). Most effort, most benefit.

## Discovery and planning

- **AWS Application Discovery Service** - Collect server inventory, utilization and dependencies from on-prem. Agentless (VMware vCenter collector) or agent-based (processes, network connections). Results in Migration Hub.
- **AWS Migration Hub** - Single place to track migration progress across tools; strategy recommendations; orchestrator templates.
- **Migration Evaluator** - Business case: projected cost of running on AWS based on current usage.
- **AWS Transform** - AI-assisted modernization (VMware, mainframe, .NET) - awareness.

## AWS Application Migration Service (MGN)

- **What** - Primary lift-and-shift service (replaces Server Migration Service). Continuous block-level replication of physical, virtual or cloud servers into AWS.
- **Process** - Install replication agent -> data replicates to low-cost staging area -> launch test instances -> cutover with minimal downtime (minutes).
- **Supports** - Windows and Linux, any source infrastructure; converts boot volumes to run natively on EC2.
- **vs Elastic Disaster Recovery** - Same technology; MGN for one-time migration, DRS for ongoing DR.

## Other migration helpers

- **VM Import/Export** - Import VM images (VMware, Hyper-V) as AMIs and export back.
- **AWS DMS** - Database migrations (see DMS).
- **VMware Cloud on AWS** - Run VMware SDDC on AWS bare metal: relocate vSphere workloads without conversion.

## Exam tips

- Lift-and-shift servers with minimal downtime -> AWS Application Migration Service (MGN).
- Discover on-prem servers, utilization and dependencies -> Application Discovery Service (agent for process-level dependencies).
- Move a self-managed DB to RDS without code changes -> replatform.
- Move to SaaS -> repurchase. Rewrite as serverless -> refactor.

## Practice questions

**Q1.** A company wants to migrate 200 on-premises VMware and physical servers to AWS as-is with minimal downtime during cutover. Which service should be used?

- A. AWS DataSync
- B. AWS Application Migration Service
- C. AWS DMS
- D. AWS Snowball Edge

<details><summary>Answer</summary>

**B** - MGN performs continuous block-level replication and quick cutover for lift-and-shift.

_Domain: Design Resilient Architectures_

</details>

**Q2.** Before migrating, a company needs detailed information about running processes and network dependencies between its on-premises servers. What should be used?

- A. Application Discovery Service agentless collector
- B. Application Discovery Service agents installed on servers
- C. AWS Config
- D. Migration Evaluator only

<details><summary>Answer</summary>

**B** - The agent-based discovery collects process and network connection data for dependency mapping. The agentless collector gathers VM inventory and utilization.

_Domain: Design Resilient Architectures_

</details>

**Q3.** A company moves its self-managed MySQL database to Amazon RDS for MySQL without changing application code. Which migration strategy is this?

- A. Rehost
- B. Replatform
- C. Refactor
- D. Repurchase

<details><summary>Answer</summary>

**B** - Replatforming makes small optimizations, such as moving to a managed database, without changing the core architecture.

_Domain: Design High-Performing Architectures_

</details>
