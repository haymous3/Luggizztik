import {PrismaClient} from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";

const globalForPrisma = global as unknown as {prisma: PrismaClient};

function isBcryptHash(value: string): boolean {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends(withAccelerate()).$extends({
    query: {
      user: {
        async create({args, query}) {
          const raw = args.data.password;
          if (raw && typeof raw === "string" && !isBcryptHash(raw)) {
            args.data.password = await bcrypt.hash(raw, 10);
          }
          return query(args);
        },
        async update({args, query}) {
          if (args.data.password) {
            let plainPassword: string | undefined;

            if (typeof args.data.password === "string") {
              plainPassword = args.data.password;
            } else if (
              typeof args.data.password === "object" &&
              "set" in args.data.password &&
              typeof args.data.password.set === "string"
            ) {
              plainPassword = args.data.password.set;
            }

            if (plainPassword && !isBcryptHash(plainPassword)) {
              const hashed = await bcrypt.hash(plainPassword, 10);

              if (typeof args.data.password === "string") {
                args.data.password = hashed;
              } else {
                args.data.password.set = hashed;
              }
            }
          }
          return query(args);
        },
        async updateMany({args, query}) {
          if (args.data.password) {
            let plainPassword: string | undefined;

            if (typeof args.data.password === "string") {
              plainPassword = args.data.password;
            } else if (
              typeof args.data.password === "object" &&
              "set" in args.data.password &&
              typeof args.data.password.set === "string"
            ) {
              plainPassword = args.data.password.set;
            }

            if (plainPassword && !isBcryptHash(plainPassword)) {
              const hashed = await bcrypt.hash(plainPassword, 10);

              if (typeof args.data.password === "string") {
                args.data.password = hashed;
              } else {
                args.data.password.set = hashed;
              }
            }
          }
          return query(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
