
# Explaining pi integration with gstack                --  by chat gpt5.4  == provder: github-copilot harness: pi (fresh run on a new VM)**                                                                                                                  
                                                                                                                                                                       
 I think the user is looking for guidance on adding Pi as a host to gstack, especially in the context of extending Pi. They shared specific documentation, suggesting  
 they want help adapting that info for Pi. I should explain how to create a new host config for Pi in gstack, mentioning that Pi loads skills from certain directories 
 like /.pi/agent/skills and also from the project’s instructions. I'll propose a HostConfig for Pi based on this understanding.                                        
                                                                                                                                                                       
## Mapping pi config fields for gstack                                                                                                                                   
                                                                                                                                                                       
 I see that the user provided a gstack host config system, so I should help them map the necessary fields for Pi. I think I need to specify parameters like: name and  
 displayName for Pi, and maybe a command like 'pi.' The global path might be a bit tricky since it’s likely relative to home. Based on the docs, I think the global    
 skills path is /.pi/agent/skills. I also need to consider how skills and directories with SKILL.md files are organized for proper command matching.                   
                                                                                                                                                                       
 ## Setting up pi paths for gstack                                                                                                                                        
                                                                                                                                                                       
 Looking at their example, the globalRoot is set to '.myhost/skills/gstack', which suggests that runtimeRoot includes directories like gstack-review. For Pi, I think  
 it makes sense to set the globalRoot to '.pi/agent/skills' and localSkillRoot to '.pi/skills.' This way, it aligns better with how skills are organized under the Pi  
 framework. I’m just ensuring that the directory structure supports the functionality that gstack requires.                                                            
                                                                                                                                                                       
 ### Exploring installation paths                                                                                                                                          
                                                                                                                                                                       
 I’m thinking about leveraging the existing Claude gstack install. It seems like I could use .agents/skills instead of .pi/skills. However, the host configuration     
 might be specific to each host. I wonder if I could use .agents/skills project locally to enhance compatibility. Maybe I should consider globalRoot as                
 .pi/agent/skills and localSkillRoot as .agents/skills, but they might prefer the native pi path. It's certainly worth a closer look!                                  
                                                                                                                                                                       
 ### Considering adding a new host                                                                                                                                         
                                                                                                                                                                       
 The user pasted "Adding a New Host to gstack," so they're likely looking for help with adding pi. I should explain the specific changes for pi in gstack, noting that 
 it doesn't require a custom host as it loads /.claude/skills. If they want a first-class native host, I’ll provide the necessary file skeleton, index, and            
 .gitignore. I might also need to reference the AGENTS.md docs to clarify changes for team mode, especially about the .pi/skills directory. I can pull information     
 from existing docs for this.                                                                                                                                          
                                                                                                                                                                       
 ### Deciding on fields                                                                                                                                                    
                                                                                                                                                                       
 I need to decide on the fields for the project. Since I'm not entirely sure about the exact HostConfig fields, I think it makes sense to stick to what's provided in  
 the user's pasted excerpt. This way, I can ensure that I'm aligning with their expectations and making the solution more relevant. It’s a good starting point without 
 overcomplicating things. I'll ensure I focus on those fields to craft a clear response!                                                                               

 Yes — pi is a good candidate for a native gstack host.                                                                                                                
                                                                                                                                                                       
 The main thing to watch is this:                                                                                                                                      
                                                                                                                                                                       
 - Claude-style skill invocation: /review                                                                                                                              
 - pi-style skill invocation: /skill:review                                                                                                                            
                                                                                                                                                                       
 That means adding pi is mostly straightforward, but you likely want either:                                                                                           
                                                                                                                                                                       
 1. a pi host config + adapter that rewrites skill command references, or                                                                                              
 2. a minimal host config and accept that docs/examples must say /skill:name in pi.                                                                                    
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 ## Easiest answer                                                                                                                                                        
                                                                                                                                                                       
 If you want first-class pi support in gstack, add:                                                                                                                    
                                                                                                                                                                       
 - hosts/pi.ts                                                                                                                                                         
 - one line in hosts/index.ts                                                                                                                                          
 - .pi/ to .gitignore                                                                                                                                                  
                                                                                                                                                                       
 And ideally a small adapter that rewrites references like:                                                                                                            
                                                                                                                                                                       
 - /browse → /skill:browse                                                                                                                                             
 - /review → /skill:review                                                                                                                                             
 - /qa → /skill:qa                                                                                                                                                     
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 ## Important pi-native paths                                                                                                                                             
                                                                                                                                                                       
 From pi’s skill docs, the native skill locations are:                                                                                                                 
                                                                                                                                                                       
 - Global: ~/.pi/agent/skills/                                                                                                                                         
 - Project: .pi/skills/                                                                                                                                                
 - Also supported: ~/.agents/skills/ and .agents/skills/                                                                                                               
                                                                                                                                                                       
 So the most natural gstack mapping for pi is:                                                                                                                         
                                                                                                                                                                       
 - globalRoot: .pi/agent/skills                                                                                                                                        
 - localSkillRoot: .pi/skills                                                                                                                                          
 - hostSubdir: .pi                                                                                                                                                     
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 Suggested hosts/pi.ts                                                                                                                                                 
                                                                                                                                                                       
 ```ts                                                                                                                                                                 
   import type { HostConfig } from '../scripts/host-config';                                                                                                           
                                                                                                                                                                       
   const pi: HostConfig = {                                                                                                                                            
     name: 'pi',                                                                                                                                                       
     displayName: 'Pi',                                                                                                                                                
     cliCommand: 'pi',                                                                                                                                                 
     cliAliases: [],                                                                                                                                                   
                                                                                                                                                                       
     globalRoot: '.pi/agent/skills',                                                                                                                                   
     localSkillRoot: '.pi/skills',                                                                                                                                     
     hostSubdir: '.pi',                                                                                                                                                
     usesEnvVars: true,                                                                                                                                                
                                                                                                                                                                       
     frontmatter: {                                                                                                                                                    
       mode: 'allowlist',                                                                                                                                              
       keepFields: [                                                                                                                                                   
         'name',                                                                                                                                                       
         'description',                                                                                                                                                
         'license',                                                                                                                                                    
         'compatibility',                                                                                                                                              
         'metadata',                                                                                                                                                   
         'allowed-tools',                                                                                                                                              
         'disable-model-invocation',                                                                                                                                   
       ],                                                                                                                                                              
       descriptionLimit: 1024,                                                                                                                                         
     },                                                                                                                                                                
                                                                                                                                                                       
     generation: {                                                                                                                                                     
       generateMetadata: false,                                                                                                                                        
       skipSkills: ['codex'],                                                                                                                                          
     },                                                                                                                                                                
                                                                                                                                                                       
     pathRewrites: [                                                                                                                                                   
       { from: '~/.claude/skills/gstack', to: '~/.pi/agent/skills' },                                                                                                  
       { from: '.claude/skills/gstack', to: '.pi/skills' },                                                                                                            
       { from: '.claude/skills', to: '.pi/skills' },                                                                                                                   
     ],                                                                                                                                                                
                                                                                                                                                                       
     runtimeRoot: {                                                                                                                                                    
       globalSymlinks: ['bin', 'browse/dist', 'browse/bin', 'gstack-upgrade', 'ETHOS.md'],                                                                             
       globalFiles: {                                                                                                                                                  
         review: ['checklist.md', 'TODOS-format.md'],                                                                                                                  
       },                                                                                                                                                              
     },                                                                                                                                                                
                                                                                                                                                                       
     install: {                                                                                                                                                        
       prefixable: false,                                                                                                                                              
       linkingStrategy: 'symlink-generated',                                                                                                                           
     },                                                                                                                                                                
                                                                                                                                                                       
     learningsMode: 'basic',                                                                                                                                           
                                                                                                                                                                       
     // Recommended if HostConfig supports it:                                                                                                                         
     // adapter: 'scripts/host-adapters/pi-adapter.ts',                                                                                                                
   };                                                                                                                                                                  
                                                                                                                                                                       
   export default pi;                                                                                                                                                  
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 Why this config fits pi                                                                                                                                               
                                                                                                                                                                       
 ### globalRoot: '.pi/agent/skills'                                                                                                                                    
                                                                                                                                                                       
 Because pi natively discovers skills from:                                                                                                                            
                                                                                                                                                                       
 ```text                                                                                                                                                               
   ~/.pi/agent/skills/                                                                                                                                                 
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ### localSkillRoot: '.pi/skills'                                                                                                                                      
                                                                                                                                                                       
 Because pi natively discovers project skills from:                                                                                                                    
                                                                                                                                                                       
 ```text                                                                                                                                                               
   .pi/skills/                                                                                                                                                         
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ### keepFields                                                                                                                                                        
                                                                                                                                                                       
 pi’s skills format is close to the Agent Skills spec, and it understands:                                                                                             
                                                                                                                                                                       
 - name                                                                                                                                                                
 - description                                                                                                                                                         
 - license                                                                                                                                                             
 - compatibility                                                                                                                                                       
 - metadata                                                                                                                                                            
 - allowed-tools                                                                                                                                                       
 - disable-model-invocation                                                                                                                                            
                                                                                                                                                                       
 So you can keep more than just name and description.                                                                                                                  
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 The real caveat: slash command syntax                                                                                                                                 
                                                                                                                                                                       
 This is the one place where pi differs in a way that matters.                                                                                                         
                                                                                                                                                                       
 In pi, skills are invoked as:                                                                                                                                         
                                                                                                                                                                       
 ```bash                                                                                                                                                               
   /skill:browse                                                                                                                                                       
   /skill:review                                                                                                                                                       
   /skill:qa                                                                                                                                                           
 ```                                                                                                                                                                   
                                                                                                                                                                       
 Not:                                                                                                                                                                  
                                                                                                                                                                       
 ```bash                                                                                                                                                               
   /browse                                                                                                                                                             
   /review                                                                                                                                                             
   /qa                                                                                                                                                                 
 ```                                                                                                                                                                   
                                                                                                                                                                       
 So if gstack content contains instructions like:                                                                                                                      
                                                                                                                                                                       
 │ Run /review                                                                                                                                                         
                                                                                                                                                                       
 that should become:                                                                                                                                                   
                                                                                                                                                                       
 │ Run /skill:review                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 Best fix: add a pi adapter                                                                                                                                            
                                                                                                                                                                       
 A pi adapter is the cleanest solution if lots of generated content mentions skill commands directly.                                                                  
                                                                                                                                                                       
 ### Example scripts/host-adapters/pi-adapter.ts                                                                                                                       
                                                                                                                                                                       
 ```ts                                                                                                                                                                 
   import type { HostConfig } from '../host-config';                                                                                                                   
                                                                                                                                                                       
   const SKILLS = [                                                                                                                                                    
     'office-hours',                                                                                                                                                   
     'plan-ceo-review',                                                                                                                                                
     'plan-eng-review',                                                                                                                                                
     'plan-design-review',                                                                                                                                             
     'design-consultation',                                                                                                                                            
     'design-shotgun',                                                                                                                                                 
     'design-html',                                                                                                                                                    
     'review',                                                                                                                                                         
     'ship',                                                                                                                                                           
     'land-and-deploy',                                                                                                                                                
     'canary',                                                                                                                                                         
     'benchmark',                                                                                                                                                      
     'browse',                                                                                                                                                         
     'connect-chrome',                                                                                                                                                 
     'qa',                                                                                                                                                             
     'qa-only',                                                                                                                                                        
     'design-review',                                                                                                                                                  
     'setup-browser-cookies',                                                                                                                                          
     'setup-deploy',                                                                                                                                                   
     'setup-gbrain',                                                                                                                                                   
     'retro',                                                                                                                                                          
     'investigate',                                                                                                                                                    
     'document-release',                                                                                                                                               
     'codex',                                                                                                                                                          
     'cso',                                                                                                                                                            
     'autoplan',                                                                                                                                                       
     'plan-devex-review',                                                                                                                                              
     'devex-review',                                                                                                                                                   
     'careful',                                                                                                                                                        
     'freeze',                                                                                                                                                         
     'guard',                                                                                                                                                          
     'unfreeze',                                                                                                                                                       
     'gstack-upgrade',                                                                                                                                                 
     'learn',                                                                                                                                                          
   ];                                                                                                                                                                  
                                                                                                                                                                       
   export function transform(content: string, _config: HostConfig): string {                                                                                           
     for (const skill of SKILLS) {                                                                                                                                     
       const from = new RegExp(`(^|\\s)/${skill}(?=\\s|$|[.,:;!?])`, 'gm');                                                                                            
       content = content.replace(from, `$1/skill:${skill}`);                                                                                                           
     }                                                                                                                                                                 
     return content;                                                                                                                                                   
   }                                                                                                                                                                   
 ```                                                                                                                                                                   
                                                                                                                                                                       
 Then in hosts/pi.ts:                                                                                                                                                  
                                                                                                                                                                       
 ```ts                                                                                                                                                                 
   adapter: 'scripts/host-adapters/pi-adapter.ts',                                                                                                                     
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 ### Register it                                                                                                                                                           
                                                                                                                                                                       
 In hosts/index.ts:                                                                                                                                                    
                                                                                                                                                                       
 ```ts                                                                                                                                                                 
   import pi from './pi';                                                                                                                                              
                                                                                                                                                                       
   export const ALL_HOST_CONFIGS: HostConfig[] = [                                                                                                                     
     claude,                                                                                                                                                           
     codex,                                                                                                                                                            
     factory,                                                                                                                                                          
     kiro,                                                                                                                                                             
     opencode,                                                                                                                                                         
     slate,                                                                                                                                                            
     cursor,                                                                                                                                                           
     openclaw,                                                                                                                                                         
     pi,                                                                                                                                                               
   ];                                                                                                                                                                  
                                                                                                                                                                       
   export {                                                                                                                                                            
     claude,                                                                                                                                                           
     codex,                                                                                                                                                            
     factory,                                                                                                                                                          
     kiro,                                                                                                                                                             
     opencode,                                                                                                                                                         
     slate,                                                                                                                                                            
     cursor,                                                                                                                                                           
     openclaw,                                                                                                                                                         
     pi,                                                                                                                                                               
   };                                                                                                                                                                  
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 Update .gitignore                                                                                                                                                     
                                                                                                                                                                       
 Add:                                                                                                                                                                  
                                                                                                                                                                       
 ```gitignore                                                                                                                                                          
   .pi/                                                                                                                                                                
 ```                                                                                                                                                                   
                                                                                                                                                                       
 If generated project-local skills are written there.                                                                                                                  
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 ### Verify                                                                                                                                                                
                                                                                                                                                                       
 ```bash                                                                                                                                                               
   bun run gen:skill-docs --host pi                                                                                                                                    
                                                                                                                                                                       
   ls .pi/skills/gstack-*/SKILL.md                                                                                                                                     
   grep -r ".claude/skills" .pi/skills/ | head                                                                                                                         
   grep -r "/review" .pi/skills/ | head                                                                                                                                
   grep -r "/skill:review" .pi/skills/ | head                                                                                                                          
 ```                                                                                                                                                                   
                                                                                                                                                                       
 You want:                                                                                                                                                             
                                                                                                                                                                       
 - no .claude/skills leakage                                                                                                                                           
 - skill references rewritten to /skill:name                                                                                                                           
                                                                                                                                                                       
 Then run:                                                                                                                                                             
                                                                                                                                                                       
 ```bash                                                                                                                                                               
   bun run gen:skill-docs --host all                                                                                                                                   
   bun run skill:check                                                                                                                                                 
   bun test test/gen-skill-docs.test.ts                                                                                                                                
   bun test test/host-config.test.ts                                                                                                                                   
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 ### README install section for pi                                                                                                                                         
                                                                                                                                                                       
 You’d also want a pi entry in the README’s “Other AI Agents” section, something like:                                                                                 
                                                                                                                                                                       
 ```md                                                                                                                                                                 
   ### Pi                                                                                                                                                              
                                                                                                                                                                       
   ```bash                                                                                                                                                             
   git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/gstack                                                                                 
   cd ~/gstack && ./setup --host pi                                                                                                                                    
 ```                                                                                                                                                                   
                                                                                                                                                                       
 This installs gstack skills to:                                                                                                                                       
                                                                                                                                                                       
 - ~/.pi/agent/skills/ for global use                                                                                                                                  
 - .pi/skills/ for project-local/team use                                                                                                                              
                                                                                                                                                                       
 In pi, invoke skills as:                                                                                                                                              
                                                                                                                                                                       
 - /skill:review                                                                                                                                                       
 - /skill:browse                                                                                                                                                       
 - /skill:qa                                                                                                                                                           
 - /skill:autoplan                                                                                                                                                     
 ```                                                                                                                                                                   
                                                                                                                                                                       
   ---                                                                                                                                                                 
                                                                                                                                                                       
   ## Optional: team-mode guidance for pi                                                                                                                              
                                                                                                                                                                       
   For pi, the project instruction file should usually be **`AGENTS.md`**, not `CLAUDE.md`.                                                                            
                                                                                                                                                                       
   A good repo-level snippet would be:                                                                                                                                 
                                                                                                                                                                       
   ```md                                                                                                                                                               
   ## gstack                                                                                                                                                           
                                                                                                                                                                       
   Use gstack skills via `/skill:<name>`.                                                                                                                              
                                                                                                                                                                       
   For web browsing, use `/skill:browse`.                                                                                                                              
                                                                                                                                                                       
   Common skills:                                                                                                                                                      
   - /skill:office-hours                                                                                                                                               
   - /skill:review                                                                                                                                                     
   - /skill:ship                                                                                                                                                       
   - /skill:browse                                                                                                                                                     
   - /skill:qa                                                                                                                                                         
   - /skill:cso                                                                                                                                                        
   - /skill:autoplan                                                                                                                                                   
   - /skill:retro                                                                                                                                                      
   - /skill:investigate                                                                                                                                                
 ```                                                                                                                                                                   
                                                                                                                                                                       
 That matches pi better than Claude-specific wording.                                                                                                                  
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 ## One important shortcut: you may not need a pi host at all                                                                                                             
                                                                                                                                                                       
 Because pi can already load Claude skills from external directories, the lowest-effort option is:                                                                     
                                                                                                                                                                       
 ```json                                                                                                                                                               
   {                                                                                                                                                                   
     "skills": ["~/.claude/skills"]                                                                                                                                    
   }                                                                                                                                                                   
 ```                                                                                                                                                                   
                                                                                                                                                                       
 in ~/.pi/settings.json.                                                                                                                                               
                                                                                                                                                                       
 That works today, without changing gstack.                                                                                                                            
                                                                                                                                                                       
 So:                                                                                                                                                                   
                                                                                                                                                                       
 - if you want quick compatibility, just point pi at ~/.claude/skills                                                                                                  
 - if you want clean native pi support, add the pi host above                                                                                                          
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 #### Recommendation                                                                                                                                                        
                                                                                                                                                                       
 I’d do this:                                                                                                                                                          
                                                                                                                                                                       
 1. add hosts/pi.ts                                                                                                                                                    
 2. add a pi adapter for /skill: rewrites                                                                                                                              
 3. use:                                                                                                                                                               
     - ~/.pi/agent/skills globally                                                                                                                                     
     - .pi/skills locally                                                                                                                                              
 4. update README with pi-specific examples                                                                                                                            
 5. add an AGENTS.md snippet for team mode                                                                                                                             
                                                                                                                                                                       
 If you want, I can draft the exact hosts/pi.ts and pi-adapter.ts files ready to paste into gstack.                                                                    

                                                                                                                                                                       
 ok.. Sounds good!                                                                                                                                                     
                                                                                                                                                                       

 Great.                                                                                                                                                                
                                                                                                                                                                       
 If you want, I can next give you either:                                                                                                                              
                                                                                                                                                                       
 1. ready-to-paste hosts/pi.ts                                                                                                                                         
 2. ready-to-paste scripts/host-adapters/pi-adapter.ts                                                                                                                 
 3. both files plus the hosts/index.ts diff                                                                                                                            
 4. a README section for pi install/use                                                                                                                                
 5. an AGENTS.md snippet for team mode                                                                                                                                 
                                                                                                                                                                       
 If you want the fastest path, say: “give me both files”.                                                                                                              

                                                                                                                                                                       
 give me both files plus  3-5 please :)                                                                                                                                
                                                                                                                                                                       

 ## Awesome — here’s a ready-to-paste starter pack.                                                                                                                       
                                                                                                                                                                       
 1) hosts/pi.ts                                                                                                                                                        
                                                                                                                                                                       
 ```ts                                                                                                                                                                 
   import type { HostConfig } from '../scripts/host-config';                                                                                                           
                                                                                                                                                                       
   const pi: HostConfig = {                                                                                                                                            
     name: 'pi',                                                                                                                                                       
     displayName: 'Pi',                                                                                                                                                
     cliCommand: 'pi',                                                                                                                                                 
     cliAliases: [],                                                                                                                                                   
                                                                                                                                                                       
     // Pi-native skill locations:                                                                                                                                     
     //   Global: ~/.pi/agent/skills/                                                                                                                                  
     //   Project: .pi/skills/                                                                                                                                         
     globalRoot: '.pi/agent/skills',                                                                                                                                   
     localSkillRoot: '.pi/skills',                                                                                                                                     
     hostSubdir: '.pi',                                                                                                                                                
     usesEnvVars: true,                                                                                                                                                
                                                                                                                                                                       
     frontmatter: {                                                                                                                                                    
       mode: 'allowlist',                                                                                                                                              
       keepFields: [                                                                                                                                                   
         'name',                                                                                                                                                       
         'description',                                                                                                                                                
         'license',                                                                                                                                                    
         'compatibility',                                                                                                                                              
         'metadata',                                                                                                                                                   
         'allowed-tools',                                                                                                                                              
         'disable-model-invocation',                                                                                                                                   
       ],                                                                                                                                                              
       descriptionLimit: 1024,                                                                                                                                         
     },                                                                                                                                                                
                                                                                                                                                                       
     generation: {                                                                                                                                                     
       generateMetadata: false,                                                                                                                                        
       skipSkills: ['codex'],                                                                                                                                          
     },                                                                                                                                                                
                                                                                                                                                                       
     pathRewrites: [                                                                                                                                                   
       { from: '~/.claude/skills/gstack', to: '~/.pi/agent/skills' },                                                                                                  
       { from: '.claude/skills/gstack', to: '.pi/skills' },                                                                                                            
       { from: '.claude/skills', to: '.pi/skills' },                                                                                                                   
       { from: 'CLAUDE.md', to: 'AGENTS.md' },                                                                                                                         
     ],                                                                                                                                                                
                                                                                                                                                                       
     runtimeRoot: {                                                                                                                                                    
       globalSymlinks: ['bin', 'browse/dist', 'browse/bin', 'gstack-upgrade', 'ETHOS.md'],                                                                             
       globalFiles: {                                                                                                                                                  
         review: ['checklist.md', 'TODOS-format.md'],                                                                                                                  
       },                                                                                                                                                              
     },                                                                                                                                                                
                                                                                                                                                                       
     install: {                                                                                                                                                        
       prefixable: false,                                                                                                                                              
       linkingStrategy: 'symlink-generated',                                                                                                                           
     },                                                                                                                                                                
                                                                                                                                                                       
     learningsMode: 'basic',                                                                                                                                           
                                                                                                                                                                       
     // Needed because Pi invokes skills as /skill:name rather than /name                                                                                              
     adapter: 'scripts/host-adapters/pi-adapter.ts',                                                                                                                   
   };                                                                                                                                                                  
                                                                                                                                                                       
   export default pi;                                                                                                                                                  
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 2) scripts/host-adapters/pi-adapter.ts                                                                                                                                
                                                                                                                                                                       
 ```ts                                                                                                                                                                 
   import type { HostConfig } from '../host-config';                                                                                                                   
                                                                                                                                                                       
   const SKILL_NAMES = [                                                                                                                                               
     'office-hours',                                                                                                                                                   
     'plan-ceo-review',                                                                                                                                                
     'plan-eng-review',                                                                                                                                                
     'plan-design-review',                                                                                                                                             
     'design-consultation',                                                                                                                                            
     'design-shotgun',                                                                                                                                                 
     'design-html',                                                                                                                                                    
     'review',                                                                                                                                                         
     'ship',                                                                                                                                                           
     'land-and-deploy',                                                                                                                                                
     'canary',                                                                                                                                                         
     'benchmark',                                                                                                                                                      
     'browse',                                                                                                                                                         
     'connect-chrome',                                                                                                                                                 
     'qa',                                                                                                                                                             
     'qa-only',                                                                                                                                                        
     'design-review',                                                                                                                                                  
     'setup-browser-cookies',                                                                                                                                          
     'setup-deploy',                                                                                                                                                   
     'setup-gbrain',                                                                                                                                                   
     'retro',                                                                                                                                                          
     'investigate',                                                                                                                                                    
     'document-release',                                                                                                                                               
     'codex',                                                                                                                                                          
     'cso',                                                                                                                                                            
     'autoplan',                                                                                                                                                       
     'plan-devex-review',                                                                                                                                              
     'devex-review',                                                                                                                                                   
     'careful',                                                                                                                                                        
     'freeze',                                                                                                                                                         
     'guard',                                                                                                                                                          
     'unfreeze',                                                                                                                                                       
     'gstack-upgrade',                                                                                                                                                 
     'learn',                                                                                                                                                          
   ];                                                                                                                                                                  
                                                                                                                                                                       
   // Escape regex metacharacters just in case                                                                                                                         
   function escapeRegex(value: string): string {                                                                                                                       
     return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');                                                                                                              
   }                                                                                                                                                                   
                                                                                                                                                                       
   export function transform(content: string, _config: HostConfig): string {                                                                                           
     let out = content;                                                                                                                                                
                                                                                                                                                                       
     for (const skill of SKILL_NAMES) {                                                                                                                                
       const escaped = escapeRegex(skill);                                                                                                                             
                                                                                                                                                                       
       // Rewrite bare skill command references:                                                                                                                       
       //   /review -> /skill:review                                                                                                                                   
       // while avoiding double-prefixing existing /skill:review                                                                                                       
       const pattern = new RegExp(`(^|[^\\w:])\\/(?!skill:)(${escaped})(?=\\b|[./,:;!?)]|$)`, 'gm');                                                                   
       out = out.replace(pattern, `$1/skill:$2`);                                                                                                                      
     }                                                                                                                                                                 
                                                                                                                                                                       
     return out;                                                                                                                                                       
   }                                                                                                                                                                   
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 3) hosts/index.ts diff                                                                                                                                                
                                                                                                                                                                       
 ```diff                                                                                                                                                               
   +import pi from './pi';                                                                                                                                             
                                                                                                                                                                       
    export const ALL_HOST_CONFIGS: HostConfig[] = [                                                                                                                    
   -  claude, codex, factory, kiro, opencode, slate, cursor, openclaw                                                                                                  
   +  claude, codex, factory, kiro, opencode, slate, cursor, openclaw, pi                                                                                              
    ];                                                                                                                                                                 
                                                                                                                                                                       
   -export { claude, codex, factory, kiro, opencode, slate, cursor, openclaw };                                                                                        
   +export { claude, codex, factory, kiro, opencode, slate, cursor, openclaw, pi };                                                                                    
 ```                                                                                                                                                                   
                                                                                                                                                                       
 Also add this to .gitignore:                                                                                                                                          
                                                                                                                                                                       
 ```gitignore                                                                                                                                                          
   .pi/                                                                                                                                                                
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 4) README section for pi                                                                                                                                              
                                                                                                                                                                       
 You can drop this into the “Other AI Agents” section.                                                                                                                 
                                                                                                                                                                       
 ```md                                                                                                                                                                 
   ### Pi                                                                                                                                                              
                                                                                                                                                                       
   gstack supports Pi natively.                                                                                                                                        
                                                                                                                                                                       
   Install:                                                                                                                                                            
                                                                                                                                                                       
   ```bash                                                                                                                                                             
   git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/gstack                                                                                 
   cd ~/gstack && ./setup --host pi                                                                                                                                    
 ```                                                                                                                                                                   
                                                                                                                                                                       
 This installs generated gstack skills into Pi's native skill locations:                                                                                               
                                                                                                                                                                       
 - Global: ~/.pi/agent/skills/                                                                                                                                         
 - Project-local/team mode: .pi/skills/                                                                                                                                
                                                                                                                                                                       
 Use skills in Pi with /skill:<name>:                                                                                                                                  
                                                                                                                                                                       
 ```text                                                                                                                                                               
   /skill:review                                                                                                                                                       
   /skill:browse                                                                                                                                                       
   /skill:qa                                                                                                                                                           
   /skill:autoplan                                                                                                                                                     
   /skill:cso                                                                                                                                                          
   /skill:retro                                                                                                                                                        
 ```                                                                                                                                                                   
                                                                                                                                                                       
 Unlike Claude Code, Pi invokes skills with the /skill: prefix. The Pi host adapter rewrites generated references automatically.                                       
                                                                                                                                                                       
 If you want teammates to get gstack in a shared repo, commit the project-local .pi/skills/ setup and add repo guidance in AGENTS.md.                                  
                                                                                                                                                                       
 ```                                                                                                                                                                   
                                                                                                                                                                       
   If you want a slightly fuller table entry, add Pi here too:                                                                                                         
                                                                                                                                                                       
   ```md                                                                                                                                                               
   | Agent | Flag | Skills install to |                                                                                                                                
   |-------|------|-------------------|                                                                                                                                
   | Pi | `--host pi` | `~/.pi/agent/skills/` |                                                                                                                        
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────         

5) AGENTS.md snippet for team mode                                                                                                                                    
                                                                                                                                                                       
 ```md                                                                                                                                                                 
   ## gstack                                                                                                                                                           
                                                                                                                                                                       
   This repository uses gstack with Pi.                                                                                                                                
                                                                                                                                                                       
   When a task matches a gstack workflow, use the corresponding Pi skill via `/skill:<name>`.                                                                          
                                                                                                                                                                       
   ### Key rule                                                                                                                                                        
                                                                                                                                                                       
   - For web browsing, use `/skill:browse`.                                                                                                                            
   - Do not use ad-hoc browser tooling when `/skill:browse` fits the task.                                                                                             
                                                                                                                                                                       
   ### Common skills                                                                                                                                                   
                                                                                                                                                                       
   - `/skill:office-hours`                                                                                                                                             
   - `/skill:review`                                                                                                                                                   
   - `/skill:ship`                                                                                                                                                     
   - `/skill:land-and-deploy`                                                                                                                                          
   - `/skill:canary`                                                                                                                                                   
   - `/skill:benchmark`                                                                                                                                                
   - `/skill:browse`                                                                                                                                                   
   - `/skill:qa`                                                                                                                                                       
   - `/skill:qa-only`                                                                                                                                                  
   - `/skill:investigate`                                                                                                                                              
   - `/skill:document-release`                                                                                                                                         
   - `/skill:cso`                                                                                                                                                      
   - `/skill:autoplan`                                                                                                                                                 
   - `/skill:retro`                                                                                                                                                    
   - `/skill:careful`                                                                                                                                                  
                                                                                                                                                                       
   ### Examples                                                                                                                                                        
                                                                                                                                                                       
   - Security audit: `Load gstack. Run /skill:cso`                                                                                                                     
   - Code review: `Load gstack. Run /skill:review`                                                                                                                     
   - QA a URL: `Load gstack. Run /skill:qa https://...`                                                                                                                
   - Build a feature end-to-end: `Load gstack. Run /skill:autoplan, implement the plan, then run /skill:ship`                                                          
   - Plan before building: `Load gstack. Run /skill:office-hours then /skill:autoplan. Save the plan, do not implement`                                                
 ```                                                                                                                                                                   
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 ## Quick verify checklist                                                                                                                                                
                                                                                                                                                                       
 After adding the files:                                                                                                                                               
                                                                                                                                                                       
 ```bash                                                                                                                                                               
   bun run gen:skill-docs --host pi                                                                                                                                    
   bun run skill:check                                                                                                                                                 
   bun test test/gen-skill-docs.test.ts                                                                                                                                
   bun test test/host-config.test.ts                                                                                                                                   
 ```                                                                                                                                                                   
                                                                                                                                                                       
 And sanity-check output:                                                                                                                                              
                                                                                                                                                                       
 ```bash                                                                                                                                                               
   grep -r ".claude/skills" .pi/skills/ | head                                                                                                                         
   grep -r "CLAUDE.md" .pi/skills/ | head                                                                                                                              
   grep -r "/skill:review" .pi/skills/ | head                                                                                                                          
 ```                                                                                                                                                                   
                                                                                                                                                                       
 You want:                                                                                                                                                             
                                                                                                                                                                       
 - no .claude/skills leakage                                                                                                                                           
 - no CLAUDE.md leakage                                                                                                                                                
 - rewritten /skill:... references                                                                                                                                     
                                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                                      
                                                                                                                                                                       
 One small caveat                                                                                                                                                      
                                                                                                                                                                       
 If your HostConfig interface uses slightly different field names than the ones in your docs/examples, keep the structure but rename fields to match your repo’s       
 actual scripts/host-config.ts.                                                                                                                                        



** In response too pasted: garrytan/gstack/docs/ADDING_A_HOST.md follow up to "How do I extend Pi?"  Auther: Chat GPT 5.4 Pasted by: Adam Schoen GStack by Gary Tan (Note: Garry Tan had nothing to with these extentesion to `README.md`, this file or `hosts/pi.ts`, `scripts/host-adaptors/pi-adaptor.ts`
Licence: MIT 

MIT License

Copyright (c) 2026 chatgpt 5.4 and Adam Schoen, contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
