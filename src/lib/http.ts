
export class ApiError extends Error {
  constructor(public message: string, public status: number, public body?: unknown) { super(message); }
}
type Opt = { method?: 'GET'|'POST'|'PUT'|'PATCH'; headers?: Record<string,string>; body?: any; signal?: AbortSignal; };
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';
function timeout(ms:number){const c=new AbortController();const id=setTimeout(()=>c.abort(),ms);return {signal:c.signal,clear:()=>clearTimeout(id)};}

export async function http<T>(url:string,opt:Opt={}) {
  const t=timeout(10_000);
  try{
    const isJSON = opt.body!==undefined && !(opt.body instanceof FormData);
    const res = await fetch(`${BASE}${url}`, {
      cache:'no-store',
      ...opt,
      headers:{...(isJSON?{'Content-Type':'application/json'}:{}),...opt.headers},
      body: isJSON? JSON.stringify(opt.body) : opt.body,
      signal: opt.signal ?? t.signal
    });
    const text = await res.text(); const data = text ? JSON.parse(text) : null;
    if(!res.ok) throw new ApiError(data?.message || `HTTP ${res.status}`, res.status, data);
    return data as T;
  } finally { t.clear(); }
}
