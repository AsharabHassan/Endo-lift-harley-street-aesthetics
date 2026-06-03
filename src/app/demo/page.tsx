import { redirect } from "next/navigation";

// The demo is now per-treatment. Default to the Endolift flow.
export default function DemoIndex() {
  redirect("/demo/endolift");
}
