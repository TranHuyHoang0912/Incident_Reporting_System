import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Sử dụng để bảo vệ các route, nếu không có hoặc sai token sẽ bị chặn
export class JwtAuthGuard extends AuthGuard('jwt') {} 
