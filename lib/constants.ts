export const BUSINESS_NAME = "[BUSINESS NAME]";
export const DROP_BOX_ADDRESS = "[DROP BOX ADDRESS]";
export const CONTACT_EMAIL = "[CONTACT EMAIL]";
export const CONTACT_PHONE = "[CONTACT PHONE]";
export const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://[DOMAIN]";

export const HOLLOW_OPTIONS = [
  {
    value: '3/8"',
    label: '3/8"',
    description: "Deep hollow. Maximum grip and bite. Good for beginners or players who want more control.",
  },
  {
    value: '1/2"',
    label: '1/2"',
    description: 'Standard hollow. The most common choice. Balanced grip and glide.',
  },
  {
    value: '5/8"',
    label: '5/8"',
    description: "Shallow hollow. More glide and speed. Preferred by advanced players on fast ice.",
  },
] as const;

export type HollowDepth = (typeof HOLLOW_OPTIONS)[number]["value"];
