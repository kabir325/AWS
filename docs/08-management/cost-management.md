# Cost Management & Trusted Advisor

> Cost Explorer, Budgets, Cost and Usage Reports, Compute Optimizer, Savings Plans, tags, Trusted Advisor and cost-optimization patterns.

Category: **Management & Governance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Visibility and control](#visibility-and-control)
- [Optimization tools](#optimization-tools)
- [Cost-optimization patterns](#cost-optimization-patterns)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Visibility and control

- **AWS Cost Explorer** - Visualize and analyze costs/usage over time, filter by service, account, tag; forecasts up to 12 months; RI and Savings Plans recommendations and utilization/coverage reports.
- **AWS Budgets** - Set cost, usage, RI/SP utilization or coverage budgets; alert via email/SNS when actual or forecasted spend exceeds thresholds; budget actions can apply IAM/SCP policies or stop EC2/RDS.
- **Cost and Usage Report (CUR) / Data Exports** - Most detailed billing data (hourly, per resource) delivered to S3; analyze with Athena, QuickSight.
- **Cost allocation tags** - Activate user-defined (e.g. CostCenter) and AWS-generated tags to break down costs by team/project.
- **Cost Anomaly Detection** - ML monitors spend and alerts on unusual cost spikes.
- **Pricing Calculator** - Estimate cost of planned architectures.
- **Billing alarms** - CloudWatch EstimatedCharges metric (us-east-1).

## Optimization tools

- **AWS Compute Optimizer** - ML-based right-sizing recommendations for EC2, ASGs, EBS volumes, Lambda memory, ECS on Fargate, RDS, using CloudWatch metrics.
- **AWS Trusted Advisor** - Checks across cost optimization, performance, security, fault tolerance, service limits, operational excellence. Basic/Developer support: core security checks + service quotas. Business/Enterprise: all checks + API.
- **Savings Plans & RIs** - Commit for 1/3 years: Compute SP (most flexible), EC2 Instance SP, RIs for EC2, RDS, ElastiCache, Redshift, OpenSearch, DynamoDB reserved capacity.
- **Instance Scheduler** - Solution to stop/start EC2 and RDS on schedules (e.g. dev environments off nights/weekends).

## Cost-optimization patterns

- **Right-size** - Downsize underutilized instances; move to Graviton; gp2 -> gp3.
- **Purchase model** - Spot for fault-tolerant, SP/RI for steady, On-Demand for spiky.
- **Storage tiering** - S3 lifecycle / Intelligent-Tiering, EFS IA, EBS snapshot archive, delete unattached EBS volumes and old snapshots, release unused Elastic IPs.
- **Networking** - VPC gateway endpoints instead of NAT for S3/DynamoDB, CloudFront to reduce egress, keep traffic in one AZ when possible.
- **Serverless** - Pay per use for intermittent workloads (Lambda, Fargate, Aurora Serverless, DynamoDB on-demand).
- **Managed services** - Reduce operational cost (TCO) by removing undifferentiated work.

## Exam tips

- Alert when forecasted spend exceeds budget -> AWS Budgets.
- Analyze historical spend and get SP/RI recommendations -> Cost Explorer.
- Per-resource detailed billing for custom analysis -> CUR / Data Exports + Athena.
- Right-size EC2/Lambda/EBS from utilization -> Compute Optimizer.
- Break down costs by department -> cost allocation tags (must be activated in Billing).
- Unexpected spend spike detection -> Cost Anomaly Detection.

## Practice questions

**Q1.** A finance team wants to receive an alert when the forecasted monthly AWS spend is expected to exceed $10,000. What should be used?

- A. AWS Cost Explorer
- B. AWS Budgets with a forecasted cost alert
- C. Trusted Advisor
- D. Compute Optimizer

<details><summary>Answer</summary>

**B** - Budgets supports alerts on actual and forecasted spend.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q2.** A company wants machine-learning-based recommendations to right-size its EC2 instances and Lambda function memory. Which service should be used?

- A. AWS Compute Optimizer
- B. AWS Budgets
- C. Cost and Usage Report
- D. AWS Config

<details><summary>Answer</summary>

**A** - Compute Optimizer analyzes utilization and recommends optimal resource configurations.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q3.** Management wants AWS costs broken down by department. Each department tags resources with "Department". What else is required?

- A. Activate the Department tag as a cost allocation tag in the Billing console
- B. Create a separate VPC per department
- C. Enable CloudTrail data events
- D. Use AWS Config

<details><summary>Answer</summary>

**A** - User-defined tags must be activated as cost allocation tags to appear in billing reports.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q4.** Development EC2 instances run 24/7 but are used only during business hours on weekdays. What is the MOST cost-effective change?

- A. Purchase 3-year Reserved Instances
- B. Stop instances outside business hours using a scheduler (e.g. Instance Scheduler or EventBridge + Lambda)
- C. Move to Dedicated Hosts
- D. Use larger instances

<details><summary>Answer</summary>

**B** - Stopping instances for ~70% of the week saves more than RIs for workloads that do not need to run continuously.

_Domain: Design Cost-Optimized Architectures_

</details>

**Q5.** Which actions reduce costs WITHOUT affecting performance? (Choose TWO)

- A. Delete unattached EBS volumes and release unused Elastic IPs
- B. Migrate gp2 volumes to gp3
- C. Move production databases to Spot Instances
- D. Disable Multi-AZ on production databases
- E. Switch all instances to burstable T types

<details><summary>Answer</summary>

**A, B** - Unused resources cost money for nothing, and gp3 is cheaper with equal or better baseline performance.

_Domain: Design Cost-Optimized Architectures_

</details>
