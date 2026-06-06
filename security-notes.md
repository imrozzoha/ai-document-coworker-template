# Security Notes

## Sample Data Only

This template ships with three fictional sample documents. They contain no real client data, personal information, or confidential business content. Do not replace sample documents with real client data in a public repository.

## Client Data Guidelines

- Process client documents only within client-approved, access-controlled environments.
- Never upload client documents to public repositories, shared storage, or unauthenticated APIs.
- For production deployments, use private S3 buckets, encrypted storage, and IAM-controlled access.

## Human Review Required

AI-generated answers from documents must be reviewed by a qualified human before use in:

- Legal matters (contracts, agreements, compliance)
- Financial decisions (payments, obligations, penalties)
- HR processes (entitlements, disciplinary actions, leave)
- Medical or health-related documents
- Any situation where an error has material consequences

This disclaimer is displayed in the UI and must be preserved in all production deployments.

## API Keys

- API keys (OpenAI, Anthropic) are loaded from environment variables only.
- Never hardcode API keys in source code.
- Never commit `.env.local` or any file containing real API keys to version control.
- Rotate API keys regularly and restrict them to required permissions only.
- In production, use a secrets manager (AWS Secrets Manager, HashiCorp Vault) rather than `.env` files.

## No Secrets in GitHub

The `.gitignore` excludes `.env`, `.env.local`, and `.env.*.local`. Verify this before pushing to any repository. Use `git status` to confirm no secret files are staged.

## Production Hardening Checklist

Before deploying to a production or client environment:

- [ ] Add authentication (e.g., NextAuth.js, Clerk, AWS Cognito)
- [ ] Implement rate limiting on API routes
- [ ] Add input validation and sanitisation
- [ ] Enable audit logging for all document queries
- [ ] Restrict CORS to known origins
- [ ] Store documents in private, encrypted storage (e.g., AWS S3 with KMS)
- [ ] Use a secrets manager for API keys
- [ ] Set up monitoring and alerting (e.g., AWS CloudWatch, Datadog)
- [ ] Review and update the AI provider's data retention and privacy policies
- [ ] Obtain client sign-off on the data processing approach

## Document Upload (TODO)

If enabling document upload (not included in this starter):

- Validate file type and size server-side
- Scan uploaded files for malware
- Store uploads in private storage, not in the Next.js public directory
- Apply per-user or per-session access controls
- Delete uploaded files after processing if they are not needed for caching

## Responsible AI Use

- Clearly label all AI-generated content in the UI
- Display the human review disclaimer on every answer
- Do not use this template for autonomous decision-making without human oversight
- Follow the AI provider's acceptable use policy
