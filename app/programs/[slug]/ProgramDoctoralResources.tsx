import Link from "next/link";
import { doctoralProgrammes } from "@/lib/academy-resources";

export function ProgramDoctoralResources({ slug }: { slug: string }) {
  const programme = doctoralProgrammes.find((item) => item.relatedProgramSlug === slug);
  if (!programme) return null;

  return <section className="program-doctoral-resources" id="doctoral-programme"><div className="wrap">
    <div className="program-doctoral-heading">
      <div><div className="idx">Освітньо-наукова програма</div><h2>Доктор філософії</h2></div>
      <p>{programme.department}. Офіційна програма розміщена також у загальному каталозі програм і документів Академії.</p>
    </div>
    <div className="program-doctoral-card">
      <span>{programme.code}</span>
      <div><small>Третій рівень · 2025 · PDF · {programme.pages} сторінок</small><h3>{programme.title}</h3><p>{programme.description}</p></div>
      <a href={programme.href} target="_blank" rel="noreferrer">Відкрити програму ↗</a>
    </div>
    <Link className="program-doctoral-all" href="/programs#doctoral-programmes">Усі програми доктора філософії →</Link>
  </div></section>;
}
