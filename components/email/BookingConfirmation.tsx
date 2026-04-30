import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Row, Column, Section, Text,
} from "@react-email/components";
import { BUSINESS_NAME, DROP_BOX_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, DOMAIN } from "@/lib/constants";
import { formatWindowDate, formatWindowHours, getPickupDate } from "@/lib/booking";
import type { BookingWithWindow } from "@/lib/types";

const navy = "#0D2340";
const blue = "#1A6FA8";
const steel = "#4A6276";
const bg = "#F4F6F8";

export function BookingConfirmation({ booking }: { booking: BookingWithWindow }) {
  const win = booking.drop_off_windows;
  const cancelUrl = `${DOMAIN}/cancel/${booking.cancellation_token}`;

  return (
    <Html>
      <Head />
      <Preview>Booking confirmed — {formatWindowDate(win.date)}</Preview>
      <Body style={{ backgroundColor: bg, fontFamily: "system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto" }}>
          {/* Header */}
          <Section style={{ backgroundColor: navy, borderRadius: "12px 12px 0 0", padding: "24px 32px" }}>
            <Heading style={{ color: "#fff", fontSize: 20, margin: 0, fontWeight: 600 }}>
              {BUSINESS_NAME}
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "0 0 12px 12px", border: "1px solid #e5e7eb", borderTop: "none" }}>
            <Heading as="h2" style={{ color: navy, fontSize: 22, fontWeight: 700, marginTop: 0 }}>
              You&apos;re booked!
            </Heading>
            <Text style={{ color: steel, fontSize: 15, lineHeight: "1.6", marginBottom: 24 }}>
              Here are your drop-off details. Please save or screenshot this email.
            </Text>

            {/* Booking details */}
            <Section style={{ backgroundColor: bg, borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Service</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>Standard Skate Sharpening</Text></Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Hollow</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, fontFamily: "monospace", margin: 0 }}>{booking.hollow_depth}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Drop-off date</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{formatWindowDate(win.date)}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Drop-off window</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{formatWindowHours(win.open_time, win.close_time)}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pickup date</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{getPickupDate(win.date)}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Drop box</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{DROP_BOX_ADDRESS}</Text></Column>
              </Row>
            </Section>

            {/* Customer info verification */}
            <Text style={{ color: steel, fontSize: 13, marginBottom: 4 }}>Your contact info on file:</Text>
            <Text style={{ color: navy, fontSize: 14, marginTop: 0, marginBottom: 4 }}>{booking.customer_name}</Text>
            <Text style={{ color: navy, fontSize: 14, marginTop: 0, marginBottom: 4 }}>{booking.customer_email}</Text>
            <Text style={{ color: navy, fontSize: 14, marginTop: 0, marginBottom: 24 }}>{booking.customer_phone}</Text>

            <Hr style={{ borderColor: "#e5e7eb", marginBottom: 24 }} />

            {/* Cancellation */}
            <Text style={{ color: steel, fontSize: 14, marginBottom: 8 }}>
              Need to cancel? You can do so up to 24 hours before your drop-off window:
            </Text>
            <Link
              href={cancelUrl}
              style={{ display: "inline-block", color: "#fff", backgroundColor: blue, padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
            >
              Cancel this booking
            </Link>

            <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

            <Text style={{ color: steel, fontSize: 13 }}>
              Questions? Reach us at{" "}
              <Link href={`mailto:${CONTACT_EMAIL}`} style={{ color: blue }}>{CONTACT_EMAIL}</Link>{" "}
              or {CONTACT_PHONE}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingConfirmation;
