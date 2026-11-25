const CARRIERS = {
  "japanpost": {
    "name": "日本郵便",
    "home": "https://trackings.post.japanpost.jp/services/srv/search/",
    "prefix": "https://trackings.post.japanpost.jp/services/srv/search/direct?locale=ja&reqCodeNo1="
  },
  "yamato": {
    "name": "ヤマト運輸",
    "home": "https://toi.kuronekoyamato.co.jp/cgi-bin/tneko",
    "prefix": "https://toi.kuronekoyamato.co.jp/cgi-bin/tneko?init=yes&number00=1&number01="
  },
  "sagawa": {
    "name": "佐川急便",
    "home": "https://www.sagawa-exp.co.jp/howto-search/",
    "prefix": "https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo="
  },
  "seino": {
    "name": "西濃運輸",
    "home": "https://www.seino.co.jp/seino/tts/howto/",
    "prefix": "https://track.seino.co.jp/kamotsu/GempyoNoShokai.do?GNO="
  },
  "fukutsu": {
    "name": "福山通運",
    "home": "https://seikyu.fukuyama-tsuun.com/corp/tracking_no_hunt/",
    "prefix": null
  },
  "ems": {
    "name": "EMS・国際郵便",
    "home": "https://trackings.post.japanpost.jp/services/srv/search/",
    "prefix": "https://trackings.post.japanpost.jp/services/srv/search/direct?locale=ja&reqCodeNo1="
  }
};
function normalizeNumber(value){return String(value??"").normalize("NFKC").toUpperCase().replace(/[\s\-‐‑‒–—−ー]/g,"")}

function validNumber(value){return /^[A-Z0-9]{8,20}$/.test(value)}

function candidates(no){if(/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(no))return ["ems"];if(/^\d{12}$/.test(no))return ["japanpost","yamato","sagawa"];if(/^\d{11}$/.test(no))return ["japanpost","yamato","fukutsu"];if(/^\d{10}$/.test(no))return ["sagawa","seino","fukutsu"];if(/^\d{13}$/.test(no))return ["japanpost"];return []}

function hasCarrier(id){return Object.hasOwn(CARRIERS,id)}

function trackingUrl(id,no){if(!hasCarrier(id)||!validNumber(no))throw Error("不正な番号または配送会社");const c=CARRIERS[id];return c.prefix?c.prefix+encodeURIComponent(no):c.home}

function keyOf(item){return item.carrier+":"+item.no}

function cleanItem(item){if(!item||typeof item.no!=="string"||!hasCarrier(item.carrier))throw Error("不明な履歴形式");const no=normalizeNumber(item.no);if(!validNumber(no))throw Error("不正な追跡番号");return {no,carrier:item.carrier,memo:typeof item.memo==="string"?item.memo:"",date:typeof item.date==="string"&&Number.isFinite(Date.parse(item.date))?item.date:"",received:item.received===true}}

function parseHistory(raw){const data=JSON.parse(raw);if(!Array.isArray(data))throw Error("履歴の形式が不正です");return data.map(cleanItem)}

function mergeHistory(current,incoming){const map=new Map(current.map(x=>[keyOf(x),x]));for(const item of incoming)if(!map.has(keyOf(item)))map.set(keyOf(item),item);return [...map.values()]}

function upsert(list,item){const old=list.find(x=>keyOf(x)===keyOf(item));return [{...old,...item,memo:item.memo||old?.memo||"",received:old?.received??false},...list.filter(x=>keyOf(x)!==keyOf(item))]}
export { CARRIERS, normalizeNumber, validNumber, candidates, hasCarrier, trackingUrl, keyOf, cleanItem, parseHistory, mergeHistory, upsert };
