# AWS Global Accelerator

> Two static anycast IPs that route TCP/UDP traffic over the AWS backbone to the closest healthy regional endpoint.

Category: **Networking & Content Delivery** | Exam importance: **- | [Back to index](../README.md)

## Contents

- [How it works](#how-it-works)
- [Global Accelerator vs CloudFront](#global-accelerator-vs-cloudfront)
- [Exam tips](#exam-tips)
- [Practice questions](#practice-questions)

## How it works

- **Anycast IPs** - Two static IPv4 addresses (or bring your own) announced from all edge locations. Users enter the AWS network at the nearest edge.
- **Endpoints** - ALB, NLB, EC2 instances, Elastic IPs in one or more regions (endpoint groups per region with traffic dials and weights).
- **Health checks** - Automatic failover to healthy endpoints in under a minute; no DNS caching issues because IPs never change.
- **Client IP preservation** - Supported for ALB and EC2 endpoints.
- **Security** - Shield Standard by default.

## Global Accelerator vs CloudFront

- **CloudFront** - Caches content at the edge; HTTP/HTTPS; static and dynamic web content.
- **Global Accelerator** - No caching; proxies TCP/UDP packets to regional endpoints. Gaming (UDP), IoT (MQTT), VoIP, apps needing static IPs or fast deterministic regional failover.
- **Both** - Use the AWS global network and edge locations; both integrate with Shield.

## Exam tips

- Static IPs for a global application + fast regional failover -> Global Accelerator.
- UDP gaming / VoIP / IoT globally -> Global Accelerator (CloudFront is HTTP only).
- Need to cache content -> CloudFront, not Global Accelerator.
- Partners whitelist IPs but app uses ALBs in multiple regions -> Global Accelerator.

## Practice questions

**Q1.** A multiplayer gaming company uses UDP and wants to reduce latency and jitter for players worldwide while providing fast failover between regions. Which service should be used?

- A. Amazon CloudFront
- B. AWS Global Accelerator
- C. Route 53 latency routing
- D. S3 Transfer Acceleration

<details><summary>Answer</summary>

**B** - Global Accelerator supports UDP and routes over the AWS backbone with fast health-based failover.

_Domain: Design High-Performing Architectures_

</details>

**Q2.** Customers must whitelist a small, fixed set of IP addresses for an application that runs behind ALBs in two regions. What should be used?

- A. Elastic IPs on each ALB
- B. AWS Global Accelerator
- C. CloudFront with geo restriction
- D. Route 53 multivalue answers

<details><summary>Answer</summary>

**B** - Global Accelerator provides two static anycast IPs in front of regional ALBs.

_Domain: Design High-Performing Architectures_

</details>

**Q3.** What is a key difference between CloudFront and Global Accelerator?

- A. Only CloudFront uses edge locations
- B. Global Accelerator caches content, CloudFront does not
- C. CloudFront caches content; Global Accelerator proxies TCP/UDP traffic without caching
- D. Global Accelerator only supports HTTP

<details><summary>Answer</summary>

**C** - CloudFront is a caching CDN for HTTP(S). Global Accelerator improves performance for TCP/UDP apps without caching.

_Domain: Design High-Performing Architectures_

</details>
