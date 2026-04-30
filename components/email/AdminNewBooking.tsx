import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Row, Column, Section, Text,
} from "@react-email/components";
import { BUSINESS_NAME, DOMAIN } from "@/lib/constants";
import { formatWindowDate, formatWindowHours } from "@/lib/booking";
import type { BookingWithWindow } from "@/lib/types";

const navy = "#0D2340";
const blue = "#1A6FA8";
const steel = "#4A6276";
const bg = "#F4F6F8";

export function AdminNewBooking({ booking }: { booking: BookingWithWindow }) {
  const win = booking.drop_off_windows;
  const dashboardUrl = `${DOMAIN}/admin/dashboard`;

  return (
    <Html>
      <Head />
      <Preview>New booking from {booking.customer_name} — {formatWindowDate(win.date)}</Preview>
      <Body style={{ backgroundColor: bg, fontFamily: "system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto" }}>
          <Section style={{ backgroundColor: navy, borderRadius: "12px 12px 0 0", padding: "24px 32px" }}>
            <Heading style={{ color: "#fff", fontSize: 20, margin: 0, fontWeight: 600 }}>
              {BUSINESS_NAME} — New Booking
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "0 0 12px 12px", border: "1px solid #e5e7eb", borderTop: "none" }}>
            <Heading as="h2" style={{ color: navy, fontSize: 20, fontWeight: 700, marginTop: 0 }}>
              New booking received
            </Heading>

            <Section style={{ backgroundColor: bg, borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
              <Row style={{ marginBottom: 10 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Name</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{booking.customer_name}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</Text></Column>
                <Column align="right">
                  <Link href={`mailto:${booking.customer_email}`} style={{ color: blue, fontSize: 14, margin: 0 }}>
                    {booking.customer_email}
                  </Link>
                </Column>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{booking.customer_phone}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Hollow</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, fontFamily: "monospace", margin: 0 }}>{booking.hollow_depth}</Text></Column>
              </Row>
              <Row style={{ marginBottom: 10 }}>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Drop-off date</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{formatWindowDate(win.date)}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Window</Text></Column>
                <Column align="right"><Text style={{ color: navy, fontSize: 14, fontWeight: 600, margin: 0 }}>{formatWindowHours(win.open_time, win.close_time)}</Text></Column>
              </Row>
              {booking.notes && (
                <Row style={{ marginTop: 10 }}>
                  <Column><Text style={{ color: steel, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Notes</Text></Column>
                  <Column align="right"><Text style={{ color: navy, fontSize: 14, margin: 0 }}>{booking.notes}</Text></Column>
                </Row>
              )}
            </Section>

            <Hr style={{ borderColor: "#e5e7eb", marginBottom: 24 }} />

            <Link
              href={dashboardUrl}
              style={{ display: "inline-block", color: "#fff", backgroundColor: navy, padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
            >
              View in dashboard →
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminNewBooking;
