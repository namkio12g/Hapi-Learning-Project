import CustomJoi from "./customJoi";
import { CourseLevel } from "../entities/course.entity";
import { GenderTypes } from "../entities/person.entity";
import { EventStatuses } from "../entities/event.entity";

export const JoiSchemas = {
  CourseSchema: CustomJoi.object({
    _id: CustomJoi.objectId().required().example("680b05fce8fd3b66a7c0d7e1"),
    name: CustomJoi.string().example("Summer for intermidates"),
    level: CustomJoi.string()
      .valid(...Object.values(CourseLevel))
      .example("intermidate"),
    timeEnd: CustomJoi.date().example(new Date("04-22-2025")),
    timeStart: CustomJoi.date().example(new Date("04-16-2025")),
    studentsCount: CustomJoi.number().min(0).example(30),
    price: CustomJoi.number().min(0).example(20000),
  })
    .label("Course Object")
    .unknown(true),

  EventSchema: CustomJoi.object({
    _id: CustomJoi.objectId().required().example("680b05fce8fd3b66a7c0d7e1"),
    name: CustomJoi.string().example("Summer event"),
    active: CustomJoi.string()
      .valid(...Object.values(EventStatuses))
      .example("active"),
    discount: CustomJoi.number().min(0).max(100).example(10.1),
    maxVoucherQuantity: CustomJoi.number().min(0).max(1000).example(100),
    timeEnd: CustomJoi.date().example(new Date("04-22-2025")),
    timeStart: CustomJoi.date().example(new Date("04-16-2025")),
  })
    .label("Event Object")
    .unknown(true),

  StudentSchema: CustomJoi.object({
    _id: CustomJoi.objectId().required().example("680b05fce8fd3b66a7c0d7e1"),
    email: CustomJoi.string().email().example("nguyenvana@gmail.com"),
    name: CustomJoi.string().example("nguyen thanh b"),
    age: CustomJoi.number().min(0).example(20),
    address: CustomJoi.string().example("Ho chi minh").allow(""),
    phone: CustomJoi.string()
      .pattern(/^0\d{9}$/)
      .example("0123456789"),
    gender: CustomJoi.string()
      .valid(...Object.values(GenderTypes))
      .example("other"),
    wallet: CustomJoi.number().min(0).example(20000),
  })
    .label("Course Object")
    .unknown(true),

  VoucherSchema: CustomJoi.object({
    _id: CustomJoi.objectId().required().example("680b05fce8fd3b66a7c0d7e1"),
    code: CustomJoi.string().example("asdf9s9f8"),
  })
    .label("Course Object")
    .unknown(true),

  TeacherSchema: CustomJoi.object({
    _id: CustomJoi.objectId().required().example("680b05fce8fd3b66a7c0d7e1"),
    email: CustomJoi.string().email().example("nguyenvana@gmail.com"),
    name: CustomJoi.string().example("nguyen thanh b"),
    age: CustomJoi.number().min(0).example(20),
    address: CustomJoi.string().example("Ho chi minh").allow(""),
    phone: CustomJoi.string()
      .pattern(/^0\d{9}$/)
      .example("0123456789"),
    gender: CustomJoi.string()
      .valid(...Object.values(GenderTypes))
      .example("other"),
  })
    .label("Course Object")
    .unknown(true),

  ObjectIdInput: CustomJoi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .description("Enter the course id")
    .example("68077586ecb334127cd7b2f4"),
};
