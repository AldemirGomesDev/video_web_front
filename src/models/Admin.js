import User from '../models/User';

export default class Admin extends User{
  
  constructor(name, email, password, islogged, matricula) {
    super(name, email, password, islogged);
    this.matricula = matricula;
  }
}
// Admin.prototype = Object.create(User.prototype);
