async function getGamesListApi(params) {
  const baseUrl = "https://pub.gamezop.com/v3/games?id=9701";

  let result = await fetch(`${baseUrl}`, {
    method: "GET",
  });
  let data = await result.json();

  // 格式转化
  function formatData(item) {
    return {
      id: item.code,
      title: item.name.en,
      description: item.description.en,
      url: item.url,
      category: item.categories.en,
      thumb: item.assets.thumb,
    };
  }
  // 打乱

  if (params.gameId) {
    return [formatData(data.games.find((item) => item.code === params.gameId))];
  }

  if (params.name) {
    return data.games
      .filter((item) => item.name.en.toLowerCase().includes(params.name.toLowerCase()))
      .map((item) => formatData(item));
  }

  return data.games
    .sort(() => Math.random() - 0.5)
    .slice(0, params.num)
    .map((item) => {
      return formatData(item);
    });
}

let getGamesListCategory = [
  "IO",
  "2 Player",
  "3D",
  "Adventure",
  "Arcade",
  "Bejeweled",
  "Boys",
  "Clicker",
  "Cooking",
  "Girls",
  "Hypercasual",
  "Multiplayer",
  "Puzzle",
  "Racing",
  "Shooting",
  "Soccer",
  "Sports",
  "Stickman",
  "Baby Hazel",
];

export { getGamesListApi, getGamesListCategory };
