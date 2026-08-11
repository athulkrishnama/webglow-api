import { Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @Transform((value) => value.obj._id?.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
