import Script from 'next/script';
import { GA_MEASUREMENT_ID, GA_PLACEHOLDER } from '@/lib/seo';

/**
 * GA4 (gtag.js).
 *
 * STRICT NO-OP while `GA_MEASUREMENT_ID` is still the placeholder: the
 * component returns `null`, so nothing is written into the document — no
 * script tag, no request to googletagmanager.com, no cookie, no consent
 * surface. Nothing about the page changes visually either way; this
 * component renders no box.
 *
 * To switch it on: create the GA4 property, then replace the value of
 * `GA_MEASUREMENT_ID` in `lib/seo.ts` with the real `G-…` ID. That is the
 * only edit required, and it is the only place the ID lives.
 */
export function GA4() {
  const id = GA_MEASUREMENT_ID;

  if (!id || id === GA_PLACEHOLDER) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
