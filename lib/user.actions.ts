"use server";
import { createAdminClient } from "./appwrite";
import { appwriteConfig } from "./appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "./utils";
import { cookies } from "next/headers";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersCollectionId,
    queries: [Query.equal("email", email)],
  });

  return result.total > 0 ? result.rows[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken({
      userId: ID.unique(),
      email: email,
    });

    return session.userId;
  } catch (error) {
    handleError(error, "failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error("Failed to send OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersCollectionId,
      rowId: ID.unique(),
      data: {
        fullName,
        email,
        avatar:
          "https://imgs.search.brave.com/MMhX_fwxB_CXWHN83sjWFZ66JrnjfGoZ3WvI-5EAG6A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDUv/OTQ0LzE5OS9zbWFs/bC9tYWxlLWRlZmF1/bHQtcGxhY2Vob2xk/ZXItYXZhdGFyLXBy/b2ZpbGUtZ3JheS1w/aWN0dXJlLWlzb2xh/dGVkLW9uLWJhY2tn/cm91bmQtbWFuLXNp/bGhvdWV0dGUtcGlj/dHVyZS1mb3ItdXNl/ci1wcm9maWxlLWlu/LXNvY2lhbC1tZWRp/YS1mb3J1bS1jaGF0/LWdyZXlzY2FsZS1p/bGx1c3RyYXRpb24t/dmVjdG9yLmpwZw",
        accountId,
      },
    });
  }

  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "failed to verify otp");
  }
};
