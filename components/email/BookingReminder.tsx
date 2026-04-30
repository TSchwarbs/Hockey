import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Row, Column, Section, Text,
} from "@react-email/components";
import { BUSINESS_NAME, DROP_BOX_ADDRESS, CONTACT_EMAIL, DOMAIN } from "@/lib/constants";
import { formatWindowHours, getPickupDate } from "@/lib/booking";
import type { BookingWithWindow } from "@/lib/types";

const navy = "#0D2340";
const blue = "#1A6FA8";
const steel = "#4A6276";
const bg = "#F4F6F8";

export function BookingReminder({ booking }: { booking: BookingWithWindow }) {
  const win = booking.drop_off_windows;
  const cancelUrl = `${DOMAIN}/cancel/${booking.cancellation_token}`;

  return (
    <Html>
      <Head />
      <Preview>Today is your drop-off day — {formatWindowHours(win.open_time, win.close_time)}</Preview>
      <Body style={{ backgroundColor: bg, fontFamily: "system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto" }}>
          <Section style={{ backgroundColor: navy, borderRadius: "12px 12px 0 0", padding: "24px 32px" }}>
            <Heading style={{ color: "#fff", fontSize: 20, margin: 0, fontWeight: 600 }}>
              {BUSINESS_NAME}
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "0 0 12px 12px", border: "1px solid #e5e7eb", borderTop: "none" }}>
            <Heading as="h2" style={{ color: navy, fontSize: 22, fontWeight: 700, marginTop: 0 }}>
              Drop-off day reminder
            </Heading>
            <Text style={{ color: steel, fontSize: 15, lineHeight: "1.6", marginBottom: 24 }}>
              Hi {booking.customer_name} — just a reminder that today is your drop-off day.
            </Text>

            <Section style={{ backgroundColor: bg, borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Drop-off window</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 700, margin: 0 }}>{formatWindowHours(win.open_time, win.close_time)}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Hollow depth</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, fontFamily: "monospace", margin: 0 }}>{booking.hollow_depth}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Drop box</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{DROP_BOX_ADDRESS}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pickup</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>Tomorrow — {getPickupDate(win.date)}</Text></Column>
              </Row>
            </Section>

            <Hr style={{ borderColor: "#e5e7eb", marginBottom: 24 }} />

            <Text style={{ color: steel, fontSize: 13, marginBottom: 8 }}>
              Need to cancel? The cancellation link is active until your window opens today:
            </Text>
            <Link
              href={cancelUrl}
              style={{ color: blue, fontSize: 14, textDecoration: "underline" }}
            >
              Cancel this booking
            </Link>

            <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

            <Text style={{ color: steel, fontSize: 13 }}>
              Questions? Contact us at{" "}
              <Link href={`mailto:${CONTACT_EMAIL}`} style={{ color: blue }}>{CONTACT_EMAIL}</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingReminder;
