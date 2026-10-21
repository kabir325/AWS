/* Shared data container. Every data file calls svc({...}) to register a service.
 *
 * Service shape:
 *   id, name, cat (category id), imp (exam importance 1-3), tag (one-line summary)
 *   s:    sections [{ h: 'Heading', i: [[label, detail, [optional child items]] ...] }]
 *   tips: exam tips (strings)
 *   q:    questions [{ q, o: [options], a: index | [indexes], e: explanation, d: domain 1-4 }]
 */
window.AWS = {
  exam: {
    code: 'SAA-C03',
    questions: 65,
    scored: 50,
    minutes: 130,
    passScaled: 720,
    format: 'Multiple choice (1 correct of 4) and multiple response (2+ correct of 5+)'
  },
  categories: [
    { id: 'foundations', name: 'Foundations', color: '#f59e0b', blurb: 'Global infrastructure, Well-Architected Framework, disaster recovery' },
    { id: 'compute', name: 'Compute', color: '#f97316', blurb: 'EC2, Auto Scaling, load balancing, Lambda, containers' },
    { id: 'storage', name: 'Storage', color: '#22c55e', blurb: 'S3, EBS, EFS, FSx, hybrid storage, backup' },
    { id: 'database', name: 'Database', color: '#3b82f6', blurb: 'RDS, Aurora, DynamoDB, ElastiCache, purpose-built DBs' },
    { id: 'networking', name: 'Networking & Content Delivery', color: '#8b5cf6', blurb: 'VPC, hybrid connectivity, Route 53, CloudFront, Global Accelerator' },
    { id: 'security', name: 'Security, Identity & Compliance', color: '#ef4444', blurb: 'IAM, Organizations, KMS, secrets, Cognito, edge and threat protection' },
    { id: 'integration', name: 'Application Integration', color: '#ec4899', blurb: 'SQS, SNS, EventBridge, Kinesis, Step Functions, API Gateway' },
    { id: 'management', name: 'Management & Governance', color: '#14b8a6', blurb: 'CloudWatch, CloudTrail, Config, Systems Manager, CloudFormation, cost' },
    { id: 'analytics', name: 'Analytics & Machine Learning', color: '#6366f1', blurb: 'Athena, Glue, Redshift, EMR, OpenSearch, AI services' },
    { id: 'migration', name: 'Migration & Transfer', color: '#84cc16', blurb: 'DMS, MGN, DataSync, Transfer Family, Snow Family' },
    { id: 'other', name: 'Other Services', color: '#94a3b8', blurb: 'Services you only need to recognize' }
  ],
  domains: {
    1: 'Design Secure Architectures',
    2: 'Design Resilient Architectures',
    3: 'Design High-Performing Architectures',
    4: 'Design Cost-Optimized Architectures'
  },
  domainWeights: { 1: 30, 2: 26, 3: 24, 4: 20 },
  services: [],
  scenarios: [],
  cheats: {}
};

window.svc = function (o) { window.AWS.services.push(o); };
