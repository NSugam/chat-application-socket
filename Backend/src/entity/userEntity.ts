import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "Users" })
export class userEntity extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: false, type: 'varchar', unique: true })
  username: string;

  @Column({ nullable: false, type: 'varchar', unique: true })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @CreateDateColumn()
  created_at: Date;
}