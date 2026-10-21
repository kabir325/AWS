# DataSync & Transfer Family

> Online data movement: DataSync for scheduled/bulk file transfers, Transfer Family for managed SFTP/FTPS/FTP/AS2.

Category: **Migration & Transfer** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [AWS DataSync](#aws-datasync)
- [AWS Transfer Family](#aws-transfer-family)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## AWS DataSync

- **What** - Online service to move large amounts of data between on-prem storage (NFS, SMB, HDFS, object storage), other clouds, and AWS storage (S3 any class, EFS, FSx).
- **Agent** - Deploy a DataSync agent VM on premises (not needed for AWS-to-AWS transfers like EFS -> EFS, S3 -> S3).
- **Features** - Up to 10 Gbps per task, scheduling (hourly/daily/weekly), bandwidth throttling, encryption in transit, data integrity validation, preserves metadata and permissions (POSIX, NTFS).
- **Use cases** - One-time migrations, recurring sync, replication for DR, archive to S3 Glacier.
- **vs Storage Gateway** - DataSync moves data; Storage Gateway provides ongoing hybrid access.

## AWS Transfer Family

- **What** - Fully managed SFTP, FTPS, FTP and AS2 servers storing data in S3 or EFS.
- **Why** - Migrate existing file transfer workflows (partners using SFTP) without changing clients.
- **Auth** - Service-managed users, AWS Directory Service / AD, or custom IdP via Lambda/API Gateway.
- **Endpoints** - Public, VPC (internal or internet-facing with Elastic IPs).
- **Managed workflows** - Post-upload processing (copy, tag, decrypt, Lambda).

## Exam tips

- Online migration or scheduled sync of NFS/SMB data to S3/EFS/FSx -> DataSync.
- Partners exchange files via SFTP, store in S3 -> Transfer Family.
- Copy data between EFS file systems or regions -> DataSync (no agent).

## Practice questions

**Q1.** A company needs to transfer 100 TB from an on-premises NFS server to Amazon S3 over a 10 Gbps Direct Connect link and then keep the data in sync daily. Which service should be used?

- A. AWS DataSync
- B. AWS Snowball Edge
- C. S3 Transfer Acceleration
- D. AWS Transfer Family

<details><summary>Answer</summary>

**A** - DataSync performs high-speed online transfers with scheduling and incremental syncs.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** External partners upload files using SFTP clients. The company wants to store them in S3 without managing servers or changing partner workflows. What should be used?

- A. EC2 with an SFTP server
- B. AWS Transfer Family
- C. S3 pre-signed URLs
- D. AWS DataSync

<details><summary>Answer</summary>

**B** - Transfer Family offers managed SFTP endpoints backed by S3 or EFS.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** Data must be copied from an EFS file system in us-east-1 to an EFS file system in eu-west-1 on a schedule. What is the simplest solution?

- A. AWS DataSync task between the two EFS locations
- B. rsync from an EC2 instance
- C. AWS Snowball
- D. S3 Cross-Region Replication

<details><summary>Answer</summary>

**A** - DataSync supports AWS-to-AWS transfers including EFS to EFS across regions on a schedule (EFS Replication is also an option).

_Domain: Design Resilient Architectures_

</details>
