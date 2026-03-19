import { ValidationError } from "../utils/Error handlers/ValidationError.js";

export class Activity {

  /**
   * "id": 1,
      "action": "Product Created",
      "entity": "product",
      "entityId": 1,
      "userId": 1,
      "date": "2026-03-15"
   */
  #action;
  #entity;
  #entityId;
  #userId;
  #date;
  constructor(action, entity, entityId, userId, date) {
    this.action = action;
    this.entity = entity;
    this.entityId = entityId;
    this.userId = userId;
    this.date = date;
  }
  get action() { return this.#action };
  get entity() { return this.#entity };
  get entityId() { return this.#entityId };
  get userId() { return this.#userId };
  get date() { return this.#date };

  set action(value) {
    if (!value || value.trim().length < 3) {
      throw new ValidationError("you should enter action for this log", value)
    }
    this.#action = value;
  }
  set entityId(value) {
    if (!value) {
      throw new ValidationError("you should enter a entity id for this log", value)
    }
    this.#entityId = value;
  }
  set entity(value) {
    let entities = ["products", "categories", "orders", "suppliers", "users"]
    if (!value || value.trim().length < 3 || !entities.includes(value)) {
      throw new ValidationError("you should enter a entity name for this log", value)
    }
    this.#entity = value;
  }
  set userId(value) {
    if (!value) {
      throw new ValidationError("you should enter a user id for this log", value)
    }
    this.#userId = value;
  }
  set date(value) {
    if (!value) {
      throw new ValidationError("you should enter a date for this log", value)
    }
    this.#date = value;
  }
}