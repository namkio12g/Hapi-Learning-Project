export enum GenderTypes {
  Female = "female",
  Other = "other",
  Male = "male",
}

export interface IPerson {
  name: string;
  age: number;
  email: string;
  address?: string;
  gender: string;
  phone: string;
}
