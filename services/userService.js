import { User } from "../models/User.js"
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
      throw new ResourceAlreadyExistError("User already exists with this email");
    }

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user.toJSON())
    });

    if (!response.ok) {
      throw new InternalError("Failed to create user");
    }

    return await response.json();

  } catch (error) {
    throw error;
  }
}

async function gettAllUsers() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new InternalError("Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    throw new InternalError(error.message);
  }
}

async function getUserById(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`);
    if (response.status == 404) {
      throw new NotFoundError("user not found");
    }
    if (!response.ok) {
      throw new InternalError("Failed to fetch user")
    }
    return await response.json();
  } catch (error) {
    throw new InternalError(error.message);
  }
}

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
      body: JSON.stringify(updateUser.toJSON())
    });
    if (response.status === 404) {
      throw new NotFoundError("User not found");
    }
    if (!response.ok) {
      throw new InternalError("Failed to update user");
    }
    return await response.json();
  } catch (error) {
    throw new InternalError(error.message);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE"
    });
    if (response.status === 404) {
      throw new NotFoundError("User not found");
    }

    if (!response.ok) {
      throw new InternalError("Failed to delete user");
    }
    return true;
  } catch (error) {
    throw new InternalError(error.message);
  }
}

export const UserService = {
  createUser,
  gettAllUsers,
  getUserById,
  updateUser,
  deleteUser
};