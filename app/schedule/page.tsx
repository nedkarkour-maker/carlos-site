import { redirect } from "next/navigation";

// The season lives on the homepage — send /schedule to its section
// instead of shipping a blank page.
export default function SchedulePage() {
  redirect("/#schedule");
}
