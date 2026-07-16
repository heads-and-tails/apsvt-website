import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignInPath } from "../chatgpt-auth";
import { getChatGPTUser } from "../chatgpt-auth";
import { getPublisher, PUBLISHER_EMAIL } from "@/lib/auth";
import { getPosts } from "@/lib/data";
import { PanelEditor } from "./PanelEditor";

export const metadata:Metadata={title:"Редакційна панель"};
export const dynamic="force-dynamic";

export default async function PanelPage(){const user=await getChatGPTUser();const publisher=await getPublisher();if(!publisher){return <main className="auth-page"><div className="auth-card"><span className="auth-mark">АП</span><span className="kicker blue">Редакційний доступ</span><h1>{user?"Немає доступу":"Увійдіть, щоб публікувати"}</h1><p>{user?`Акаунт ${user.email} не має прав редактора.`:`Панель доступна лише для ${PUBLISHER_EMAIL}. Авторизація та перевірка виконуються на сервері.`}</p>{!user&&<Link href={chatGPTSignInPath("/panel")}>Увійти в захищений акаунт →</Link>}<Link className="back-home" href="/">← Повернутися на сайт</Link></div></main>}const posts=await getPosts({includeDrafts:true,limit:100});return <PanelEditor initialPosts={posts} publisher={publisher.email}/>}
