import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  senderName: z.string().trim().min(1).max(200),
  senderEmail: z.string().trim().email().max(320),
  subject: z.string().trim().min(1).max(300),
  body: z.string().trim().min(1).max(10000),
  attachmentNames: z.array(z.string().max(255)).max(10).default([]),
});

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Always persist the message so nothing is lost.
    const { error: insertError } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        sender_name: data.senderName,
        sender_email: data.senderEmail,
        subject: data.subject,
        body: data.body,
        attachment_names: data.attachmentNames,
      });

    if (insertError) {
      console.error("contact_messages insert failed", insertError);
      throw new Error("Could not save your message. Please try again.");
    }

    // 2. Best-effort email delivery via Lovable Emails (requires verified sender domain).
    let emailDelivered = false;
    let emailError: string | null = null;

    try {
      const origin = process.env.LOVABLE_PROJECT_URL ?? "";
      const url = `${origin}/lovable/email/transactional/send`;
      const apiKey = process.env.LOVABLE_API_KEY;

      if (apiKey && origin) {
        const attachmentsLine = data.attachmentNames.length
          ? `\n\nAttachments mentioned by sender:\n- ${data.attachmentNames.join("\n- ")}`
          : "";

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            templateName: "contact-relay",
            recipientEmail: "neerajmadan2006@gmail.com",
            idempotencyKey: `contact-${Date.now()}-${data.senderEmail}`,
            templateData: {
              senderName: data.senderName,
              senderEmail: data.senderEmail,
              subject: data.subject,
              body: data.body + attachmentsLine,
            },
          }),
        });
        emailDelivered = res.ok;
        if (!res.ok) emailError = `Email send returned ${res.status}`;
      } else {
        emailError = "Email infrastructure not configured yet.";
      }
    } catch (e) {
      console.error("contact email send failed", e);
      emailError = e instanceof Error ? e.message : "Unknown email error";
    }

    return { saved: true, emailDelivered, emailError };
  });
