# AWS KMS & CloudHSM

> Managed encryption keys: key types, key policies, envelope encryption, rotation, multi-region keys; CloudHSM for dedicated HSMs.

Category: **Security, Identity & Compliance** | Exam importance: *** | [Back to index](../README.md)

## Contents

- [KMS key types](#kms-key-types)
- [How encryption works](#how-encryption-works)
- [Access control](#access-control)
- [AWS CloudHSM](#aws-cloudhsm)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## KMS key types

- **AWS owned keys** - Used by services internally (e.g. default DynamoDB encryption). Not visible, free.
- **AWS managed keys** - aws/s3, aws/ebs, aws/rds... created for you, rotated yearly automatically, cannot change policy.
- **Customer managed keys (CMK)** - You create and control: key policy, rotation, enable/disable, schedule deletion (7-30 days). Needed for cross-account sharing and fine control. $1/month + API calls.
- **Symmetric vs asymmetric** - Symmetric AES-256 (default; key never leaves KMS; used by AWS services). Asymmetric RSA/ECC for sign/verify or encryption by clients outside AWS with the public key.
- **Imported key material / custom key store** - Bring your own key material (you manage durability and can delete it); custom key store backed by CloudHSM or an external key manager (XKS).

## How encryption works

- **Direct encryption limit** - KMS Encrypt API handles up to 4 KB of data.
- **Envelope encryption** - GenerateDataKey returns a plaintext + encrypted data key; encrypt data locally with the plaintext key, store the encrypted key with the data. Used by S3, EBS, etc.
- **Regional** - Keys are regional. Copying encrypted snapshots across regions re-encrypts with a key in the destination region.
- **Multi-Region keys** - Same key ID and material replicated across regions: encrypt in one region, decrypt in another (global DynamoDB, client-side encryption, DR). Not global; each replica managed independently.
- **Quotas** - Shared request rate quotas per region (thousands per second); throttling possible: use data key caching / S3 Bucket Keys.

## Access control

- **Key policy** - Primary resource policy on every key. Default policy gives the account root full access so IAM policies can grant permissions.
- **Grants** - Temporary, programmatic delegation of key usage (used by services like EBS).
- **Cross-account use** - Key policy must allow the other account AND the other account's IAM policy must allow using the key.
- **Auditing** - Every API call logged in CloudTrail.
- **Rotation** - Automatic rotation for customer managed symmetric keys (default yearly, configurable 90-2,560 days, or on-demand); old key material kept to decrypt old data. Manual rotation = new key + alias update.

## AWS CloudHSM

- **What** - Dedicated, single-tenant hardware security modules in your VPC, FIPS 140-3 Level 3 validated. You manage keys and users; AWS cannot access your keys.
- **Use cases** - Regulatory need for exclusive key control, SSL/TLS offload, Oracle TDE, custom key store for KMS, PKCS#11/JCE/CNG apps.
- **HA** - Cluster of HSMs across AZs. If you lose credentials, keys are unrecoverable.

## Exam tips

- Control, audit, disable or rotate keys yourself -> customer managed KMS key.
- Encrypt data larger than 4 KB -> envelope encryption with data keys.
- Share encrypted snapshot/AMI cross-account -> use a customer managed key and share it via key policy.
- Encrypt in one region, decrypt in another with same key -> multi-region keys.
- Single-tenant HSM, full customer control, FIPS Level 3 with exclusive access -> CloudHSM.
- KMS throttling with S3 -> S3 Bucket Keys.

## Practice questions

**Q1.** A company must be able to audit every use of encryption keys and disable keys immediately if compromised. Which option meets this with the least effort?

- A. SSE-S3
- B. KMS customer managed keys
- C. AWS owned keys
- D. Client-side encryption with local keys

<details><summary>Answer</summary>

**B** - Customer managed keys can be disabled at any time and all usage is logged in CloudTrail.

_Domain: Design Secure Architectures_

</details>

**Q2.** An encrypted EBS snapshot (using the AWS managed key aws/ebs) must be shared with another account. What must be done?

- A. Share the snapshot directly
- B. Copy the snapshot re-encrypting with a customer managed key, share the key via key policy, then share the snapshot
- C. Decrypt the snapshot first
- D. Use S3 Cross-Region Replication

<details><summary>Answer</summary>

**B** - AWS managed key policies cannot be changed to allow other accounts. Re-encrypt with a customer managed key and share both.

_Domain: Design Secure Architectures_

</details>

**Q3.** An application must encrypt 2 GB files using KMS. What is the correct approach?

- A. Call KMS Encrypt directly on the file
- B. Use envelope encryption with GenerateDataKey and encrypt locally
- C. Split the file into 4 KB chunks and call Encrypt
- D. Use an asymmetric key

<details><summary>Answer</summary>

**B** - KMS Encrypt handles up to 4 KB; envelope encryption is used for larger data.

_Domain: Design Secure Architectures_

</details>

**Q4.** Regulations require that encryption keys are stored in single-tenant hardware that the company exclusively controls, with AWS having no access. What should be used?

- A. AWS KMS with AWS managed keys
- B. AWS CloudHSM
- C. AWS Secrets Manager
- D. SSE-S3

<details><summary>Answer</summary>

**B** - CloudHSM provides dedicated HSMs where only the customer manages keys and users.

_Domain: Design Secure Architectures_

</details>

**Q5.** A client application encrypts data in us-east-1 and the data must be decrypted in eu-west-1 during DR without re-encryption. What should be used?

- A. Two separate KMS keys
- B. A KMS multi-Region key
- C. CloudHSM in each region
- D. SSE-S3

<details><summary>Answer</summary>

**B** - Multi-Region keys share key material across regions so ciphertext can be decrypted in the replica region.

_Domain: Design Resilient Architectures_

</details>
