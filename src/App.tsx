import ForceGraph2D, { NodeObject, LinkObject } from "react-force-graph-2d";
import { useCallback, useEffect, useRef, useState } from "react";
import getData from "./data/index";
// import SmallData from "./data/miserables.json";
import { GraphLink, GraphNode, MasterJSON } from "types";

const NODE_R = 6;
function App() {
  const [nbWallets, setNbWallets] = useState(500);
  const [nbTransactions, setNbTransactions] = useState(5);
  const [data, setData] = useState<MasterJSON>();

  const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<string>());
  const [hoverNode, setHoverNode] = useState<NodeObject<GraphNode>>();
  const [selectedNode, setSelectedNode] = useState<NodeObject<GraphNode>>();

  const fgRef = useRef();

  useEffect(
    () => {
      const fetchData = async () => {
        const newData = await getData(nbWallets, nbTransactions);
        setData(newData);
      };
      fetchData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // useEffect(() => {
  //   const fg = fgRef.current;

  //   if (!data || !fg) return;

  //   // Deactivate existing forces
  //   fg.d3Force("center", null);
  //   fg.d3Force("charge", null);

  //   // Add collision and bounding box forces
  //   fg.d3Force("collide", d3.forceCollide(NODE_R * 2));
  //   //   fg.d3Force(
  //   //     "center",
  //   //     d3
  //   //       .forceCenter(this.center_coords.x, this.center_coords.y)
  //   //       .strength(0.03)
  //   //   )
  //   //   .force(
  //   //     "radial",
  //   //     d3
  //   //       .forceRadial(
  //   //         function radius(d) {
  //   //           return get_node_default_r_coord(d);
  //   //         },
  //   //         this.center_coords.x,
  //   //         this.center_coords.y
  //   //       )
  //   //       .strength(0.005)
  //   //   )
  //   //   .force("link", d3.forceLink(this.graph.links).distance(50).strength(0.5));
  // }, [data]);

  const updateData = async () => {
    const newData = await getData(nbWallets, nbTransactions);
    setData(newData);
  };

  const handleNodeHover = (node: NodeObject<NodeObject<GraphNode>> | null) => {
    const newHighlightLinks = new Set<string>();
    const newHighlightNodes = new Set<string>();

    if (node) {
      newHighlightNodes.add(node.id);
      for (const neighbour of node.neighbours) {
        newHighlightNodes.add(neighbour);
      }
      for (const link of node.links) {
        newHighlightLinks.add(link.id);
      }
    }

    setHoverNode(node ?? undefined);

    setHighlightLinks(newHighlightLinks);
    setHighlightNodes(newHighlightNodes);

    console.log("node", node);
  };

  const handleLinkHover = (
    link: LinkObject<
      NodeObject<GraphNode>,
      LinkObject<GraphNode, GraphLink>
    > | null
  ) => {
    const newHighlightLinks = new Set<string>();
    const newHighlightNodes = new Set<string>();

    if (link) {
      newHighlightLinks.add(link.id);
      newHighlightNodes.add(
        typeof link.source === "string" ? link.source : link.source.id
      );
      newHighlightNodes.add(
        typeof link.target === "string" ? link.target : link.target.id
      );
    }

    setHighlightLinks(newHighlightLinks);
    setHighlightNodes(newHighlightNodes);
  };

  const handleClick = (node: NodeObject<NodeObject<GraphNode>> | null) => {
    if (!node) {
      setHighlightLinks(new Set<string>());
      setHighlightNodes(new Set<string>());
      setSelectedNode(undefined);
      return;
    }

    const newHighlightLinks = new Set<string>();
    const newHighlightNodes = new Set<string>();

    newHighlightNodes.add(node.id);
    for (const neighbour of node.neighbours) {
      newHighlightNodes.add(neighbour);
    }
    for (const link of node.links) {
      newHighlightLinks.add(link.id);
    }

    setHighlightLinks(newHighlightLinks);
    setHighlightNodes(newHighlightNodes);
    setSelectedNode(node);

    // Center/zoom on node
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fg = fgRef.current as any;
    if (fg) {
      fg.centerAt(node.x, node.y, 1000);
      fg.zoom(2, 2000);
    }
  };

  // S = Pi * r²
  // S = node.val * NODE_R² * Pi
  // r = sqrt(S / Pi)
  // r = sqrt(node.val * NODE_R²)

  const paintNodes = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: NodeObject<GraphNode> | null, ctx: any) => {
      if (!node) return;
      const nodeRadius = Math.sqrt(node.val * NODE_R * NODE_R);
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3 + nodeRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle =
        hoverNode === node
          ? "red"
          : highlightNodes.has(node.id)
          ? "orange"
          : selectedNode === node
          ? "green"
          : "blue";
      ctx.fill();
    },
    [hoverNode, highlightNodes, selectedNode]
  );

  return (
    <div
      style={{
        padding: "20px",
        height: window.innerHeight,
        width: window.innerWidth,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <p>
          You can{" "}
          <a
            target="_blank"
            href="https://gilfink.medium.com/quick-tip-using-the-chrome-devtools-fps-meter-1bb400b63f7"
          >
            turn on the FPS-meter from Chromium{" "}
          </a>{" "}
          easily to have an idea of the performance
        </p>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",

            alignItems: "center",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <label htmlFor="nbWallets">Number of wallets</label>
            <input
              id="nbWallets"
              type="number"
              value={nbWallets}
              max={10000}
              onChange={(e) => setNbWallets(parseInt(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <label htmlFor="nbTransactions">
              Number of transactions MAX per wallet
            </label>
            <input
              max={100}
              id="nbTransactions"
              type="number"
              value={nbTransactions}
              onChange={(e) => setNbTransactions(parseInt(e.target.value))}
            />
          </div>
          <div style={{}}>
            <button onClick={updateData}>Update data</button>
          </div>
        </div>
      </div>

      {data && data?.links?.length > 0 && data?.nodes?.length > 0 && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <ForceGraph2D
            width={window.innerWidth - 50}
            height={window.innerHeight * 0.9}
            ref={fgRef}
            graphData={data}
            nodeRelSize={NODE_R}
            autoPauseRedraw={false}
            nodeLabel={(node) => "Wallet n° " + node.id}
            linkLabel={(link) => {
              return `${
                typeof link.source === "string" ? link.source : link.source.id
              } sent ${link.value}ETH to ${
                typeof link.target === "string" ? link.target : link.target.id
              } on ${link.date}`;
            }}
            linkWidth={(link) => (highlightLinks.has(link.id) ? 4 : 3)}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={(link) =>
              highlightLinks.has(link.id) ? 6 : 4
            }
            linkDirectionalParticleColor={(link) =>
              highlightLinks.has(link.id) ? "orange" : "gray"
            }
            linkDirectionalParticleSpeed={(link) => link.value * 0.001}
            // nodeCanvasObjectMode="replace"
            nodeCanvasObject={paintNodes}
            onNodeHover={handleNodeHover}
            onLinkHover={handleLinkHover}
            d3VelocityDecay={0.01}
            onNodeClick={handleClick}
            // d3Force={(graphData) => {
            //   return d3
            //     .forceSimulation(graphData.nodes)
            //     .force(
            //       "link",
            //       d3.forceLink(graphData.links).id((d) => d.id)
            //     )
            //     .force("charge", d3.forceManyBody().strength(-300))
            //     .force("center", d3.forceCenter(0, 0))
            //     .force("collide", d3.forceCollide(NODE_R * 2));
            // }}
            onNodeDragEnd={(node) => {
              node.fx = node.x;
              node.fy = node.y;
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
