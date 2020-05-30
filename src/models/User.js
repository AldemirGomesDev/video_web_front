export default class User {
  constructor(name, email, password, islogged, isadmin) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.islogged = islogged;
    this.isadmin = isadmin;
  }
}
