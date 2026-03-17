"use server";

import prisma from "@/lib/prisma";
import {signIn} from "@/features/auth/auth";
import {type ActionResult, ok, fail} from "@/lib/action-result";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import bcrypt from "bcryptjs";

export const signUpAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const username = formData.get("username") as string;
    const companyName = formData.get("companyName") as string;
    const email = formData.get("emailAddress") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const fullName = formData.get("fullName") as string;

    const referer = (await headers()).get("referer") || "";

    let role: "shipper" | "carrier" | null = null;

    if (referer.includes("/signup/shipper")) {
      role = "shipper";
    }
    if (referer.includes("/signup/carrier")) {
      role = "carrier";
    }

    if (!role) return fail("Invalid sign up route, role is missing");
    if (!email) return fail("Email address is required");
    if (!password) return fail("Password is required");
    if (!phoneNumber) return fail("Phone number is required");
    if (role === "carrier" && !companyName) return fail("Company name is required for carriers");

    if (password !== confirmPassword) {
      return fail("Passwords do not match");
    }

    const existingUser = await prisma.user.findUnique({where: {email}});

    if (existingUser) {
      return fail("A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username: username || fullName,
        password: hashedPassword,
        phoneNumber,
        role,
        name: fullName,
      },
    });

    if (role === "carrier") {
      await prisma.carrierCompany.create({
        data: {
          userId: user.id,
          companyName: companyName || fullName || `Carrier-${user.id}`,
          address: address || null,
        },
      });
    }

    return ok("Account created successfully");
  } catch (error: unknown) {
    console.error("Unexpected signup error:", error);
    return fail("Something went wrong. Please try again.");
  }
};

export const signInAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const email = formData.get("username") as string || formData.get("emailAddress") as string;
    const password = formData.get("password") as string;

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
