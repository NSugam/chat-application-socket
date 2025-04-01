import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { groupEntity } from "./groupEntity";
import { userEntity } from "./userEntity";

@Entity({ name: "groupMembers" })
export class groupMembersEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => groupEntity, group => group.id)
  group: groupEntity;

  @ManyToOne(() => userEntity, user => user.id)
  user: userEntity;
}