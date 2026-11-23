import { env } from 'cloudflare:workers';
import { z } from 'zod';
const field=(n:number)=>z.string().trim().max(n);
const schema=z.object({fullName:field(120).min(2),organisation:field(180),designation:field(120),email:z.string().trim().email().max(254),phone:field(40),country:field(80).min(2),interest:field(120).min(2),message:field(5000).min(20),business:z.enum(['TMSG','ZUSTMED','OMVIRAA','SHAHI ESTATE','SHAHI WORLD','EMERGING VENTURES']),kind:z.enum(['enquiry','partnership','career']),source:field(160).startsWith('/'),consent:z.literal(true),website:field(100).optional()});
export async function POST(request:Request){
 try{
  const origin=request.headers.get('origin');if(origin&&new URL(origin).host!==new URL(request.url).host)return Response.json({error:'Please submit this form from the website.'},{status:403});
  if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'A valid form submission is required.'},{status:415});
  if(Number(request.headers.get('content-length')||0)>15000)return Response.json({error:'Your message is too large.'},{status:413});
  const body=await request.text();if(body.length>15000)return Response.json({error:'Your message is too large.'},{status:413});
  let raw:unknown;try{raw=JSON.parse(body)}catch{return Response.json({error:'Please check the form and try again.'},{status:400})}
  const parsed=schema.safeParse(raw);if(!parsed.success)return Response.json({error:'Please complete all required fields, enter a valid email, and write at least 20 characters in your message.'},{status:400});
  const d=parsed.data;if(d.website)return Response.json({error:'We could not accept this submission.'},{status:400});
  if(!env.DB)return Response.json({error:'Enquiries are temporarily unavailable. Please try again later.'},{status:503});
  const ip=request.headers.get('cf-connecting-ip')||d.email.toLowerCase();
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));const key=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
  const now=Date.now(); const recent=await env.DB.prepare('SELECT COUNT(*) AS count FROM enquiries WHERE rate_key = ? AND created_at > ?').bind(key,now-3600000).first<{count:number}>();
  if((recent?.count||0)>=8)return Response.json({error:'You have sent several enquiries recently. Please try again in an hour.'},{status:429,headers:{'Retry-After':'3600'}});
  const id=crypto.randomUUID();await env.DB.prepare('INSERT INTO enquiries (id,created_at,kind,business,full_name,organisation,designation,email,phone,country,interest,message,consent,source,rate_key) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,now,d.kind,d.business,d.fullName,d.organisation,d.designation,d.email.toLowerCase(),d.phone,d.country,d.interest,d.message,1,d.source,key).run();
  return Response.json({ok:true,reference:id.slice(0,8).toUpperCase()},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Your enquiry could not be saved. Please try again.'},{status:500})}
}
