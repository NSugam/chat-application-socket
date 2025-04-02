import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { userEntity } from "./userEntity";

@Entity({ name: "Groups" })
export class groupEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    group_name: string

    @ManyToOne(() => userEntity, user => user.id, { nullable: false })
    created_by: userEntity

    @CreateDateColumn()
    created_at: Date
}