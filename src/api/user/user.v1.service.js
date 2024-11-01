import { ForbiddenError } from "../../helpers/exeptions.js";

export default class UserService {
  #userRepository;

  constructor({ userRepository }) {
    this.#userRepository = userRepository;
  }

  async deleteUser(userId) {
    await this.#userRepository.deleteUser(userId);
  }

  async getDownloadHistory(userId) {
    return await this.#userRepository.getDownloadHistory(userId);
  }

  async banUser(userIdToBan, adminWhoBannedId) {
    if (adminWhoBannedId === userIdToBan) {
      throw new ForbiddenError("You can't ban yourself");
    }

    await this.#userRepository.banUser(userIdToBan, adminWhoBannedId);
  }

  async unbanUser(userIdToUnban) {
    await this.#userRepository.unbanUser(userIdToUnban);
  }
}
