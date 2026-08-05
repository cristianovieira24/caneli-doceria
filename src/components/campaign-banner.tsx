import Image from "next/image";
import Link from "next/link";
import { ViewTracker } from "@/components/view-tracker";
import type { Campaign } from "@/types/database";

export function CampaignBanner({ campaign }: { campaign: Campaign }) {
  return (
    <section className="section pb-4">
      <ViewTracker event="campaign_viewed" params={{ campaign: campaign.title }} />
      <div className="arch-frame relative flex min-h-[220px] items-end overflow-hidden bg-terracotta sm:min-h-[280px]">
        {(campaign.image_desktop_url || campaign.image_mobile_url) && (
          <Image
            src={campaign.image_desktop_url || campaign.image_mobile_url!}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10" />
        <div className="relative z-10 p-6 sm:p-10 text-cream-soft">
          {campaign.subtitle && <p className="eyebrow text-blush">{campaign.subtitle}</p>}
          <h2 className="mt-1 max-w-[24ch] text-2xl sm:text-3xl text-cream-soft">{campaign.title}</h2>
          {campaign.button_label && campaign.button_link && (
            <Link
              href={campaign.button_link}
              className="mt-4 inline-block rounded-full bg-cream-soft px-6 py-2.5 text-sm font-medium text-pine hover:bg-blush-light"
            >
              {campaign.button_label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
