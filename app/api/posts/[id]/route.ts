import { NextResponse } from "next/server";
import { deletePost, updatePost, type PostInput } from "@/lib/data";
import { requirePublisher } from "@/lib/auth";

type Context={params:Promise<{id:string}>};
function valid(value:unknown):value is PostInput{if(!value||typeof value!=="object")return false;const v=value as Record<string,unknown>;return typeof v.title==="string"&&typeof v.excerpt==="string"&&typeof v.body==="string"&&typeof v.category==="string"&&typeof v.imageUrl==="string"&&typeof v.imageAlt==="string"&&(v.status==="draft"||v.status==="published")&&typeof v.featured==="boolean"}

export async function PATCH(request:Request,{params}:Context){try{const publisher=await requirePublisher();const body:unknown=await request.json();if(!valid(body))return NextResponse.json({error:"Некоректні дані"},{status:400});const {id}=await params;const post=await updatePost(id,body,publisher.email);return post?NextResponse.json(post):NextResponse.json({error:"Матеріал не знайдено"},{status:404})}catch{return NextResponse.json({error:"Не вдалося зберегти зміни"},{status:403})}}
export async function DELETE(_:Request,{params}:Context){try{await requirePublisher();const {id}=await params;await deletePost(id);return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"Не вдалося видалити матеріал"},{status:403})}}
