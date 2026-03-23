import { ValidationError } from "../utils/Error handlers/ValidationError.js";
export class User {
  #name;
  #password;
  #email;
  constructor({ name, email, password, role = "user" }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  get name() { return this.#name; }
  get password() { return this.#password; }
  get email() { return this.#email; }
  set name(value) {
    // check if name contain any special chars or digit
    const regex = /^[A-Za-z\s]+$/;
    if (!value || !value.trim()) {
      throw new ValidationError([{ msg: "Name is required", param: "name" }])
    }
    if (!regex.test(value)) {
      throw new ValidationError([
        { msg: "Name must contain letters only", param: "name" }
      ]);
    }
    if (value.length < 3) {
      throw new ValidationError([{ msg: "Name must be at least 3 characters", param: "name" }]);
    }
    this.#name = value.trim();
  }
  set email(value) {
    if (!value || !value.trim()) {
      throw new ValidationError([
        { msg: "Email is required", param: "email" }
      ]);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      throw new ValidationError([
        { msg: "Please enter a valid email", param: "email" }
      ]);
    }

    this.#email = value.trim();
  }
  set password(value) {
    // validate password 
    if (!value || !value.trim()) {
      throw new ValidationError([{ msg: "Password is required", param: "password" }])
    }
    const hasNumber = /\d/.test(value);
    const hasCapital = /[A-Z]/.test(value);

    if (value.length < 6 || !hasNumber || !hasCapital) {
      throw new ValidationError([{
        msg: "Password must be at least 6 characters, include a capital letter, and a number", param: "password"
      }]
      );
    }

    this.#password = value.trim();
  }

  //* function to return a js object
  toJSON() {
    return {
      name: this.#name,
      email: this.email,
      password: this.#password,
      role: this.role
    }
  };
}