import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service — Gena Medure",
  description:
    "Terms for using genamedure.com, the personal media kit for Gena Medure.",
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" updated="July 17, 2026">
      <p>
        These Terms of Service (“Terms”) govern use of{" "}
        <a href="https://genamedure.com">genamedure.com</a> (the “Site”), a
        personal media kit for {SITE.name}. By using the Site, you agree to
        these Terms. Questions:{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>The Site</h2>
      <p>
        The Site shares brand-facing information about {SITE.name}, including
        biography, collaboration history, and TikTok performance stats. It is
        provided for informational and partnership purposes.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site for anything unlawful or harmful</li>
        <li>
          Attempt to access private systems, tokens, or non-public admin tools
        </li>
        <li>
          Scrape, copy, or republish Site content at scale without permission
        </li>
        <li>
          Misrepresent an affiliation with {SITE.name} or use Site materials to
          imply endorsement without consent
        </li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        Photos, video, text, logos, and other materials on the Site belong to{" "}
        {SITE.name} or their respective owners. You may view the Site for
        personal or ordinary business evaluation (for example, reviewing a
        media kit for a potential collaboration). Any other use requires prior
        written permission.
      </p>

      <h2>Stats and third-party platforms</h2>
      <p>
        Stats shown on the Site may be synced from TikTok or entered manually
        and can change over time. Third-party platforms (including TikTok) have
        their own terms and privacy policies. We are not responsible for those
        platforms or for temporary inaccuracies while data is updating.
      </p>

      <h2>TikTok connection</h2>
      <p>
        If the Site owner connects a TikTok account, that connection is used
        only to keep media kit profile links and published stats current. Site
        visitors are not required to log in with TikTok.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The Site is provided “as is.” To the fullest extent permitted by law, we
        disclaim warranties of merchantability, fitness for a particular
        purpose, and non-infringement. We do not guarantee uninterrupted
        availability or error-free content.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE.name} and operators of the
        Site are not liable for indirect, incidental, special, consequential, or
        punitive damages, or for loss of profits, data, or business
        opportunities, arising from use of the Site.
      </p>

      <h2>Links</h2>
      <p>
        The Site may link to third-party sites (for example TikTok or email).
        Those sites are not under our control, and we are not responsible for
        their content or practices.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms from time to time. The “Last updated” date at
        the top of this page will change when we do. Continued use of the Site
        after an update means you accept the revised Terms.
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
