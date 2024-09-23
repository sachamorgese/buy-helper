import type { List, ListItem } from "../types";
import keyBy from "lodash/keyBy";

export function getKeyByList(list: List) {
  if (!list) {
    return {
      wants: {},
      needs: {},
      desires: {},
    };
  }

  const { needs, wants, desires } = list;

  const keyByNeeds = keyBy(needs, "title");
  const keyByWants = keyBy(wants, "title");
  const keyByDesires = keyBy(desires, "title");

  return {
    needs: keyByNeeds,
    wants: keyByWants,
    desires: keyByDesires,
  };
}

function calculateListScore(
  settingsList: ListItem[],
  list: { [k: string]: ListItem },
  weight: number,
) {
  const checkedItems = settingsList.filter((item) => list[item.title]?.checked);
  const score = checkedItems.length / settingsList.length;
  return (isNaN(score) ? 0 : score) * weight;
}

export function calculateScore(
  settings: List,
  list: ReturnType<typeof getKeyByList>,
) {
  // let's merge the lists by taking the first list and adding thge second list's checked items
  const needsScore = calculateListScore(settings.needs, list.needs, 50);
  const wantsScore = calculateListScore(settings.wants, list.wants, 30);
  const desiresScore = calculateListScore(settings.desires, list.desires, 20);
  const totalScore = needsScore + wantsScore + desiresScore;
  return Math.round(totalScore * 100) / 100;
}

export const emptyList = {
  needs: [],
  wants: [],
  desires: [],
};
