"use server";

// Never log or return passwords or raw formData; credentials stay in memory only.
import prisma from "@/lib/prisma";
import { signIn } from "@/features/auth/auth";
import { type ActionResult, ok, fail } from "@/lib/action-result";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const username = (formData.get("username") as string)?.trim();
    const companyName = (formData.get("companyName") as string)?.trim();
    const email = (formData.get("emailAddress") as string)?.trim()?.toLowerCase();
    const phoneNumber = (formData.get("phoneNumber") as string)?.trim();
    const address = (formData.get("address") as string)?.trim() || undefined;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const fullName = (formData.get("fullName") as string)?.trim();

    // Prefer role from form (hidden input), then fallback to referer
    let role: "shipper" | "carrier" | null = null;
    const formRole = formData.get("role") as string | null;
    if (formRole === "shipper" || formRole === "carrier") {
      role = formRole;
    }
    if (!role) {
      const referer = (await headers()).get("referer") || "";
      if (referer.includes("/signup/shipper")) role = "shipper";
      else if (referer.includes("/signup/carrier")) role = "carrier";
    }

    if (!role) return fail("Invalid sign up route. Please use the sign up page.");
    if (!email) return fail("Email address is required");
    if (!password) return fail("Password is required");
    if (!phoneNumber) return fail("Phone number is required");
    if (role === "carrier" && !companyName) return fail("Company name is required for carriers");

    if (password !== confirmPassword) {
      return fail("Passwords do not match");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return fail("A user with this email already exists");
    }

    // Password is hashed by Prisma middleware (lib/prisma.ts) on create — do not hash here
    const user = await prisma.user.create({
      data: {
        email,
        username: username || fullName || email,
        password,
        phoneNumber,
        role,
        name: fullName || username || null,
      },
    });

    if (role === "carrier") {
      const carrierCompanyName =
        companyName || fullName || `Carrier-${user.id}`;
      try {
        await prisma.carrierCompany.create({
          data: {
            userId: user.id,
            companyName: carrierCompanyName,
            address: address ?? null,
          },
        });
      } catch (carrierErr: unknown) {
        const code = (carrierErr as { code?: string })?.code;
        if (code === "P2002") {
          await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
          return fail("A carrier with this company name already exists.");
        }
        throw carrierErr;
      }
    }

    // Sign the user in and redirect to their dashboard
    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInRes?.error) {
      return ok("Account created successfully. Please sign in.");
    }

    switch (role) {
      case "shipper":
        redirect("/dashboard/shipper");
        break;
      case "carrier":
        redirect("/dashboard/carrier");
        break;
      default:
        redirect("/");
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    const prismaCode = (error as { code?: string })?.code;
    if (prismaCode === "P2002") {
      return fail("A user with this email or username already exists.");
    }
    console.error("Unexpected signup error:", error);
    return fail("Something went wrong. Please try again.");
  }
};

export const signInAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const rawEmail =
      (formData.get("emailAddress") as string) ||
      (formData.get("username") as string);
    const email = rawEmail?.trim()?.toLowerCase();
    const password = (formData.get("password") as string) ?? "";

    if (!email || !password) {
      return fail("Email and password are required");
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return fail("Invalid email or password");
    }

    const user = await prisma.user.findUnique({
      where: {email},
      select: {role: true},
    });

    if (!user) return fail("User not found");

    switch (user.role) {
      case "shipper":
        redirect("/dashboard/shipper");
        break;
      case "carrier":
        redirect("/dashboard/carrier");
        break;
      default:
        redirect("/");
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Sign in error:", error);
    return fail("Invalid email or password");
  }
};
