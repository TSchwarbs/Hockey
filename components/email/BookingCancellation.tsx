import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from "@react-email/components";
import { BUSINESS_NAME, CONTACT_EMAIL, DOMAIN } from "@/lib/constants";
import { formatWindowDate, formatWindowHours } from "@/lib/booking";
import type { BookingWithWindow } from "@/lib/types";

const navy = "#0D2340";
const blue = "#1A6FA8";
const steel = "#4A6276";
const bg = "#F4F6F8";

export function BookingCancellation({ booking }: { booking: BookingWithWindow }) {
  const win = booking.drop_off_windows;

  return (
    <Html>
      <Head />
      <Preview>Your booking has been cancelled — {BUSINESS_NAME}</Preview>
      <Body style={{ backgroundColor: bg, fontFamily: "system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto" }}>
          <Section style={{ backgroundColor: navy, borderRadius: "12px 12px 0 0", padding: "24px 32px" }}>
            <Heading style={{ color: "#fff", fontSize: 20, margin: 0, fontWeight: 600 }}>
              {BUSINESS_NAME}
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "0 0 12px 12px", border: "1px solid #e5e7eb", borderTop: "none" }}>
            <Heading as="h2" style={{ color: navy, fontSize: 22, fontWeight: 700, marginTop: 0 }}>
              Booking cancelled
            </Heading>
            <Text style={{ color: steel, fontSize: 15, lineHeight: "1.6", marginBottom: 24 }}>
              Hi {booking.customer_name}, your booking has been successfully cancelled. No action is needed.
            </Text>

            <Section style={{ backgroundColor: bg, borderRadius: 8, padding: "16px 24px", marginBottom: 24 }}>
              <Text style={{ color: steel, fontSize: 12, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Cancelled booking</Text>
              <Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
                {formatWindowDate(win.date)} — {formatWindowHours(win.open_time, win.close_time)}
              </Text>
              <Text style={{ color: steel, fontSize: 13, fontFamily: "monospace", margin: 0 }}>
                Hollow: {booking.hollow_depth}
              </Text>
            </Section>

            <Text style={{ color: steel, fontSize: 15, marginBottom: 24 }}>
              Want to rebook? It only takes a minute:
            </Text>

            <Link
              href={`${DOMAIN}/book`}
              style={{ display: "inline-block", color: "#fff", backgroundColor: blue, padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
            >
              Book a new drop-off
            </Link>

            <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

            <Text style={{ color: steel, fontSize: 13 }}>
              Questions? Reach us at{" "}
              <Link href={`mailto:${CONTACT_EMAIL}`} style={{ color: blue }}>{CONTACT_EMAIL}</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingCancellation;
