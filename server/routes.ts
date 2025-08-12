import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { sendContactFormEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      
      // Send email using SendGrid
      const emailSent = await sendContactFormEmail({
        name: contactData.name,
        email: contactData.email,
        brief: contactData.brief,
      });

      if (!emailSent) {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send email notification" 
        });
        return;
      }

      // Store in database for record keeping
      const submission = await storage.createContactSubmission(contactData);
      
      res.json({ 
        success: true, 
        id: submission.id,
        message: "Contact form submitted successfully! We'll get back to you within 24 hours."
      });
    } catch (error) {
      console.error("Contact form error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Get contact submissions (for admin purposes if needed)
  app.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch submissions" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
