import { ValidationError } from "../utils/Error handlers/ValidationError.js";

export class Activity {
  #action;
  #entity;
  #userId;
  #date;

  constructor({ action, entity, userId, date }) {
    this.action = action;
    this.entity = entity;
    this.userId = userId;
    this.date = date;
  }

  // ===== Getters =====
  get action() { return this.#action; }
  get entity() { return this.#entity; }
  get userId() { return this.#userId; }
  get date() { return this.#date; }

  // ===== Setters =====
  set action(value) {
    if (!value || value.trim().length < 3) {
      throw new ValidationError("You must provide a valid action", value);
    }
    this.#action = value;
  }

  set entity(value) {
    const allowedEntities = ["products", "categories", "orders", "suppliers", "users"];
    if (!value || !allowedEntities.includes(value)) {
      throw new ValidationError("Invalid entity type", value);
    }
    this.#entity = value;
  }

  set userId(value) {
    if (!value) {
      throw new ValidationError("User ID is required", value);
    }
    this.#userId = value;
  }

  set date(value) {
    if (!value) {
      throw new ValidationError("Date is required", value);
    }
    this.#date = value;
  }


  toJSON() {
    return {
      action: this.action,
      entity: this.entity,
      userId: this.userId,
      date: this.date
    };
  }
}