import type { Session } from "@supabase/supabase-js";
import type { EmailAnalysisResponse, EmailProvider } from "../../shared/subscriptions";
import { supabase } from "@/lib/supabase";
import { extractSubscriptionsFromMessages, type MailMessageCandidate } from "@/utils/mailAnalysis";

const pendingProviderStorageKey = "gider-takip.pending-mail-provider";

const providerConfig = {
  gmail: {
    oauthProvider: "google" as const,
    scopes: "https://www.googleapis.com/auth/gmail.readonly",
    queryParams: {
      access_type: "offline",
      prompt: "consent",
    },
  },
  outlook: {
    oauthProvider: "azure" as const,
    scopes: "email offline_access openid profile Mail.Read",
    queryParams: {},
  },
};

function hasLinkedIdentity(session: Session | null, provider: "google" | "azure") {
  return session?.user?.identities?.some((identity) => identity.provider === provider) ?? false;
}

async function getSessionWithProviderToken(session: Session | null) {
  if (session?.provider_token) {
    return session;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!data.session?.provider_token) {
    throw new Error(
      "Mail erisim tokeni bulunamadi. Google/Microsoft izin ekranini tekrar tamamlayip yeniden dene."
    );
  }

  return data.session;
}

async function readJsonResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (payload as { error?: { message?: string }; message?: string }).error?.message ||
      (payload as { message?: string }).message ||
      "Mail kutusu okunamadi.";

    throw new Error(message);
  }

  return payload;
}

async function fetchGoogleMessages(accessToken: string): Promise<MailMessageCandidate[]> {
  const query = encodeURIComponent(
    'newer_than:365d (receipt OR invoice OR subscription OR payment OR renewal OR fatura OR odeme OR abonelik)'
  );
  const listResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=12`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const listPayload = (await readJsonResponse(listResponse)) as { messages?: Array<{ id: string }> };
  const messages = listPayload.messages ?? [];

  if (!messages.length) {
    return [];
  }

  const details = await Promise.all(
    messages.map(async (message) => {
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const detailPayload = (await readJsonResponse(detailResponse)) as {
        id: string;
        snippet?: string;
        payload?: {
          headers?: Array<{ name: string; value: string }>;
        };
      };
      const headers = detailPayload.payload?.headers ?? [];
      const subject = headers.find((header) => header.name.toLowerCase() === "subject")?.value ?? "";
      const from = headers.find((header) => header.name.toLowerCase() === "from")?.value ?? "";
      const date = headers.find((header) => header.name.toLowerCase() === "date")?.value ?? "";

      return {
        id: detailPayload.id,
        subject,
        from,
        snippet: detailPayload.snippet ?? "",
        receivedAt: date ? new Date(date).toISOString() : new Date().toISOString(),
      };
    })
  );

  return details.filter((message) => message.subject || message.snippet);
}

async function fetchOutlookMessages(accessToken: string): Promise<MailMessageCandidate[]> {
  const response = await fetch(
    "https://graph.microsoft.com/v1.0/me/messages?$top=20&$orderby=receivedDateTime DESC&$select=id,subject,from,receivedDateTime,bodyPreview",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const payload = (await readJsonResponse(response)) as {
    value?: Array<{
      id: string;
      subject?: string;
      bodyPreview?: string;
      receivedDateTime?: string;
      from?: {
        emailAddress?: {
          address?: string;
          name?: string;
        };
      };
    }>;
  };

  return (payload.value ?? []).map((message) => ({
    id: message.id,
    subject: message.subject ?? "",
    from:
      message.from?.emailAddress?.address ||
      message.from?.emailAddress?.name ||
      "microsoft-account",
    snippet: message.bodyPreview ?? "",
    receivedAt: message.receivedDateTime ?? new Date().toISOString(),
  }));
}

export function rememberPendingMailProvider(provider: EmailProvider) {
  window.sessionStorage.setItem(pendingProviderStorageKey, provider);
}

export function getPendingMailProvider(): EmailProvider | null {
  const value = window.sessionStorage.getItem(pendingProviderStorageKey);
  return value === "gmail" || value === "outlook" ? value : null;
}

export function clearPendingMailProvider() {
  window.sessionStorage.removeItem(pendingProviderStorageKey);
}

export async function startMailProviderLink(provider: EmailProvider) {
  rememberPendingMailProvider(provider);

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    clearPendingMailProvider();
    throw sessionError;
  }

  const config = providerConfig[provider];
  const authPromise = hasLinkedIdentity(sessionData.session, config.oauthProvider)
    ? supabase.auth.signInWithOAuth({
        provider: config.oauthProvider,
        options: {
          redirectTo: `${window.location.origin}/mail/callback`,
          scopes: config.scopes,
          queryParams: config.queryParams,
        },
      })
    : supabase.auth.linkIdentity({
        provider: config.oauthProvider,
        options: {
          redirectTo: `${window.location.origin}/mail/callback`,
          scopes: config.scopes,
          queryParams: config.queryParams,
        },
      });

  const { error } = await authPromise;

  if (error) {
    clearPendingMailProvider();
    throw error;
  }
}

export async function analyzeLinkedMailbox(
  session: Session | null,
  provider: EmailProvider
): Promise<EmailAnalysisResponse> {
  const activeSession = await getSessionWithProviderToken(session);
  const accessToken = activeSession.provider_token;
  const email = activeSession.user?.email;

  if (!email) {
    throw new Error("Kullanici e-postasi bulunamadi.");
  }

  const messages =
    provider === "gmail"
      ? await fetchGoogleMessages(accessToken)
      : await fetchOutlookMessages(accessToken);

  return extractSubscriptionsFromMessages(provider, email, messages);
}
