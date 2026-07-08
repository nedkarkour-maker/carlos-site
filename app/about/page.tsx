import { redirect } from "next/navigation";

// The full story lives on the homepage — send /about to its section
// instead of shipping a blank page.
export default function AboutPage() {
  redirect("/#about");
}
