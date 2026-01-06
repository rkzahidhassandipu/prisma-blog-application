import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
const nodemailer = require("nodemailer");
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "hassanmahamud85a@gmail.com",
    pass: "xamdhvswovnzhbgj",
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        returned: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const info = await transporter.sendMail({
        from: `"Prisma Blog" <${process.env.APP_USER}>`,
        to: user.email,
        subject: "Please Verify Your Email ✅",
        text: `Hello ${user.name},

Thank you for signing up at Prisma Blog!

Please verify your email by clicking the link below:

${url}

If you did not create an account, you can ignore this email.

Thanks,
Prisma Blog Team
`,
        html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <h1 style="color: #333;">Welcome, ${user.name}!</h1>
    <p style="color: #555;">Thank you for signing up at <strong>Prisma Blog</strong>. To complete your registration, please verify your email by clicking the button below:</p>
    <a href="${url}" style="
      display: inline-block;
      padding: 12px 25px;
      margin: 20px 0;
      background-color: #4CAF50;
      color: white;
      font-weight: bold;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    ">Verify Email</a>
    <p style="color: #555;">If you did not create an account, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="color: #999; font-size: 12px;">Prisma Blog Team | &copy; 2025 Prisma Blog. All rights reserved.</p>
  </div>
  `,
      });

      console.log("Verification email sent:", info.messageId);

      console.log("Message sent:", info.messageId);
    },
  },
});
