import { auth } from "@/auth";
import { redirectTo } from "@/lib/redirect-locale";

export default async function ApresConnexionPage() {
  const session = await auth();
  if (!session?.user) {
    await redirectTo("/connexion");
    return;
  }

  switch (session.user.role) {
    case "ELEVE":
      await redirectTo("/eleve");
    case "PROFESSEUR":
      await redirectTo("/professeur");
    case "ADMIN":
      await redirectTo("/admin");
    default:
      await redirectTo("/");
  }
}
