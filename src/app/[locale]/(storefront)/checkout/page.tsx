import { redirect } from "@/i18n/routing";

export default function CheckoutPage() {
  redirect("/cart");
  return null;
}