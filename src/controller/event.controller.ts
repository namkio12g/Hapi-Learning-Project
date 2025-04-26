import { Request, ResponseToolkit } from "@hapi/hapi";
import { EventService } from "../services/event.service";
import { IEventDocument } from "../models/event.model";
import { IAddingCourseToEvent } from "../entities/types/addingCourseToEvent.types";
import { IRequestNewVoucherInfo } from "../entities/types/RequestNewVoucherInfo.types";
import { sendVoucherByEmailJob } from "../queues/master.queue";
import { badRequest } from "@hapi/boom";
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
  requestNewVoucher(request: Request, h: ResponseToolkit) {
    try {
      const voucherInfo = request.payload as IRequestNewVoucherInfo;
      const voucher = EventService.requestNewVoucher(voucherInfo);
      voucher.then((res) => sendVoucherByEmailJob(voucherInfo.email, res.code));
      return voucher;
    } catch (error) {
      throw badRequest("Failed to request a new voucher");
    }
  },
};
export default EventController;
