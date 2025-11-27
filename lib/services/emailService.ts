// lib/email/emailService.ts
import nodemailer from 'nodemailer';

export type EmailNotificationType =
  | 'NEW_REQUEST_NEARBY'
  | 'REQUEST_RESPONSE'
  | 'RESPONSE_ACCEPTED'
  | 'RESPONSE_DECLINED'
  | 'REQUEST_FULFILLED'
  | 'REQUEST_CANCELLED'
  | 'DONATION_REMINDER'
  | 'PROFILE_COMPLETE';

interface EmailData {
  to: string;
  type: EmailNotificationType;
  data: {
    userName?: string;
    patientName?: string;
    bloodGroup?: string;
    urgency?: string;
    unitsNeeded?: number;
    distance?: number;
    hospitalName?: string;
    locationName?: string;
    requestId?: string;
    donorName?: string;
    responseMessage?: string;
    nextDonationDate?: string;
  };
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // gmail app password
  },
});

// Email templates
const getEmailContent = (type: EmailNotificationType, data: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  switch (type) {
    case 'PROFILE_COMPLETE':
      return {
        subject: '✅ Welcome to Blood Donation Network!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Welcome, ${data.userName}! 🩸</h2>
            <p>Thank you for completing your profile and joining our blood donation network.</p>
            <p><strong>Your Details:</strong></p>
            <ul>
              <li>Blood Group: <strong>${data.bloodGroup}</strong></li>
              <li>Location: ${data.locationName}</li>
            </ul>
            <p>You'll now receive notifications when someone nearby needs your blood type.</p>
            <a href="${baseUrl}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              Go to Dashboard
            </a>
            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Every drop counts. Thank you for being a lifesaver! ❤️
            </p>
          </div>
        `,
      };

    case 'NEW_REQUEST_NEARBY':
      return {
        subject: `🚨 ${data.urgency === 'CRITICAL' ? 'URGENT' : ''} Blood Needed Near You - ${data.bloodGroup}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: ${data.urgency === 'CRITICAL' ? '#fee2e2' : '#fef3c7'}; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: ${data.urgency === 'CRITICAL' ? '#dc2626' : '#f59e0b'}; margin: 0;">
                ${data.urgency === 'CRITICAL' ? '🚨 CRITICAL' : '⚠️'} Blood Request
              </h2>
            </div>
            
            <p>Hi ${data.userName},</p>
            <p><strong>${data.patientName}</strong> urgently needs <strong>${data.bloodGroup}</strong> blood donation.</p>
            
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>📍 Location:</strong> ${data.hospitalName || data.locationName}</p>
              <p style="margin: 8px 0;"><strong>📏 Distance:</strong> ${data.distance?.toFixed(1)} km away</p>
              <p style="margin: 8px 0;"><strong>🩸 Units Needed:</strong> ${data.unitsNeeded}</p>
              <p style="margin: 8px 0;"><strong>⚡ Urgency:</strong> ${data.urgency}</p>
            </div>

            <a href="${baseUrl}/requests/${data.requestId}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              View Details & Respond
            </a>

            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Your donation can save a life. Please respond if you're available to donate.
            </p>
          </div>
        `,
      };

    case 'REQUEST_RESPONSE':
      return {
        subject: `✅ Someone Responded to Your Blood Request`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Good News! 🎉</h2>
            <p>Hi ${data.userName},</p>
            <p><strong>${data.donorName}</strong> has responded to your blood request for <strong>${data.patientName}</strong>.</p>
            
            <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 8px 0;"><strong>Donor:</strong> ${data.donorName}</p>
              <p style="margin: 8px 0;"><strong>Blood Group:</strong> ${data.bloodGroup}</p>
              ${data.responseMessage ? `<p style="margin: 8px 0;"><strong>Message:</strong> "${data.responseMessage}"</p>` : ''}
            </div>

            <a href="${baseUrl}/requests/${data.requestId}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              View Response & Accept
            </a>

            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Please coordinate with the donor as soon as possible.
            </p>
          </div>
        `,
      };

    case 'RESPONSE_ACCEPTED':
      return {
        subject: `✅ Your Response Was Accepted!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Response Accepted! 🎉</h2>
            <p>Hi ${data.userName},</p>
            <p>Great news! Your offer to donate blood has been accepted.</p>
            
            <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Patient:</strong> ${data.patientName}</p>
              <p style="margin: 8px 0;"><strong>Blood Group:</strong> ${data.bloodGroup}</p>
              <p style="margin: 8px 0;"><strong>Location:</strong> ${data.hospitalName || data.locationName}</p>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>The requester will contact you shortly</li>
              <li>Confirm the donation time and location</li>
              <li>Bring a valid ID to the hospital/blood bank</li>
            </ol>

            <a href="${baseUrl}/requests/${data.requestId}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              View Request Details
            </a>

            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Thank you for being a hero! 🦸‍♂️
            </p>
          </div>
        `,
      };

    case 'RESPONSE_DECLINED':
      return {
        subject: `Your Response Was Declined`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">Response Update</h2>
            <p>Hi ${data.userName},</p>
            <p>Thank you for offering to donate blood for <strong>${data.patientName}</strong>.</p>
            <p>Unfortunately, the requester has found another donor or the request has been fulfilled.</p>
            
            <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;">Your willingness to help is greatly appreciated. There are many other people who need your help!</p>
            </div>

            <a href="${baseUrl}/find-requests" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              Find Other Requests
            </a>

            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Thank you for your generosity! ❤️
            </p>
          </div>
        `,
      };

    case 'REQUEST_FULFILLED':
      return {
        subject: `✅ Blood Request Fulfilled - Thank You!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Request Fulfilled! 🎉</h2>
            <p>Hi ${data.userName},</p>
            <p>Great news! The blood request for <strong>${data.patientName}</strong> has been fulfilled.</p>
            
            <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #10b981; margin: 0;">🩸 Life Saved! 🩸</h3>
              <p style="margin: 8px 0;">Thanks to generous donors like you, another life was saved today.</p>
            </div>

            <p>If you donated, please update your last donation date in your profile.</p>

            <a href="${baseUrl}/profile" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              Update Profile
            </a>

            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              You're a hero! Thank you for saving lives. ❤️
            </p>
          </div>
        `,
      };

    case 'REQUEST_CANCELLED':
      return {
        subject: `Blood Request Cancelled`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6b7280;">Request Cancelled</h2>
            <p>Hi ${data.userName},</p>
            <p>The blood request for <strong>${data.patientName}</strong> (${data.bloodGroup}) has been cancelled by the requester.</p>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;">Thank you for your willingness to help. Your generosity is appreciated!</p>
            </div>

            <a href="${baseUrl}/find-requests" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              Find Other Requests
            </a>
          </div>
        `,
      };

    case 'DONATION_REMINDER':
      return {
        subject: `🩸 You Can Donate Blood Again!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">You're Eligible to Donate Again! 🎉</h2>
            <p>Hi ${data.userName},</p>
            <p>Good news! It's been 3 months since your last donation, which means you're eligible to donate blood again.</p>
            
            <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Your Blood Group:</strong> ${data.bloodGroup}</p>
              <p style="margin: 8px 0;"><strong>Next Donation Date:</strong> ${data.nextDonationDate}</p>
            </div>

            <p>There are people near you who need your help right now!</p>

            <a href="${baseUrl}/find-requests" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              Find Nearby Requests
            </a>

            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Every donation can save up to 3 lives. Be a hero today! 🦸‍♂️
            </p>
          </div>
        `,
      };

    default:
      return {
        subject: 'Blood Donation Network Notification',
        html: '<p>You have a new notification.</p>',
      };
  }
};

// Main function to send email
export async function sendEmail({ to, type, data }: EmailData) {
  try {
    const { subject, html } = getEmailContent(type, data);

    const info = await transporter.sendMail({
      from: `"Blood Donation Network" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// Batch send emails (for notifying multiple donors)
export async function sendBatchEmails(emails: EmailData[]) {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  console.log(`Batch email results: ${successful} sent, ${failed} failed`);
  
  return { successful, failed, total: emails.length };
}