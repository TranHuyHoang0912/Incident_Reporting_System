import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }
    // Đóng gói thông tin cho token
    const payload = { sub: user.userId, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
      }
    };
  }
}
