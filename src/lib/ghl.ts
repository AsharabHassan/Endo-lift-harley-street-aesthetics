const GHL_API_KEY = process.env.GHL_API_KEY!;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID!;

function ghlHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${GHL_API_KEY}`,
    "Content-Type": "application/json",
    Version: "2021-07-28",
    "Location-Id": GHL_LOCATION_ID,
  };
}

export async function updateGhlContactField(
  contactId: string,
  fieldKey: string,
  value: string
): Promise<void> {
  const response = await fetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}`,
    {
      method: "PUT",
      headers: ghlHeaders(),
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
      headers: ghlHeaders(),
      body: JSON.stringify({ tags: [tag] }),
    }
  );

  if (!response.ok) {
    throw new Error(`GHL API error: ${response.status} ${response.statusText}`);
  }
}
