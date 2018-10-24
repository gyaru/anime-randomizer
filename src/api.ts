import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";

const asyncMiddleware = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const query = `
query ($season: MediaSeason!, $seasonYear: Int!, $page: Int) {
  Page(page: $page) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(season: $season, seasonYear: $seasonYear, type: ANIME, format: TV, sort: START_DATE) {
      id
      title {
        romaji
      }
      coverImage {
        large
      }
      bannerImage
    }
  }
}
`;

const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"];

export let getRandomAnime = asyncMiddleware(
  async (req: Request, res: Response) => {
    const randomSeason = await seasons[
      Math.floor(Math.random() * Math.floor(seasons.length))
    ];
    const randomYear = await Math.floor(Math.random() * 12) + 2006;
    const variables = await {
      season: randomSeason,
      seasonYear: randomYear,
      page: 1,
    };
    const api = await fetch("https://graphql.anilist.co", {
      method: "POST",
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await api.json();
    const animeList = await json.data.Page.media;
    const randomizedNumber = await Math.floor(
      Math.random() * Math.floor(animeList.length),
    );
    const animeTitle = await json.data.Page.media[randomizedNumber].title
      .romaji;
    const animeId = await json.data.Page.media[randomizedNumber].id;
    const animeCover = await json.data.Page.media[randomizedNumber].coverImage
      .large;
    const animeBanner = await json.data.Page.media[randomizedNumber].bannerImage;
    const data = await {
      id: animeId,
      year: randomYear,
      season: randomSeason,
      total: animeList.length,
      title: animeTitle,
      image: animeCover,
      banner: animeBanner,
    };
    await res.render("index", data);
  },
);
