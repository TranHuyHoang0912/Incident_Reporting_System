import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true })) // Validate input theo DTO login
  async login(@Body() body: LoginDto) {
     // Gọi service xử lý đăng nhập
    return this.authService.login(body.username, body.password);
  }
}
