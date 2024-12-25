export const BASE_URL = "http://127.0.0.1:8080";

export const checkError = (message) => {
  if (message.toString().startsWith("001")) {    return "Username or Password are not correct";  }

  if (message.toString().startsWith("002")) {    return "Username already existed";  }

  if (message.toString().startsWith("003")) {    return "Invalid year of birth";  }

  if (message.toString().startsWith("004")) {    return "Couldn't find user by username";  }

  if (message.toString().startsWith("005")) {    return "Error ending livestream session";  }

  if (message.toString().startsWith("006")) {    return "Couldn't find livestream session by Id";  }

  if (message.toString().startsWith("008")) {    return "Current Password is not correct !";  }

  return null;
};

export const livestreamBackground = [
  "https://cdn.tgdd.vn/GameApp/4/221941/Screentshots/lien-minh-huyen-thoai-game-moba-pho-bien-nhat-the-gioi-21-05-2020-2.jpg",
  "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/10/nang-cap-fo4.jpg",
  "https://cmsassets.rgpub.io/sanity/images/dsfx7636/content_organization/731216ff2453134e530feabc9dbd3c44e480e352-1200x625.jpg",
  "https://wstatic-prod.pubg.com/web/live/main_d559c6b/img/d16f5b2.jpg",
  "https://images2.thanhnien.vn/528068263637045248/2024/6/10/black-myth-wukong-1024x499-1717988407641-17179884082061339819395.jpg",
  "https://media.contentapi.ea.com/content/dam/apex-legends/common/apex-price-change-key-art.jpg.adapt.crop16x9.431p.jpg",
  "https://images2.thanhnien.vn/zoom/1200_630/528068263637045248/2024/11/1/call-of-duty-black-ops-6-1-1730428979336-17304289797941293330647-0-0-1005-1920-crop-17304310477961168236274.jpg",
  "https://images2.thanhnien.vn/528068263637045248/2023/6/28/among-us-16879157558491830914451.jpg",
  "https://tailieu.link/images/anh-dai-dien/165.jpg",
  "https://xboxera.com/wp-content/uploads/2024/11/starcraft-2-collection.jpeg",
  "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/6570/header.jpg?t=1187643692",
  "https://didongviet.vn/dchannel/wp-content/uploads/2023/03/1-cf-la-gi-didongviet.jpg",
  "https://t4.ftcdn.net/jpg/07/23/14/93/360_F_723149335_tA0Fo8zefrHzYlSgXRMYHmBQk7CuWrRd.jpg",
  "https://static.vecteezy.com/system/resources/previews/045/132/934/non_2x/a-beautiful-picture-of-the-eiffel-tower-in-paris-the-capital-of-france-with-a-wonderful-background-in-wonderful-natural-colors-photo.jpg",
  "https://cdn.pixabay.com/photo/2023/05/20/16/54/rose-8006847_640.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB4pCtjQpCMhrDrJGwxnX4VZAeZwWIWaRb-Q&s",
  "https://static.vecteezy.com/system/resources/thumbnails/026/829/465/small_2x/beautiful-girl-with-autumn-leaves-photo.jpg",
  "https://watermark.lovepik.com/photo/40024/8584.jpg_wh1200.jpg",
  "https://www.alwayspets.com/wp-content/uploads/2024/11/f1e4839891dc405bb02662991c230eba.webp",
  "https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L",
];
