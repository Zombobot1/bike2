import { Datum, ResponsiveLine } from '@nivo/line';
import React from 'react';
import { LineGraph } from '../types';
import { lineGraphTicks } from '../utils';
import { COLORS } from '../../../../config';
import { transformedMax } from '../../../../utils/algorithms';

const CardsPerDayLine = ({ data }: LineGraph) => {
  const dataMax = transformedMax(data[0].data, (e: Datum) => e.y) * 1.1;
  const ticks = lineGraphTicks(dataMax, 5, 5);
  return (
    <ResponsiveLine
      data={data}
      colors={[COLORS.secondary]}
      margin={{ top: 15, right: 15, bottom: 30, left: 30 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 0, max: dataMax }}
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
      yFormat={(value) => 'viewed cards ' + value}
      xFormat={(value) => 'date ' + value}
      enableGridX={false}
      gridYValues={ticks}
      lineWidth={5}
      pointSize={10}
      pointColor="#303250"
      useMesh={true}
    />
  );
};

export default CardsPerDayLine;
