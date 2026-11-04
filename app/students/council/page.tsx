import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { CouncilNavigation } from "./CouncilNavigation";
import "./council.css";

export const metadata: Metadata = { title: "Студентська рада", description: "Студентське самоврядування АПСВТ: представництво, структура, нормативна база, новини та ініціативи." };

export default function Page() {
  return <main id="top" data-page-materials-server="true"><SiteHeader englishHref="/en/students" />
    <section className="council-banner" aria-label="Студентська рада АПСВТ">
      <h1 className="council-title">Студентська рада АПСВТ</h1>
      <img src="/student-council/banner.png" alt="Студентська рада Академії праці, соціальних відносин і туризму. Твій голос. Твої ідеї. Твоя Академія." width="2048" height="768" fetchPriority="high" />
    </section>
    <CouncilNavigation /><SiteFooter />
  </main>;
}
