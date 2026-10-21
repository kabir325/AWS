# AWS Systems Manager

> Operate fleets of EC2 and on-prem servers: Session Manager, Run Command, Patch Manager, Automation, Parameter Store, Inventory.

Category: **Management & Governance** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [Capabilities](#capabilities)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## Capabilities

- **SSM Agent** - Installed on managed nodes (EC2 AMIs, on-prem servers via hybrid activations). Instance needs an IAM role with AmazonSSMManagedInstanceCore and network access to SSM endpoints (NAT or VPC endpoints).
- **Session Manager** - Browser/CLI shell access without SSH keys, bastion hosts or open inbound ports. IAM controlled; sessions logged to S3/CloudWatch.
- **Run Command** - Run scripts/commands across many instances at scale without SSH (rate control, error thresholds).
- **Patch Manager** - Automate OS and application patching with patch baselines and maintenance windows; compliance reporting.
- **Automation** - Runbooks to perform operational tasks (create AMI, restart instance, remediate Config findings).
- **State Manager** - Keep instances in a defined state (agent installed, settings applied) on a schedule.
- **Parameter Store** - Configuration and secrets storage (see Secrets entry).
- **Inventory** - Collect software and configuration metadata from instances.
- **OpsCenter / Incident Manager** - Aggregate operational issues (OpsItems) and manage incidents with response plans.
- **Distributor / Fleet Manager** - Package distribution; UI to manage nodes.

## Exam tips

- Shell access to private instances without SSH/bastion/open ports -> Session Manager.
- Patch many instances on a schedule -> Patch Manager + maintenance windows.
- Run a command on hundreds of instances -> Run Command.
- Instances not appearing in Systems Manager -> check SSM agent, IAM instance role and endpoint connectivity.

## Practice questions

**Q1.** A company wants administrators to access shell sessions on private EC2 instances without opening port 22, managing SSH keys, or using bastion hosts, with full session logging. What should be used?

- A. EC2 Instance Connect with public IPs
- B. AWS Systems Manager Session Manager
- C. A bastion host with MFA
- D. Site-to-Site VPN

<details><summary>Answer</summary>

**B** - Session Manager provides IAM-controlled shell access through the SSM agent with logging and no inbound ports.

_Domain: Design Secure Architectures_

</details>

**Q2.** An operations team must apply OS security patches to 500 EC2 instances every Sunday night and report compliance. What should be used?

- A. SSM Patch Manager with a maintenance window
- B. User data scripts
- C. AWS Config
- D. Amazon Inspector

<details><summary>Answer</summary>

**A** - Patch Manager automates patching using baselines and maintenance windows and reports compliance.

_Domain: Design Secure Architectures_

</details>

**Q3.** EC2 instances in a private subnet without internet access do not appear as managed nodes in Systems Manager. The SSM agent is installed. What could fix this? (Choose TWO)

- A. Attach an instance profile with the AmazonSSMManagedInstanceCore policy
- B. Create interface VPC endpoints for ssm, ssmmessages and ec2messages
- C. Open inbound port 22
- D. Assign Elastic IPs
- E. Enable detailed monitoring

<details><summary>Answer</summary>

**A, B** - Managed nodes need IAM permissions and network connectivity to SSM endpoints (via NAT or VPC endpoints).

_Domain: Design Secure Architectures_

</details>
