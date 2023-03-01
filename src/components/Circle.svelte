<script lang="ts">
  import P5, { type Sketch, type p5 } from "p5-svelte";
  import Metronome from "./Metronome.svelte";

  import {
    circleColorStore,
    currBeatStore,
    subdivisionsStore,
    tempoStore,
  } from "../stores/stores";

  let diameter: number = 55;

  let numCirclesInput;
  let numCirclesInputSize: number;

  let tempoInput;
  let tempoInputSize;

  let circles = [];

  let circleColors: CircleColors[];
  circleColorStore.subscribe((data) => {
    circleColors = data;
  });

  let tempo: number;
  tempoStore.subscribe((data) => {
    tempo = data;
  });

  let currBeat: number;
  currBeatStore.subscribe((data) => {
    currBeat = data;
  });

  let numCircles: number;
  subdivisionsStore.subscribe((data) => {
    numCircles = data;
  });
  let prevNumCircles: number = numCircles;

  let canvas;

  enum CircleColors {
    teal,
    purple,
  }

  let numCirclesSlider;

  let usingInput = false;

  const sketch: Sketch = (p5) => {
    p5.setup = () => {
      // https://www.youtube.com/watch?v=OIfEHD3KqCg
      canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
      canvas.position(0, 0);
      canvas.style("z-index", "-1");

      numCirclesInput = p5
        .createInput("16")
        .attribute("placeholder", "Subdivisions");
      setNumCirclesInputStyle();
      numCirclesInput.changed(updateCircleColorsLen);
      initCircleColors();

      tempoInput = p5.createInput("30").attribute("placeholder", "BPM");
      setTempoInputStyle();
      tempoInput.changed(updateTempo);

      numCirclesSlider = p5.createSlider(0, 32, 1);
      setNumCirclesSliderStyle();

      const setNumCirclesInput = () => {
        numCirclesInput.value(numCirclesSlider.value());
      };
      numCirclesSlider.input(setNumCirclesInput);

      circleColorStore.set(circleColors);
      console.log(circleColors);

      const setNumCirclesSlider = () => {
        numCirclesSlider.value(numCirclesInput.value());
      };
      numCirclesInput.input(setNumCirclesSlider);
      // p5.noLoop()
    };

    p5.draw = () => {
      prevNumCircles = numCircles;

      // numCircles = Number(numCirclesInput.value());
      var numCirclesInputElem = document.getElementById("numCirclesInput");
      var isNumCirclesInputFocused =
        document.activeElement === numCirclesInputElem;
      numCircles = numCirclesSlider.value();

      if (!isNumCirclesInputFocused) {
        // console.log("bruh")
        numCirclesSlider.value(numCirclesInput.value());
      }

      subdivisionsStore.set(numCircles);
      updateCircleColorsLen();
      updateTempo();
      p5.background("#121212");
      p5.fill("white");

      drawWhiteCircle();
      populateCircleArrays();
    };
    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

      setNumCirclesInputStyle();
      setNumCirclesSliderStyle();
      setTempoInputStyle();
      // p5.redraw();
    };

    p5.mousePressed = () => {
      let circleClicked = calculateCircleClicked();
      if (circleClicked != -1) {
        invertCircleColor(circleClicked);
      }
    };

    const drawWhiteCircle = (): void => {
      if (numCircles != 0) {
        p5.fill(p5.color("#EEE"));
        let x = (p5.width / (numCircles + 1)) * (currBeat + 1);
        console.log(currBeat);
        let y = p5.height / 2;

        if (numCircles > 25) {
          diameter = 55;
        } else {
          diameter = 70;
        }
        p5.circle(x, y, diameter);
      }
      // p5.redraw()
    };
    const setNumCirclesInputStyle = (): void => {
      numCirclesInput.style("background-color", "#121212");
      numCirclesInput.style("color", "#EEE");
      numCirclesInput.style("border-color", "#EEE");
      numCirclesInput.style("border-width", "1px");
      numCirclesInput.style("padding", "5px");
      numCirclesInputSize = 100;
      numCirclesInput.position(
        p5.width / 2 - numCirclesInputSize / 2,
        p5.height / 2 + 100
      );
      numCirclesInput.size(numCirclesInputSize);
      numCirclesInput.id("numCirclesInput");
      numCirclesInput.class("font-open-sans");
    };
    const setNumCirclesSliderStyle = (): void => {
      numCirclesSlider.style("width", `${numCirclesInput.width}px`);
      // numCirclesSlider.style('::-webkit-slider-thumb');

      numCirclesSlider.position(
        p5.width / 2 - numCirclesInputSize / 2,
        p5.height / 2 + 100 + 50
      );
      numCirclesSlider.id("numCircleSlider");
    };
    const setTempoInputStyle = (): void => {
      tempoInput.style("background-color", "#121212");
      tempoInput.style("color", "#EEE");
      tempoInput.style("border-color", "#EEE");
      tempoInput.style("border-width", "1px");
      tempoInput.style("padding", "5px");
      tempoInputSize = 100;
      tempoInput.position(
        p5.width / 2 - numCirclesInputSize / 2,
        p5.height / 2 + 200
      );
      tempoInput.size(numCirclesInputSize);
      tempoInput.id("tempoInput");
      tempoInput.class("font-open-sans");
    };

    const calculateCircleClicked = (): number => {
      const r: number = diameter / 2;
      const x: number = p5.mouseX;
      const y: number = p5.mouseY;

      for (let i = 0; i < numCircles; i++) {
        let leftHand: number =
          Math.pow(x - (p5.width / (numCircles + 1)) * (i + 1), 2) +
          Math.pow(y - p5.height / 2, 2);
        let rightHand: number = Math.pow(r, 2);
        if (leftHand < rightHand) {
          return i;
        }
      }
      return -1;
    };
    const populateCircleArrays = () => {
      circles = [];
      for (let i = 0; i < numCircles; i++) {
        const c =
          circleColors[i] == CircleColors.purple
            ? p5.color("#BB86FC")
            : p5.color("#03DAC6");
        p5.fill(c);
        let x = (p5.width / (numCircles + 1)) * (i + 1);
        let y = p5.height / 2;
        // console.log(`x: ${x}`)
        // console.log(`y: ${y}`)

        if (numCircles > 25) {
          diameter = 40;
        } else {
          diameter = 55;
        }
        circles.push(p5.circle(x, y, diameter));
      }
    };

    const initCircleColors = () => {
      circleColors = [];
      for (let i = 0; i < numCircles; i++) {
        circleColors.push(CircleColors.teal);
      }
      numCircles = circleColors.length;
      subdivisionsStore.set(numCircles);
      console.log(numCircles);
      console.log(circleColors);
      circleColorStore.set(circleColors);
      // p5.redraw();
    };

    const updateCircleColorsLen = () => {
      // console.log(prevNumCircles)
      if (prevNumCircles > numCircles) {
        for (let i = 0; i < prevNumCircles - numCircles; i++) {
          circleColors.pop();
        }
      } else if (prevNumCircles < numCircles) {
        for (let i = 0; i < numCircles - prevNumCircles; i++) {
          circleColors.push(CircleColors.teal);
        }
      }
      numCircles = circleColors.length;
      subdivisionsStore.set(numCircles);
      console.log(numCircles);
      console.log(circleColors);
      circleColorStore.set(circleColors);

      // p5.redraw();
    };
    const updateTempo = () => {
      tempo = Number(tempoInput.value());
      tempoStore.set(tempo);

      p5.redraw;
    };

    const invertCircleColor = (i: number) => {
      if (circleColors[i] === CircleColors.purple) {
        circleColors[i] = CircleColors.teal;
      } else {
        circleColors[i] = CircleColors.purple;
      }
      // p5.redraw();
    };
  };
</script>

<P5 {sketch} />
<Metronome />
