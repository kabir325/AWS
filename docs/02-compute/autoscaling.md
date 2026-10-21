# EC2 Auto Scaling

> Automatically maintain and scale fleets of EC2 instances across AZs using health checks and scaling policies.

Category: **Compute** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Core concepts](#core-concepts)
- [Scaling policies](#scaling-policies)
- [Health, lifecycle and termination](#health-lifecycle-and-termination)
- [Integrations](#integrations)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Core concepts

- **Auto Scaling group (ASG)** - Logical group of instances with min, desired and max capacity, spread across the subnets/AZs you choose.
- **Launch template** - Defines AMI, instance type(s), key pair, security groups, user data, IAM instance profile. Supports versions and mixed instances.
- **Mixed instances policy** - Combine On-Demand base capacity with Spot across multiple instance types for cost and availability.
- **Self-healing** - Unhealthy or terminated instances are replaced automatically to keep desired capacity. Free service; you pay for resources.

## Scaling policies

- **Target tracking** - Keep a metric at a target, e.g. average CPU 50% or ALB RequestCountPerTarget 1000. Simplest and usually recommended.
- **Step scaling** - Add/remove capacity in steps based on CloudWatch alarm breach size (e.g. +2 at 70%, +4 at 85%).
- **Simple scaling** - One adjustment per alarm, waits for cooldown. Legacy.
- **Scheduled scaling** - Change min/max/desired at known times (e.g. scale up at 8 AM Monday-Friday).
- **Predictive scaling** - Machine learning forecasts load from history and scales ahead of recurring daily/weekly patterns.
- **Scale on queue depth** - For workers: custom metric "backlog per instance" = SQS ApproximateNumberOfMessagesVisible / running instances, with target tracking.

## Health, lifecycle and termination

- **Health checks** - EC2 status checks by default. Enable ELB health checks so instances failing the app health check are replaced. Grace period lets apps boot.
- **Cooldown / warmup** - Default cooldown 300 s for simple scaling; instance warmup for target tracking/step so new instances are not counted too early.
- **Lifecycle hooks** - Pause instances in Pending:Wait or Terminating:Wait to run scripts (install software, drain, copy logs) before InService or termination.
- **Default termination policy** - Balance AZs first, then terminate instance with oldest launch template/config, then closest to next billing hour.
- **Warm pools** - Pre-initialized stopped/hibernated instances to cut scale-out latency for apps with long boot times.
- **Instance refresh** - Rolling replacement of instances to roll out a new launch template version with minimum healthy percentage.
- **Scale-in protection** - Protect specific instances (e.g. a long-running job) from termination during scale-in.

## Integrations

- **ELB** - ASG registers/deregisters instances in target groups automatically; deregistration delay lets connections drain.
- **CloudWatch alarms** - Drive step/simple scaling; SNS notifications on launch/terminate events.
- **AWS Auto Scaling (plans)** - Separate service to scale multiple resources (ECS, DynamoDB, Aurora replicas, Spot Fleet) together.

## Exam tips

- Load is predictable at known times -> scheduled scaling. Recurring pattern but not exact -> predictive scaling. Otherwise -> target tracking.
- Instances unhealthy at app level but ASG does not replace them -> enable ELB health checks on the ASG.
- Scale SQS workers on backlog per instance, not on CPU.
- Need to run something before an instance goes into service or is terminated -> lifecycle hook.
- Users get errors right after scale-out because instances need long initialization -> warm pools or golden AMI.

## Practice questions

**Q1.** A web application behind an ALB experiences instances that hang and return HTTP 500 errors, but the Auto Scaling group does not replace them. What should be done?

- A. Increase the maximum capacity
- B. Configure the ASG to use ELB health checks
- C. Enable detailed monitoring
- D. Add a lifecycle hook

<details><summary>Answer</summary>

**B** - By default ASGs only use EC2 status checks. Enabling ELB health checks makes the ASG replace instances failing the target group health check.

_Domain: Design Resilient Architectures_

</details>

**Q2.** Traffic to an application increases sharply every weekday at 9 AM. Users experience slow responses for the first 10 minutes. What is the BEST solution?

- A. Use scheduled scaling to increase capacity before 9 AM
- B. Use simple scaling on CPU
- C. Increase the cooldown period
- D. Use larger instances all day

<details><summary>Answer</summary>

**A** - For known, time-based load changes, scheduled scaling provisions capacity ahead of demand.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** An application consumes messages from an SQS queue using EC2 instances in an ASG. Which metric should drive scaling?

- A. Average CPU utilization
- B. Network in
- C. Backlog per instance (queue depth / instance count)
- D. ALB request count

<details><summary>Answer</summary>

**C** - AWS recommends a custom backlog-per-instance metric with target tracking for queue workers.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** Before an instance is terminated during scale-in, an application must upload log files to S3. What should be used?

- A. User data
- B. A lifecycle hook on Terminating:Wait
- C. Scale-in protection
- D. A scheduled action

<details><summary>Answer</summary>

**B** - Lifecycle hooks pause the instance in Terminating:Wait so you can run scripts before termination completes.

_Domain: Design Resilient Architectures_

</details>

**Q5.** Which scaling policy keeps average CPU utilization at 50% with the least configuration effort?

- A. Step scaling
- B. Simple scaling
- C. Target tracking scaling
- D. Scheduled scaling

<details><summary>Answer</summary>

**C** - Target tracking creates and manages the alarms for you to hold the metric near the target.

_Domain: Design High-Performing Architectures_

</details>

**Q6.** An application takes 15 minutes to initialize. The company wants faster scale-out without paying for running idle instances. What should be used?

- A. Warm pool with stopped instances
- B. Increase desired capacity permanently
- C. Spot Instances
- D. Spread placement group

<details><summary>Answer</summary>

**A** - Warm pools keep pre-initialized instances in a stopped (or hibernated) state; you pay only for their EBS storage while stopped.

_Domain: Design Cost-Optimized Architectures_

</details>
