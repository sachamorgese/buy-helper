<script lang="ts">
  import {type List, type DataKeys, SETTINGS_NAME, SETTINGS_ID, SETTINGS_PARTNER_ID} from "../types";
  import ElementLine from "./ElementLine.svelte";

  let name = localStorage.getItem(SETTINGS_NAME) ?? "";
  let userID = localStorage.getItem(SETTINGS_ID) ?? "";
  let partnerID = localStorage.getItem(SETTINGS_PARTNER_ID) ?? "";

  export let data: List;
  export let setSettingsList: (type: DataKeys, value: string) => void;
  export let removeSettingsList: (type: DataKeys, index: number) => void;
  export let setName: (name: string) => void;
  export let setPartnerID: (partnerID: string) => void;

  $: needs = data.needs;
  $: wants = data.wants;
  $: desires = data.desires;

  function handleKey(e: KeyboardEvent, type: DataKeys) {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      const value = input.value;
      setSettingsList(type, value);
      input.value = "";
    }
  }

  function handleKeyName(e: KeyboardEvent) {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      const value = input.value;
      name = value;
      input.value = "";
      setName(value)
    }
  }

  function handlePartnerID(e: KeyboardEvent) {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      const value = input.value;
      partnerID = value;
      input.value = "";
      setPartnerID(value)
    }
  }
</script>

<main>
  <h1 class="font-bold">Settings</h1>
  <h2 class="text-xl mt-4 mb-2 font-bold">Name</h2>
  <input autocomplete="off" aria-autocomplete="none" type="text" on:keydown={handleKeyName} />
  {#if name}
    <p>{name}</p>
  {/if}
  <h2 class="text-xl mt-4 mb-2 font-bold">Needs</h2>
  <ul>
    <li><input autocomplete="off" type="text" on:keydown={(e) => handleKey(e, "needs")} /></li>
    {#each needs as need, index}
      <ElementLine
        element={need}
        removeData={() => removeSettingsList("needs", index)}
      />
    {/each}
  </ul>
  <h2 class="text-xl mt-4 mb-2 font-bold">Wants</h2>
  <ul>
    <li><input autocomplete="off" type="text" on:keydown={(e) => handleKey(e, "wants")} /></li>
    {#each wants as want, index}
      <ElementLine
        element={want}
        removeData={() => removeSettingsList("wants", index)}
      />
    {/each}
  </ul>
  <h2 class="text-xl mt-4 mb-2 font-bold">Desires</h2>
  <ul>
    <li><input autocomplete="off" type="text" on:keydown={(e) => handleKey(e, "desires")} /></li>
    {#each desires as desire, index}
      <ElementLine
        element={desire}
        removeData={() => removeSettingsList("desires", index)}
      />
    {/each}
  </ul>
  <h2 class="text-xl mt-4 mb-2 font-bold">Your ID is: </h2>
  <div class="flex">
    {userID}
  </div>
  <h2 class="text-xl mt-4 mb-2 font-bold">Partner ID</h2>
  <input autocomplete="off" aria-autocomplete="none" type="text" on:keydown={handlePartnerID} />
  {#if partnerID}
    <p>{partnerID}</p>
  {/if}
</main>
