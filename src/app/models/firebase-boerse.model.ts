

export class boerselisting {
  $key: string;
  name: string;  
  desc?: string;  
  user?: string;
  contact?: string;
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
  preis?: string;
  reserviert?: string;
  reserviert_user?: string;
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
}

