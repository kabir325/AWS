# Containers: ECS, EKS, Fargate, ECR

> Run Docker containers on AWS: orchestrators (ECS, EKS), serverless compute (Fargate), registry (ECR), App Runner.

Category: **Compute** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [Amazon ECS](#amazon-ecs)
- [Amazon EKS](#amazon-eks)
- [AWS Fargate](#aws-fargate)
- [Amazon ECR and App Runner](#amazon-ecr-and-app-runner)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Amazon ECS

- **What** - AWS-native container orchestrator. Simple, deeply integrated with ALB, IAM, CloudWatch.
- **Task definition** - JSON blueprint: image, CPU/memory, ports, env vars, IAM task role, logging, volumes.
- **Service** - Keeps N tasks running, integrates with ALB/NLB, supports rolling and blue/green (CodeDeploy) deployments.
- **EC2 launch type** - You manage the EC2 container instances (ECS agent, patching, capacity). Cheaper at steady scale, supports GPU and special instance needs.
- **Fargate launch type** - Serverless: no instances to manage; pay per vCPU/memory per second per task.
- **Task role vs instance role** - Task role = permissions for the app inside a task (least privilege per service). Instance role = permissions for the ECS agent on EC2.
- **ECS Service Auto Scaling** - Scale task count with target tracking (CPU, memory, ALB requests). Capacity providers scale the underlying EC2 ASG or use Fargate / Fargate Spot.

## Amazon EKS

- **What** - Managed Kubernetes control plane. Choose when standardizing on Kubernetes, multi-cloud or migrating existing K8s workloads.
- **Data plane options** - Managed node groups (EC2), self-managed nodes, Fargate profiles, Karpenter for node autoscaling.
- **Storage** - CSI drivers for EBS, EFS, FSx.
- **EKS Anywhere / ECS Anywhere** - Run the orchestrator on your own on-prem hardware.

## AWS Fargate

- **Serverless containers** - Works with ECS and EKS. No servers, patching or capacity planning.
- **Fargate Spot** - Interruptible Fargate tasks at up to 70% discount.
- **Storage** - Ephemeral storage up to 200 GB per task; mount EFS for persistent shared storage.
- **When** - Least operational overhead for containers. Choose EC2 launch type for GPUs, very steady large scale, or special host-level control.

## Amazon ECR and App Runner

- **ECR** - Private/public Docker and OCI image registry, backed by S3. Image scanning (basic or enhanced with Inspector), lifecycle policies, cross-region/cross-account replication, IAM-based access.
- **App Runner** - Fully managed: give it source code or an image, it builds, deploys, load balances, scales and adds TLS. Simplest way to run a web app/API container.
- **Beanstalk / Lightsail containers** - Alternative simple options; App Runner is the modern answer for "least effort" web containers.

## Exam tips

- Containers with least operational overhead -> Fargate (or App Runner for a simple web app).
- Already using Kubernetes / want open-source tooling portability -> EKS.
- Different permissions per container app -> ECS task roles, not instance roles.
- Shared persistent storage between tasks across AZs -> EFS.
- Fault-tolerant container batch at lowest cost -> Fargate Spot or EC2 Spot capacity provider.

## Practice questions

**Q1.** A company wants to run containerized microservices without managing servers or clusters of EC2 instances. Which option provides the LEAST operational overhead?

- A. ECS on EC2 launch type
- B. EKS with self-managed nodes
- C. ECS with the Fargate launch type
- D. Docker on EC2 with Auto Scaling

<details><summary>Answer</summary>

**C** - Fargate removes the need to provision, patch and scale container hosts.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** Two ECS services run on the same cluster. One needs access to an S3 bucket and the other needs access to a DynamoDB table. How should permissions be granted following least privilege?

- A. Attach both permissions to the EC2 instance role
- B. Create a separate IAM task role for each task definition
- C. Use one IAM user with access keys in environment variables
- D. Use security groups

<details><summary>Answer</summary>

**B** - Task roles give each task its own scoped permissions independent of the host.

_Domain: Design Secure Architectures_

</details>

**Q3.** A company already runs workloads on Kubernetes on premises and wants to migrate to AWS with minimal changes to tooling. Which service should it use?

- A. Amazon ECS
- B. Amazon EKS
- C. AWS App Runner
- D. AWS Elastic Beanstalk

<details><summary>Answer</summary>

**B** - EKS is managed Kubernetes and works with existing Kubernetes manifests and tooling.

_Domain: Design High-Performing Architectures_

</details>

**Q4.** Containers running in ECS tasks across multiple AZs need a shared, persistent file system. Which storage should be used?

- A. Amazon EBS volumes
- B. Instance store
- C. Amazon EFS
- D. Task ephemeral storage

<details><summary>Answer</summary>

**C** - EFS is a regional, multi-AZ NFS file system that can be mounted by many tasks concurrently, including on Fargate.

_Domain: Design Resilient Architectures_

</details>

**Q5.** A developer wants to deploy a containerized web API from source code with automatic builds, load balancing, TLS and scaling, writing no infrastructure code. Which service is simplest?

- A. AWS App Runner
- B. Amazon EKS
- C. ECS on EC2
- D. AWS Batch

<details><summary>Answer</summary>

**A** - App Runner is fully managed for web apps and APIs from source or image, handling build, deploy, scaling and TLS.

_Domain: Design High-Performing Architectures_

</details>
