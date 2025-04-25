import CustomJoi from "../utility/customJoi";
import { JoiSchemas } from "../utility/JoiSchema";
import EventController from "../controller/event.controller";
import { EventStatuses } from "../entities/event.entity";
import { Server } from "@hapi/hapi";
const EventRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/event/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.EventSchema,
          },
        },
        handler: EventController.getOneEvent,
      },
    },
    {
      method: "get",
      path: "/event/get-events",
      options: {
        tags: ["api"],
        validate: {
          query: CustomJoi.object({
            name: CustomJoi.string().example("Summer event").default(""),
            active: CustomJoi.string()
              .valid(...Object.values(EventStatuses))
              .example("active")
              .default(""),
            discount: CustomJoi.number().min(0).max(100).example(10.1),
            maxVoucherQuantity: CustomJoi.number()
              .min(0)
              .max(1000)
              .example(100),
            timeEnd: CustomJoi.date().example(new Date("04-22-2025")),
            timeStart: CustomJoi.date().example(new Date("04-16-2025")),
            page: CustomJoi.number().min(0).required().example(1),
          }),
        },
        response: {
          status: {
            200: CustomJoi.array().items(JoiSchemas.EventSchema),
          },
        },
        handler: EventController.getEvents,
      },
    },
    {
      method: "post",
      path: "/event/create-event",
      options: {
        tags: ["api"],
        validate: {
          payload: CustomJoi.object({
            name: CustomJoi.string().required().example("Summer event"),
            active: CustomJoi.string()
              .valid(...Object.values(EventStatuses))
              .example("active"),
            discount: CustomJoi.number()
              .min(0)
              .max(100)
              .required()
              .example(10.1),
            maxVoucherQuantity: CustomJoi.number()
              .required()
              .min(0)
              .max(1000)
              .example(100),
            timeEnd: CustomJoi.date()
              .required()
              .example(new Date("04-22-2025")),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.EventSchema,
          },
        },
        handler: EventController.createNewEvent,
      },
    },
    {
      method: "patch",
      path: "/event/update-event",
      options: {
        tags: ["api"],
        validate: {
          query: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
          payload: CustomJoi.object({
            name: CustomJoi.string().example("Summer event"),
            active: CustomJoi.string()
              .valid(...Object.values(EventStatuses))
              .example("active"),
            discount: CustomJoi.number().min(0).max(100).example(10.1),
            maxVoucherQuantity: CustomJoi.number()
              .min(0)
              .max(1000)
              .example(100),
            timeEnd: CustomJoi.date().example(new Date("04-22-2025")),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.EventSchema,
          },
        },
        handler: EventController.updateEvent,
      },
    },

    {
      method: "delete",
      path: "/event/delete/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {},
        handler: EventController.deleteEventById,
      },
    },
    {
      method: "post",
      path: "/event/add-course",
      options: {
        tags: ["api"],
        validate: {
          payload: CustomJoi.object({
            eventId: JoiSchemas.ObjectIdInput.required(),
            coursesIdArray: CustomJoi.array().items(JoiSchemas.ObjectIdInput),
          }),
        },
        response: {},
        handler: EventController.addCoursesIntoEvent,
      },
    },
  ]);
};
export default EventRoutes;
