import { useQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/settings.functions";

export function SiteConfig() {
  const { data } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: () => getPublicSettings(),
    staleTime: 5 * 60 * 1000,
  });

  const s = (data ?? {}) as Record<string, any>;
  const ga = (s.google_analytics_id ?? "").trim();
  const gtm = (s.gtm_id ?? "").trim();
  const pixel = (s.meta_pixel_id ?? "").trim();
  const head = (s.custom_head_scripts ?? "").trim();
  const body = (s.custom_body_scripts ?? "").trim();

  return (
    <>
      {ga && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`,
            }}
          />
        </>
      )}
      {gtm && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
          }}
        />
      )}
      {pixel && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`,
          }}
        />
      )}
      {head && <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: head }} />}
      {body && <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: body }} />}
    </>
  );
}

export function SiteBanner() {
  const { data } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: () => getPublicSettings(),
    staleTime: 5 * 60 * 1000,
  });
  const s = (data ?? {}) as Record<string, any>;
  if (!s.maintenance_banner_enabled || !(s.maintenance_banner ?? "").trim()) return null;
  return (
    <div className="w-full bg-[var(--crimson)] text-white text-center px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em]">
      {s.maintenance_banner}
    </div>
  );
}
