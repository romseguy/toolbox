import { Layer, Line, Rect, Stage, Text } from "react-konva";

const Trapeze = () => {
  const m = 5;
  const h = 160;
  const w1a = 80;
  const w1b = 280;
  const w2b = 350 - m;
  return (
    <Stage width={370} height={h}>
      <Layer>
        <Line
          points={[w1a, 0, m, h, w2b, h, w1b, 0]}
          fill="white"
          stroke="black"
          strokeWidth={1}
          closed
        />
      </Layer>
    </Stage>
  );
};

export default Trapeze;
