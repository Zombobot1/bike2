import './cards-types.scss';
import React from 'react';
import { CardTypeInPieChart } from '../types';
import CardsTypesPie from '../graphs/cards-types-pie';

export interface CardsTypesP {
  data: CardTypeInPieChart[];
}

const CardsTypes = ({ data }: CardsTypesP) => {
  return (
    <div className="col-3 me-3 cards-types">
      <h3 className="overview__subheader">Cards types</h3>
      <div className="cards-types-pie-container">
        <CardsTypesPie data={data} />
      </div>
    </div>
  );
};

export default CardsTypes;
