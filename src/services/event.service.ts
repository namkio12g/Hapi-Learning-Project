import Boom from "@hapi/boom";
import {
  EventModel,
  IEventDocument,
  IVoucherDocument,
  VoucherModel,
} from "../models/index";
import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { IRequestNewVoucherInfo } from "../entities/types/RequestNewVoucherInfo.types";
import { retryTransaction } from "../untils";
import { ClientSession } from "mongoose";

const LIMIT_NUMBER = 6; // limit number of each page
export const EventService = {
  //-----------Create a new event-----------///
  async createEvent(eventInfo: IEventDocument) {
    if (eventInfo.timeEnd && new Date(eventInfo.timeEnd) < new Date()) {
      throw Boom.badRequest("The end time cannot be before the start time");
    }// checking if the end time of new event is before the start time 

    try {
      const newEvent = new EventModel(eventInfo);
      const newEventSaved = await newEvent.save({});
      return newEventSaved;
    } catch (error) {
      console.log(error);
      throw Boom.badRequest("Had Error at creating event");
    }
  },


  
  //-----------Delete a new event-----------///
  async deleteEventById(eventId: string) {
    try {
      return await EventModel.deleteOne({ _id: eventId });
    } catch (error) {
      throw Boom.badRequest("Had an error at deleting event");
    }
  },

    //-----------Add courses to the event to make them eligible for discounts.-----------///
  async addCourseToEvent(eventId: string, courseIdArray: string[]) {
    const eventObj = await EventModel.findById(eventId);
    if (!eventObj) throw Boom.notFound("Can't found the event");
    try {
      for (const item of courseIdArray) {
        const isExisted = eventObj.coursesEligible?.includes(
          new mongoose.Types.ObjectId(item)
        );
        if (!isExisted) {
          eventObj.coursesEligible?.push(new mongoose.Types.ObjectId(item));
        }
      }
      return await eventObj.save();
    } catch (error) {
      throw Boom.badRequest("Had an error at adding courses to th event");
    }
  },
//-----------Update events' infomation.-----------///
  async updateEvent(eventId: string, eventInfo: Partial<IEventDocument>) {
    const eventObj = await EventModel.findById(eventId);
    if (!eventObj) throw Boom.notFound("event not found");// checking if event is existed
    const timeStart = eventObj.timeStart;
    if (
      eventInfo.timeEnd &&
      timeStart &&
      new Date(eventInfo.timeEnd) < timeStart
    )
      throw Boom.badRequest("The end time cannot be before the start time");// checking the end time of the event

    try {
      const updatedEventObj = await EventModel.findByIdAndUpdate(
        eventId,
        { $set: eventInfo },
        { new: true, runValidators: true }
      );
      if (!updatedEventObj) throw Boom.notFound("Event not found");
      return updatedEventObj;
    } catch (error) {
      throw Boom.badRequest("Had an error at updating event");
    }
  },

  
//-----------Get detail of a event by using id.-----------///
  async getEventById(eventId: string) {
    try {
      const res = await EventModel.findOne({ _id: eventId }).populate(
        "coursesEligible",
        "_id name"
      );
      if (!res) throw Boom.notFound("Event not found");
      return res;
    } catch (error) {
      throw Boom.badRequest("Had an error at finding event");
    }
  },
  
//-----------Request a new voucher of a event .-----------///
  async requestNewVoucher(voucherInfo: IRequestNewVoucherInfo) {
    const code = randomBytes(4).toString("hex"); // create a new code for a new voucher
    try {
      // use retry transaction function if any collision happened
      const result = (await retryTransaction(async function createNewVoucher(
        session: ClientSession
      ): Promise<IVoucherDocument> {
        // find all vouchers of the event in Database to check the sum of them
        const eventObj = await EventModel.findById(voucherInfo.eventId).session(
          session
        );
        // check if the event is not existed
        if (!eventObj) throw Boom.notFound("Event not found");
        const existedVoucher = await VoucherModel.find(
          { eventApplied: voucherInfo.eventId },
          null,
          { session, readPreference: "primary" } // read the primary node of the Database
        );
        // if the number of issued vouchers exceeds the event's maximum quantity , return the 456 error code
        if (existedVoucher.length >= eventObj.maxVoucherQuantity)
          throw Boom.boomify(
            new Error("The event has reached its maximum number of vouchers"),
            { statusCode: 456 }
          );
      // if not , create a new voucher and return the data
        const voucher = new VoucherModel({
          eventApplied: voucherInfo.eventId,
          code: code,
        });

        return (await voucher.save({ session })) as IVoucherDocument;
      })) as IVoucherDocument;
      return result;
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  },
//-----------Filer events.-----------///
  async getEvents(page: number, eventQuery: Partial<IEventDocument>) {
    try {
      let query: any = {
        name: { $regex: eventQuery.name, $options: "i" },
        active: { $regex: eventQuery.active, $options: "i" },
      };
      if (eventQuery.timeStart)
        query.timeStart = { $gte: new Date(eventQuery.timeStart) };
      if (eventQuery.timeEnd)
        query.timeEnd = { $lte: new Date(eventQuery.timeEnd) };
      if (eventQuery.discount) query.discount = { $lte: eventQuery.discount };
      const eventArr = await EventModel.find(query)
        .skip((page - 1) * LIMIT_NUMBER)
        .limit(LIMIT_NUMBER);
      return eventArr;
    } catch (error) {
      throw Boom.badRequest("Had an error at getting events");
    }
  },
};
