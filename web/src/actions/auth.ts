"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { startElevePaddleCheckout } from "@/actions/eleve-inscription-paddle";
import { startEleveStripeCheckout } from "@/actions/eleve-inscription-stripe";
import { prisma } from "@/lib/prisma";
import { getPaddle } from "@/lib/paddle-server";
import { getStripe } from "@/lib/stripe-server";

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ELEVE", "PROFESSEUR"]),
    groupe: z.string().optional(),
    anneeScolaire: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "ELEVE") {
      if (!data.groupe?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indiquez votre groupe ou classe.",
          path: ["groupe"],
        });
      }
      if (!data.anneeScolaire?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Choisissez l’année scolaire.",
          path: ["anneeScolaire"],
        });
      }
    }
  });

/** État formulaire inscription — `paymentSkippedInDev` = élève créé sans paiement (mode dev uniquement). */
export type RegisterState =
  | { error?: string }
  | { ok: true; paymentSkippedInDev?: boolean }
  | { checkoutUrl: string }
  | undefined;

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    groupe: formData.get("groupe") ?? undefined,
    anneeScolaire: formData.get("anneeScolaire") ?? undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fe = flat.fieldErrors;
    const first =
      fe.groupe?.[0] ||
      fe.anneeScolaire?.[0] ||
      fe.role?.[0] ||
      "Données invalides (mot de passe ≥ 6 caractères).";
    return { error: first };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "Cet e-mail est déjà utilisé." };
  }

  if (parsed.data.role === "ELEVE") {
    const devBypass =
      process.env.NODE_ENV === "development" &&
      process.env.STRIPE_BYPASS_IN_DEV?.trim() === "true";

    const provider =
      process.env.PAYMENT_PROVIDER?.trim().toLowerCase() || "stripe";

    if (!getStripe() && !getPaddle() && devBypass) {
      await prisma.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash: await bcrypt.hash(parsed.data.password, 10),
          role: "ELEVE",
          groupe: parsed.data.groupe!.trim(),
          anneeScolaire: parsed.data.anneeScolaire!.trim(),
        },
      });
      return { ok: true, paymentSkippedInDev: true };
    }

    if (provider === "paddle") {
      const paddle = getPaddle();
      if (!paddle) {
        return {
          error:
            "Paiement Paddle indisponible : ajoutez PADDLE_API_KEY dans web/.env (sandbox : developer.paddle.com). PAYMENT_PROVIDER=paddle.",
        };
      }
      const locale = String(formData.get("locale") || "fr");
      const checkout = await startElevePaddleCheckout(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password,
          groupe: parsed.data.groupe!.trim(),
          anneeScolaire: parsed.data.anneeScolaire!.trim(),
        },
        locale,
      );
      if ("error" in checkout) {
        return { error: checkout.error };
      }
      return { checkoutUrl: checkout.checkoutUrl };
    }

    const stripe = getStripe();
    if (!stripe) {
      return {
        error:
          "Paiement en ligne indisponible : ajoutez STRIPE_SECRET_KEY ou configurez Paddle (PADDLE_API_KEY + PAYMENT_PROVIDER=paddle). En local uniquement, STRIPE_BYPASS_IN_DEV=true permet de créer un compte élève sans paiement.",
      };
    }

    const locale = String(formData.get("locale") || "fr");
    const checkout = await startEleveStripeCheckout(
      {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        groupe: parsed.data.groupe!.trim(),
        anneeScolaire: parsed.data.anneeScolaire!.trim(),
      },
      locale,
    );
    if ("error" in checkout) {
      return { error: checkout.error };
    }
    return { checkoutUrl: checkout.checkoutUrl };
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      role: parsed.data.role,
      groupe: null,
      anneeScolaire: null,
    },
  });

  return { ok: true };
}

