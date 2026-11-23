import Website from '@/components/Website';
import { allPaths,businesses,groupLinks } from '@/content/site';
import {stories} from '@/content/stories';
import {notFound} from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params; const path='/'+slug.join('/'); const brand=businesses.find(b=>b.slug===slug[0]);const story=stories.find(s=>'/news/'+s.slug===path);return {title:story?story.title:brand?brand.name+(slug[1]?' - '+slug[1]:''):groupLinks.find(x=>x[1]===path)?.[0]||'TMSG'};}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const path='/'+slug.join('/');if(!allPaths().includes(path))notFound();return <Website path={path}/>;}
