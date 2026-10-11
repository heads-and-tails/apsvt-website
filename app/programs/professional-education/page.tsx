import { redirect } from "next/navigation";
import { digitalDepartmentPath } from "@/lib/professional-education";

// Preserve existing incoming links without keeping a duplicate programme page.
export default function Page() {
  redirect(`${digitalDepartmentPath}#programmes`);
}
