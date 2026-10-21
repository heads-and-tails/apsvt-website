export const marketingMobilitySection = {
  id: "marketing-master-mobility",
  title: "Академічна мобільність та визнання результатів навчання",
  label: "Якість освіти · Магістратура · Академічна мобільність та визнання результатів навчання",
} as const;

const mobilityReportId = "68097e3c-0d97-43f3-b41a-fd90a58bc99d";

export function marketingMobilitySectionId(id: string, pagePath: string, sectionId: string): string {
  return id === mobilityReportId && pagePath === "/programs/marketing" && sectionId === "department-news"
    ? marketingMobilitySection.id
    : sectionId;
}
