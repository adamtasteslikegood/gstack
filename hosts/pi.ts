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
