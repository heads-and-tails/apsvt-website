"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { programs } from "@/lib/programs";

const questions = [
  {title:"Що вам найцікавіше?", options:[{label:"Люди й підтримка",tags:["люди","допомога","психологія"]},{label:"Бізнес і рішення",tags:["бізнес","аналітика","лідерство"]},{label:"Суспільство й правила",tags:["держава","суспільство","справедливість"]},{label:"Подорожі й події",tags:["подорожі","організація"]}]},
  {title:"Який тип завдань вам ближчий?", options:[{label:"Консультувати",tags:["підтримка","допомога","люди"]},{label:"Аналізувати дані",tags:["аналітика","цифри","інвестиції"]},{label:"Аргументувати",tags:["аргументація","політика","справедливість"]},{label:"Створювати проєкти",tags:["проєкти","креативність","підприємництво"]}]},
  {title:"Де ви уявляєте першу роботу?", options:[{label:"У компанії",tags:["бізнес","бренди","команди"]},{label:"У громаді або NGO",tags:["громади","суспільство","допомога"]},{label:"У державній чи правничій сфері",tags:["держава","політика","справедливість"]},{label:"У власному проєкті",tags:["підприємництво","продажі","організація"]}]},
  {title:"Яка ваша сильна сторона?", options:[{label:"Емпатія",tags:["люди","підтримка","здоров’я"]},{label:"Системність",tags:["аналітика","управління","логістика"]},{label:"Комунікація",tags:["бренди","команди","аргументація"]},{label:"Допитливість",tags:["дослідження","подорожі","інвестиції"]}]},
];

export function ProgramFinder(){
  const [answers,setAnswers]=useState<string[][]>([]);
  const [step,setStep]=useState(0);
  const result=useMemo(()=>{
    const chosen=answers.flat();
    return [...programs].sort((a,b)=>chosen.filter(t=>b.tags.includes(t)).length-chosen.filter(t=>a.tags.includes(t)).length).slice(0,3);
  },[answers]);
  const choose=(tags:string[])=>{setAnswers(v=>[...v,tags]);setStep(v=>v+1)};
  const reset=()=>{setAnswers([]);setStep(0)};
  return <section id="test" className="finder-section"><div className="wrap"><div className="idx">02 / Тест на програму</div><div className="finder-shell">
    {step<questions.length?<><div className="finder-progress"><span style={{width:`${(step/questions.length)*100}%`}} /></div><div className="mono">Питання {step+1} з {questions.length}</div><h2>{questions[step].title}</h2><div className="finder-options">{questions[step].options.map(o=><button onClick={()=>choose(o.tags)} key={o.label}>{o.label}<b>→</b></button>)}</div></>:
    <><div className="mono">Ваші найсильніші збіги</div><h2>Програми для вас</h2><div className="finder-results">{result.map((p,i)=><Link href={`/programs/${p.slug}`} key={p.slug}><span>0{i+1}</span><div><b>{p.title}</b><small>{p.short}</small></div><strong>→</strong></Link>)}</div><button className="finder-reset" onClick={reset}>Пройти ще раз</button></>}
  </div></div></section>;
}
