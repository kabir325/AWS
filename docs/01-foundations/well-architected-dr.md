# Well-Architected & Disaster Recovery

> The six pillars, design principles, RPO/RTO and the four DR strategies that frame most exam answers.

Category: **Foundations** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Six pillars](#six-pillars)
- [Core design principles](#core-design-principles)
- [RPO and RTO](#rpo-and-rto)
- [Four DR strategies (cheapest to most expensive)](#four-dr-strategies-cheapest-to-most-expensive)
- [DR building blocks](#dr-building-blocks)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Six pillars

- **Operational Excellence** - Run and monitor systems, improve processes. Infrastructure as code, small reversible changes, anticipate failure, learn from operational events.
- **Security** - Strong identity foundation (least privilege), traceability, security at every layer, automate security, protect data in transit and at rest, prepare for incidents.
- **Reliability** - Automatically recover from failure, test recovery procedures, scale horizontally, stop guessing capacity, manage change through automation.
- **Performance Efficiency** - Use advanced technologies as managed services, go global in minutes, use serverless, experiment more often, mechanical sympathy (right tool for the job).
- **Cost Optimization** - Adopt a consumption model, measure overall efficiency, stop spending on undifferentiated heavy lifting, analyze and attribute expenditure.
- **Sustainability** - Understand impact, maximize utilization, use managed services and more efficient hardware (e.g. Graviton), reduce downstream impact.

## Core design principles

- **Loose coupling** - Decouple tiers with queues (SQS), topics (SNS), event buses (EventBridge) so components fail and scale independently.
- **Stateless compute** - Keep session state out of instances (ElastiCache, DynamoDB) so any instance can serve any request and Auto Scaling works.
- **Horizontal scaling** - Add more smaller resources behind a load balancer rather than one bigger box (vertical scaling has a ceiling and causes downtime).
- **Managed and serverless first** - Prefer services that remove operational overhead: "least operational overhead" in a question usually points to a managed/serverless option.
- **Tools** - AWS Well-Architected Tool reviews workloads against the pillars; Lenses add domain guidance (Serverless, SaaS, etc.).

## RPO and RTO

- **RPO (Recovery Point Objective)** - Maximum acceptable data loss measured in time. Driven by backup / replication frequency.
- **RTO (Recovery Time Objective)** - Maximum acceptable downtime. Driven by how much infrastructure is already running in the DR site.
- **Trade-off** - Lower RPO/RTO = higher cost. Pick the cheapest strategy that meets the stated objectives.

## Four DR strategies (cheapest to most expensive)

- **Backup and restore** - Back up data (snapshots, AWS Backup, S3 CRR) to another region; rebuild everything on disaster. RPO/RTO: hours. Cheapest.
- **Pilot light** - Core data is live-replicated (e.g. RDS cross-region read replica) but app servers are off or not provisioned. Turn on and scale on disaster. RPO: minutes, RTO: tens of minutes.
- **Warm standby** - A scaled-down but fully functional copy runs all the time; scale up on disaster. RPO: seconds, RTO: minutes.
- **Multi-site active-active** - Full production in 2+ regions serving traffic (Route 53, Global Accelerator, DynamoDB global tables, Aurora Global Database). Near-zero RPO/RTO. Most expensive.

## DR building blocks

- **Data replication** - S3 Cross-Region Replication, Aurora Global Database (<1 s lag, promote in ~1 min), DynamoDB global tables, RDS cross-region read replicas, EBS snapshot copy, AWS Backup cross-region copies.
- **Traffic failover** - Route 53 failover routing with health checks; Global Accelerator for fast IP-level failover; CloudFront origin groups.
- **Infrastructure** - CloudFormation / CDK templates and AMIs copied to the DR region to rebuild quickly.
- **AWS Elastic Disaster Recovery (DRS)** - Continuous block-level replication of servers (on-prem or cloud) into a low-cost staging area; launch recovery instances in minutes. RPO seconds, RTO minutes.

## Exam tips

- Read the RPO/RTO numbers first, then pick the cheapest DR strategy that meets them.
- RPO/RTO in hours and lowest cost -> backup and restore. Minutes and core DB always running -> pilot light. Must handle traffic immediately at reduced capacity -> warm standby.
- Pilot light vs warm standby: in pilot light the app tier is NOT running; in warm standby a small version of everything IS running.
- "Least operational overhead" -> managed or serverless service.
- Sustainability pillar is the newest (6th) pillar.

## Practice questions

**Q1.** A company requires an RPO of 24 hours and an RTO of 12 hours for a non-critical application and wants the lowest cost. Which DR strategy should be used?

- A. Multi-site active-active
- B. Warm standby
- C. Pilot light
- D. Backup and restore

<details><summary>Answer</summary>

**D** - Hours-level RPO/RTO with lowest cost points to backup and restore.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q2.** A company replicates its database to a second region continuously, but keeps application servers turned off until a disaster occurs. Which DR strategy is this?

- A. Backup and restore
- B. Pilot light
- C. Warm standby
- D. Active-active

<details><summary>Answer</summary>

**B** - Pilot light keeps the core (data) live while the rest of the environment is provisioned or started only during recovery.

_Domain: Design Resilient Architectures_

</details>

**Q3.** An application needs an RTO of a few minutes and must be able to serve some production traffic immediately after a regional failure. Budget does not allow full duplicate capacity. Which strategy fits?

- A. Warm standby
- B. Pilot light
- C. Backup and restore
- D. Multi-site active-active

<details><summary>Answer</summary>

**A** - Warm standby runs a scaled-down but fully functional copy that can take traffic immediately and then scale up.

_Domain: Design Resilient Architectures_

</details>

**Q4.** Which statement correctly defines RPO?

- A. The maximum time a system can be down
- B. The maximum acceptable amount of data loss measured in time
- C. The time it takes to restore a backup
- D. The frequency of DR tests

<details><summary>Answer</summary>

**B** - RPO is about data loss (how old the last recoverable data point can be). RTO is about downtime.

_Domain: Design Resilient Architectures_

</details>

**Q5.** A company wants to replicate on-premises physical servers to AWS continuously and recover them in minutes during a disaster with minimal infrastructure cost in AWS while idle. Which service should be used?

- A. AWS Backup
- B. AWS Elastic Disaster Recovery
- C. AWS DataSync
- D. AWS Application Migration Service with scheduled cutover

<details><summary>Answer</summary>

**B** - Elastic Disaster Recovery continuously replicates block data to a low-cost staging area and launches recovery instances in minutes.

_Domain: Design Resilient Architectures_

</details>

**Q6.** Which design principle BEST improves the ability of a web tier to scale out with Auto Scaling?

- A. Store user sessions on the local instance disk
- B. Use larger instance types
- C. Make the web tier stateless by storing sessions in ElastiCache or DynamoDB
- D. Use sticky sessions with long durations

<details><summary>Answer</summary>

**C** - Stateless instances can be added or removed freely. Local sessions and long sticky sessions break even distribution and lose state on scale-in.

_Domain: Design High-Performing Architectures_

</details>

**Q7.** A workload must survive a full regional outage with near-zero downtime and near-zero data loss. Which combination is MOST appropriate? (Choose TWO)

- A. Aurora Global Database or DynamoDB global tables
- B. Nightly EBS snapshots copied to another region
- C. Route 53 latency or failover routing across active stacks in two regions
- D. A single Multi-AZ RDS instance
- E. S3 Standard-IA for backups

<details><summary>Answer</summary>

**A, C** - Active-active multi-region needs multi-region data replication (Aurora Global Database / DynamoDB global tables) and DNS or Global Accelerator based traffic routing across regions.

_Domain: Design Resilient Architectures_

</details>
