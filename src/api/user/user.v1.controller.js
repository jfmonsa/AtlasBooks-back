export default class UserController {
  #userService;

  constructor({ userService }) {
    this.#userService = userService;

    this.deleteUser = this.deleteUser.bind(this);
    this.getDownloadHistory = this.getDownloadHistory.bind(this);
  }

  async deleteUser(req, res) {
    await this.#userService.deleteUser(req.user.id);
    res.formatResponse({}, "User deleted successfully");
  }

  async getDownloadHistory(req, res) {
    const downloadHistory = await this.#userService.getDownloadHistory(
      req.user.id
    );
    res.formatResponse(downloadHistory);
  }
}
