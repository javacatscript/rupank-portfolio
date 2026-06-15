export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  href: string;
}

// Real channels pulled from the résumé. Used by the Contact "Comm Channels"
// block and the footer.
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "github",
    label: "GITHUB",
    handle: "javacatscript",
    href: "https://github.com/javacatscript",
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    handle: "in/rupankjoshi",
    href: "https://linkedin.com/in/rupankjoshi",
  },
  {
    id: "email",
    label: "EMAIL",
    handle: "hellorupank@gmail.com",
    href: "mailto:hellorupank@gmail.com",
  },
];
