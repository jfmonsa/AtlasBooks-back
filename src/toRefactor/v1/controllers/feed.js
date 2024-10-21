export class UserFeedController {
  static async getFeedRecomendedForUser(_req, res) {
    //TODO: 1. In the future, recommend books based on the user (their download history)
    const feed = await UserFeedService.getFeedRecomended();

    res.status(200).send({ recommended_feed: feed });
  }
}
