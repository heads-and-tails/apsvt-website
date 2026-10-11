import { Fragment } from "react";

export type VerbatimBlock = {
  text: string;
  heading: boolean;
  parts: { text: string; href?: string }[];
};

function LinkedText({ text }: { text: string }) {
  return text.split(/(https?:\/\/[^\s<>]+)/g).map((part, index) => /^https?:\/\//.test(part)
    ? <a href={part} target="_blank" rel="noreferrer" key={index}>{part}</a>
    : <Fragment key={index}>{part}</Fragment>);
}

export function VerbatimInline({ block }: { block: VerbatimBlock }) {
  return <>{block.parts.map((part, index) => part.href
    ? <a href={part.href} target="_blank" rel="noreferrer" key={index}>{part.text}</a>
    : <LinkedText text={part.text} key={index} />)}</>;
}

export function VerbatimProfileText({ blocks }: { blocks: VerbatimBlock[] }) {
  return <div className="marketing-verbatim-text">{blocks.map((block, index) => block.heading
    ? <h4 key={index}><VerbatimInline block={block} /></h4>
    : <p key={index}><VerbatimInline block={block} /></p>)}</div>;
}
