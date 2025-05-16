import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

import { getDataFromUnix } from "../../utils/unixTimeConverter/getDataFromUnix";

import s from "../../components/Wallet/Wallet.module.css";

export const CreateWalletLineTokenGraph = (props) => {
  if (props.graphDataIsFetching === false) {
    let data = [];
    for (let i = 0; i < props.graphData.length; i++) {
      data.push({
        time: `${getDataFromUnix(props.graphData[i][0])}`,
        priceChange: `${props.graphData[i][1]}`,
      });
    }
    return (
      <div className={`${s.wallet_right__line_graph}`}>
        <div className={s.wallet_right__title}>{props.currentSymbol}</div>
        <LineChart
          width={700}
          height={425}
          data={data}
          margin={{ top: 5, right: 25, left: 15, bottom: 5 }}
        >
          <CartesianGrid stroke="#8f8383" />
          <XAxis dataKey="time" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Legend width={700} />
          <Line type="monotone" dataKey="priceChange" stroke="#ccc" />
        </LineChart>
      </div>
    );
  }
};
