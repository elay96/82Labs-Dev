import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;

// Only set up SendGrid if API key is available
if (apiKey) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn("SENDGRID_API_KEY environment variable not set. Email functionality will be disabled.");
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // If no API key, return false instead of crashing
  if (!apiKey) {
    console.warn("SendGrid API key not configured. Email not sent.");
    return false;
  }

  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };
    
    if (params.text) emailData.text = params.text;
    if (params.html) emailData.html = params.html;
    
    await sgMail.send(emailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  brief: string;
}): Promise<boolean> {
  // If no API key, just log the submission and return true
  if (!apiKey) {
    console.log(`Contact form submission received (email disabled):`, {
      name: data.name,
      email: data.email,
      brief: data.brief
    });
    return true; // Return true so the form submission succeeds
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
        New Contact Form Submission - 82 Labs
      </h2>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      </div>
      
      <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="color: #374151; margin-top: 0;">Project Brief</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.brief}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p>This email was sent from the 82 Labs contact form.</p>
        <p>Reply directly to this email to respond to ${data.name}.</p>
      </div>
    </div>
  `;

  const textContent = `
New Contact Form Submission - 82 Labs

Contact Details:
Name: ${data.name}
Email: ${data.email}

Project Brief:
${data.brief}

---
This email was sent from the 82 Labs contact form.
Reply directly to this email to respond to ${data.name}.
  `;

  return await sendEmail({
    to: 'idan.t@82labs.io',
    from: 'contact@82labs.com', // This should be a verified sender in SendGrid
    subject: `New Project Inquiry from ${data.name}`,
    text: textContent,
    html: htmlContent,
  });
}