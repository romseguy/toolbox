import { Heading, Button, Box, Flex } from "@chakra-ui/react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { Html } from "react-konva-utils";

const Base = () => {
  const m = 5;
  const h = 160;
  const w1a = 70;
  const w1b = 415 - m;
  const w2b = 475 - m;
  return (
    <Stage width={500} height={h}>
      <Layer>
        <Line
          points={[w1a, 0, m, h, w2b, h, w1b, 0]}
          fill="white"
          stroke="black"
          strokeWidth={1}
          closed
        />
        <Text
          x={500 / 2}
          y={15}
          text="L'estime de soi"
          fontSize={30}
          //fontFamily="Calibri"
          fill="green"
          offsetX={110} // Approximate half width
        />
        <Html>
          <Flex flexDirection="column" mt={12} ml={120}>
            <Heading size="xs">L'opinion que l'on a de soi-même...</Heading>
            <Button colorScheme="green" variant="solid" size="xs" mt={3}>
              Cliquez ici pour en savoir plus
            </Button>
          </Flex>
        </Html>
      </Layer>
    </Stage>
  );
};

export default Base;
