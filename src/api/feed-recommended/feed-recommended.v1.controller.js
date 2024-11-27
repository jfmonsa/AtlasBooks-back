export default class FeedRecommendedController {
  #feedRecommendedService;

  constructor({ feedRecommendedService }) {
    this.#feedRecommendedService = feedRecommendedService;

    this.getFeedRecomendedForUser = this.getFeedRecomendedForUser.bind(this);
  }

  async getFeedRecomendedForUser(_req, res) {
    //TODO: recommend books based on the user (their download history)
    // const { id: userId } = req.user;

    const feed = await this.#feedRecommendedService.getFeedRecomendedForUser();

    res.formatResponse(feed);
  }
}
