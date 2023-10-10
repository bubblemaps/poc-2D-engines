import { ForceGraph2D } from "react-force-graph";
import { useEffect, useState } from "react";
import getData from "./data/index";
// import SmallData from "./data/miserables.json";
import { MasterJSON } from "types";

function App() {
  const [nbWallets, setNbWallets] = useState(1000);
  const [nbTransactions, setNbTransactions] = useState(10);
  const [data, setData] = useState<MasterJSON>();

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

  const updateData = async () => {
    console.log("updateData", { nbWallets, nbTransactions });
    const newData = await getData(nbWallets, nbTransactions);
    setData(newData);
  };

  return (
    <div style={{ padding: "20px" }}>
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
        <ForceGraph2D
          graphData={data}
          linkDirectionalParticles={"value"}
          linkDirectionalParticleSpeed={(d) => d.value * 0.001}
        />
      )}
    </div>
  );
}

export default App;
