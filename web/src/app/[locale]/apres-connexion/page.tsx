import { auth } from "@/auth";
import { redirectTo } from "@/lib/redirect-locale";

export default async function ApresConnexionPage() {
  const session = await auth();
  if (!session?.user) {
    await redirectTo("/connexion");
    return;
  }

  const role = session.user.role;

  if (role === "ELEVE") {
    await redirectTo("/eleve");
  } else if (role === "PROFESSEUR") {
    await redirectTo("/professeur");
  } else if (role === "ADMIN") {
    await redirectTo("/admin");
  } else {
    await redirectTo("/");
  }
}
