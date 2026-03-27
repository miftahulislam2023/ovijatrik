# Ovijatrik Project Structure and Features

## Project Structure

```text
ovijatrik/
  components.json
  eslint.config.mjs
  next-env.d.ts
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  prisma.config.ts
  proxy.ts
  tsconfig.json

  prisma/
    schema.prisma

  public/
    images/
      public-sections/

  src/
    actions/
      applications.ts
      blog.ts
      contact.ts
      donations.ts
      gallery.ts
      tubewell-project.ts
      volunteers.ts
      weekly-project.ts

    app/
      error.tsx
      globals.css
      layout.tsx
      loading.tsx
      manifest.json
      not-found.tsx
      page.tsx

      (admin)/
        error.tsx
        layout.tsx
        loading.tsx
        not-found.tsx
        admin/
          page.tsx
          dashboard/
          applications/
          blog/
          donations/
          gallery/
          messages/
          tubewell-projects/
          volunteers/
          weekly-projects/

      (user)/
        error.tsx
        layout.tsx
        loading.tsx
        not-found.tsx
        about/
        apply-for-donation/
        blog/
        contact/
        donation/
        faq/
        gallery/
        join-us/
        our-impact/
        privacy-policy/
        profile/
        projects/
        terms/
        tubewell-project/
        tubewell-projects/
        weekly-project/
        weekly-projects/

      api/
        auth/

      create-admin/
        page.tsx

    components/
      charts/
        admin-overview-charts.tsx
      layout/
        Footer.tsx
        Header.tsx
      providers/
        app-providers.tsx
        language-provider.tsx
      site/
        admin-loading.tsx
        admin-navbar.tsx
        foundation-loading.tsx
        gallery-lightbox.tsx
        language-toggle.tsx
        public-experience-sections.tsx
        site-footer.tsx
        site-header.tsx
        theme-toggle.tsx
        volunteer-apply-form.tsx
      ui/
        (many reusable UI primitives)

    generated/
      prisma/
        browser.ts
        ...

    hooks/
      use-mobile.ts

    lib/
      auth.ts
      authorization.ts
      cloudinary.ts
      language.ts
      prisma.ts
      proxy.ts
      slug.ts
      utils.ts

    types/
      next-auth.d.ts
      styles.d.ts
```

## Main Features

- Public-facing website with dedicated user routes (about, projects, gallery, contact, donation, FAQ, privacy policy, terms, etc.).
- Admin panel under `src/app/(admin)/admin` for managing content and operations.
- Authentication with NextAuth (`src/app/api/auth`, `src/lib/auth.ts`) and role-based authorization (`src/lib/authorization.ts`).
- Donation system:
  - General donations
  - Weekly project donations
  - Support for multiple donation mediums (bKash, Nagad, Rocket, bank, other)
  - Donation categories/types (general, zakat, sadaqah, emergency, Ramadan, other)
- Weekly project management with fundraising progress and publish states.
- Tubewell project showcase/management with location, completion year/date, and impact summary.
- Blog management with bilingual content, markdown, featured/published status, and SEO fields.
- Gallery management with sortable media items and lightbox display.
- Contact/message management for user inquiries.
- Donation application workflow (`Application`) with status tracking (pending/approved/rejected).
- Volunteer application workflow (`VolunteerApplication`) with status tracking.
- Multi-language content support (Bangla/English fields across core models, language provider/toggle).
- Theme support (theme toggle + provider).
- Charting/analytics components for admin overview (`src/components/charts/admin-overview-charts.tsx`).
- Cloudinary integration for media handling (`src/lib/cloudinary.ts`).
- Prisma + PostgreSQL data layer with generated Prisma client (`src/generated/prisma`).
- Soft-delete pattern across most data models (`deletedAt` fields).

## Core Data Models (Prisma)

- `User`
- `WeeklyProject`
- `WeeklyDonation`
- `Donation`
- `TubewellProject`
- `BlogPost`
- `GalleryItem`
- `Message`
- `Application`
- `VolunteerApplication`

## Tech Stack Snapshot

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React 19 + reusable component primitives + Tailwind CSS v4
- Auth: NextAuth v5 (beta)
- ORM/DB: Prisma + PostgreSQL (Neon adapter included)
- Validation/Forms: Zod + React Hook Form
- Charts: Recharts
- Email/communication utility: Resend
