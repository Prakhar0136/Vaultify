"use server";
import { createAdminClient, createSessionClient } from "./appwrite";
import { appwriteConfig } from "./appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "./utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

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
        avatar: avatarPlaceholderUrl,
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

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();

  const result = await account.get();

  const user = await databases.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersCollectionId,
    queries: [Query.equal("accountId", result.$id)],
  });

  if (user.total <= 0) {
    return null;
  }

  return parseStringify(user.rows[0]);
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession({ sessionId: "current" });
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "failed to sign user out");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return parseStringify({ accountId: null, error: "user not found" });
  } catch (error) {
    handleError(error, "failed to sign user in");
  }
};
