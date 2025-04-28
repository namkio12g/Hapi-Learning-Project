import { Request, ResponseToolkit } from "@hapi/hapi";
import { EventService } from "../services/event.service";
import { IEventDocument } from "../models/event.model";
import { IAddingCourseToEvent } from "../entities/types/addingCourseToEvent.types";
import { IRequestNewVoucherInfo } from "../entities/types/RequestNewVoucherInfo.types";
import {
  sendVoucherByEmailJob,
  requestEditEventJob,
  releaseEditEventJob,
  maintainEditEventJob,
} from "../queues/master.queue";
import { badRequest, boomify } from "@hapi/boom";
const EventController = {
  createNewEvent(request: Request, h: ResponseToolkit) {
    try {
      const eventInfo = request.payload as IEventDocument;
      return EventService.createEvent(eventInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneEvent(request: Request, h: ResponseToolkit) {
    try {
      const eventId = request.params.id;
      return EventService.getEventById(eventId);
    } catch (error) {
      console.log(error);
    }
  },

  getEvents(request: Request, h: ResponseToolkit) {
    try {
      const eventInfo = request.query as Partial<IEventDocument>;
      const page = request.query.page as number;
      return EventService.getEvents(page, eventInfo);
    } catch (error) {
      console.log(error);
    }
  },

  addCoursesIntoEvent(request: Request, h: ResponseToolkit) {
    try {
      const addingCoursesInfo = request.payload as IAddingCourseToEvent;
      return EventService.addCourseToEvent(
        addingCoursesInfo.eventId,
        addingCoursesInfo.coursesIdArray
      );
    } catch (error) {
      console.log(error);
    }
  },
  updateEvent(request: Request, h: ResponseToolkit) {
    try {
      const eventId = request.query.id;
      const eventInfo = request.payload as IEventDocument;
      return EventService.updateEvent(eventId, eventInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteEventById(request: Request, h: ResponseToolkit) {
    try {
      const eventId = request.params.id;
      return EventService.deleteEventById(eventId);
    } catch (error) {
      console.log(error);
    }
  },
  async requestEditEvent(request: Request, h: ResponseToolkit) {
    try {
      const user = request.auth.credentials?.user as any;
      const eventId = request.params.id;
      const result = (await requestEditEventJob(
        eventId,
        user?.id as string
      )) as any;
      return h.response({ message: result.message }).code(result.status);
    } catch (error: any) {
      return h.response({ message: error.message }).code(409);
    }
  },
  async maintainEditEvent(request: Request, h: ResponseToolkit) {
    try {
      const user = request.auth.credentials?.user as any;
      const eventId = request.params.id;
      const result = (await maintainEditEventJob(
        eventId,
        user?.id as string
      )) as any;
      return h.response({ message: result.message }).code(result.status);
    } catch (error: any) {
      return h.response({ message: error.message }).code(409);
    }
  },
  async releaseEditEvent(request: Request, h: ResponseToolkit) {
    try {
      const user = request.auth.credentials?.user as any;
      const eventId = request.params.id;
      const result = (await releaseEditEventJob(
        eventId,
        user?.id as string
      )) as any;
      return h.response({ message: result.message }).code(result.status);
    } catch (error: any) {
      return h.response({ message: error.message }).code(409);
    }
  },

  async requestNewVoucher(request: Request, h: ResponseToolkit) {
    try {
      const voucherInfo = request.payload as IRequestNewVoucherInfo;
      const voucher = await EventService.requestNewVoucher(voucherInfo);
      return voucher;
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  },
};
export default EventController;
