import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async create(createUserDto: CreateUserDto): Promise<User>{
        const existingUser = await this.userRepository.findOne({
            where: {email : createUserDto.email}
        })

        if (existingUser) {
            throw new ConflictException('Email Already Exists!')
        }
        const hashPassword = await bcrypt.hash(createUserDto.password,10)

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashPassword
        })

        return await this.userRepository.save(user)
    }

    async findAll () : Promise<User[]> {
        return await this.userRepository.find()
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException(`User with ID ${id} not found!`);
        return user
    }

    async update (id: number, updateUserDto:UpdateUserDto): Promise<User>{
        const user = await this.findOne(id);
        return await this.userRepository.save({...user, ...updateUserDto});
    }

    async remove (id: number): Promise<void> {
        await this.userRepository.delete(id)
    }
}
