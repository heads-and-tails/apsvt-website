import { NextResponse } from "next/server";

const target="https://formsubmit.co/ajax/vportnaia@kse.org.ua";

export async function POST(request:Request){
  try{
    const body=await request.json() as Record<string,unknown>;
    const name=String(body.name||"").trim();const email=String(body.email||"").trim();const phone=String(body.phone||"").trim();const event=String(body.event||"").trim();
    if(!name||!email.includes("@")||!phone||!event)return NextResponse.json({error:"Перевірте обов’язкові поля"},{status:400});
    const payload={_subject:`Реєстрація на подію АПСВТ: ${event}`,Подія:event,"Ім’я":name,Email:email,"Телефон":phone,"Статус":String(body.role||""),"Формат":String(body.format||""),"Побажання":String(body.note||"")};
    const response=await fetch(target,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(payload)});
    if(!response.ok)return NextResponse.json({error:"Сервіс реєстрації тимчасово недоступний"},{status:502});
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:"Некоректний запит"},{status:400})}
}
