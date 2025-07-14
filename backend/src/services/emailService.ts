import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private templatesPath: string;

  constructor() {
    this.templatesPath = path.join(__dirname, '..', 'templates', 'email');
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
          pass: process.env.ETHEREAL_PASS || 'ethereal.pass',
        },
      });
    }
  }

  private async loadTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      throw new Error(`Email template '${templateName}' not found`);
    }
  }

  private async loadBaseTemplate(): Promise<string> {
    try {
      const basePath = path.join(this.templatesPath, 'base.hbs');
      return fs.readFileSync(basePath, 'utf-8');
    } catch (error) {
      throw new Error('Base email template not found');
    }
  }

  private async compileTemplate(
    templateName: string,
    data: Record<string, unknown>
  ): Promise<string> {
    const templateContent = await this.loadTemplate(templateName);
    const compiledTemplate = handlebars.compile(templateContent);
    const renderedContent = compiledTemplate(data);

    const baseTemplate = await this.loadBaseTemplate();
    const compiledBase = handlebars.compile(baseTemplate);

    return compiledBase({
      title: data.title || 'Football Fantasy Manager',
      body: renderedContent,
    });
  }
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const html = await this.compileTemplate(options.template, options.data);

      const mailOptions = {
        from: {
          name: 'Football Fantasy Manager',
          address: process.env.FROM_EMAIL || 'noreply@footballfantasymanager.com',
        },
        to: options.to,
        subject: options.subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);

      if (process.env.NODE_ENV !== 'production') {
        console.log('Email sent successfully!');
        console.log('Preview URL:', nodemailer.getTestMessageUrl(result));
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to Football Fantasy Manager! 🏆',
      template: 'welcome',
      data: {
        title: 'Welcome to Football Fantasy Manager',
        userName,
        loginUrl,
      },
    });
  }

  async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const expirationTime = '1 hour';

    return this.sendEmail({
      to: userEmail,
      subject: 'Reset Your Password - Football Fantasy Manager',
      template: 'password-reset',
      data: {
        title: 'Reset Your Password',
        userName,
        resetUrl,
        expirationTime,
      },
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  }
}
