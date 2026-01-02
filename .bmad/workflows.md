# BMAD Workflows Guide

## The 4 Phases

### Phase 1: ANALYSIS (Optional)

#### Brainstorming Workflow
**Command**: `*brainstorming`
- **Purpose**: Guided ideation with creative techniques
- **Output**: Ideas document in `.bmad/analysis/brainstorming/`
- **Use when**: Starting new features, exploring solutions

#### Research Workflow
**Command**: `*research`
- **Purpose**: Market, domain, or technical research
- **Output**: Research findings in `.bmad/analysis/research/`
- **Use when**: Need competitive analysis, technology evaluation

#### Product Brief Creation
**Command**: `*create-product-brief`
- **Purpose**: High-level vision document
- **Output**: Product brief in `.bmad/analysis/product-brief.md`
- **Use when**: Defining overall product direction

---

### Phase 2: PLANNING (Required)

#### PRD Creation (BMAD Method)
**Command**: `*create-prd`
- **Purpose**: Full Product Requirements Document
- **Output**: PRD in `.bmad/planning/prd.md`
- **Typical stories**: 10-50+
- **Use when**: Complex features, new products

#### Tech Spec Creation (Quick Flow)
**Command**: `*create-tech-spec`
- **Purpose**: Quick specification for small features
- **Output**: Tech spec in `.bmad/planning/tech-spec.md`
- **Typical stories**: 1-15
- **Use when**: Bug fixes, small enhancements

#### UX Design
**Command**: `*create-ux-design`
- **Purpose**: UI/UX specifications
- **Output**: UX designs in `.bmad/planning/ux-design/`
- **Use when**: User-facing features

---

### Phase 3: SOLUTIONING (Required for BMAD Method)

#### Architecture Creation
**Command**: `*create-architecture`
- **Purpose**: Technical design decisions
- **Output**: Architecture doc in `.bmad/solutioning/architecture.md`
- **Includes**: System design, database schema, API contracts

#### Epics & Stories Creation
**Command**: `*create-epics-and-stories`
- **Purpose**: Break PRD into implementable units
- **Output**: Epics and stories in `.bmad/solutioning/epics/` and `.bmad/solutioning/stories/`

#### Readiness Check
**Command**: `*check-implementation-readiness`
- **Purpose**: Validate all documents align
- **Output**: Readiness report
- **Checks**: PRD completeness, architecture clarity, story definition

---

### Phase 4: IMPLEMENTATION (Required)

#### Sprint Planning
**Command**: `*sprint-planning`
- **Purpose**: Initialize sprint tracking
- **Output**: Sprint plan in `.bmad/implementation/sprints/sprint-{n}/`
- **Creates**: Sprint backlog, velocity tracking

#### Create Story
**Command**: `*create-story`
- **Purpose**: Prepare individual story for development
- **Output**: Story card with acceptance criteria
- **Includes**: Story details, tasks, estimates

#### Dev Story
**Command**: `*dev-story`
- **Purpose**: Implement story with TDD
- **Process**: 
  1. Write failing tests
  2. Implement feature
  3. Refactor code
  4. Document changes
- **Output**: Implemented code + tests

#### Code Review
**Command**: `*code-review`
- **Purpose**: Adversarial quality review
- **Checks**:
  - Code quality
  - Test coverage
  - Security issues
  - Best practices
- **Output**: Review report with recommendations

#### Quick Dev
**Command**: `*quick-dev`
- **Purpose**: Fast implementation (skip planning)
- **Use when**: Urgent fixes, trivial changes
- **Warning**: Bypasses BMAD workflow - use sparingly

---

## Planning Tracks Comparison

| Track | Best For | Required Docs | Typical Stories |
|-------|----------|---------------|-----------------|
| **Quick Flow** | Bug fixes, small features | Tech-spec only | 1-15 |
| **BMAD Method** | Products, complex features | PRD + UX + Architecture | 10-50+ |
| **Enterprise** | Large systems, compliance | Method + Security/DevOps | 30+ |

---

## Workflow Examples

### Example 1: New Feature (BMAD Method)
```
*create-prd
*create-ux-design
*create-architecture
*create-epics-and-stories
*check-implementation-readiness
*sprint-planning
*dev-story
*code-review
```

### Example 2: Bug Fix (Quick Flow)
```
*create-tech-spec
*quick-dev
*code-review
```

### Example 3: Product Ideation
```
*brainstorming
*research
*create-product-brief
*create-prd
[continue with BMAD Method...]
```

---

## Best Practices

1. **Don't skip planning** - Even quick fixes benefit from specs
2. **Use appropriate track** - Match workflow to task complexity
3. **Review readiness** - Always check before implementation
4. **Document decisions** - Architecture choices should be recorded
5. **Test-driven development** - Write tests first
6. **Code review everything** - Quality over speed

---

## Current Project Status

- **Active Phase**: Ready for all phases
- **Planning Track**: BMAD Method
- **Sprint**: Not started
- **Backlog**: Empty (ready for stories)

Start by running `*create-prd` or `*create-tech-spec` based on your needs!
