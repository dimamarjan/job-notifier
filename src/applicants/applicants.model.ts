import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IApplicationAdd } from './interfaces/applicants.interfaces';

@Table({ tableName: 'applicants' })
export class Applicants extends Model<Applicants, IApplicationAdd> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  categories: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  japanese_knowledge: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  level: string;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  applicant_id: string;
}
