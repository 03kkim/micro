<script lang="ts">
  import P5, {type Sketch, type p5} from "p5-svelte";
  import Metronome from "./Metronome.svelte";

  import circleColorStore from "../stores/circleColorStore.js"
  import tempoStore from "../stores/tempoStore";



  let diameter: number = 55;

  let numCirclesInput;
  let numCirclesInputSize: number;
  let numCircles: number;
  let prevNumCircles: number = numCircles;

  let tempoInput;
  let tempoInputSize;

  let circles = [];

  let circleColors: CircleColors[];
  circleColorStore.subscribe(data => {
    circleColors = data;
  });

  let tempo: number;
  tempoStore.subscribe(data => {
    tempo = data;
  })

  let canvas;

  enum CircleColors {
    teal,
    purple
  }

  const sketch: Sketch = (p5) => {
    
    p5.setup = () => {
      // https://www.youtube.com/watch?v=OIfEHD3KqCg
      canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
      canvas.position(0, 0);
      canvas.style('z-index', '-1')
      
      numCirclesInput = p5.createInput('').attribute('placeholder', 'Beats');
      setNumCirclesInputStyle();
      numCirclesInput.changed(updateCircleColorsLen)
      initCircleColors();

      tempoInput = p5.createInput('').attribute('placeholder', 'BPM');;
      setTempoInputStyle();
      tempoInput.changed(updateTempo)

      circleColorStore.set(circleColors)
      console.log(circleColors)

      

      p5.noLoop()
      
    };
    p5.draw = () => {
      prevNumCircles = numCircles;
      numCircles = Number(numCirclesInput.value());
      updateCircleColorsLen();
      updateTempo();
      p5.background('#121212');
      p5.fill('white')

      // let inputX = p5.width / 2 - numCirclesInputSize / 2;
      // let inputY =  p5.height / 2 + 100;
      // let inputHeight = numCirclesInput.size.height;
      // let inputWidth = numCirclesInput.size.width;
      // let midpointX = inputX + inputWidth + 30;
      // let midpointY = inputY + (inputHeight / 2)
      // p5.triangle(midpointX, inputHeight, midpointX + 10, midpointY, midpointX - 10, midpointY);
      // p5.triangle(inputX + 120, inputY + 40, inputX + 130, inputY + 20, inputX + 110, inputY + 20);
      populateCircleArrays();
      

      
    }
    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

      setNumCirclesInputStyle();
      setTempoInputStyle();
      p5.redraw();
    }

    p5.mousePressed = () => {
      let circleClicked = calculateCircleClicked();
      if (circleClicked != -1) {
        invertCircleColor(circleClicked);
      }
    }

    const setNumCirclesInputStyle = (): void => {
      numCirclesInput.style('background-color', "#121212")
      numCirclesInput.style( 'color', "#EEE")
      numCirclesInput.style( 'border-color', "#EEE")
      numCirclesInput.style( 'border-width', "1px")
      numCirclesInput.style( 'padding', "5px")
      numCirclesInputSize = 100;
      numCirclesInput.position(p5.width / 2 - numCirclesInputSize / 2, p5.height / 2 + 100);
      numCirclesInput.size(numCirclesInputSize)
      numCirclesInput.id('numCirclesInput');
      numCirclesInput.class('font-open-sans');
      
    }
    const setTempoInputStyle = (): void => {
      tempoInput.style('background-color', "#121212")
      tempoInput.style( 'color', "#EEE")
      tempoInput.style( 'border-color', "#EEE")
      tempoInput.style( 'border-width', "1px")
      tempoInput.style( 'padding', "5px")
      tempoInputSize = 100;
      tempoInput.position(p5.width / 2 - numCirclesInputSize / 2, p5.height / 2 + 200);
      tempoInput.size(numCirclesInputSize)
      tempoInput.id('tempoInput')
      tempoInput.class('font-open-sans');
      
    }

    const calculateCircleClicked = (): number => {
      const r: number = diameter / 2;
      const x: number = p5.mouseX;
      const y: number = p5.mouseY;

      for (let i = 0; i < numCircles; i++) {
        let leftHand: number = Math.pow(x - p5.width / (numCircles + 1) * (i+1), 2) + Math.pow(y - p5.height / 2, 2)
        let rightHand: number = Math.pow(r, 2)
        if ( leftHand < rightHand ) {
        return i;
        }
      }
      return -1
    }
    const populateCircleArrays = () => {
      circles = []
      for (let i = 0; i < numCircles; i++) {
        const c = circleColors[i] == CircleColors.purple ? p5.color("#BB86FC") : p5.color("#03DAC6")
        p5.fill(c);
        let x = (p5.width / (numCircles + 1)) * (i+1)
        let y = p5.height / 2
        // console.log(`x: ${x}`)
        // console.log(`y: ${y}`)
        
        if (numCircles > 25) {
          diameter = 40
        } else {
          diameter = 55
        }
        circles.push(p5.circle(x, y, diameter));
      }
    }

    const initCircleColors = () => {
      circleColors = [];
      for (let i = 0; i < numCircles; i++) {
      circleColors.push(CircleColors.teal);
      }
      numCircles = circleColors.length;
      console.log(numCircles)
      console.log(circleColors)
      circleColorStore.set(circleColors)
      p5.redraw();
    }

    const updateCircleColorsLen = () => {
      // console.log(prevNumCircles)
      if (prevNumCircles > numCircles) {
        for (let i = 0; i < prevNumCircles - numCircles; i++) {
          circleColors.pop();
        }
      } else if (prevNumCircles < numCircles) {
        for (let i = 0; i < numCircles - prevNumCircles; i++) {
          circleColors.push(CircleColors.teal)
        } 
      }
      numCircles = circleColors.length;
      console.log(numCircles)
      console.log(circleColors)
      circleColorStore.set(circleColors)
      
      
      p5.redraw();
    }
    const updateTempo = () => {
      tempo = Number(tempoInput.value());
      tempoStore.set(tempo);

      p5.redraw
    }

    const invertCircleColor = (i: number) => {
        if (circleColors[i] === CircleColors.purple) {
        circleColors[i] = CircleColors.teal;
        } else {
          circleColors[i] = CircleColors.purple
        }
        p5.redraw();
    }
  };
</script>



<P5 {sketch} />
<Metronome />