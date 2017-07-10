import numeral from "numeral";

export function isInt(n) {
  return parseInt(n) === n;
}

export function parseNumber(number, has_comma = true) {
  return numeral(number).format(`0${has_comma ? ",0" : ""}.[00]`);
}

export function truncateWords(sentence, number = 25) {
  if (!sentence) {
    return sentence;
  }
  var all_words = sentence.split(" ");
  var has_more = all_words.length > number;
  return all_words.splice(0, number).join(" ") + (has_more ? " ..." : "");
}

export function getItemsList(ids, itemsMap) {
  if (Array.isArray(ids) && ids.length) {
    return ids.map(id => {
      return itemsMap[id];
    });
  }
  return [];
}
