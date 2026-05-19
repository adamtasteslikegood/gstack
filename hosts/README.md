
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

## Follow-up: `setup --host pi` support landed

This branch now patches the real `setup` script so `./setup --host pi` works,
not just `bun run gen:skill-docs --host pi`.

### What changed

- Added Pi-specific setup paths in the installer.
- Updated `--host` validation/help text to include `pi`.
- Extended setup handling so the Pi host is recognized by the real install flow.

For the exact implementation details, see the commit or PR that introduced this
change rather than duplicating the full patch in this README.
 done
 
 case "$HOST" in
-  claude|codex|kiro|factory|opencode|auto) ;;
+  claude|codex|kiro|factory|opencode|pi|auto) ;;
   openclaw)
     echo ""
     echo "OpenClaw integration uses a different model — OpenClaw spawns Claude Code"
@@ -91,7 +93,7 @@ case "$HOST" in
     echo "GBrain setup and brain skills ship from the GBrain repo."
     echo ""
     exit 0 ;;
-  *) echo "Unknown --host value: $HOST (expected claude, codex, kiro, factory, opencode, openclaw, hermes, gbrain, or auto)" >&2; exit 1 ;;
+  *) echo "Unknown --host value: $HOST (expected claude, codex, kiro, factory, opencode, pi, openclaw, hermes, gbrain, or auto)" >&2; exit 1 ;;
 esac
 
 # ─── Resolve skill prefix preference ─────────────────────────
@@ -155,14 +157,16 @@ INSTALL_CODEX=0
 INSTALL_KIRO=0
 INSTALL_FACTORY=0
 INSTALL_OPENCODE=0
+INSTALL_PI=0
 if [ "$HOST" = "auto" ]; then
   command -v claude >/dev/null 2>&1 && INSTALL_CLAUDE=1
   command -v codex >/dev/null 2>&1 && INSTALL_CODEX=1
   command -v kiro-cli >/dev/null 2>&1 && INSTALL_KIRO=1
   command -v droid >/dev/null 2>&1 && INSTALL_FACTORY=1
   command -v opencode >/dev/null 2>&1 && INSTALL_OPENCODE=1
+  command -v pi >/dev/null 2>&1 && INSTALL_PI=1
   # If none found, default to claude
-  if [ "$INSTALL_CLAUDE" -eq 0 ] && [ "$INSTALL_CODEX" -eq 0 ] && [ "$INSTALL_KIRO" -eq 0 ] && [ "$INSTALL_FACTORY" -eq 0 ] && [ "$INSTALL_OPENCODE" -eq 0 ]; then
+  if [ "$INSTALL_CLAUDE" -eq 0 ] && [ "$INSTALL_CODEX" -eq 0 ] && [ "$INSTALL_KIRO" -eq 0 ] && [ "$INSTALL_FACTORY" -eq 0 ] && [ "$INSTALL_OPENCODE" -eq 0 ] && [ "$INSTALL_PI" -eq 0 ]; then
     INSTALL_CLAUDE=1
   fi
 elif [ "$HOST" = "claude" ]; then
@@ -175,6 +179,8 @@ elif [ "$HOST" = "factory" ]; then
   INSTALL_FACTORY=1
 elif [ "$HOST" = "opencode" ]; then
   INSTALL_OPENCODE=1
+elif [ "$HOST" = "pi" ]; then
+  INSTALL_PI=1
 fi
 
 migrate_direct_codex_install() {
@@ -321,6 +327,16 @@ if [ "$INSTALL_OPENCODE" -eq 1 ] && [ "$NEEDS_BUILD" -eq 0 ]; then
   )
 fi
 
+# 1e. Generate .pi/ Pi skill docs
+if [ "$INSTALL_PI" -eq 1 ] && [ "$NEEDS_BUILD" -eq 0 ]; then
+  log "Generating .pi/ skill docs..."
+  (
+    cd "$SOURCE_GSTACK_DIR"
+    bun install --frozen-lockfile 2>/dev/null || bun install
+    bun run gen:skill-docs --host pi
+  )
+fi
+
 # 2. Ensure Playwright's Chromium is available
 if ! ensure_playwright_browser; then
   echo "Installing Playwright Chromium..."
@@ -763,6 +779,107 @@ link_opencode_skill_dirs() {
   fi
 }
 
+create_pi_runtime_root() {
+  local gstack_dir="$1"
+  local pi_gstack="$2"
+  local pi_dir="$gstack_dir/.pi/skills"
+
+  if [ -L "$pi_gstack" ]; then
+    rm -f "$pi_gstack"
+  elif [ -d "$pi_gstack" ] && [ "$pi_gstack" != "$gstack_dir" ]; then
+    rm -rf "$pi_gstack"
+  fi
+
+  mkdir -p "$pi_gstack" "$pi_gstack/browse" "$pi_gstack/design" "$pi_gstack/gstack-upgrade" "$pi_gstack/review" "$pi_gstack/qa" "$pi_gstack/plan-devex-review"
+
+  if [ -f "$pi_dir/gstack/SKILL.md" ]; then
+    ln -snf "$pi_dir/gstack/SKILL.md" "$pi_gstack/SKILL.md"
+  fi
+  if [ -d "$gstack_dir/bin" ]; then
+    ln -snf "$gstack_dir/bin" "$pi_gstack/bin"
+  fi
+  if [ -d "$gstack_dir/browse/dist" ]; then
+    ln -snf "$gstack_dir/browse/dist" "$pi_gstack/browse/dist"
+  fi
+  if [ -d "$gstack_dir/browse/bin" ]; then
+    ln -snf "$gstack_dir/browse/bin" "$pi_gstack/browse/bin"
+  fi
+  if [ -d "$gstack_dir/design/dist" ]; then
+    ln -snf "$gstack_dir/design/dist" "$pi_gstack/design/dist"
+  fi
+  if [ -f "$pi_dir/gstack-upgrade/SKILL.md" ]; then
+    ln -snf "$pi_dir/gstack-upgrade/SKILL.md" "$pi_gstack/gstack-upgrade/SKILL.md"
+  fi
+  for f in checklist.md design-checklist.md greptile-triage.md TODOS-format.md; do
+    if [ -f "$gstack_dir/review/$f" ]; then
+      ln -snf "$gstack_dir/review/$f" "$pi_gstack/review/$f"
+    fi
+  done
+  if [ -d "$gstack_dir/review/specialists" ]; then
+    ln -snf "$gstack_dir/review/specialists" "$pi_gstack/review/specialists"
+  fi
+  if [ -d "$gstack_dir/qa/templates" ]; then
+    ln -snf "$gstack_dir/qa/templates" "$pi_gstack/qa/templates"
+  fi
+  if [ -d "$gstack_dir/qa/references" ]; then
+    ln -snf "$gstack_dir/qa/references" "$pi_gstack/qa/references"
+  fi
+  if [ -f "$gstack_dir/plan-devex-review/dx-hall-of-fame.md" ]; then
+    ln -snf "$gstack_dir/plan-devex-review/dx-hall-of-fame.md" "$pi_gstack/plan-devex-review/dx-hall-of-fame.md"
+  fi
+  if [ -f "$gstack_dir/ETHOS.md" ]; then
+    ln -snf "$gstack_dir/ETHOS.md" "$pi_gstack/ETHOS.md"
+  fi
+}
+
+link_pi_skill_dirs() {
+  local gstack_dir="$1"
+  local skills_dir="$2"
+  local pi_dir="$gstack_dir/.pi/skills"
+  local linked=()
+
+  if [ ! -d "$pi_dir" ]; then
+    echo "  Generating .pi/ skill docs..."
+    ( cd "$gstack_dir" && bun run gen:skill-docs --host pi )
+  fi
+
+  if [ ! -d "$pi_dir" ]; then
+    echo "  warning: .pi/skills/ generation failed — run 'bun run gen:skill-docs --host pi' manually" >&2
+    return 1
+  fi
+
+  for skill_dir in "$pi_dir"/gstack*/; do
+    if [ -f "$skill_dir/SKILL.md" ]; then
+      skill_name="$(basename "$skill_dir")"
+      [ "$skill_name" = "gstack" ] && continue
+      target="$skills_dir/$skill_name"
+      if [ -L "$target" ] || [ ! -e "$target" ]; then
+        ln -snf "$skill_dir" "$target"
+        linked+=("$skill_name")
+      fi
+    fi
+  done
+
+  if [ -d "$pi_dir/gstack-office-hours" ]; then
+    local repo_office_hours_alias="$pi_dir/office-hours"
+    if [ -L "$repo_office_hours_alias" ] || [ ! -e "$repo_office_hours_alias" ]; then
+      ln -snf "$pi_dir/gstack-office-hours" "$repo_office_hours_alias"
+    fi
+  fi
+
+  if [ -d "$skills_dir/gstack-office-hours" ]; then
+    local office_hours_alias="$skills_dir/office-hours"
+    if [ -L "$office_hours_alias" ] || [ ! -e "$office_hours_alias" ]; then
+      ln -snf "$skills_dir/gstack-office-hours" "$office_hours_alias"
+      linked+=("office-hours")
+    fi
+  fi
+
+  if [ ${#linked[@]} -gt 0 ]; then
+    echo "  linked skills: ${linked[*]}"
+  fi
+}
+
 # 4. Install for Claude (default)
 SKILLS_BASENAME="$(basename "$INSTALL_SKILLS_DIR")"
 SKILLS_PARENT_BASENAME="$(basename "$(dirname "$INSTALL_SKILLS_DIR")")"
@@ -935,6 +1052,16 @@ if [ "$INSTALL_OPENCODE" -eq 1 ]; then
   echo "  opencode skills: $OPENCODE_SKILLS"
 fi
 
+# 6d. Install for Pi
+if [ "$INSTALL_PI" -eq 1 ]; then
+  mkdir -p "$PI_SKILLS"
+  create_pi_runtime_root "$SOURCE_GSTACK_DIR" "$PI_GSTACK"
+  link_pi_skill_dirs "$SOURCE_GSTACK_DIR" "$PI_SKILLS"
+  echo "gstack ready (pi)."
+  echo "  browse: $BROWSE_BIN"
+  echo "  pi skills: $PI_SKILLS"
+fi
+
 # 7. Create .agents/ sidecar symlinks for the real Codex skill target.
 # The root Codex skill ends up pointing at $SOURCE_GSTACK_DIR/.agents/skills/gstack,
 # so the runtime assets must live there for both global and repo-local installs.

diff --git a/test/gen-skill-docs.test.ts b/test/gen-skill-docs.test.ts
index 7249a448..be0c3a6c 100644
--- a/test/gen-skill-docs.test.ts
+++ b/test/gen-skill-docs.test.ts
@@ -2245,9 +2245,9 @@ describe('setup script validation', () => {
     expect(fnBody).toContain('rm -f "$target"');
   });
 
-  test('setup supports --host auto|claude|codex|kiro|opencode', () => {
+  test('setup supports --host auto|claude|codex|kiro|opencode|pi', () => {
     expect(setupContent).toContain('--host');
-    expect(setupContent).toContain('claude|codex|kiro|factory|opencode|auto');
+    expect(setupContent).toContain('claude|codex|kiro|factory|opencode|pi|auto');
   });
 
   test('auto mode detects claude, codex, kiro, and opencode binaries', () => {
@@ -2296,6 +2296,18 @@ describe('setup script validation', () => {
     expect(setupContent).toContain('dx-hall-of-fame.md');
   });
 
+  test('setup supports --host pi with Pi skill path vars and runtime assets', () => {
+    expect(setupContent).toContain('INSTALL_PI=');
+    expect(setupContent).toContain('PI_SKILLS="$HOME/.pi/agent/skills"');
+    expect(setupContent).toContain('PI_GSTACK="$PI_SKILLS/gstack"');
+    expect(setupContent).toContain('create_pi_runtime_root');
+    expect(setupContent).toContain('bun run gen:skill-docs --host pi');
+    expect(setupContent).toContain('review/specialists');
+    expect(setupContent).toContain('qa/templates');
+    expect(setupContent).toContain('qa/references');
+    expect(setupContent).toContain('office-hours');
+  });
+
   test('create_agents_sidecar links runtime assets', () => {
     // Sidecar must link bin, browse, review, qa
     const fnStart = setupContent.indexOf('create_agents_sidecar()');

diff --git a/test/host-config.test.ts b/test/host-config.test.ts
index 57705703..7b59db0f 100644
--- a/test/host-config.test.ts
+++ b/test/host-config.test.ts
@@ -22,6 +22,7 @@ import {
   slate,
   cursor,
   openclaw,
+  pi,
 } from '../hosts/index';
 import { HOST_PATHS } from '../scripts/resolvers/types';
 
@@ -30,8 +31,8 @@ const ROOT = path.resolve(import.meta.dir, '..');
 // ─── hosts/index.ts ─────────────────────────────────────────
 
 describe('hosts/index.ts', () => {
-  test('ALL_HOST_CONFIGS has 10 hosts', () => {
-    expect(ALL_HOST_CONFIGS.length).toBe(10);
+  test('ALL_HOST_CONFIGS has 11 hosts', () => {
+    expect(ALL_HOST_CONFIGS.length).toBe(11);
   });
 
   test('ALL_HOST_NAMES matches config names', () => {
@@ -48,6 +49,7 @@ describe('hosts/index.ts', () => {
     expect(opencode.name).toBe('opencode');
     expect(slate.name).toBe('slate');
     expect(cursor.name).toBe('cursor');
     expect(openclaw.name).toBe('openclaw');
+    expect(pi.name).toBe('pi');
   });
```
