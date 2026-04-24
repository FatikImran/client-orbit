import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getSupabaseClient } from "@/lib/db/supabase";
import type { ConversationRecord, LeadRecord } from "@/types/lead";

const dataPath = path.join(process.cwd(), "data", "demo-store.json");

type LocalStore = {
  leads: LeadRecord[];
  conversations: ConversationRecord[];
};

async function readStore(): Promise<LocalStore> {
  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    return { leads: [], conversations: [] };
  }
}

async function writeStore(store: LocalStore) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2), "utf-8");
}

export async function saveConversation(input: Omit<ConversationRecord, "id" | "createdAt">) {
  const supabase = getSupabaseClient();
  const record: ConversationRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input
  };

  if (supabase) {
    const client = supabase as any;
    const { error } = await client.from("conversations").insert({
      id: record.id,
      session_id: record.sessionId,
      user_message: record.userMessage,
      assistant_reply: record.assistantReply,
      escalation_needed: record.escalationNeeded,
      source: record.source,
      created_at: record.createdAt
    });
    if (error) {
      throw new Error(`Failed to save conversation: ${error.message}`);
    }
    return record;
  }

  const store = await readStore();
  store.conversations.unshift(record);
  store.conversations = store.conversations.slice(0, 300);
  await writeStore(store);
  return record;
}

export async function saveLead(input: Omit<LeadRecord, "id" | "createdAt">) {
  const supabase = getSupabaseClient();
  const record: LeadRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input
  };

  if (supabase) {
    const client = supabase as any;
    const { error } = await client.from("leads").insert({
      id: record.id,
      session_id: record.sessionId,
      name: record.name,
      email: record.email,
      need: record.need,
      urgency: record.urgency,
      created_at: record.createdAt
    });
    if (error) {
      throw new Error(`Failed to save lead: ${error.message}`);
    }
    return record;
  }

  const store = await readStore();
  store.leads.unshift(record);
  store.leads = store.leads.slice(0, 300);
  await writeStore(store);
  return record;
}

export async function getRecentLeads(limit = 25) {
  const supabase = getSupabaseClient();

  if (supabase) {
    const client = supabase as any;
    const { data } = await client
      .from("leads")
      .select("id, session_id, name, email, need, urgency, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!data) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      sessionId: item.session_id,
      name: item.name,
      email: item.email,
      need: item.need,
      urgency: item.urgency,
      createdAt: item.created_at
    })) as LeadRecord[];
  }

  const store = await readStore();
  return store.leads.slice(0, limit);
}
