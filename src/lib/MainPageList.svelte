<script lang="ts">
  import {
    type DataKeys,
    SENT_MESSAGE_TYPES,
    RECEIVED_MESSAGE_TYPES,
    SETTINGS_ID,
    PARTNER_SETTINGS,
    SETTINGS_KEY,
    SETTINGS_NAME,
    type List,
    SETTINGS_PARTNER_ID,
  } from "../types";
  import { onMount } from "svelte";
  import { getCurrentTabUrl } from "./fetchData";
  import { calculateScore, emptyList, getKeyByList } from "./utils";

  export let socket: WebSocket;

  const userID = localStorage.getItem(SETTINGS_ID);
  const partnerID = localStorage.getItem(SETTINGS_PARTNER_ID);

  const ownSettingsData: List =
    JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "") ?? emptyList;

  let ownPageListData: List = emptyList;
  let pageKey: string;

  onMount(() => {
    if (partnerID) {
      socket.send(
        JSON.stringify({
          type: SENT_MESSAGE_TYPES.GET_PARTNER_SETTINGS,
          data: {
            partnerID,
          },
        }),
      );
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === RECEIVED_MESSAGE_TYPES.PARTNER_SETTINGS) {
        const partnerSettingsRaw = JSON.parse(data.content);
        if (!partnerSettingsRaw) {
          return;
        }
        partnerSettings = partnerSettingsRaw;
      }

      if (data.type === RECEIVED_MESSAGE_TYPES.PARTNER_LIST) {
        const partnerListRaw = JSON.parse(data.content);
        if (!partnerListRaw) {
          return;
        }
        partnerList = partnerListRaw;
      }
    };
  });

  getCurrentTabUrl().then((url) => {
    pageKey = url;
    const storedData = localStorage.getItem(pageKey);
    ownPageListData = storedData ? JSON.parse(storedData) : ownSettingsData;
  });

  $: {
    try {
      socket.send(
        JSON.stringify({
          type: SENT_MESSAGE_TYPES.GET_PARTNER_LIST,
          data: {
            partnerID,
            key: pageKey,
          },
        }),
      );
    } catch (error) {
      console.error("Unable to send message:", error);
    }
  }

  function handleCheckboxChange(type: DataKeys, index: number) {
    ownPageListData = {
      ...ownPageListData,
      [type]: ownPageListData[type].map((item, i) => {
        if (i === index) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      }),
    };

    localStorage.setItem(pageKey, JSON.stringify(ownPageListData));

    const data = {
      content: ownPageListData,
      key: pageKey,
      userID,
    };

    socket.send(
      JSON.stringify({
        type: SENT_MESSAGE_TYPES.LIST,
        data,
      }),
    );
  }

  let partnerDataString = localStorage.getItem(PARTNER_SETTINGS);

  let partnerSettings = partnerDataString
    ? JSON.parse(partnerDataString)
    : emptyList;

  let partnerList: List = emptyList;

  $: ownPageListDataByKey = getKeyByList(ownPageListData);
  $: partnerListByKey = getKeyByList(partnerList);

  $: settingsNeeds = ownSettingsData.needs;
  $: settingsWants = ownSettingsData.wants;
  $: settingsDesires = ownSettingsData.desires;
  $: pageNeeds = ownPageListDataByKey?.needs;
  $: pageWants = ownPageListDataByKey?.wants;
  $: pageDesires = ownPageListDataByKey?.desires;
  $: partnerSettingsNeeds = partnerSettings?.needs;
  $: partnerSettingsWants = partnerSettings?.wants;
  $: partnerSettingsDesires = partnerSettings?.desires;
  $: partnerPageNeeds = partnerListByKey?.needs;
  $: partnerPageWants = partnerListByKey?.wants;
  $: partnerPageDesires = partnerListByKey?.desires;

  $: console.log({
    partnerSettingsNeeds,
    partnerSettingsWants,
    partnerSettingsDesires,
    partnerPageNeeds,
    partnerPageWants,
    partnerPageDesires,
  });

  const name = localStorage.getItem(SETTINGS_NAME);
  $: ownScore = calculateScore(ownSettingsData, ownPageListDataByKey);
  $: partnerScore = calculateScore(partnerSettings, partnerListByKey);

  $: combinedScore = Math.round((ownScore + partnerScore) / 2);
</script>

<section class="flex h-[calc(100%-30px)]">
  <div class="basis-1/2 flex flex-col justify-between">
    <div>
      <h1 class="font-bold">{name ?? "Your List"}</h1>
      <h2 class="text-xl mt-4 mb-2 font-bold">Needs</h2>
      <ul>
        {#each settingsNeeds as need, index}
          <li>
            <input
              type="checkbox"
              checked={pageNeeds?.[need.title]?.checked}
              on:change={() => handleCheckboxChange("needs", index)}
            />
            {need.title}
          </li>
        {/each}
      </ul>
      <h2 class="text-xl mt-4 mb-2 font-bold">Wants</h2>
      <ul>
        {#each settingsWants as want, index}
          <li>
            <input
              type="checkbox"
              checked={pageWants?.[want.title]?.checked}
              on:change={() => handleCheckboxChange("wants", index)}
            />
            {want.title}
          </li>
        {/each}
      </ul>
      <h2 class="text-xl mt-4 mb-2 font-bold">Desires</h2>
      <ul>
        {#each settingsDesires as desire, index}
          <li>
            <input
              type="checkbox"
              checked={pageDesires?.[desire.title]?.checked}
              on:change={() => handleCheckboxChange("desires", index)}
            />
            {desire.title}
          </li>
        {/each}
      </ul>
    </div>
    <span>Total own score: {ownScore}/100</span>
  </div>
  <div class="basis-1/2 flex flex-col justify-between">
    <div>
      <h1 class="font-bold">Your Partner's List</h1>
      <h2 class="text-xl mt-4 mb-2 font-bold">Needs</h2>
      <ul>
        {#each partnerSettingsNeeds as need}
          <li>
            <input
              type="checkbox"
              checked={partnerPageNeeds?.[need.title]?.checked}
              disabled
            />
            {need.title}
          </li>
        {/each}
      </ul>
      <h2 class="text-xl mt-4 mb-2 font-bold">Wants</h2>
      <ul>
        {#each partnerSettingsWants as want}
          <li>
            <input
              type="checkbox"
              checked={partnerPageWants?.[want.title]?.checked}
              disabled
            />
            {want.title}
          </li>
        {/each}
      </ul>
      <h2 class="text-xl mt-4 mb-2 font-bold">Desires</h2>
      <ul>
        {#each partnerSettingsDesires as desire}
          <li>
            <input
              type="checkbox"
              checked={partnerPageDesires?.[desire.title]?.checked}
              disabled
            />
            {desire.title}
          </li>
        {/each}
      </ul>
    </div>
    <span>Total partner score: {partnerScore}/100</span>
  </div>
</section>
<div>
  <h1 class="font-bold block text-center">Combined score {combinedScore}/100</h1>
</div>
