<script lang="ts">
  import * as Tone from "tone";
  import { circleColorStore, currBeatStore, subdivisionsStore, tempoStore } from "../stores/stores"

  let numCircles: number;
  subdivisionsStore.subscribe(data => {
    numCircles = data;
  })
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
    new Tone.MembraneSynth({envelope: {  
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.5,}}).toDestination();

  const hatSynth: Tone.Synth<Tone.MetalSynth> =
    new Tone.MetalSynth({envelope: {  
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.1,}}).toDestination();
  
      // var tom = new Tone.MembraneSynth();
      // var snare = new Tone.NoiseSynth(   
      // { noise: {
      //     type: "brown"
      //   },
      //   envelope: {
      //     attack: 0.005 ,
      //     decay: 0.1 ,
      //     sustain: 0.02
      //     }
      //   }
      // )
      // var reverb = new Tone.Freeverb({
      // roomSize  : 0.7 ,
      // dampening  : 8000
      // });
      // var feedbackDelay = new Tone.FeedbackDelay({
      // delayTime  : "32n",
      //   feedback : 0.25
      // });
      // var gate = new Tone.Gate(-50)
      // var compressor = new Tone.MidSideCompressor();
      // var gain = new Tone.Gain();

      // // snare.chain(reverb, gate, compressor, gain);
      // snare.chain( gate, compressor, gain);

      // //tom.chain(reverb, gate, compressor, gain);
      // tom.chain( gate, compressor, gain);


      // gain.chain(Tone.Master); // dry

      // snare.triggerAttackRelease("C4, 8n");
      // tom.triggerAttackRelease("C1","8n");


  let idx = 0;
  currBeatStore.subscribe(data => {
    idx = data
  })

  const loop: Tone.Loop<Tone.LoopOptions> = new Tone.Loop((time) => {
    if (stopped === true) {
      idx = 0;
      stopped = false;
    }
    idx = idx % (circleColors.length);
    if (circleColors[idx] == CircleColors.purple) {
      kickSynth.triggerAttackRelease("C2", "64n", time);
    } else if (circleColors[idx] == CircleColors.teal) {
      hatSynth.triggerAttackRelease("C2", "64n", time);
    }
    

    
    currBeatStore.set(idx);
    console.log(idx)
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
    currBeatStore.set(0)
    stopped = true;
  };
  // event = keyup or keydown
  document.addEventListener('keyup', event => {
    // https://stackoverflow.com/questions/36430561/how-can-i-check-if-my-element-id-has-focus
    var numCirclesInputElem = document.getElementById('numCirclesInput');
    var isNumCirclesInputFocused = (document.activeElement === numCirclesInputElem);
    var tempoInputElem = document.getElementById('tempoInput');
    var isTempoInputFocused = (document.activeElement === tempoInputElem);
    // numCirclesInputElem.addEventListener("change",(ev) => {
    //   Tone.Transport.bpm.value = tempo * numCircles;
    //   Tone.Transport.bpm.rampTo(tempo * numCircles, 1);
    // }
    // )
    if (!isNumCirclesInputFocused && !isTempoInputFocused) {
      if (event.code === 'Space') {
        if (stopped == true) {
          playSynth();
        } else {
          stopSynth();
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
  <button class="text-[#EEE] z-10" on:click={stopSynth}>Pause Metronome</button> -->
</div>
