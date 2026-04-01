const GHL_API_KEY = process.env.GHL_API_KEY!;

export async function updateGhlContactField(
  contactId: string,
  fieldKey: string,
  value: string
): Promise<void> {
  const response = await fetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({
        customFields: [{ key: fieldKey, value }],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`GHL API error: ${response.status} ${response.statusText}`);
  }
}

export async function addGhlContactTag(
  contactId: string,
  tag: string
): Promise<void> {
  const response = await fetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({ tags: [tag] }),
    }
  );

  if (!response.ok) {
    throw new Error(`GHL API error: ${response.status} ${response.statusText}`);
  }
}
