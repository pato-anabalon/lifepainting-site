import type { Metadata } from "next";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32" as="section">
      <h1 data-testid="not-found-heading" className="lp-title text-4xl sm:text-6xl">Page not found</h1>
      <p className="mt-5 max-w-md text-lg">That page doesn&apos;t exist, but your next paint job still can.</p>
      <Button href="/" className="mt-8" data-testid="not-found-home-button">Back to home</Button>
    </Container>
  );
}
