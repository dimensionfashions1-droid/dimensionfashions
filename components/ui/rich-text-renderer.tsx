"use client"

export function RichTextRenderer({ content }: { content: string }) {
  if (!content) return null;
  
  return (
    <div 
      className="max-w-none text-primary/70 leading-relaxed font-sans text-sm 
        [&>p]:mb-4 last:[&>p]:mb-0
        [&>h2]:text-xl [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-primary [&>h2]:mt-6 [&>h2]:mb-3
        [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
        [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4
        [&>ul>li]:pl-1 [&>ol>li]:pl-1
        [&_strong]:font-bold [&_strong]:text-primary
        [&_em]:italic"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
