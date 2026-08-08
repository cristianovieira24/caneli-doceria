import Image from "next/image";
import Link from "next/link";
import { ViewTracker } from "@/components/view-tracker";
import { DemoExternalLink } from "@/components/demo-external-link";
import type { Campaign } from "@/types/database";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function CampaignBanner({ campaign }: { campaign: Campaign }) {
  const isExternalLink = campaign.button_link?.startsWith("http");

  return (
    <section className="section pb-5 sm:pb-7">
      <ViewTracker
        event="campaign_viewed"
        params={{ campaign: campaign.title }}
      />

      <div className="frosting-panel relative flex min-h-[250px] items-end overflow-hidden bg-terracotta shadow-lift sm:min-h-[300px]">
        {(campaign.image_desktop_url || campaign.image_mobile_url) && (
          <Image
            src={campaign.image_desktop_url || campaign.image_mobile_url!}
            alt=""
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.02]"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

        <div
          aria-hidden
          className="absolute -right-5 -top-6 h-24 w-24 rounded-full border-[9px] border-blush/45"
        />

        <div className="relative z-10 p-5 text-cream-soft min-[380px]:p-6 sm:p-10">
          {campaign.subtitle && (
            <p className="eyebrow text-blush">{campaign.subtitle}</p>
          )}

          <h2 className="mt-1 max-w-[24ch] text-2xl text-cream-soft sm:text-3xl">
            {campaign.title}
          </h2>

          {campaign.button_label && campaign.button_link && (
            DEMO_MODE && isExternalLink ? (
              <DemoExternalLink
                href={campaign.button_link}
                className="mt-5 inline-flex rounded-full bg-cream-soft px-6 py-3 text-sm font-medium text-pine shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-blush-light"
              >
                {campaign.button_label}
              </DemoExternalLink>
            ) : (
              <Link
                href={campaign.button_link}
                className="mt-5 inline-flex rounded-full bg-cream-soft px-6 py-3 text-sm font-medium text-pine shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-blush-light"
              >
                {campaign.button_label}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
