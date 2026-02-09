import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BarChartComponent({ data, bars, height = 300, layout = 'horizontal' }) {
  const defaultBars = [
    { dataKey: 'value', color: '#6b4d3d', name: 'Value' },
  ];

  const chartBars = bars || defaultBars;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        {layout === 'horizontal' ? (
          <>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          </>
        ) : (
          <>
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6b7280' }} width={100} />
          </>
        )}
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          formatter={(value) => value.toLocaleString()}
        />
        <Legend />
        {chartBars.map((bar) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.color} name={bar.name} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
