// Import the necessary modules
import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/nodemailer";

// Named function for the POST method
export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Assuming emailContent and userEmails are extracted from req.body
      const { emailContent, userEmails } = req.body;

      await sendEmail(emailContent, userEmails);

      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: `Failed to send email: ${error.message}` });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
