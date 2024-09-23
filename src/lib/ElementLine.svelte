<script lang="ts">
  import Icon from "svelte-awesome";
  import minusSquareO from "svelte-awesome/icons/minusSquareO";
  import type { ListItem } from "../types";

  export let element: ListItem;
  export let removeData: () => void;
</script>

<li class="flex">
  {element.title}
  <button class="ml-4" on:click={removeData}><Icon data={minusSquareO} /></button>
</li>
