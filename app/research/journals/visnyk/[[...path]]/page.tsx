import type { Metadata } from "next";

const journalOrigin = "https://visnyk-apsvt-journal.ikucha.chatgpt.site";

export const metadata: Metadata = {
  title: "Вісник АПСВТ — науковий журнал",
  description:
    "Науковий журнал Академії праці, соціальних відносин і туризму.",
};

export default async function JournalPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const suffix = path.map(encodeURIComponent).join("/");
  const src = suffix ? `${journalOrigin}/${suffix}` : `${journalOrigin}/`;

  return (
    <main
      style={{
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#f1efe9",
      }}
    >
      <iframe
        src={src}
        title="Вісник АПСВТ — науковий журнал"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        allow="clipboard-write"
      />
    </main>
  );
}
