import { Layer, Line, Rect, Stage, Text } from "react-konva";

const Triangle = () => {
  const b1 = 25;
  const b2 = 290;
  const h = 170;
  return (
    <Stage width={260} height={h}>
      <Layer>
        <Line
          points={[b1, h, b2, b2, 135, 0]}
          fill="white"
          stroke="black"
          strokeWidth={1}
          closed
        />
      </Layer>
    </Stage>
  );
};

export default Triangle;
