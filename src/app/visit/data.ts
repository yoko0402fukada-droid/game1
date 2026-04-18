export interface Location {
  no: number;
  chiban: string;
  chome: number;
  banchi: number;
  go: string;
  building: string;
}

export const locations: Location[] = [
  { no: 1,  chiban: '別府', chome: 3, banchi: 1,  go: '1',     building: 'のせ歯科医院' },
  { no: 2,  chiban: '別府', chome: 3, banchi: 1,  go: '3-1',   building: 'アラコーヒー' },
  { no: 3,  chiban: '別府', chome: 3, banchi: 1,  go: '3-2',   building: '(有)協立住建' },
  { no: 4,  chiban: '別府', chome: 3, banchi: 1,  go: '3-3',   building: '美未命' },
  { no: 5,  chiban: '別府', chome: 3, banchi: 1,  go: '4',     building: '鶏ジロー' },
  { no: 6,  chiban: '別府', chome: 3, banchi: 1,  go: '6-1',   building: '西南泌尿器科クリニック' },
  { no: 7,  chiban: '別府', chome: 3, banchi: 1,  go: '6-2',   building: 'タカラ薬局別府' },
  { no: 8,  chiban: '別府', chome: 3, banchi: 1,  go: '23-1',  building: '東京海上日動代理店(有)城南総合保険センター' },
  { no: 9,  chiban: '別府', chome: 3, banchi: 1,  go: '23-2',  building: 'ダイニングバーセカンド' },
  { no: 10, chiban: '別府', chome: 3, banchi: 1,  go: '23-3',  building: '信コーポレーション' },
  { no: 11, chiban: '別府', chome: 3, banchi: 1,  go: '24',    building: 'ピザクック六本松店' },
  { no: 12, chiban: '別府', chome: 3, banchi: 1,  go: '26',    building: 'コナミスポーツクラブ福岡城南' },
  { no: 13, chiban: '別府', chome: 3, banchi: 2,  go: '1',     building: '(株)西武地所城南店' },
  { no: 14, chiban: '別府', chome: 3, banchi: 2,  go: '3',     building: '別府スタンド' },
  { no: 15, chiban: '別府', chome: 3, banchi: 2,  go: '18',    building: '荒江保育園' },
  { no: 16, chiban: '別府', chome: 3, banchi: 2,  go: '27',    building: 'ヴィルコート城南左' },
  { no: 17, chiban: '別府', chome: 3, banchi: 2,  go: '30',    building: '' },
  { no: 18, chiban: '別府', chome: 3, banchi: 2,  go: '31',    building: 'かわもとクリニック右奥' },
  { no: 19, chiban: '別府', chome: 3, banchi: 2,  go: '33',    building: 'かわもと胃腸内科クリニック' },
  { no: 20, chiban: '別府', chome: 3, banchi: 4,  go: '1',     building: 'ヤスカワフォトスタジオ' },
  { no: 21, chiban: '別府', chome: 3, banchi: 4,  go: '15',    building: 'プレミアムレジデンス左' },
  { no: 22, chiban: '別府', chome: 3, banchi: 4,  go: '16',    building: 'ビーフラット右' },
  { no: 23, chiban: '別府', chome: 3, banchi: 4,  go: '32',    building: '西島整骨院' },
  { no: 24, chiban: '別府', chome: 3, banchi: 4,  go: '35',    building: 'パックミスミ本店' },
  { no: 25, chiban: '別府', chome: 3, banchi: 6,  go: '2',     building: 'あんのうら歯科クリニック' },
  { no: 26, chiban: '別府', chome: 3, banchi: 6,  go: '3',     building: '別府駅駐輪場' },
];

export function getAddress(loc: Location): string {
  return `福岡市城南区${loc.chiban}${loc.chome}丁目${loc.banchi}-${loc.go}`;
}

export function getYahooMapUrl(loc: Location): string {
  const addr = encodeURIComponent(getAddress(loc));
  return `https://map.yahoo.co.jp/search?q=${addr}`;
}
