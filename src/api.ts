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
    }
  }
}
`;

const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"];
const years = [
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
];
export let getRandomAnime = asyncMiddleware(
  async (req: Request, res: Response) => {
    const randomSeason = await seasons[
      Math.floor(Math.random() * Math.floor(seasons.length))
    ];
    const randomYear = await years[
      Math.floor(Math.random() * Math.floor(years.length))
    ];
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
    const animeCover = await json.data.Page.media[randomizedNumber].coverImage
      .large;
    const data = await {
      year: randomYear,
      season: randomSeason,
      total: animeList.length,
      title: animeTitle,
      image: animeCover,
    };
    await res.render("index", data);
  },
);
