"use client";

import { safeParseJSON } from "@/lib/utils";
import GuideContentEditor from "./GuideContentEditor";
import AdvertorialContentEditor from "./AdvertorialContentEditor";
import ListicleContentEditor from "./ListicleContentEditor";
import ReviewContentEditor from "./ReviewContentEditor";
import ComparativeContentEditor from "./ComparativeContentEditor";

interface Props {
  type: string;
  value: string;
  onChange: (json: string) => void;
}

export default function ContentEditorSwitch({ type, value, onChange }: Props) {
  const parsed = safeParseJSON(value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(data: any) {
    onChange(JSON.stringify(data));
  }

  switch (type) {
    case "guide":
      return (
        <GuideContentEditor
          data={{
            sections: (parsed.sections as [] | undefined) || [],
            tips: (parsed.tips as [] | undefined) || [],
            faq: (parsed.faq as [] | undefined) || [],
          }}
          onChange={handleChange}
        />
      );

    case "advertorial":
      return (
        <AdvertorialContentEditor
          data={{
            sections: (parsed.sections as [] | undefined) || [],
            products: (parsed.products as [] | undefined) || [],
            verdict: (parsed.verdict as string | undefined) || "",
          }}
          onChange={handleChange}
        />
      );

    case "listicle":
      return (
        <ListicleContentEditor
          data={{
            items: (parsed.items as [] | undefined) ||
              (parsed.sections as [] | undefined)?.map(
                (s: { title: string; body: string }) => ({
                  title: s.title,
                  body: s.body,
                })
              ) || [],
          }}
          onChange={handleChange}
        />
      );

    case "review":
      return (
        <ReviewContentEditor
          data={{
            overallScore: (parsed.overallScore as number | undefined) || 0,
            criteria: (parsed.criteria as [] | undefined) || [],
            pros: (parsed.pros as string[] | undefined) || [],
            cons: (parsed.cons as string[] | undefined) || [],
            forWho: (parsed.forWho as string | undefined) || "",
            alternatives: (parsed.alternatives as [] | undefined) || [],
            body: (parsed.body as string | undefined) || "",
          }}
          onChange={handleChange}
        />
      );

    case "comparative":
      return (
        <ComparativeContentEditor
          data={{
            criteria: (parsed.criteria as string[] | undefined) || [],
            products: (parsed.products as [] | undefined) || [],
            winner: (parsed.winner as string | undefined) || "",
            verdict: (parsed.verdict as string | undefined) || "",
            sections: (parsed.sections as [] | undefined) || [],
          }}
          onChange={handleChange}
        />
      );

    default:
      return (
        <GuideContentEditor
          data={{
            sections: (parsed.sections as [] | undefined) || [],
            tips: (parsed.tips as [] | undefined) || [],
            faq: (parsed.faq as [] | undefined) || [],
          }}
          onChange={handleChange}
        />
      );
  }
}
