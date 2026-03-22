## Task 1

### Homomorphic Encryption: Current State for Practical Use

**Answer:** Homomorphic encryption (HE) is transitioning from research to early production use in narrow domains, but it is not ready for general-purpose production deployment.

**Key Barriers:**

1. **Performance**: FHE operations can be 1,000x slower than partial HE methods. From Gentry's 2009 breakthrough (30 minutes per bit operation), performance has improved dramatically but remains orders of magnitude slower than plaintext computation.

2. **Developer complexity**: Developers must understand noise budgets, bootstrapping, scheme selection (BFV, BGV, CKKS, TFHE), and parameter tuning -- all concepts foreign to typical application developers.

3. **Hardware acceleration not yet delivered**: Multiple sources project 1000x speedups from custom ASICs, but these are projections, not shipping products.

**Where it works today:**
- Blockchain/Web3 privacy (sealed-bid auctions, confidential smart contracts)
- Simple analytics on encrypted data
- Regulated data sharing where privacy requirements justify the performance penalty

**Comparison:**

| Criterion | FHE | Partial HE | TEEs | MPC |
|-----------|-----|-----------|------|-----|
| Flexibility | Arbitrary | Single op type | Arbitrary | Arbitrary |
| Performance overhead | 1000x+ | Minimal | Near-native | 10-1000x |
| Trust model | Zero trust | Zero trust | Trust hardware | Trust protocol |
| Maturity | Early production | Mature | Production | Growing |

**Recommendation:** Consider FHE only where data-in-use privacy is a hard regulatory requirement and latency tolerance is high. Start with partial HE if your use case requires only additions or only multiplications. Monitor hardware acceleration developments.

---

## Task 2

### Top 3 Approaches to AI Alignment Research

**The three dominant approaches:**

**1. RLHF and Variants (dominant production approach)**
- Trains reward models on human preference rankings; powers ChatGPT, Claude, Llama
- Strengths: Immediate, measurable improvements in model behavior
- Weaknesses: The "Alignment Trilemma" proves RLHF cannot simultaneously capture diverse human values, remain tractable, and resist adversarial manipulation. Models assign >99% probability to majority opinions, functionally erasing minority perspectives. Sycophancy and reward hacking are common.

**2. Scalable Oversight / Constitutional AI**
- Addresses the problem that humans cannot reliably evaluate superhuman AI outputs
- Techniques: AI debate, recursive reward modeling, weak-to-strong generalization, Constitutional AI (self-critique against principles)
- Strengths: Designed for the superhuman regime; reduces dependence on individual human judgments
- Weaknesses: Untested against truly superhuman systems; bootstrapping problem (trusting AI to verify AI)

**3. Mechanistic Interpretability**
- Reverse-engineers neural network internals to verify alignment properties directly
- Strengths: Could provide alignment guarantees no behavioral testing can match
- Weaknesses: Works on small models; scaling to hundreds of billions of parameters remains unclear

**Comparison:**

| Criterion | RLHF | Scalable Oversight | Interpretability |
|-----------|------|-------------------|-----------------|
| Production readiness | High | Medium | Low |
| Scales to superhuman AI | Poor | Designed for it, unproven | Theoretically strongest |
| Captures value diversity | Poor | Better | N/A |
| Robustness to deception | Weak | Medium | Strong |

**Emerging consensus:** Production systems already combine approaches. Alignment is dynamic and bidirectional, not static one-way fitting.

---

## Task 3

### Serverless Computing: Did It Deliver? (2018-2025)

**Answer:** Serverless partially delivered. It succeeded at reducing operational overhead and enabling pay-per-use pricing for event-driven workloads. It failed to replace traditional architectures for most workloads.

**Promise-by-promise assessment:**

| Promise | Verdict | Notes |
|---------|---------|-------|
| No server management | Partially delivered | Concerns shifted (cold starts, connection pooling), not eliminated |
| Pay for what you use | Delivered with caveats | Great for bursty/low-volume; expensive for sustained high-throughput |
| Automatic scaling | Mostly delivered | Works transparently; scale-to-zero introduces cold starts |
| Future of all cloud computing | Not delivered | One tool among many; containers/VMs remain dominant for stateful workloads |
| No vendor lock-in | Not delivered | Lock-in at language, trigger, and ecosystem levels |

**Key data:**
- Over 70% of AWS customers use at least one serverless solution
- Container-based serverless (Cloud Run) growing fastest
- Frontend deployment (Vercel, Netlify, Cloudflare Workers) is the leading emerging use case
- Cold starts remain a challenge: up to 7 seconds in some regions

**Where serverless thrived:** API backends, event processing, scheduled tasks, webhook handlers, frontend deployment.

---

## Task 4

### Why Google+ Failed: Non-Obvious Lessons

**Answer:** Google+ failed because it was a defensive response to Facebook, not a product solving a genuine user need. Google leveraged its user base through forced integration, creating resentment rather than engagement.

**Non-obvious lessons:**

1. **Forced distribution is anti-correlated with engagement.** Users coerced into creating accounts (via Gmail, YouTube forced integration) had no intrinsic motivation. Average daily usage: 3-5 seconds vs. hours on Facebook. Distribution advantage only works when the product independently delivers value.

2. **Defensive products driven by competitive fear tend to fail.** "We need to compete with X" is not a product strategy. Successful Google products (Search, Maps, Gmail) each solved a problem better than any alternative. Google+ solved no unserved need.

3. **Network effects work both ways.** Users checked Google+ and found their friends inactive. Unlike Search or Maps which deliver value to individual users, a social network without an active graph delivers zero value.

4. **Organizational structure predicted failure.** The team was isolated; employee bonuses were tied to Google+ engagement, creating perverse incentives that damaged healthy products.

5. **Premature scaling is destructive even with unlimited resources.** Google tried to scale to billions before achieving product-market fit with anyone. Successful social networks all started with narrow, engaged communities.

The data breaches (500,000+ users in 2018, 52.5M in second incident) were the proximate cause of shutdown, not the root cause of failure.

---

## Task 5

### The Replication Crisis in Psychology

**Answer:** The crisis was genuinely severe (fewer than 40% replicated in the 2015 landmark study), but the field has responded with measurable reforms. A 2025 meta-analysis of 240,000 papers shows improvements across every subdiscipline.

**How bad was it?**
- 2015 Open Science Collaboration: only 36-39% of 100 studies replicated
- Effect sizes in replications were on average half the originals
- Social psychology was most vulnerable; cognitive psychology fared better
- Causes were structural: publication bias, p-hacking, underpowered studies, perverse career incentives

**What has changed since 2015?**

| Metric | Before (~2010) | After (~2023) |
|--------|---------------|---------------|
| Social psych median sample | ~80-100 | ~250 |
| Other fields sample sizes | Baseline | 50-100% increase |
| Statistical robustness | Weak | Improved across all subdisciplines |
| Incentives | Novelty rewarded | Robust findings get more citations |
| Institutional reforms | None | Pre-registration, Registered Reports, open data |

**But reforms are incomplete:**
- Pre-registrations are often never made public
- Adoption of open-science practices remains slow (2024 study)
- Critics argue the focus on methodology misses a deeper theoretical poverty
- Complaints about these issues date back to 1897; Cohen (1994) and Meehl (1978) raised identical concerns

**Key gap:** No one has replicated the 2015 study using post-reform papers to see if the success rate has actually improved. This is the most important missing data point.

**Recommendation:** Treat pre-2015 social psychology findings with skepticism unless independently replicated. Post-2015 research in journals requiring pre-registration is substantially more trustworthy, but not immune to error.
