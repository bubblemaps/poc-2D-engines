import { useRef, useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import * as d3 from "d3-force";
const CollisionDetectionFG = () => {
  const fgRef = useRef();

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const fg = fgRef.current;

    // Deactivate existing forces
    fg.d3Force("center", null);
    fg.d3Force("charge", null);

    // Add collision and bounding box forces
    fg.d3Force("collide", d3.forceCollide(4));
    fg.d3Force("box", () => {
      const SQUARE_HALF_SIDE = N * 2;

      nodes.forEach((node) => {
        const x = node.x || 0,
          y = node.y || 0;

        // bounce on box walls
        if (Math.abs(x) > SQUARE_HALF_SIDE) {
          node.vx *= -1;
        }
        if (Math.abs(y) > SQUARE_HALF_SIDE) {
          node.vy *= -1;
        }
      });
    });

    // Generate nodes
    const N = 80;
    const nodes = [...Array(N).keys()].map(() => ({
      // Initial velocity in random direction
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1
    }));

    setGraphData({ nodes, links: [] });
  }, []);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      cooldownTime={Infinity}
      d3AlphaDecay={0}
      d3VelocityDecay={0}
    />
  );
};

export default CollisionDetectionFG;
