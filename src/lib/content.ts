/**
 * Life Painting – centralised commercial content (en-NZ).
 *
 * Rules (see AGENTS.md):
 *  - Every visible string lives here, not inside components.
 *  - Never invent testimonials, reviews, awards, metrics, clients or case studies.
 *  - Anything awaiting real material is `evidence: "pending"`. Pending sections render
 *    in development only (see `isSectionVisible`), unless SHOW_PENDING_SECTIONS is on.
 */

export type Evidence = "ready" | "pending";

export const site = {
  name: "Life Painting",
  legalName: "Life Painting & Decorating",
  slogan: "Good preparations. Better Finishes.",
  tagline: "Premium workmanship. Approachable service.",
  established: 2023,
  locale: "en-NZ",
  phone: { display: "027 375 9093", tel: "+64273759093" },
  email: "contact@lifepaintingdec.co.nz",
  serviceAreas: ["Auckland", "North Shore", "Auckland Central", "West Auckland"],
  country: "NZ",
} as const;

/** Sections of the home landing, in page order. `visible` hides a section completely. */
export type SectionId =
  | "hero"
  | "services-overview"
  | "services"
  | "proof"
  | "work"
  | "faq"
  | "contact";

export const sections: Record<
  SectionId,
  {
    anchor: string;
    navLabel: string | null;
    evidence: Evidence;
    visible: boolean;
  }
> = {
  hero: { anchor: "top", navLabel: null, evidence: "ready", visible: true },
  // "Services" in the menu lands on the overview ("What we paint and prepare"), the first services section.
  "services-overview": {
    anchor: "services",
    navLabel: "Services",
    evidence: "ready",
    visible: true,
  },
  // "How we look after your home" (owner, 2026-11-01: its own menu item).
  services: {
    anchor: "looking-after-your-home",
    navLabel: "Our approach",
    evidence: "ready",
    visible: true,
  },
  // Standards are ready; only the testimonial block inside it is pending (see `proof.testimonials`).
  proof: {
    anchor: "how-we-work",
    navLabel: "How we work",
    evidence: "ready",
    visible: true,
  },
  // Real project photos supplied by the owner (2026-11-09).
  work: {
    anchor: "work",
    navLabel: "Our work",
    evidence: "ready",
    visible: true,
  },
  faq: { anchor: "faq", navLabel: "FAQ", evidence: "ready", visible: true },
  contact: {
    anchor: "contact",
    navLabel: null,
    evidence: "ready",
    visible: true,
  },
};

/**
 * Mock-up mode (owner, 2026-11-01): show pending content in production too, with its "PENDING"
 * notes, so the client could review the full page. Off since the production release (2026-11-09):
 * pending content (the testimonial block) renders in development only.
 */
export const SHOW_PENDING_SECTIONS = false;

/** Pending content only renders outside production (unless in mock-up mode), so placeholders do not ship. */
export function isEvidenceVisible(evidence: Evidence): boolean {
  if (evidence === "pending")
    return SHOW_PENDING_SECTIONS || process.env.NODE_ENV !== "production";
  return true;
}

export function isSectionVisible(id: SectionId): boolean {
  const s = sections[id];
  return s.visible && isEvidenceVisible(s.evidence);
}

export const nav = {
  items: (Object.keys(sections) as SectionId[])
    .filter((id) => sections[id].navLabel && isSectionVisible(id))
    .map((id) => ({
      id,
      label: sections[id].navLabel as string,
      href: `/#${sections[id].anchor}`,
    })),
  cta: { label: "Get a quote", href: "/#contact" },
  mobileMenuOpen: "Open menu",
  mobileMenuClose: "Close menu",
  skipToContent: "Skip to content",
};

export const hero = {
  title: "Good preparations. Better Finishes.",
  titleLines: ["Good preparations.", "Better Finishes."],
  intro:
    "Interior, exterior and decorative painting for Auckland homes, with careful preparation and clear communication from first conversation to final coat.",
  primaryCta: { label: "Get a free quote", href: "/#contact" },
  secondaryCta: { label: "See what we do", href: "/#services" },
};

/**
 * Hero collage (HeroSection). Ambient pictures of homes, rooms and the trade, supplied by
 * the owner (2026-11-01; free licence, no credit needed). The shopfront picture is an illustration:
 * the business has no physical shop. Add a `credit` to any photo that needs one; the footer lists only those
 * (and hides the credits block when there are none). Order = tile order in LifeHeroCollage.
 */
/** Shared social image (src/app/opengraph-image.tsx): hero headline plus this line. */
export const ogImage = {
  line: "Interior, exterior and decorative painting for Auckland homes.",
  alt: "Life Painting & Decorating: Good preparations. Better finishes. Interior, exterior and decorative painting in Auckland.",
};

export const heroCollage = {
  photos: [
    { src: "/hero-collage/1-optimized.avif", credit: null },
    { src: "/hero-collage/2-optimized.avif", credit: null },
    { src: "/hero-collage/3-optimized.avif", credit: null },
    { src: "/hero-collage/4-optimized.avif", credit: null },
    { src: "/hero-collage/5-optimized.avif", credit: null },
    { src: "/hero-collage/6-optimized.avif", credit: null },
    { src: "/hero-collage/7-optimized.avif", credit: null },
    { src: "/hero-collage/8-optimized.avif", credit: null },
    { src: "/hero-collage/9-optimized.avif", credit: null },
    { src: "/hero-collage/10-optimized.avif", credit: null },
    { src: "/hero-collage/11-optimized.avif", credit: null },
    { src: "/hero-collage/12-optimized.avif", credit: null },
  ] as Array<{
    src: string;
    credit: {
      title: string;
      creator: string;
      license: string;
      url: string;
    } | null;
  }>,
  creditsLabel: "Photo credits",
  creditsIntro: "Hero collage photos:",
};

export type ServiceKey = "interior" | "exterior" | "decorative" | "preparation";

export const services: Array<{
  key: ServiceKey;
  title: string;
  summary: string;
  details: string[];
  cta: string;
}> = [
  {
    key: "interior",
    title: "Interior Painting",
    summary:
      "Refresh and transform your interior spaces with professional painting and careful attention to detail. From walls and ceilings to doors, trims and feature finishes, we focus on thorough preparation and a clean, high-quality finish throughout your home.",
    details: ["Walls", "Ceilings", "Trim", "Doors", "Feature finishes"],
    cta: "Quote interior painting",
  },
  {
    key: "exterior",
    title: "Exterior Painting",
    summary:
      "Protect and refresh your home with exterior painting designed for Auckland conditions. We prepare and paint weatherboards, masonry, roofs, fences and other exterior surfaces, using quality products and proven systems for a durable, long-lasting finish.",
    details: [
      "Weatherboards",
      "Masonry",
      "Roofs",
      "Fences",
      "Exterior surfaces",
    ],
    cta: "Quote exterior painting",
  },
  {
    key: "decorative",
    title: "Decorative Finishes",
    summary:
      "Add character and personality to your space with decorative and specialty finishes. From feature walls and subtle textures to unique finishing techniques, we can help create something distinctive that complements your home and style.",
    details: ["Feature walls", "Textures", "Special finishes"],
    cta: "Ask about finishes",
  },
  {
    key: "preparation",
    title: "Preparation & Repairs",
    summary:
      "A great finish starts with proper preparation. We provide GIB stopping, skimming, surface preparation and minor repairs to create a smooth, sound surface before painting, helping achieve a better-looking and longer-lasting result.",
    details: [
      "GIB stopping",
      "Skimming",
      "Surface preparation",
      "Minor repairs",
    ],
    cta: "Ask about prep & repairs",
  },
];

/** Links a service to the enquiry form. The form reads `?service=` in Phase 3. */
export function contactHref(service?: ServiceKey): string {
  return service ? `/?service=${service}#contact` : "/#contact";
}

export const servicesOverview = {
  title: "What we paint and prepare",
  intro:
    "Not sure which service you need? Start here, then tell us about your home and we'll point you the right way.",
  askLabel: "Ask about",
  tiles: [
    {
      key: "interior" as ServiceKey,
      title: "Interior Painting",
      note: "Walls, ceilings, trim and doors",
    },
    {
      key: "exterior" as ServiceKey,
      title: "Exterior Painting",
      note: "Built for Auckland conditions",
    },
    {
      key: "exterior" as ServiceKey,
      title: "Weatherboards",
      note: "Prepared, primed, painted",
    },
    {
      key: "exterior" as ServiceKey,
      title: "Masonry & brick",
      note: "Brickwork and more",
    },
    { key: "exterior" as ServiceKey, title: "Roofs", note: "Roof painting" },
    {
      key: "exterior" as ServiceKey,
      title: "Fences",
      note: "Fences and surfaces",
    },
    {
      key: "decorative" as ServiceKey,
      title: "Decorative Finishes",
      note: "Feature walls and textures",
    },
    {
      key: "preparation" as ServiceKey,
      title: "Preparation & Repairs",
      note: "GIB stopping and skimming",
    },
  ],
};

export const servicesSection = {
  title: "How we look after your home",
  intro:
    "Painting is at the heart of what we do. Everything else exists to make the finish better and longer-lasting.",
};

/** "How we work": brand values, stated qualitatively. No reviews or numbers. */
export const proof = {
  title: "How we run every job",
  intro:
    "We can't hand you a stack of badges, but we can tell you how we run every job.",
  values: [
    {
      title: "Do what we say",
      body: "We keep our commitments, on timing and on scope.",
    },
    {
      title: "Take pride in the finish",
      body: "Careful preparation first, then a clean, detailed result.",
    },
    {
      title: "Treat every property like it matters",
      body: "A neat, careful approach from start to finish.",
    },
    {
      title: "The small things are part of the job",
      body: "The details are where a good finish is won.",
    },
    {
      title: "Keep people informed",
      body: "Clear communication at every step.",
    },
  ],
  // Pending: real client comments (with written permission) are still being collected.
  testimonials: {
    evidence: "pending" as Evidence,
    title: "Kind words from our clients",
    pending:
      "PENDING: real client comments and written permission to publish them.",
    slots: 3,
  },
};

/** A real project photo (owner's own work, 2026-11-09). Files in `public/gallery/`. */
export type WorkPhoto = { src: string; alt: string; width: number; height: number };

export const work = {
  title: "Finishes we're proud of",
  intro: "A look at recent projects across Auckland.",
  /** Photos shown per tier; the shuffle button swaps in the ones not on screen. */
  shown: 3,
  shuffle: {
    label: "Shuffle photos",
    announce: "Showing other photos from each group.",
  },
  tiers: [
    {
      key: "interior",
      title: "Interior",
      note: "Walls, ceilings and trim",
      highlight: false,
      photos: [
        { src: "/gallery/interior-1.jpg", alt: "Open-plan dining room and kitchen with white walls, a black beam and a timber ceiling", width: 1440, height: 1800 },
        { src: "/gallery/interior-2.jpg", alt: "Living and dining area with white walls under a timber ceiling and amber pendant lights", width: 1440, height: 1800 },
        { src: "/gallery/interior-3.jpg", alt: "Long hallway with white walls and white louvred wardrobe doors", width: 1440, height: 1800 },
        { src: "/gallery/interior-4.jpg", alt: "Front door painted deep green, opening onto a white entry hall", width: 1440, height: 1800 },
        { src: "/gallery/interior-5.jpg", alt: "Hallway with white walls and doors and timber floors", width: 1192, height: 1192 },
        { src: "/gallery/interior-6.jpg", alt: "Staircase with white walls and a timber handrail", width: 1440, height: 1440 },
      ],
    },
    {
      key: "exterior",
      title: "Exterior",
      note: "Weatherboards, masonry, roofs and fences",
      highlight: true,
      photos: [
        { src: "/gallery/exterior-1.jpg", alt: "Weatherboard house painted light grey with white bay windows and trim", width: 1440, height: 1800 },
        { src: "/gallery/exterior-2.jpg", alt: "Brick house with a large timber deck", width: 1440, height: 1800 },
        { src: "/gallery/exterior-3.jpg", alt: "Front door painted black with a leadlight window, set in white weatherboards", width: 1440, height: 1800 },
        { src: "/gallery/exterior-4.jpg", alt: "Two-storey building painted white with dark blue window frames", width: 1439, height: 1439 },
        { src: "/gallery/exterior-5.jpg", alt: "White building with dark blue trim behind a green lawn", width: 1439, height: 1439 },
        { src: "/gallery/exterior-6.jpg", alt: "Villa porch with pale blue weatherboards, white fretwork and a red front door", width: 1440, height: 1800 },
      ],
    },
    {
      key: "finishes",
      title: "Finishes",
      note: "Decorative and specialty work",
      highlight: false,
      photos: [
        { src: "/gallery/deco-1.jpg", alt: "Kitchen with dark blue tiles, timber cabinets and a timber ceiling", width: 1000, height: 1000 },
        { src: "/gallery/deco-2.jpg", alt: "Lounge with white walls, a timber sliding barn door and a starburst clock", width: 1439, height: 1439 },
        { src: "/gallery/deco-3.jpg", alt: "Bedroom with cream walls, a timber ceiling and a black beam", width: 1440, height: 1800 },
        { src: "/gallery/deco-4.jpg", alt: "Bathroom with a green tiled feature wall and a pink freestanding bath", width: 1440, height: 1800 },
        { src: "/gallery/deco-5.jpg", alt: "Bathroom with blue-grey walls, a round mirror and a white vanity", width: 1440, height: 1800 },
        { src: "/gallery/deco-6.jpg", alt: "Timber sliding barn door against white walls", width: 1440, height: 1800 },
      ],
    },
  ] satisfies { key: string; title: string; note: string; highlight: boolean; photos: WorkPhoto[] }[],
};

export const faq = {
  title: "Good to know first",
  items: [
    {
      q: "Which areas do you work in?",
      a: "We work across Auckland, with a focus on the North Shore, Auckland Central and West Auckland.",
    },
    {
      q: "What services do you offer?",
      a: "Interior painting, exterior painting, decorative finishes, and preparation and repairs including GIB stopping and skimming.",
    },
    {
      q: "Can you paint roofs, fences and brickwork?",
      a: "Yes. Beyond walls and ceilings we paint weatherboards, masonry, roofs, fences and other exterior surfaces.",
    },
    {
      q: "Why does preparation matter so much?",
      a: "Paint is only as good as the surface under it. Proper preparation and minor repairs give you a smoother, sounder surface, a better-looking result and a finish that lasts longer.",
    },
    {
      q: "How do I ask for a quote?",
      a: "Tell us about your project using the enquiry form, or call or email us. The more detail you share about the rooms or surfaces involved, the easier it is for us to point you in the right direction.",
    },
  ],
};

export const contact = {
  title: "Ready to give your home a new life?",
  intro: "Let's talk about your next project.",
  marquee: [
    "Homes",
    "Interior",
    "Exterior",
    "Renovations",
    "Decorative Finishes",
    "Preparation & Repairs",
    "Decorative Work",
  ],
  /** Until the step form ships (Phase 3), the real channels are a call and an email. */
  callLabel: "Call 027 375 9093",
  emailLabel: "Email us",
  note: "Tell us about your home, the rooms or surfaces involved, and when you'd like to start.",
};

export const footer = {
  blurb:
    "An Auckland-based painting company focused on quality workmanship, reliability and personal service.",
  columns: {
    explore: "Explore",
    services: "Services",
    contact: "Get in touch",
  },
  areasLabel: "Areas we work in",
  copyright: `© ${new Date().getFullYear()} Life Painting & Decorating. Auckland, New Zealand.`,
  /** Site credit (owner, 2026-11-01). The heart is read out as "love". */
  credit: { before: "Built with", heart: "💛", heartLabel: "love", after: "by", label: "Nodo.co.nz", href: "https://nodo.co.nz", newTab: "(opens in a new tab)" },
};

export const contactForm = {
  title: "Tell us about your project",
  steps: ["Service", "Project", "Your details"],
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
  service: {
    legend: "What do you need help with?",
    options: [
      { value: "interior", label: "Interior painting" },
      { value: "exterior", label: "Exterior painting" },
      { value: "decorative", label: "Decorative finishes" },
      { value: "preparation", label: "Preparation & repairs" },
      { value: "unsure", label: "Not sure yet" },
    ],
    error: "Choose the option that fits best.",
  },
  project: {
    areaLabel: "Which area is the property in?",
    areaOptions: [
      "Auckland",
      "North Shore",
      "Auckland Central",
      "West Auckland",
      "Somewhere else",
    ],
    areaError: "Choose an area.",
    messageLabel: "Tell us about the job",
    messageHint: "Rooms or surfaces involved, and when you'd like to start.",
    messageError: "Add a few details (at least 10 characters).",
    photosLabel: "Photos (optional)",
    photosHint: "Up to 3 photos, 4 MB each. JPG, PNG or WebP.",
    photosAdd: "Add photos",
    photoRemove: "Remove",
    photoErrors: {
      type: "Only JPG, PNG or WebP photos, please.",
      size: "That photo is over 4 MB.",
      failed: "We couldn't upload that photo. You can continue without it.",
      limit: "Up to 3 photos.",
    },
  },
  details: {
    nameLabel: "Your name",
    nameError: "Enter your name.",
    emailLabel: "Email",
    emailError: "Enter a valid email address.",
    phoneLabel: "Phone (optional)",
    phoneError: "That phone number doesn't look right.",
    consentLabel:
      "I agree that Life Painting & Decorating may contact me about this enquiry.",
    consentError: "Please tick this so we can reply.",
    privacyLead: "How we handle your details:",
    privacyLink: "Privacy policy",
    privacyClose: "Close",
  },
  next: "Continue",
  back: "Back",
  submit: "Send enquiry",
  sending: "Sending…",
  genericError:
    "Something went wrong. Please try again, or call or email us directly.",
  unavailable:
    "The enquiry form isn't available right now. Please call or email us instead.",
};

export const consent = {
  title: "Cookies and analytics",
  body: "We'd like to use privacy-friendly analytics to see which parts of the site help people. Nothing is collected unless you accept.",
  accept: "Accept analytics",
  decline: "No thanks",
  manage: "Cookie preferences",
};

export const thankYou = {
  title: "Thanks, we've got your enquiry",
  body: "We'll get back to you by email or phone. If it's urgent, call us on the number below.",
  back: "Back to the home page",
};

export const privacy = {
  title: "Privacy policy",
  updated: "Last updated: October 2026",
  intro:
    "Life Painting & Decorating (Auckland, New Zealand) respects your privacy. This page explains what we collect through this website and why.",
  blocks: [
    {
      heading: "What we collect",
      body: "When you send an enquiry we collect the details you enter: your name, email, optional phone number, service, area, project description and any photos you choose to upload. We use them only to reply to you and to quote for your project.",
    },
    {
      heading: "Photos",
      body: "Photos you upload are stored with our file storage provider (Vercel Blob) under an unguessable web address and are shared with us in the enquiry email. Please don't upload photos showing people.",
    },
    {
      heading: "Analytics and cookies",
      body: 'With your permission we use Vercel Web Analytics to understand how the site is used (for example which buttons are clicked). It is switched on only if you accept, and you can change your choice at any time using "Cookie preferences" in the footer.',
    },
    {
      heading: "Who handles your data",
      body: "Enquiry emails are delivered through Resend. Hosting is provided by Vercel. We don't sell your details or use them for unrelated marketing.",
    },
    {
      heading: "Your rights",
      body: "You can ask us what we hold about you, ask us to correct it or ask us to delete it, under the New Zealand Privacy Act 2020. Email or call us using the details below.",
    },
  ],
};
