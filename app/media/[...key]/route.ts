import { NextResponse } from "next/server";

type Context={params:Promise<{key:string[]}>};
export async function GET(_:Request,{params}:Context){try{const moduleName="cloudflare:workers";const {env}=await import(/* webpackIgnore: true */ moduleName);const {key}=await params;if(!env.MEDIA)return new NextResponse("Not found",{status:404});const object=await env.MEDIA.get(key.join("/"));if(!object)return new NextResponse("Not found",{status:404});const headers=new Headers();object.writeHttpMetadata(headers);headers.set("etag",object.httpEtag);headers.set("cache-control",headers.get("cache-control")||"public, max-age=31536000, immutable");return new NextResponse(object.body,{headers})}catch{return new NextResponse("Not found",{status:404})}}
