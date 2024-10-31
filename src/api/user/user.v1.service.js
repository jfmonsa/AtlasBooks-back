export default class UserService {
  #userRepository;

  constructor({ userRepository }) {
    this.#userRepository = userRepository;
  }

  async deleteUser(userId) {
    await this.#userRepository.deleteUser(userId);
  }
}
