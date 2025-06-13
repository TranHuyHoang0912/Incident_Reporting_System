import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
   // Tìm user theo username, trả về user nếu có, không có trả về null
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(data: { username: string; password: string; role: string }) {
     // Tạo user mới trong DB
    const existed = await this.findByUsername(data.username);
    if (existed) throw new BadRequestException('Username đã tồn tại!');
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: data.role,
      },
      select: {
        userId: true,
        username: true,
        role: true,
        isActive: true,
      }
    });
  }

  async validateUser(username: string, password: string) {
      // Xác thực login: tìm user, so sánh password
    const user = await this.findByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async getUserById(userId: number) {
      // Lấy thông tin user qua userId, chỉ trả về trường an toàn
    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        username: true,
        role: true,
        isActive: true,
      },
    });
    if (!user) throw new NotFoundException('User không tồn tại!');
    return user;
  }
// đổi mật khẩu
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('User không tồn tại!');
    if (user.password !== oldPassword) throw new BadRequestException('Mật khẩu cũ không đúng!');
    await this.prisma.user.update({
      where: { userId },
      data: { password: newPassword },
    });
    return { message: 'Đổi mật khẩu thành công!' };
  }
}
