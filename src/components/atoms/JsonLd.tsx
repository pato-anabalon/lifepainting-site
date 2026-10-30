/** Server-rendered JSON-LD. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data, testId }: { data: object; testId?: string }) {
  return (
    <script
      type="application/ld+json"
      data-testid={testId}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
