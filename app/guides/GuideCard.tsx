import Link from "next/link";
import type { GuideMeta } from "@/lib/guides";
import { ArrowIcon } from "./icons";

export default function GuideCard({ guide }: { guide: GuideMeta }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="gd-card-link">
      <article className="gd-card">
        <div className="gd-card-tags">
          <span className="gd-pill gd-pill-topic">{guide.category}</span>
          <span className="gd-pill gd-pill-tool">{guide.tool}</span>
        </div>
        <h3 className="gd-card-title">{guide.title}</h3>
        <span className="gd-card-read">
          Read guide <ArrowIcon size={13} />
        </span>
      </article>
    </Link>
  );
}
