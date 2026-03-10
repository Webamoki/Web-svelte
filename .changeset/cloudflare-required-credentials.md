---
'@webamoki/web-svelte': minor
---

BREAKING: sendEmail now requires AWS credentials as arguments. The awsRegion, awsAccessKeyId, and awsSecretAccessKey fields are now required in SendEmailOptions and will not fallback to process.env. This ensures proper Cloudflare Workers compatibility where process.env is not available.
