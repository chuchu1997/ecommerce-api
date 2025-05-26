import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MyLogger } from './logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger: MyLogger;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT') ?? ''),
      secure: this.configService.get('SMTP_PORT') === '465', // true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }
  async sendResetLinkToEmail(
    email: string,
    resetToken: string,
    userName: string,
  ): Promise<void> {
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: this.configService.get('APP_NAME') || 'Your App Name',
        address: this.configService.get('SMTP_USER'),
      },
      to: email,
      subject: '🔐 Link để bạn lấy lại mật khẩu ',
      html: this.getResetPasswordTemplate(userName, resetLink),
    };
    await this.transporter.sendMail(mailOptions);
    this.logger.log(
      `Đã gửi link reset password cho email ${email} thành công !!`,
    );
  }

  async sendPasswordChangedNotification(
    email: string,
    userName: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: '🔒 Lấy lại mật khẩu thành công ',
        html: this.getTemplateRegisterSuccess(userName),
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send password changed notification:', error);
    }
  }
  private getTemplateRegisterSuccess(userName: string) {
    return `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center;">
          <div style="font-size: 40px;">🔒</div>
          <h2 style="color: #2e6da4;">Bạn đã đổi mật khẩu thành công</h2>
        </div>

        <p>Xin chào <strong>${userName}</strong>,</p>
        <p>Mật khẩu của bạn đã được thay đổi thành công. Nếu bạn thực hiện thay đổi này, bạn không cần làm gì thêm.</p>

        <div style="background-color: #e9f6ff; border-left: 4px solid #007bff; padding: 10px 15px; margin: 20px 0;">
          Nếu bạn <strong>không thực hiện</strong> thay đổi này, vui lòng liên hệ với bộ phận hỗ trợ <strong>ngay lập tức</strong> để bảo vệ tài khoản của bạn.
        </div>

        <p style="margin-top: 30px;">Trân trọng,<br/>Đội ngũ hỗ trợ của chúng tôi</p>

        <hr style="margin: 30px 0;" />

        <div style="text-align: center; font-size: 12px; color: #888;">
          Đây là email tự động, vui lòng không trả lời thư này.<br/>
          &copy; 2025 Tên Ứng Dụng Của Bạn. Mọi quyền được bảo lưu.
        </div>
      </div>
    </body>
  `;
  }
  private getResetPasswordTemplate(userName: string, resetUrl: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lấy lại mật khẩu </title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #2c3e50;
                margin: 0;
                font-size: 28px;
            }
            .lock-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            .button:hover {
                transform: translateY(-2px);
            }
            .link-fallback {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                word-break: break-all;
                font-family: monospace;
                font-size: 12px;
                color: #666;
                margin: 20px 0;
            }
            .warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 0 5px 5px 0;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 12px;
            }
            .security-note {
                background: #d1ecf1;
                border-left: 4px solid #17a2b8;
                padding: 15px;
                margin: 20px 0;
                border-radius: 0 5px 5px 0;
            }
        </style>
    </head>
 <body>
  <div class="container">
    <div class="header">
      <div class="lock-icon">🔐</div>
      <h1>Yêu cầu đặt lại mật khẩu</h1>
    </div>

    <div class="content">
      <p>Xin chào <strong>${userName}</strong>,</p>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Nếu bạn đã thực hiện yêu cầu này, vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:</p>

      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
      </div>

      <div class="warning">
        <strong>⚠️ Lưu ý quan trọng:</strong> Liên kết này sẽ hết hạn sau <strong>10 phút</strong> để đảm bảo an toàn cho tài khoản của bạn.<br />
        ⏳ <em>Liên kết sẽ tự động hủy sau 10 phút.</em>
      </div>

      <p>Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
      <div class="link-fallback">${resetUrl}</div>

      <div class="security-note">
        <strong>🛡️ Bảo mật:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không bị thay đổi.
      </div>
    </div>

    <div class="footer">
      <p>Đây là email tự động, vui lòng không trả lời.</p>
      <p>&copy; 2025 Tên ứng dụng của bạn. Mọi quyền được bảo lưu.</p>
    </div>
  </div>
</body>

    </html>
    `;
  }
}
