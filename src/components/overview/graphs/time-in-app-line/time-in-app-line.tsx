import { Datum, ResponsiveLine } from '@nivo/line';
import React from 'react';
import { LineGraph } from '../types';
import { lineGraphTicks } from '../utils';
import { COLORS } from '../../../../config';
import { transformedMax } from '../../../../utils/algorithms';

const TimeInAppLine = ({ data }: LineGraph) => {
  const max = transformedMax(data[0].data, (e: Datum) => e.y) * 1.1;
  const ticks = lineGraphTicks(max, 50, 4);
  return (
    <ResponsiveLine
      data={data}
      colors={[COLORS.tertiary]}
      enableArea={true}
      defs={[
        {
          id: 'gradientC',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: COLORS.tertiary },
            { offset: 100, color: COLORS.tertiary, opacity: 0 },
          ],
        },
      ]}
      fill={[{ match: '*', id: 'gradientC' }]}
      margin={{ top: 15, right: 15, bottom: 30, left: 30 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 0, max: max }}
      curve="natural"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickValues: ticks,
      }}
      yFormat={(value) => 'spent time ' + value}
      xFormat={(value) => 'date ' + value}
      enableGridY={false}
      enableGridX={false}
      lineWidth={2}
      useMesh={true}
    />
  );
};

export default TimeInAppLine;
