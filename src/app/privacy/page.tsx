import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy — Gena Medure",
  description:
    "How genamedure.com collects, uses, and stores information, including TikTok account data used to update this media kit.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" updated="July 17, 2026">
      <p>
        This Privacy Policy explains how information is handled on{" "}
        <a href="https://genamedure.com">genamedure.com</a> (the “Site”), a
        personal media kit for {SITE.name}. Questions:{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>What this site is</h2>
      <p>
        The Site is a public media kit for brand partners. Most visitors can
        browse without creating an account or providing personal information.
      </p>

      <h2>Information we collect</h2>
      <h3>From site visitors</h3>
      <p>
        We do not ask visitors to create accounts. If you email us, we receive
        whatever you include in that message (typically your email address and
        message content). Hosting and analytics providers may automatically
        collect standard technical data such as IP address, browser type, and
        pages viewed.
      </p>

      <h3>From TikTok (account owner only)</h3>
      <p>
        The Site owner may connect a TikTok account through TikTok Login Kit so
        the media kit can stay current. When that connection is authorized, we
        may receive:
      </p>
      <ul>
        <li>TikTok username and profile link</li>
        <li>Basic profile details (such as display name and avatar)</li>
        <li>Public engagement stats (such as follower count)</li>
        <li>
          Public video metadata needed to summarize recent post performance
          (views, likes, comments, and shares)
        </li>
        <li>
          OAuth tokens used only to refresh that information on a schedule
        </li>
      </ul>
      <p>
        Visitors to the Site never log in with TikTok and are not asked to
        authorize TikTok access.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To operate and display the media kit</li>
        <li>
          To keep TikTok handle, profile URL, and published stats accurate
        </li>
        <li>To respond to emails and brand inquiries</li>
        <li>To maintain the security and reliability of the Site</li>
      </ul>
      <p>
        We do not sell personal information. We do not use TikTok data to build
        a multi-user social product.
      </p>

      <h2>Where information is stored</h2>
      <p>
        Site content and published stats are stored in Sanity (content
        management). The Site is hosted on Vercel. TikTok tokens, when used, are
        stored server-side and used only to refresh media kit content. TikTok’s
        own handling of account data is governed by TikTok’s privacy policy.
      </p>

      <h2>Cookies and similar technologies</h2>
      <p>
        The Site may use cookies or similar technologies required for hosting,
        security, or basic analytics. We do not use them to run third-party
        advertising on this media kit.
      </p>

      <h2>Sharing</h2>
      <p>
        We share information only with service providers that help run the Site
        (for example hosting and CMS), when required by law, or to protect the
        Site and its users. Published media kit stats are intentionally public
        on the Site.
      </p>

      <h2>Retention</h2>
      <p>
        Emails are kept as long as needed to manage inquiries. TikTok tokens and
        synced stats are kept while the TikTok connection is active and the Site
        is operated. You can request deletion by contacting us.
      </p>

      <h2>Your choices</h2>
      <p>
        The TikTok account owner can revoke the Site’s access at any time in
        TikTok’s app or account settings. After revocation, we stop pulling new
        TikTok data. To request access, correction, or deletion of information
        we hold, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>Children</h2>
      <p>
        The Site is not directed to children under 13, and we do not knowingly
        collect personal information from children under 13.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. The “Last updated” date at
        the top of this page will change when we do. Continued use of the Site
        after an update means you accept the revised policy.
      </p>

      <h2>Contact</h2>
      <p>
        {SITE.name}
        <br />
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <br />
        <a href="https://genamedure.com">https://genamedure.com</a>
      </p>
    </LegalDoc>
  );
}
