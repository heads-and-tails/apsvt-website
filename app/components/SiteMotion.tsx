"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const revealSelectors = [
  ".sec-head",
  ".split",
  ".stat",
  ".prow",
  ".pcard",
  ".news",
  ".deep-card",
  ".row",
  ".story",
  ".evt",
  ".leader-card",
  ".academic-profile-card",
  ".faculty-group-head",
  ".professor-list article",
  ".faculty-card",
  ".study-plan article",
  ".opportunity-grid article",
  ".facility-card",
  ".space-grid article",
  ".book-card",
].join(",");

export function SiteMotion(){
  const pathname=usePathname();
  const isPanel=pathname.startsWith("/panel");
  const [done,setDone]=useState(isPanel);
  const [progress,setProgress]=useState(0);

  useEffect(()=>{
    if(isPanel)return;
    const started=performance.now();
    const duration=1450;
    let frame=0;
    const tick=(now:number)=>{
      const elapsed=Math.min(1,(now-started)/duration);
      const eased=1-Math.pow(1-elapsed,3.2);
      setProgress(Math.min(100,Math.round(eased*100)));
      if(elapsed<1)frame=requestAnimationFrame(tick);
      else window.setTimeout(()=>setDone(true),260);
    };
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[isPanel]);

  useEffect(()=>{
    if(isPanel)return;
    let scrollFrame=0;
    const updateScroll=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      document.documentElement.style.setProperty("--scroll",`${max?scrollY/max*100:0}%`);
      document.documentElement.style.setProperty("--scroll-y",`${scrollY}px`);
      scrollFrame=0;
    };
    const onScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll)};
    updateScroll();
    addEventListener("scroll",onScroll,{passive:true});

    document.body.classList.remove("route-entering");
    void document.body.offsetWidth;
    document.body.classList.add("route-entering");
    const routeTimer=window.setTimeout(()=>document.body.classList.remove("route-entering"),1050);

    const elements=Array.from(document.querySelectorAll<HTMLElement>(revealSelectors));
    elements.forEach((element,index)=>{
      element.classList.add("motion-reveal");
      element.style.setProperty("--reveal-delay",`${Math.min(index%6,5)*55}ms`);
    });
    document.documentElement.classList.add("motion-ready");
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -6% 0px"});
    elements.forEach(element=>observer.observe(element));

    return()=>{
      removeEventListener("scroll",onScroll);
      if(scrollFrame)cancelAnimationFrame(scrollFrame);
      clearTimeout(routeTimer);
      observer.disconnect();
    };
  },[isPanel,pathname]);

  if(isPanel)return null;
  return <>
    <div className={`loader ${done?"done":""}`} aria-hidden={done}>
      <div className="loader-aura"/>
      <div className="loader-grid"/>
      <div className="loader-orbit"><i/><i/><i/><b><span/></b></div>
      <div className="loader-top mono"><span>APSVT / ACADEMY</span><span>KYIV · UKRAINE</span></div>
      <strong>{String(progress).padStart(2,"0")}</strong>
      <div className="loader-line"><span style={{width:`${progress}%`}}/></div>
    </div>
    <div className="scroll-progress"/>
  </>;
}
