import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignInPath } from "../chatgpt-auth";
import { getChatGPTUser } from "../chatgpt-auth";
import { getPublisher } from "@/lib/auth";
import { getPosts } from "@/lib/data";
import { PanelEditor } from "./PanelEditor";

export const metadata:Metadata={title:"Редакційна панель"};
export const dynamic="force-dynamic";

export default async function PanelPage(){
  if(process.env.VERCEL){
    return <main className="auth-page"><div className="auth-card"><span className="auth-mark">АП</span><span className="kicker blue">Редакційний доступ</span><h1>Панель публікацій</h1><p>Захищена редакційна панель працює в основній версії сайту, де підключені сховище новин і фотографій.</p><a href="https://apsvt-academy.ikucha.chatgpt.site/panel">Відкрити панель →</a><Link className="back-home" href="/">← Повернутися на сайт</Link></div></main>;
  }
  const user=await getChatGPTUser();
  const publisher=await getPublisher();
  if(!publisher){
    return <main className="auth-page"><div className="auth-card"><span className="auth-mark">АП</span><span className="kicker blue">Редакційний доступ</span><h1>{user?"Немає доступу":"Увійдіть, щоб публікувати"}</h1><p>{user?"Цей акаунт не має прав редактора.":"Редакційна панель захищена. Увійдіть акаунтом із правом публікації."}</p>{!user&&<Link href={chatGPTSignInPath("/panel")}>Увійти в захищений акаунт →</Link>}<Link className="back-home" href="/">← Повернутися на сайт</Link></div></main>;
  }
  const posts=await getPosts({includeDrafts:true,limit:100});
  return <PanelEditor initialPosts={posts}/>;
}
