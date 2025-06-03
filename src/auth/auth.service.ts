import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService ) {}

    async signup(dto: SignupDto) {
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data:{
                user_name: dto.user_name,
                user_email: dto.user_email,
                user_role: dto.user_role,
                password: dto.password
            },
        });
        delete user.password;
        return this.signToken(user.user_id, user.user_email);
    }
    async login(dto: LoginDto){
        const user = await this.prisma.user.findUnique({
         where: {
            user_email: dto.user_email
         },
        });
        if (!user) throw new UnauthorizedException('Email not found');

        const pwMatches = await bcrypt.compare(dto.password, user.password);
        if (!pwMatches) throw new UnauthorizedException('Invalid password');

        return this.signToken(user.user_id, user.user_email);
    }
    signToken(userId: number, email: string): {acess_token: string} {
        const payload = { sub: userId, email };
        const token = this.jwt.sign(payload);
        return {acess_token: token };
    }
}
