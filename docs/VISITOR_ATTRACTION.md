# Visitor attraction (future)

Milestone 05.3A does **not** implement visitors, irrigators, inventors, dialogue, or recruitment.

When those systems exist, appearance chance must stay probabilistic:

```text
visitor final weight =
  base visitor weight
  × applicable village attraction modifiers
```

Example:

```text
Inventor slime
baseWeight: 1

simple automatic irrigator present:
multiplier: 4

finalWeight: 4
```

Principles:

- Modifiers increase probability. They never guarantee a visitor.
- Random selection happens only among currently eligible visitors.
- Zero-weight visitors cannot appear.
- Duplicate copies of one structure type do not stack unless the modifier says they do.
- Unavailable visitors stay excluded regardless of attraction.
- Existing residents cannot appear again as visitors.
- Invited / waiting residents cannot be selected again.
- Randomness must be injectable / seedable in tests.

Helper: `visitorFinalWeight` in `src/simulation/visitorAttraction.ts`.
