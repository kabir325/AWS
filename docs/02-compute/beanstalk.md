# AWS Elastic Beanstalk

> PaaS that provisions EC2, ASG, ELB, monitoring for your web app code; you keep control of the resources.

Category: **Compute** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Basics](#basics)
- [Deployment policies](#deployment-policies)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Basics

- **What** - Upload code (Java, .NET, Node.js, Python, PHP, Ruby, Go, Docker) and Beanstalk provisions capacity, load balancing, scaling and health monitoring. No extra charge beyond resources.
- **Components** - Application -> versions -> environments (dev, prod). Environment tiers: Web server tier (ELB + ASG) and Worker tier (SQS queue + daemon that POSTs messages to your app).
- **Configuration** - .ebextensions config files or saved configurations. Can still access underlying EC2.
- **Database** - RDS created inside the environment is deleted with it: for production create RDS separately and connect via env vars.

## Deployment policies

- **All at once** - Fastest, deploys to all instances simultaneously, causes downtime.
- **Rolling** - Updates batches; capacity reduced during deploy; no extra cost.
- **Rolling with additional batch** - Launches an extra batch first so full capacity is maintained.
- **Immutable** - New instances in a temporary ASG; swap when healthy. Quick, safe rollback; higher cost.
- **Traffic splitting** - Canary: send a percentage of traffic to new instances for evaluation.
- **Blue/green** - Separate environment; swap environment URLs (CNAME swap) or use Route 53 weighted records. Zero downtime, easy rollback.

## Exam tips

- Developer wants to deploy a web app quickly without managing infrastructure but with access to it -> Elastic Beanstalk.
- Background jobs from a queue in Beanstalk -> worker environment tier.
- Zero downtime and fast rollback -> immutable or blue/green (swap URLs).
- Decouple RDS from the Beanstalk environment for production so it is not deleted with the environment.

## Practice questions

**Q1.** A development team wants to deploy a Python web application quickly without managing load balancers or Auto Scaling configuration manually, but still wants access to the underlying EC2 instances. Which service is BEST?

- A. AWS Lambda
- B. AWS Elastic Beanstalk
- C. Amazon Lightsail
- D. AWS CloudFormation

<details><summary>Answer</summary>

**B** - Beanstalk provisions and manages ELB, ASG, EC2 and monitoring from your code while leaving the resources accessible.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** Which Elastic Beanstalk deployment policy maintains full capacity and allows the fastest rollback by deploying to entirely new instances?

- A. All at once
- B. Rolling
- C. Immutable
- D. Rolling with additional batch

<details><summary>Answer</summary>

**C** - Immutable deployments launch new instances in a separate ASG; rollback simply terminates them.

_Domain: Design Resilient Architectures_

</details>

**Q3.** A Beanstalk application needs to process long-running background tasks submitted by the web tier. What is the recommended architecture?

- A. Run cron jobs on web instances
- B. Create a worker environment that consumes an SQS queue
- C. Use a larger web instance type
- D. Use the all-at-once deployment policy

<details><summary>Answer</summary>

**B** - Worker environments pull messages from SQS and decouple background processing from the web tier.

_Domain: Design Resilient Architectures_

</details>
