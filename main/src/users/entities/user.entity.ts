import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../../enum/role.enum';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  firstName: string;

  @Column({ nullable: true, type: 'varchar' })
  middleName: string;

  @Column({ nullable: false, type: 'varchar' })
  lastName: string;

  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column(
    {type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.EDITOR
  })
  role: RoleEnum;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
