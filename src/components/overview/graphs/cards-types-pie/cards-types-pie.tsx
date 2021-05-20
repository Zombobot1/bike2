import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import { COLORS } from '../../../../config';
import { CardTypeInPieChart } from '../../types';
import { sum } from '../../../../utils/algorithms';

const chartColors = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.info];
const pieChartData = (cardTypes: CardTypeInPieChart[]) => {
  cardTypes.sort((a, b) => b.value - a.value);
  return chartColors.map((e, i) => ({ ...cardTypes[i], color: e }));
};

export interface PieP {
  data: CardTypeInPieChart[];
}

const CardsTypesPie = ({ data }: PieP) => {
  const pieData = pieChartData(data);
  const total = sum(data, (p: number, e: CardTypeInPieChart) => p + e.value);
  return (
    <ResponsivePie
      data={pieData}
      theme={{ fontSize: 14, textColor: COLORS.primary }}
      margin={{ top: 5, right: 155, bottom: 5, left: 5 }}
      innerRadius={0.5}
      enableRadialLabels={false}
      padAngle={0.7}
      cornerRadius={5}
      colors={chartColors}
      sliceLabel={(d) => Math.round((d.value / total) * 100) + '%'}
      sliceLabelsSkipAngle={10}
      sliceLabelsTextColor="white"
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          translateX: 120,
          translateY: 0,
          itemsSpacing: 5,
          itemWidth: 100,
          itemHeight: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: COLORS.info,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default CardsTypesPie;
