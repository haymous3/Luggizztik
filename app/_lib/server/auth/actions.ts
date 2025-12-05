"use server";

import prisma from "@/app/_lib/server/prisma";
//import {signIn} from "next-auth/react";
import {signIn} from "@/app/_lib/server/auth";
import type {AuthState} from "@/app/_lib/types/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export const signUpAction = async (formData: FormData): Promise<AuthState> => {
  try {
    const username = formData.get("username") as string;
    const companyName = formData.get("companyName") as string;
    const email = formData.get("emailAddress") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const password = formData.get("password") as string;

    const confirmPassword = formData.get("confirmPassword") as string;
    const fullName = formData?.get("fullName") as string;
    const driverLicense = formData?.get("licenseNumber") as string;

    const truckType = formData?.get("truckType") as string;

    const loadCapacity = formData?.get("loadCapacity") as string;

    const plateNumber = formData?.get("plateNumber") as string;

    const yearOfManufacture = formData?.get("yearOfManufacture") as string;

    const referer = (await headers()).get("referer") || "";

    let role: "shipper" | "carrier" | null = null;

    if (referer.includes("/signup/shipper")) {
      role = "shipper";
    }
    if (referer.includes("/signup/carrier")) {
      role = "carrier";
    }

    if (!role) throw new Error("Invalid sign up route, role is missing");
    //console.log(role);

    const existingUser = await prisma.user.findUnique({where: {email}});

    if (existingUser) {
      return {success: false, message: "User already exist"};
    }

    // console.log(password, confirmPassword);
    if (password !== confirmPassword) {
      return {success: false, message: "Password do not match"};
    }

    await prisma.user.create({
      data: {
        email,
        username: username || fullName,
        companyName: companyName || fullName,
        password,
        phoneNumber,
        address,
        role,
        name: fullName,
        driverLicense,
        truckType,
        loadCapacity,
        plateNumber,
        yearOfManufacture,
      },
    });

    return {success: true, message: "Signup successful"};
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Unexpected signup error:", error);
    } else {
      console.error("Unexpected signup error:", error);
    }
    throw new Error("Internal server error while creating user");
  }
};

export const signInAction = async (formData: FormData): Promise<void> => {
  
  const email = formData.get("username") as string || formData.get("emailAddress") as string;
 
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

 
  if (res?.error) {
    throw new Error("Invalid credentials");
  }

  const user = await prisma.user.findUnique({
    where: {email},
    select: {role: true},
  });

  if (!user) throw new Error("User not found");

  // Redirect by role
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

  // return {success: true, message: "Login successful"};
};
