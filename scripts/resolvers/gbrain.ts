/**
 * GBrain resolver — brain-first lookup and save-to-brain for thinking skills.
 *
 * GBrain is a "mod" for gstack. When installed, coding skills become brain-aware:
 * they search the brain for context before starting and save results after finishing.
 *
 * These resolvers are suppressed on ALL hosts except gbrain (via suppressedResolvers
 * in each host config). For non-gbrain hosts, {{GBRAIN_CONTEXT_LOAD}} and
 * {{GBRAIN_SAVE_RESULTS}} resolve to empty string and vanish from the output.
 */
import type { TemplateContext } from './types';

export function generateGBrainContextLoad(_ctx: TemplateContext): string {
  return `## Brain Context Load

Before starting this skill, search your brain for relevant context:

1. Search GBrain: \`gbrain query "<topic from user request>"\`
2. If results found, read the top 3 pages for context
3. Use this brain context to inform your analysis

If GBrain is not available or returns no results, proceed without brain context.`;
}

export function generateGBrainSaveResults(ctx: TemplateContext): string {
  const skillSaveMap: Record<string, string> = {
    'office-hours': 'Save the design document as a brain page: `gbrain put_page` with the design doc content, tagged with the project slug and "design-doc".',
    'investigate': 'Save the root cause analysis as a brain page: `gbrain put_page` with the investigation findings, tagged with affected files and "investigation".',
    'plan-ceo-review': 'Save the CEO plan as a brain page: `gbrain put_page` with the scope decisions and vision, tagged with the feature slug and "ceo-plan".',
    'retro': 'Save the retrospective as a brain page: `gbrain put_page` with the retro output, tagged with the date range and "retro".',
  };

  const saveInstruction = skillSaveMap[ctx.skillName] || 'Save the skill output as a brain page if the results are worth preserving.';

  return `## Save Results to Brain

After completing this skill, persist the results to your brain for future reference:

${saveInstruction}

Add backlinks to related brain pages if they exist. If GBrain is not available, skip this step.`;
}
