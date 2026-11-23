import {allPaths} from '@/content/site';
export default function sitemap(){return allPaths().map(path=>({url:'https://tmsg-institutions-motion.singh-aghoreshwar.chatgpt.site'+(path==='/'?'':path),changeFrequency:'monthly' as const,priority:path==='/'?1:.6}));}
