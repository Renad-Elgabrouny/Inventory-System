import { Activity } from "../models/ActivityLog.js";
import { InternalError } from "../utils/Error handlers/InternalError.js";
import { NotFoundError } from "../utils/Error handlers/NotFoundError.js";
import { ResourceAlreadyExistError } from "../utils/Error handlers/ResourceAlreadyExistError.js";

const baseUrl = "http://localhost:3000/activityLogs";

async function createActivity(activityData) {
  try {
    const activity = new Activity(activityData);
    const checkExist = await fetch(`${baseUrl}/${activity.id}`);
    if (checkExist.status === 200) {
      throw new ResourceAlreadyExistError("id", activity.id);
    }
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(activity.toJSON())
    });
    if (!response.ok) {
      throw new InternalError(response);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    if (
      error instanceof NotFoundError ||
      error instanceof ResourceAlreadyExistError
    ) {
      throw error;
    }

    throw new InternalError(error);
  }
}// create instance from model with validating it and save it into json

async function getAllActivities() {
  try {
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new InternalError(response);
    }

    return await response.json();

  } catch (error) {
    console.error(error);

    if (
      error instanceof NotFoundError ||
      error instanceof ResourceAlreadyExistError
    ) {
      throw error;
    }

    throw new InternalError(error);
  }
}// retrieve activities from json file

async function getActivityById(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`);

    if (response.status === 404) {
      throw new NotFoundError("Activity not found");
    }

    if (!response.ok) {
      throw new InternalError(response);
    }

    return await response.json();

  } catch (error) {
    console.error(error);

    if (
      error instanceof NotFoundError ||
      error instanceof ResourceAlreadyExistError
    ) {
      throw error;
    }

    throw new InternalError(error);
  }
}// get specific object from the json file

async function deleteActivity(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE"
    });
    console.log(response);
    if (response.status === 404) {
      throw new NotFoundError("Activity not found");
    }
    if (!response.ok) {
      throw new InternalError(response);
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    if (
      error instanceof NotFoundError ||
      error instanceof ResourceAlreadyExistError
    ) {
      throw error;
    }
    throw new InternalError(error);
  }
}// delete object from json file

export const ActivityService = {
  createActivity,
  getAllActivities,
  getActivityById,
  deleteActivity
};