import { Module } from '@nestjs/common';
import { ConfigModule as conf } from '@nestjs/config';

@Module({
    imports: [
        conf.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        })
    ]
})
export class ConfigModule {}
