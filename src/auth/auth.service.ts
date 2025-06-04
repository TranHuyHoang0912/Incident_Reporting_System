import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService để thao tác với DB
import { SignupDto } from './dto/signup.dto'; // Dữ liệu đăng ký người dùng
import { LoginDto } from './dto/login.dto';   // Dữ liệu đăng nhập
import * as bcrypt from 'bcryptjs';           // Thư viện mã hóa mật khẩu
import { JwtService } from '@nestjs/jwt';     // Dịch vụ tạo JWT token

@Injectable() //là 1 decorator để Nestjs biết được cái này có thể được inject vào nơi khác như controller
export class AuthService {
  // Inject PrismaService (dùng để giao tiếp với database) và JwtService (dùng để giao tiếp với database) thông qua constructor
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // Hàm đăng ký người dùng mới
  async signup(dto: SignupDto) {
    // Băm mật khẩu bằng bcrypt
    const hash = await bcrypt.hash(dto.password, 10); // dùng bcrypt để băm mk ngkhac, mục tiêu để db ko biết đc mk

    // Tạo người dùng mới trong DB với thông tin đã mã hóa
    const user = await this.prisma.user.create({
      data: {
        user_name: dto.user_name,
        user_email: dto.user_email,
        user_role: dto.user_role,
        password: hash, // Lưu mật khẩu đã được mã hóa, không lưu mật khẩu gốc
      },
    });

    // Trả về access token (JWT)
    return this.signToken(user.user_id, user.user_email);
  }

  // Hàm đăng nhập
  async login(dto: LoginDto) {
    // Tìm người dùng theo email
    const user = await this.prisma.user.findUnique({
      where: {
        user_email: dto.user_email,
      },
    });

    // Nếu không tìm thấy email, báo lỗi không được cấp quyền
    if (!user) throw new UnauthorizedException('Email not found');

    // So sánh mật khẩu gõ vào với mật khẩu đã mã hóa trong DB
    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) throw new UnauthorizedException('Invalid password');

    // Trả về access token nếu đăng nhập thành công
    return this.signToken(user.user_id, user.user_email);
  }

  // Hàm tạo JWT token từ userId và email
  signToken(userId: number, email: string): { access_token: string } {
    const payload = { sub: userId, email }; // Payload chứa user id và email
    const token = this.jwt.sign(payload);   // Tạo token từ payload
    return { access_token: token };          // Trả về object chứa access token
  }
}
