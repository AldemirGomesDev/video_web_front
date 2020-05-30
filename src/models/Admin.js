import User from '../models/User';

export default class Admin extends User{
  
  constructor(name, email, password, islogged, isadmin, registration) {
    super(name, email, password, islogged, isadmin);
    this.registration = registration;
  }
}
// Admin.prototype = Object.create(User.prototype);
