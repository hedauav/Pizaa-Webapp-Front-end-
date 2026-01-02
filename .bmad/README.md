# BMAD Framework - SliceMaster Pizza Webapp

## Overview

This project uses **BMAD (Breakthrough Method for Agile AI-Driven Development)** - a structured framework for AI-assisted software development.

## Quick Start

### Available Commands

#### Phase 1: Analysis (Optional)
```
*brainstorming    - Start guided ideation session
*research         - Conduct market/technical research
*create-product-brief - Create high-level vision document
```

#### Phase 2: Planning (Required)
```
*create-prd       - Create Product Requirements Document
*create-tech-spec - Create quick technical specification
*create-ux-design - Create UI/UX specifications
```

#### Phase 3: Solutioning (Required for BMAD Method)
```
*create-architecture        - Design technical architecture
*create-epics-and-stories  - Break PRD into implementation units
*check-implementation-readiness - Validate document alignment
```

#### Phase 4: Implementation (Required)
```
*sprint-planning  - Initialize sprint tracking
*create-story     - Prepare story for development
*dev-story        - Implement story with TDD
*code-review      - Conduct quality review
*quick-dev        - Fast implementation (skip planning)
```

## Project Structure

```
.bmad/
├── config.yml              # BMAD configuration
├── README.md              # This file
├── analysis/              # Phase 1 outputs
├── planning/              # Phase 2 outputs (PRD, Tech Specs)
├── solutioning/           # Phase 3 outputs (Architecture, Stories)
└── implementation/        # Phase 4 outputs (Sprints, Code Reviews)
```

## Current Setup

- **Planning Track**: BMAD Method (full PRD + UX + Architecture)
- **Sprint Duration**: 14 days
- **Testing**: TDD required, 80% coverage target
- **Code Review**: Required before merging

## Getting Started with BMAD

1. **Define Your Feature/Task**
   - Start with *create-product-brief or *create-prd

2. **Plan the Solution**
   - Create technical specifications with *create-tech-spec
   - Design UX with *create-ux-design (if needed)

3. **Design Architecture**
   - Run *create-architecture for technical design
   - Break down into stories with *create-epics-and-stories

4. **Implement**
   - Plan sprint with *sprint-planning
   - Develop stories using *dev-story
   - Review code with *code-review

## Project Context

**Frontend**: HTML/CSS/JavaScript responsive pizza webapp
**Backend**: Java Spring Boot with MySQL database
**Features**: User authentication, pizza menu, cart, orders, payments

## Best Practices

✅ Always create specifications before coding
✅ Follow TDD approach for implementation
✅ Conduct code reviews for quality assurance
✅ Track progress using sprint planning
✅ Document architectural decisions

## Quick Development

For small fixes or features, use:
```
*quick-dev - Fast implementation without full BMAD workflow
```

---

**BMAD Philosophy**: Move from chaotic AI prompts → structured specifications → predictable outputs
