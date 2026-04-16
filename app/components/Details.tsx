import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-2 items-center px-3 py-1 rounded-full border shadow-sm",
              score > 69
                  ? "bg-green-50/50 border-green-100"
                  : score > 39
                      ? "bg-amber-50/50 border-amber-100"
                      : "bg-red-50/50 border-red-100"
          )}
      >
        <div className={cn(
          "size-2 rounded-full",
          score > 69 ? "bg-green-500" : score > 39 ? "bg-amber-500" : "bg-red-500"
        )} />
        <p
            className={cn(
                "text-xs font-bold uppercase tracking-wider",
                score > 69
                    ? "text-green-700"
                    : score > 39
                        ? "text-amber-700"
                        : "text-red-700"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row justify-between items-center w-full py-4 px-2 hover:bg-gray-50/30 transition-colors rounded-xl group">
        <p className="text-xl font-bold text-gray-800 transition-colors group-hover:text-black">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-6 w-full pt-2 pb-6 px-2">
        <div className="assessment-grid">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-3 items-start" key={index}>
                <div className={cn(
                  "mt-1 size-5 rounded-full flex items-center justify-center shrink-0",
                  tip.type === "good" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                )}>
                   <img
                    src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                    alt="icon"
                    className="size-3"
                />
                </div>
                <p className="text-gray-700 font-medium leading-snug">{tip.tip}</p>
              </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-4 w-full mt-2">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 px-2">Detailed Assessments</p>
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      tip.type === "good" ? "tip-card-good" : "tip-card-improve"
                  )}
              >
                <div className="flex flex-row gap-3 items-center">
                   <div className={cn(
                    "size-8 rounded-full flex items-center justify-center bg-white shadow-sm shrink-0",
                    tip.type === "good" ? "text-green-600" : "text-amber-600"
                  )}>
                    <img
                        src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                        alt="icon"
                        className="size-4"
                    />
                  </div>
                  <p className="text-lg font-bold">{tip.tip}</p>
                </div>
                <p className="text-base leading-relaxed mt-2 pl-11 opacity-90">{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-4">
          <span className="eyebrow w-fit">Deep Analysis</span>
          <h2 className="text-4xl font-bold !text-black leading-tight">Layered Performance Review</h2>
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
            We've broken down your resume into four critical performance pillars. Expand each section to see specific assessments and rewrite guidance.
          </p>
        </div>

        <div className="report-shell !p-4">
          <Accordion>
            <AccordionItem id="tone-style">
              <AccordionHeader itemId="tone-style">
                <CategoryHeader
                    title="Tone & Style"
                    categoryScore={feedback.toneAndStyle.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="tone-style">
                <CategoryContent tips={feedback.toneAndStyle.tips} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem id="content">
              <AccordionHeader itemId="content">
                <CategoryHeader
                    title="Content Quality"
                    categoryScore={feedback.content.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="content">
                <CategoryContent tips={feedback.content.tips} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem id="structure">
              <AccordionHeader itemId="structure">
                <CategoryHeader
                    title="Visual Structure"
                    categoryScore={feedback.structure.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="structure">
                <CategoryContent tips={feedback.structure.tips} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem id="skills">
              <AccordionHeader itemId="skills">
                <CategoryHeader
                    title="Role Alignment & Skills"
                    categoryScore={feedback.skills.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="skills">
                <CategoryContent tips={feedback.skills.tips} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
  );
};

export default Details;
