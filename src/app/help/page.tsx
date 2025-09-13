"use client";

import * as React from "react";
import {
  Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
  Link as MLink, Divider, Alert, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function HelpPage() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  React.useEffect(() => {
    try {
      const role = localStorage.getItem("hz_fake_user_role");
      setIsAdmin(role === "admin");
    } catch {}
  }, []);

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const submitDeletionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setOpen(false), 700);
  };

  return (
    <Box sx={{ maxWidth: 920, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Help & Support
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Find quick answers, contact us, and review our data deletion policy (admin only).
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Frequently Asked Questions</Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Why do I see a mock login?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              This prototype uses a demo-only login for navigation and UI flows. No real authentication is performed.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Where are Work Orders data from?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              Data are mock fixtures stored in the frontend (e.g., <code>lib/fakeApi.ts</code>) for demo purposes.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I report a UI issue?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              Please capture a screenshot and open a ticket in our repo. Include steps to reproduce and the expected behaviour.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Contact</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          For support, email us at{" "}
          <MLink href="mailto:support@havenszure.example">support@havenszure.example</MLink>
          {" "}or check our{" "}
          <MLink href="#" onClick={(e) => e.preventDefault()}>documentation</MLink>.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Response times may vary during demo periods.
        </Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Data Deletion Policy (Admin Only)</Typography>

        {!isAdmin ? (
          <Alert severity="info">
            This section is visible to administrators only. Ask an admin to review the policy or submit a deletion request on your behalf.
          </Alert>
        ) : (
          <Stack spacing={2}>
            <Alert severity="warning">
              Deleting data is irreversible in this demo. Proceed only with proper authorization.
            </Alert>

            <Typography variant="subtitle2">Scope</Typography>
            <Typography variant="body2">
              In the full system, deletions apply to customer PII, work order artifacts, and audit logs subject to retention rules.
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Process</Typography>
            <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
              <li>Verify requester identity and authorization.</li>
              <li>Confirm records to delete and legal retention requirements.</li>
              <li>Queue deletion job and notify stakeholders.</li>
              <li>Record a non-PII tombstone for audit.</li>
            </Typography>

            <Divider />

            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={() => setOpen(true)}>
                Submit Deletion Request (Mock)
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Submit Deletion Request (Mock)</DialogTitle>
        <Box component="form" onSubmit={submitDeletionRequest}>
          <DialogContent>
            {sent ? (
              <Alert severity="success">Request recorded (demo only).</Alert>
            ) : (
              <Stack spacing={2}>
                <TextField
                  label="Requester Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Describe the records to delete"
                  fullWidth
                  multiline
                  minRows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
            {!sent && (
              <Button type="submit" variant="contained">
                Submit
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
