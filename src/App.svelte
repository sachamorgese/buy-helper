<script lang="ts">
  import { onMount } from "svelte";
  import cog from "svelte-awesome/icons/cog";
  import close from "svelte-awesome/icons/close";
  import Icon from "svelte-awesome";
  import Settings from "./lib/Settings.svelte";
  import {
    type List,
    type DataKeys,
    SETTINGS_KEY,
    SETTINGS_NAME,
    SETTINGS_ID,
    RECEIVED_MESSAGE_TYPES,
    type Message,
    SENT_MESSAGE_TYPES,
    SETTINGS_PARTNER_ID,
  } from "./types";
  import Main from "./lib/MainPageList.svelte";

  const isDev = import.meta.env.MODE === "development";
  const SERVER_URL = isDev ? "localhost:4000" : "buy-helper-be-production.up.railway.app";

  let socket: WebSocket;
  let userID = localStorage.getItem(SETTINGS_ID) ?? "";
  let isSocketOpen = false;
  let loadingFlag = true;

  onMount(() => {
    socket = new WebSocket(`ws://${SERVER_URL}?userId=${userID}`);

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);

      if (message.type === RECEIVED_MESSAGE_TYPES.NEW_ID) {
        userID = message.data.id;
        console.log(userID)
        localStorage.setItem(SETTINGS_ID, userID);
        loadingFlag = false;
      }

      if (message.type === RECEIVED_MESSAGE_TYPES.ID_FOUND) {
        loadingFlag = false;
      }
    };

    socket.onopen = () => {
      isSocketOpen = true;
    };

    return () => {
      socket.close();
    };
  });

  let isSettingsOpen = false;

  const settingsString = localStorage.getItem(SETTINGS_KEY);

  let settingsData: List = settingsString
    ? JSON.parse(settingsString)
    : (() => {
        const newSettings = {
          needs: [],
          wants: [],
          desires: [],
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));

        return newSettings;
      })();

  function setSettingsList(type: DataKeys, value: string) {
    settingsData = {
      ...settingsData,
      [type]: [...settingsData[type], { title: value, checked: false }],
    };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsData));
    const data = {
      content: settingsData,
      userID,
    };
    socket.send(
      JSON.stringify({
        type: SENT_MESSAGE_TYPES.SETTINGS,
        data,
      }),
    );
  }

  function setName(name: string) {
    localStorage.setItem(SETTINGS_NAME, name);

    const data = {
      content: name,
      userID,
    };

    console.log(data)

    socket.send(
      JSON.stringify({
        type: SENT_MESSAGE_TYPES.NAME,
        data,
      }),
    );
  }

  function setPartnerID(partnerID: string) {
    localStorage.setItem(SETTINGS_PARTNER_ID, partnerID);

    const data = {
      content: partnerID,
      userID,
    };
    socket.send(
      JSON.stringify({
        type: SENT_MESSAGE_TYPES.PARTNER_ID,
        data,
      }),
    );
  }

  function removeSettingsList(type: DataKeys, index: number) {
    settingsData = {
      ...settingsData,
      [type]: settingsData[type].filter((_, i) => i !== index),
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsData));
    const data = {
      content: settingsData,
      userID,
    };
    socket.send(
      JSON.stringify({
        type: SENT_MESSAGE_TYPES.SETTINGS,
        data,
      }),
    );
  }
</script>

<main class="h-full relative pt-5">
  {#if isSettingsOpen}
    <button class="absolute top-0 right-0" on:click={() => (isSettingsOpen = false)}>
      <Icon data={close} scale={1.5} />
    </button>
  {:else}
    <button class="absolute top-0 right-0" on:click={() => (isSettingsOpen = true)}>
      <Icon data={cog} scale={1.5} />
    </button>
  {/if}

  {#if isSettingsOpen}
    <Settings
      data={settingsData}
      {setSettingsList}
      {removeSettingsList}
      {setName}
      {setPartnerID}
    />
  {:else if !loadingFlag && isSocketOpen && userID}
    <Main {socket} />
  {/if}
</main>

<style>
</style>
