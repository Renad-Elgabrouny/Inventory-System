import { User } from "../models/User.js";
import { InternalError } from "../utils/Error handlers/InternalError.js";
import { NotFoundError } from "../utils/Error handlers/NotFoundError.js";
import { ResourceAlreadyExistError } from "../utils/Error handlers/ResourceAlreadyExistError.js";

const baseUrl = "http://localhost:3000/users";

async function createUser(userData) {
  try {
    const user = new User(userData);

    const checkExist = await fetch(`${baseUrl}?email=${user.email}`);
    const existing = await checkExist.json();

    if (existing.length > 0) {
      throw new ResourceAlreadyExistError("email", user.email);
    }

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user.toJSON())
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
}// create instance from model with validating it and save it into json file

async function getAllUsers() {
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
}// retrieve users from json file

async function getUserById(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`);

    if (response.status === 404) {
      throw new NotFoundError("User not found");
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

async function updateUser(id, userData) {
  try {
    const user = new User(userData);
    const updatedData = user.toJSON();
    updatedData.id = id;

    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    if (response.status === 404) {
      throw new NotFoundError("User not found");
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
}// update the data of user 

async function deleteUser(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE"
    });

    if (response.status === 404) {
      throw new NotFoundError("User not found");
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

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};