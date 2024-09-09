

export class communitylisting {
  $key?: string;
  name?: string;  
  desc?: string;  
  user?: string;
  userbild?: string;
  contact?: string;
  timestamp?: string;
  timestampformat?: string;
  lat?: string;
  lng?: string;
  adress?: string;
  mo?: string;
  di?: string;
  mi?: string;
  do?: string;
  fr?: string;
  sa?: string;
  so?: string;
  von?: string;
  bis?: string;
  datum?: string;
  bild1?: string;
  bild2?: string;
  bild3?: string;
  bild4?: string;
  bild5?: string;
  uhrzeit?: string;
  maxanzahl?: string;
  big?: string;
  mid?: string;
  small?: string;
  ratings?: string[];
  ratingcounter?: string;
  commentscounter?: string;
  comments?: string;
  kat?: string;
}


export class communitylistingfilter {
  $key?: string;
  name?: string;  
  desc?: string;  
  user?: string;
  contact?: string;
  timestamp?: string;
  timestampformat?: string;
  lat?: string;
  lng?: string;
  adress?: string;
  mo?: string;
  di?: string;
  mi?: string;
  do?: string;
  fr?: string;
  sa?: string;
  so?: string;
  von?: string;
  bis?: string;
  datum?: string;
  bild1?: string;
  bild2?: string;
  bild3?: string;
  bild4?: string;
  bild5?: string;
  uhrzeit?: string;
  maxanzahl?: string;
  big?: string;
  mid?: string;
  small?: string;
  ratings?: string[];
  ratingcounter?: string;
  commentscounter?: string;
  comments?: string;
  kat?: string;
}

export class CommunityLists{
  $key: string;
  name: string;
  desc?: string;
  user?: string;
  timestamp: string;
  timestampformat: string;
  lat?: string;
  lng?: string;
  adress?: string;
  mo?: string;
  di?: string;
  mi?: string;
  do?: string;
  fr?: string;
  sa?: string;
  so?: string;
  von?: string;
  bis?: string;
  datum?: string;
  bild1?: string;
  bild2?: string;
  bild3?: string;
  bild4?: string;
  bild5?: string;
  uhrzeit?: string;
  maxanzahl?: string;
  big?: string;
  mid?: string;
  small?: string;
  ratings?: string[];
  ratingcounter?: string;
  commentscounter?: string;
  comments?: string;
  kat?: string;
}

export interface FILE {
  name: string;
  filepath: string;
  size: number;
  user: string;
  timestamp: string;
}

export class ratings{
    rating?: string;
    user: string;
    timestamp: string;
}

export class comments{
  comment?: string;
  user: string;
  timestamp: string;
  timestamporder: string;
  username: string;
  useravatar?: string;
}

export class anzeige{
  id?: string;
  name?: string;  
  desc?: string;  
  user?: string;
  contact?: string;
  timestamp?: string;
  timestampformat?: string;
  lat?: string;
  lng?: string;
  adress?: string;
  mo?: string;
  di?: string;
  mi?: string;
  do?: string;
  fr?: string;
  sa?: string;
  so?: string;
  von?: string;
  bis?: string;
  datum?: string;
  bild1?: string;
  bild2?: string;
  bild3?: string;
  bild4?: string;
  bild5?: string;
  uhrzeit?: string;
  maxanzahl?: string;
  big?: string;
  mid?: string;
  small?: string;
  ratings?: string[];
  ratingcounter?: string;
  commentscounter?: string;
  comments?: string;
  kat?: string;
  type?: string;
  url?: string;
  message?: string;
  to_username?: string;
  from_username?: string;
  time?: string;
  chatanzeige?: string;
}

export class anzeigegroup{
  group?: string;
}
