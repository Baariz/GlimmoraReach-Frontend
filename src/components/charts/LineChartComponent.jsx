import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LineChartComponent({ data, lines, height = 300 }) {
  const defaultLines = [
    { dataKey: 'impressions', color: '#6b4d3d', name: 'Impressions' },
    { dataKey: 'clicks', color: '#8b6d5d', name: 'Clicks' },
    { dataKey: 'conversions', color: '#d4a574', name: 'Conversions' },
  ];

  const chartLines = lines || defaultLines;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickFormatter={(val) => {
            const d = new Date(val);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          formatter={(value) => value.toLocaleString()}
        />
        <Legend />
        {chartLines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            name={line.name}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: line.color }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
