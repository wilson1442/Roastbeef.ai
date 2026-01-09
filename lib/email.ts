import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@roastbeef.ai',
      to: email,
      subject: 'Verify your RoastBeef.ai account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff7ed; border-radius: 10px;">
          <h1 style="color: #f97316; text-align: center;">Welcome to RoastBeef.ai! 🥩</h1>
          <p style="color: #333; font-size: 16px;">Thanks for signing up! Please verify your email address to get started.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Verify Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 12px; word-break: break-all;">${verifyUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">You'll receive 5 free tokens to start roasting websites!</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}
