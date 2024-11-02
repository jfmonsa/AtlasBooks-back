export default class UserController {
  #userService;

  constructor({ userService }) {
    this.#userService = userService;

    this.deleteUser = this.deleteUser.bind(this);
    this.getDownloadHistory = this.getDownloadHistory.bind(this);
    this.banUser = this.banUser.bind(this);
    this.unbanUser = this.unbanUser.bind(this);
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

  async banUser(req, res) {
    const { userIdToBan } = req.body;
    const adminWhoBannedId = req.user.id;

    await this.#userService.banUser(userIdToBan, adminWhoBannedId);
    res.formatResponse({}, "User banned successfully");
  }

  async unbanUser(req, res) {
    const { userIdToUnban } = req.body;

    await this.#userService.unbanUser(userIdToUnban);
    res.formatResponse({}, "User unbanned successfully");
  }
}
