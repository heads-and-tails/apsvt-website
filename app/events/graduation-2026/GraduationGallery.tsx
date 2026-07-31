"use client";

import { useEffect, useState } from "react";

const photos = [
  ["1zN1kSw7ZpoSqBWuRiJQTNb2iMXCpxDSm", "Урочистий момент свята вручення дипломів"],
  ["17QeHnYFzqC_9DpoSGS3lQU3j3Cqzwhij", "Випускники Академії під час святкової церемонії"],
  ["1iZGWuhsawkzCuGtQDagAonFnqPQZETe9", "Спільне фото випускників"],
  ["1_q9iZK4ZuXQ9-ooUAWhk63Aj7qHPispX", "Святкова атмосфера вручення дипломів"],
  ["1iXTzGsLCwwnF7JCFebItloMezQq7Zuht", "Випускники зі своїми дипломами"],
  ["1Wo5_kDFetcQAeUUJxBmsaRphxh53skMq", "Пам’ятна мить церемонії"],
  ["1v6SDVmAjuJqfsd1QaW4C3QV3r38zx0us", "Гості та учасники випускного свята"],
  ["1D29rebz_vttxSApA2yCbTshj-tYVSUwS", "Церемонія вручення дипломів АПСВТ"],
  ["1Bv-xXE559nrd6uj8hgMG-zzp0ar8TNbq", "Випускний день в Академії"],
  ["1ltOolM8wyqQsIpZ52q-_neYGpc5SFUEw", "Емоції випускного свята"],
  ["1DDF_1vWzcXShHroRXb4043a6hzBlTcQy", "Фото на згадку про навчання в Академії"],
] as const;

const imageUrl = (id: string, size = "w1800") => `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;

export function GraduationGallery() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((current) => current === null ? null : (current + 1) % photos.length);
      if (event.key === "ArrowLeft") setSelected((current) => current === null ? null : (current - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected]);

  return <>
    <div className="graduation-gallery" aria-label="Фотографії зі свята вручення дипломів">
      {photos.map(([id, alt], index) => <button type="button" onClick={() => setSelected(index)} aria-label={`Відкрити фото ${index + 1}`} key={id}><img src={imageUrl(id, "w1200")} alt={alt} loading={index > 3 ? "lazy" : undefined} /><span>{String(index + 1).padStart(2, "0")}</span></button>)}
    </div>
    {selected !== null && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`Фото ${selected + 1} із ${photos.length}`} onClick={() => setSelected(null)}>
      <button className="gallery-close" type="button" onClick={() => setSelected(null)} aria-label="Закрити галерею">×</button>
      <button className="gallery-prev" type="button" onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length); }} aria-label="Попереднє фото">←</button>
      <figure onClick={(event) => event.stopPropagation()}><img src={imageUrl(photos[selected][0], "w2400")} alt={photos[selected][1]} /><figcaption><span>{String(selected + 1).padStart(2, "0")} / {photos.length}</span>{photos[selected][1]}</figcaption></figure>
      <button className="gallery-next" type="button" onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % photos.length); }} aria-label="Наступне фото">→</button>
    </div>}
  </>;
}
