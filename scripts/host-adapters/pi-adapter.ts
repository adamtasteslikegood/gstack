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
