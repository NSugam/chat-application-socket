import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { userEntity } from "./userEntity";
import { groupEntity } from "./groupEntity";

@Entity({ name: "Messages" })
export class messagesEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: number

    @ManyToOne(() => userEntity, user => user.id, { nullable: false })
    sender: userEntity

    @ManyToOne(() => userEntity, user => user.id, { nullable: true })
    receiver: userEntity | null

    @ManyToOne(() => groupEntity, group => group.id, { nullable: true })
    group: groupEntity | null

    @Column({ nullable: false, type: 'varchar' })
    message_text: string

    @CreateDateColumn({ nullable: false, type: 'date' })
    timestamp: Date

    @Column({ nullable: false, type: 'boolean', default: false })
    read_status: boolean
}