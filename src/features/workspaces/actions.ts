import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

type getWorkspaceProps = {
  workspaceId: string;
};

export async function getWorkspace({ workspaceId }: getWorkspaceProps) {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session) return null;

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) return null;

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
    );

    return workspace;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getWorkspaces() {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session) return { documents: [], total: 0 };

    client.setSession(session.value);

    const account = new Account(client);
    const database = new Databases(client);
    const user = await account.get();

    const members = await database.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await database.listDocuments(DATABASE_ID, WORKSPACE_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspaceIds),
    ]);

    return workspaces;
  } catch (error) {
    console.error(error);
    return { documents: [], total: 0 };
  }
}
