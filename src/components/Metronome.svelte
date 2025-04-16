<script lang="ts">
  import * as Tone from "tone";
  import { circleColorStore, currBeatStore, subdivisionsStore, tempoStore } from "../stores/stores";

  let tempo: number;
  let numCircles: number;
  let idx = 0;

  let pendingTempo: number | null = null;
  let pendingNumCircles: number | null = null;

  const updateTransportBpm = () => {
    if (tempo && numCircles) {
      Tone.Transport.bpm.value = tempo * numCircles;
    }
  };

  currBeatStore.subscribe((data) => {
    idx = data;
    // Check if the current cycle is complete
    if (idx === 0 && (pendingTempo !== null || pendingNumCircles !== null)) {
      // Apply pending updates
      if (pendingTempo !== null) {
        tempo = pendingTempo;
        pendingTempo = null;
      }
      if (pendingNumCircles !== null) {
        numCircles = pendingNumCircles;
        pendingNumCircles = null;
      }
      updateTransportBpm();
    }
  });

  tempoStore.subscribe((data) => {
    if (idx === 0) {
      // Update immediately if at the start of a cycle
      tempo = data;
      updateTransportBpm();
    } else {
      // Otherwise, queue the update
      pendingTempo = data;
    }
  });

  subdivisionsStore.subscribe((data) => {
    if (idx === 0) {
      // Update immediately if at the start of a cycle
      numCircles = data;
      updateTransportBpm();
    } else {
      // Otherwise, queue the update
      pendingNumCircles = data;
    }
  });

  enum CircleColors {
    gray,
    purple,
    teal,
  }

  let circleColors: CircleColors[];
  circleColorStore.subscribe((data) => {
    circleColors = data;
  });

  let stopped = true;
  // let numCircles: number = 2;

  const kickSynth: Tone.MembraneSynth = new Tone.MembraneSynth({
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.2,
    },
  }).toDestination();

  const hatSynth: Tone.MetalSynth = new Tone.MetalSynth({
    envelope: {
      attack: 0.1,
      decay: 0.15,
      sustain: 0.0,
      release: 0.02,
    },
  }).toDestination();

  const loop: Tone.Loop<Tone.LoopOptions> = new Tone.Loop((time) => {
    if (stopped === true) {
      idx = 0;
      stopped = false;
    }
    idx = idx % numCircles;
    if (circleColors[idx] == CircleColors.purple) {
      kickSynth.triggerAttackRelease("C2", "64n", time);
    } else if (circleColors[idx] == CircleColors.teal) {
      hatSynth.triggerAttackRelease("C2", "64n", time);
    } else if (circleColors[idx] == CircleColors.gray) {
      // do nothing
    }

    currBeatStore.set(idx);
    console.log(idx);
    idx += 1;
  }, "4n").start(0);

  let playSynth = async () => {
    if (tempo !== 0) {
      await Tone.start();
      Tone.Transport.bpm.value = tempo * numCircles;
      Tone.Transport.start();
      stopped = false;
    }
  };
  let stopSynth = () => {
    Tone.Transport.stop();
    currBeatStore.set(0);
    stopped = true;
  };
  // event = keyup or keydown
  document.addEventListener("keyup", (event) => {
    // https://stackoverflow.com/questions/36430561/how-can-i-check-if-my-element-id-has-focus
    var numCirclesInputElem = document.getElementById("numCirclesInput");
    var isNumCirclesInputFocused = document.activeElement === numCirclesInputElem;
    var tempoInputElem = document.getElementById("tempoInput");
    var isTempoInputFocused = document.activeElement === tempoInputElem;

    if (!isNumCirclesInputFocused && !isTempoInputFocused) {
      if (event.code === "Space") {
        if (stopped == true) {
          playSynth();
        } else {
          stopSynth();
        }
        console.log("Space pressed");
      }
    }
    if (event.code === "Enter") {
      // https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
      (<HTMLInputElement>document.activeElement).blur();
    }
  });
  // // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
  // // https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
  // document.getElementById('numCirclesInput').addEventListener('input', (event) => {
  //   this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
  // });
</script>

<div class="bg-[#121212]">
  <!-- <button class="text-[#EEE] z-10" on:click={playSynth}>Play Metronome</button>
  <button class="text-[#EEE] z-10" on:click={stopSynth}>Pause Metronome</button> -->
</div>
