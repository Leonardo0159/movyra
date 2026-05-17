---
name: generate-prd
description: Use when asked to generate a PRD (Product Requirements Document) or product requirements.
---

# PRD Generator

## When to use
- User asks for a PRD, product requirements document, or product spec
- User wants to formalize feature requirements before implementation

## Process

1. **Gather context** — Ask clarifying questions if the feature scope is unclear:
   - Target users and personas
   - Problem being solved
   - Success metrics
   - Constraints and dependencies

2. **Generate the PRD** using this structure:

```markdown
# PRD: <Feature Name>

## Overview
Brief description of the feature and the problem it solves.

## Goals
- Primary goal
- Secondary goals

## Non-Goals
- What is explicitly out of scope

## Target Users
- Persona 1: description
- Persona 2: description

## User Stories
1. As a [user], I want to [action] so that [benefit]
2. ...

## Requirements

### Functional
- FR-1: ...
- FR-2: ...

### Non-Functional
- NF-1: Performance, security, accessibility, etc.

## Success Metrics
- Metric 1: how it will be measured
- Metric 2: ...

## Dependencies
- External services, APIs, other teams, etc.

## Timeline & Milestones
- Phase 1: ...
- Phase 2: ...

## Open Questions
- Items that need clarification or decisions
```

3. **Review with the user** — Ask for feedback and iterate before finalizing.

## Guidelines
- Keep descriptions concise and actionable
- Prioritize clarity over verbosity
- Use measurable success metrics
- Flag assumptions explicitly
- Write in Portuguese unless the team convention is English
