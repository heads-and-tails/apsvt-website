import { notFound, permanentRedirect } from "next/navigation";

const legacyGrantPages = new Map([
  ["3199", "/international#grants"],
  ["3377", "/international#greenfinedu"],
  ["3172", "/international#grants"],
]);

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const destination = legacyGrantPages.get((await params).id);
  if (!destination) notFound();
  permanentRedirect(destination);
}
