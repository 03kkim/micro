<script lang="ts">
  import * as Tone from "tone";
  import circleColorStore from "../stores/circleColorStore.js"
  import tempoStore from "../stores/tempoStore.js";

  enum CircleColors {
    teal,
    purple
  }
  
  let circleColors: CircleColors[];
  circleColorStore.subscribe(data => {
    circleColors = data;
  });

  let tempo: number;
  tempoStore.subscribe(data => {
    tempo = data;
  })

  let stopped = true;
  // let numCircles: number = 2;

  const kickSynth: Tone.Synth<Tone.MembraneSynth> =
    new Tone.MembraneSynth().toDestination();

  const hatSynth: Tone.Synth<Tone.MetalSynth> =
    new Tone.MetalSynth().toDestination();
  let idx = 0;

  const loop: Tone.Loop<Tone.LoopOptions> = new Tone.Loop((time) => {
    if (stopped === true) {
      idx = 0;
      stopped = false;
    }
    idx = idx % circleColors.length;
    if (circleColors[idx] == CircleColors.purple) {
      kickSynth.triggerAttackRelease("C2", "32n", time);
    } else if (circleColors[idx] == CircleColors.teal) {
      hatSynth.triggerAttackRelease("C2", "32n", time);
    }
    

    console.log(idx % circleColors.length)
    idx += 1;
  }, "4n").start(0);

  let playSynth = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.start();
  };
  let pauseSynth = () => {
    Tone.Transport.stop();
    stopped = true;
  };
  // event = keyup or keydown
  document.addEventListener('keyup', event => {
    // https://stackoverflow.com/questions/36430561/how-can-i-check-if-my-element-id-has-focus
    var numCirclesInputElem = document.getElementById('numCirclesInput');
    var isNumCirclesInputFocused = (document.activeElement === numCirclesInputElem);
    var tempoInputElem = document.getElementById('tempoInput');
    var isTempoInputFocused = (document.activeElement === tempoInputElem);
    if (!isNumCirclesInputFocused && !isTempoInputFocused) {
      if (event.code === 'Space') {
        if (stopped == true) {
          playSynth();
        } else {
          pauseSynth();
        }
        console.log('Space pressed')
      }
    }
    if (event.code === 'Enter') {
      // https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
      (<HTMLInputElement>document.activeElement).blur();
    }
    
  })
  // // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
  // // https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
  // document.getElementById('numCirclesInput').addEventListener('input', (event) => {
  //   this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
  // });
      
</script>

<div class="bg-[#121212]">
  <!-- <button class="text-[#EEE] z-10" on:click={playSynth}>Play Metronome</button>
  <button class="text-[#EEE] z-10" on:click={pauseSynth}>Pause Metronome</button> -->
</div>
