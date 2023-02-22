import { writable } from "svelte/store";

const circleColorStore = writable();
const currBeatStore = writable(0);
const subdivisionsStore = writable();
const tempoStore = writable(0);

export { circleColorStore, currBeatStore, subdivisionsStore, tempoStore };
