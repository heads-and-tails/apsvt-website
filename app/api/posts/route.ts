import { NextResponse } from "next/server";
import { createPost, getPosts, type PostInput } from "@/lib/data";
import { requirePagePublisher } from "@/lib/auth";

export const dynamic="force-dynamic";

function valid(value:unknown):value is PostInput{if(!value||typeof value!=="object")return false;const v=value as Record<string,unknown>;return typeof v.title==="string"&&v.title.trim().length>=3&&typeof v.excerpt==="string"&&typeof v.body==="string"&&typeof v.category==="string"&&typeof v.imageUrl==="string"&&typeof v.imageAlt==="string"&&(v.status==="draft"||v.status==="published")&&typeof v.featured==="boolean"}

export async function GET(){try{await requirePagePublisher("/news");return NextResponse.json(await getPosts({includeDrafts:true,limit:100}))}catch{return NextResponse.json({error:"Доступ заборонено"},{status:403})}}

export async function POST(request:Request){try{const publisher=await requirePagePublisher("/news");const body:unknown=await request.json();if(!valid(body))return NextResponse.json({error:"Заповніть усі обов’язкові поля"},{status:400});const post=await createPost(body,publisher.email);return NextResponse.json(post,{status:201})}catch(error){const denied=error instanceof Error&&(error.message==="UNAUTHORIZED"||error.message==="FORBIDDEN_SCOPE");return NextResponse.json({error:denied?"Доступ заборонено":"Не вдалося створити матеріал"},{status:denied?403:500})}}
