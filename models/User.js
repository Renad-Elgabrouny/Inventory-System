export class User {
  #name;
  #password;

  constructor({ name, email, password, role }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  get name() { return this.#name; }
  get password() { return this.#password; }

  set name(value) {
    // check if name contain any special chars or digit
    const regex = /[\d\W_]/;
    if (regex.test(value)) {
      throw new Error("Name must contain alphabet letters only");
    }
    if (value.length < 3) {
      throw new Error("Name must be at least 3 characters");
    }
    this.#name = value;
  }

  set password(value) {
    // validate password 
    const hasNumber = /\d/.test(value);
    const hasCapital = /[A-Z]/.test(value);

    if (value.length < 6 || !hasNumber || !hasCapital) {
      throw new Error(
        "Password must be at least 6 characters, include a capital letter, and a number"
      );
    }

    this.#password = value;
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