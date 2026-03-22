# Research Agent Roles

Proposed specialized agents for conducting rigorous research, mirroring how coding agents decompose software tasks. Roles are derived from systematic review methodology (Cochrane, PRISMA), academic research team structures, and AI-assisted research workflows.

---

## Core Research Lifecycle

### 1. Research Strategist
**Purpose:** Designs the overall research plan — question formulation, methodology selection, scope definition.
- Translates vague topics into precise, answerable research questions (PICO/PICOTS frameworks)
- Selects appropriate review type (systematic, scoping, rapid, narrative, meta-analysis)
- Defines inclusion/exclusion criteria, target databases, and timelines
- Produces a research protocol document before any work begins
- Analogous to a Principal Investigator scoping a study

### 2. Literature Scout
**Purpose:** Exhaustive search and retrieval of relevant sources across databases and grey literature.
- Builds multi-database search strategies (keyword expansion, Boolean logic, MeSH/controlled vocabulary)
- Covers academic databases, preprints (arXiv, bioRxiv), grey literature, conference proceedings, patents
- Handles backward/forward citation chasing (snowballing)
- Produces deduplicated, structured reference lists with retrieval metadata
- Analogous to a research librarian / information specialist

### 3. Screening Reviewer
**Purpose:** Applies inclusion/exclusion criteria to candidate sources, deciding what enters the review.
- Reads titles, abstracts, and full texts against predefined eligibility criteria
- Flags borderline cases with rationale for inclusion or exclusion
- Produces PRISMA-style flow data (identified → screened → eligible → included)
- Documents reasons for exclusion at each stage
- Analogous to an independent screener in systematic review teams

### 4. Data Extractor
**Purpose:** Systematically pulls structured data from included studies into standardized tables.
- Extracts study characteristics: design, population, intervention, outcomes, sample size, key findings
- Handles heterogeneous source formats (quantitative, qualitative, mixed-methods)
- Flags missing data, inconsistencies, and items requiring author contact
- Outputs clean, tabular extraction forms ready for synthesis
- Analogous to the data extraction phase in evidence synthesis

### 5. Quality Assessor
**Purpose:** Evaluates methodological rigor and risk of bias in included studies.
- Applies standard quality appraisal tools (GRADE, Cochrane Risk of Bias, Newcastle-Ottawa, CASP, JBI)
- Assesses internal validity, external validity, reporting completeness
- Rates evidence strength per outcome (high/moderate/low/very low)
- Produces a bias assessment matrix with justifications
- Analogous to a methodology expert / quality appraiser

### 6. Evidence Synthesizer
**Purpose:** Integrates findings across studies into coherent narrative or quantitative synthesis.
- Identifies themes, patterns, contradictions, and gaps across the evidence base
- Performs thematic synthesis, framework synthesis, or narrative synthesis
- For quantitative work: identifies whether meta-analysis is appropriate (heterogeneity check)
- Produces synthesis tables, evidence maps, and summary-of-findings tables
- Analogous to the lead analyst composing the results section

### 7. Statistical Analyst
**Purpose:** Performs quantitative analysis — meta-analysis, effect size computation, heterogeneity testing.
- Computes pooled effect sizes (OR, RR, SMD, WMD) with confidence intervals
- Runs heterogeneity tests (I-squared, Q-test, tau-squared), subgroup analyses, sensitivity analyses
- Generates forest plots, funnel plots, and publication bias tests (Egger, Begg)
- Handles meta-regression for exploring moderators
- Analogous to a biostatistician / quantitative methods expert

---

## Critical Thinking & Validation

### 8. Devil's Advocate
**Purpose:** Challenges findings, assumptions, and conclusions to stress-test the research.
- Searches for counter-evidence and alternative explanations
- Identifies logical fallacies, confirmation bias, cherry-picking, and overgeneralization
- Questions causal claims, effect size plausibility, and ecological validity
- Proposes alternative interpretations of the same data
- No direct analogue in traditional teams — addresses the well-known problem of groupthink in research

### 9. Gap Analyst
**Purpose:** Identifies what the literature does NOT cover — the white spaces.
- Maps the terrain of existing evidence to find unstudied populations, contexts, or variables
- Distinguishes between "not studied" and "studied but inconclusive"
- Connects gaps to practical or theoretical significance
- Produces prioritized research agenda recommendations
- Analogous to the "implications for future research" section, but done systematically

---

## Domain & Context Specialists

### 10. Domain Expert
**Purpose:** Provides deep subject-matter knowledge to contextualize findings.
- Interprets technical terminology, field-specific methods, and domain norms
- Identifies seminal works, key debates, and foundational theories in the field
- Validates whether extracted findings are plausible within domain context
- Flags when research crosses disciplinary boundaries requiring additional expertise
- Analogous to the subject matter expert on a review team

### 11. Methodologist
**Purpose:** Advises on research design, ensuring methodological coherence and rigor.
- Recommends appropriate study designs for the research question
- Validates that synthesis methods match the data types and review objectives
- Ensures protocol adherence throughout the review process
- Reviews reporting against standards (PRISMA, MOOSE, ENTREQ, RAMESES)
- Analogous to the methodological expert on a Cochrane review team

---

## Communication & Output

### 12. Research Writer
**Purpose:** Transforms raw findings into clear, structured, publication-ready prose.
- Writes introduction/background sections with proper literature positioning
- Composes methods sections with reproducibility in mind
- Drafts results with appropriate hedging and precision
- Produces discussion sections that connect findings to broader implications
- Analogous to the lead author / manuscript drafter

### 13. Visual Communicator
**Purpose:** Creates figures, tables, diagrams, and visual summaries of research findings.
- Designs evidence maps, concept maps, and causal diagrams
- Produces PRISMA flow diagrams, forest plots, summary-of-findings tables
- Creates infographics and visual abstracts for dissemination
- Handles data visualization choices (chart type selection, color accessibility)
- Analogous to a scientific illustrator / data visualization specialist

### 14. Research Translator
**Purpose:** Converts academic findings into actionable insights for non-academic audiences.
- Writes policy briefs, executive summaries, and practitioner guides
- Translates statistical findings into plain language (absolute vs. relative risk, NNT)
- Adapts messaging for different stakeholders (policymakers, practitioners, public)
- Identifies implementation considerations and real-world applicability
- Analogous to a knowledge broker / science communicator

---

## Integrity & Process

### 15. Reproducibility Auditor
**Purpose:** Verifies that every step of the research process is documented and reproducible.
- Checks that search strategies are fully reproducible (databases, dates, exact queries)
- Validates that screening decisions are traceable and justified
- Ensures data extraction is consistent and verifiable against source material
- Reviews the entire pipeline for undocumented judgment calls
- Analogous to the transparency/reproducibility standards enforced by PROSPERO and Cochrane

### 16. Source Validator
**Purpose:** Assesses the credibility, provenance, and reliability of individual sources.
- Checks publication venue reputation, author credentials, funding disclosures
- Identifies predatory journals, retracted papers, and preprints not yet peer-reviewed
- Cross-references claims against primary data sources
- Flags conflicts of interest and potential publication bias
- Analogous to a fact-checker combined with a librarian's source evaluation role

---

## Orchestration

### 17. Research Coordinator
**Purpose:** Manages the overall research workflow, ensuring stages connect and nothing falls through.
- Tracks progress across all research phases (search → screen → extract → synthesize → write)
- Manages handoffs between specialist agents (e.g., extractor output feeds into synthesizer)
- Resolves conflicts between agents (disagreements on inclusion, quality ratings)
- Maintains the master protocol and ensures deviations are documented
- Analogous to the project manager / team leader in a systematic review team

---

## Notes on Design Philosophy

- **Separation of concerns:** Each role handles one cognitive function, enabling parallel execution and clear accountability — same principle as coding agents
- **Verification built in:** Quality Assessor, Devil's Advocate, Reproducibility Auditor, and Source Validator provide multi-layered verification, mirroring how code-reviewer, security-reviewer, and test-automator work in the coding pipeline
- **Composability:** Not every research task needs all 17 roles. A quick literature scan might use only Scout + Screener + Synthesizer. A full systematic review uses the complete pipeline
- **Domain-agnostic:** These roles work across fields (medicine, CS, social science, policy). The Domain Expert role is the plug-in point for field-specific knowledge
