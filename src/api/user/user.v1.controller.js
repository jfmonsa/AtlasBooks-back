export default class UserController {
  #userService;

  constructor({ userService }) {
    this.#userService = userService;

    this.deleteUser = this.deleteUser.bind(this);
  }

  async deleteUser(req, res) {
    await this.#userService.deleteUser(req.user.id);
    res.formatResponse({}, "User deleted successfully");
  }
}
