import type { Metadata } from 'next';
import './corporate.css';
import './editorial.css';
import './inner-pages.css';
import './motion.css';
export const metadata:Metadata={title:{default:'TMSG - Institutions Built for the Future',template:'%s | TMSG'},description:'The Mrityunjay Shahi Group. An India-rooted business group building across healthcare, wellness, real estate, hospitality and emerging ventures.',icons:{icon:'/favicon.svg'},openGraph:{title:'TMSG - Institutions Built for the Future',description:'India-rooted. Future-focused. Globally minded.',images:['/images/india-city.webp']}};
const motionBoot = "(function(){try{var saved=localStorage.getItem('tmsg-motion');var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(saved?saved==='on':!reduce)document.documentElement.classList.add('tmsg-motion')}catch(e){}})()";
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><script dangerouslySetInnerHTML={{__html:motionBoot}}/>{children}</body></html>;}
