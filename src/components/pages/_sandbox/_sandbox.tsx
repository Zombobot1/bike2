import './_sandbox.scss';
import React from 'react';
import { OverdueType } from '../../notifications/notification/notification';
import { Overdue } from '../../icons/icons';
import { ReactComponent as Glasses } from './glasses.svg';
import { ReactComponent as Bookmark } from './bookmark.svg';
import { ReactComponent as Clocks } from '../icons/clocks-fill-up-icon.svg';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine, Serie, Datum } from '@nivo/line';
import { useInfo } from '../../info-provider/info-provider';
import NavBar from '../../navigation/navbar';
import Breadcrumb from '../../navigation/breadcrumb';
import Footer from '../../footer';

const fancyNumber = (n: number): string => {
  if (Math.floor(n / 1e3)) return `${Math.floor(n / 1e3)}.${('' + n)[1]}k`;
  return String(n);
};

type TrainingCardsInfoP = {
  toRepeat: number;
  toLearn: number;
};

const TrainingCardsInfo = ({ toRepeat, toLearn }: TrainingCardsInfoP) => {
  const repeatInfo = () => (
    <span>
      <Clocks />
      {fancyNumber(toRepeat)}
    </span>
  );
  const learnInfo = () => (
    <span>
      <Glasses />
      {fancyNumber(toLearn)}
    </span>
  );

  return (
    <span className="training-cards-number">
      {Boolean(toRepeat) && repeatInfo()} {Boolean(toLearn) && learnInfo()}
    </span>
  );
};

interface LastTrainingCardP extends DeckCard {
  overdue: OverdueType;
  trainingCardsInfo: TrainingCardsInfoP;
  editingDate: string;
}

const addS = (n: number) => {
  return String(n) !== '1' ? 's' : '';
};

const fancyDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const delta = Math.round((+new Date() - +date) / 1000);

  const minute = 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;

  const deltaMins = Math.floor(delta / minute);
  const deltaHrs = Math.floor(delta / hour);
  const deltaDays = Math.floor(delta / day);

  if (delta < 30) return 'now';
  if (delta < minute) return delta + ' secs ago';
  if (delta < hour) return `${deltaMins} min${addS(deltaMins)} ago`;
  if (delta < day) return `${deltaHrs} hr${addS(deltaHrs)} ago`;
  if (delta < day * 2) return 'yesterday';
  if (delta < week) return `${deltaDays} hr${addS(deltaDays)} ago`;
  return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const LastTrainingCard = ({ overdue, deckColor, deckName, editingDate, trainingCardsInfo }: LastTrainingCardP) => {
  return (
    <div className="last-training-card">
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <Overdue type={overdue} />
      <strong className="deck-name">{deckName}</strong>
      <TrainingCardsInfo {...trainingCardsInfo} />
      <span className="time">Trained: {fancyDate(editingDate)}</span>
    </div>
  );
};

interface LastReviewCardP extends DeckCard {
  reviewResult: number;
  reviewDate: string;
}

const percentage = (result: number) => Math.floor(result * 100) + '%'; // Result must be like 52%

const LastReviewCard = ({ deckName, deckColor, reviewDate, reviewResult }: LastReviewCardP) => {
  return (
    <div className="last-review-card">
      <Bookmark style={{ fill: deckColor }} />
      <strong className="deck-name">{deckName}</strong>
      <span className="review-result">{percentage(reviewResult)}</span>
      <span className="time">Reviewed: {fancyDate(reviewDate)}</span>
    </div>
  );
};

interface DeckProgressP extends DeckCard {
  progress: number;
}

const DeckProgress = ({ deckColor, deckName, progress }: DeckProgressP) => {
  return (
    <div className="deck-progress">
      <div className="d-flex justify-content-between">
        <span className="deck-name">{deckName}</span>
        <span className="progress-value">{percentage(progress)}</span>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: percentage(progress), backgroundColor: deckColor }} />
      </div>
    </div>
  );
};

type CardType = {
  id: string;
  value: number;
};

const chartColors = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.info];
const pieChartData = (cardTypes: CardType[]) => {
  cardTypes.sort((a, b) => b.value - a.value);
  return chartColors.map((e, i) => ({ ...cardTypes[i], color: e }));
};

const MyResponsivePie = ({ data }: { data: CardType[] }) => {
  const pieData = pieChartData(data);
  const total = sum(data, (p: number, e: CardType) => p + e.value);
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

const lineGraphTicks = (max: number, roundTo: number, tickStep: number) => {
  const result = [];
  const roundedMax = Math.ceil(max / roundTo) * roundTo;
  for (let i = 0; i < roundedMax; i += roundedMax / tickStep) result.push(Math.round(i));
  result.push(roundedMax);
  return result;
};

interface LineGraph {
  data: Serie[];
}

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

const TimeInAppLine = ({ data }: LineGraph) => {
  const max = transformedMax(data[0].data, (e: Datum) => e.y) * 1.1;
  const ticks = lineGraphTicks(max, 50, 4);
  console.log(ticks);
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

interface LastTrainingsP {
  lastTrainings: LastTrainingCardP[];
}

const LastTrainings = ({ lastTrainings }: LastTrainingsP) => {
  return (
    <div className="col-4 me-3 last-trainings">
      <div className="d-flex justify-content-between last-trainings__header">
        <h3 className="overview__subheader">Active trainings</h3>
        <button className="btn btn-sm btn-secondary">See all</button>
      </div>
      <div className="cards">
        {lastTrainings.map((e, i) => (
          <LastTrainingCard {...e} key={i} />
        ))}
      </div>
    </div>
  );
};

interface CardsPerDayP {
  data: Serie[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const avg = (arr: any, f: any): number => arr.reduce(f, 0) / arr.length;
const datumAvg = (arr: Datum[]) => avg(arr, (p: number, e: Datum) => p + Number(e.y));

const CardsPerDay = ({ data }: CardsPerDayP) => {
  return (
    <div className="col-7 me-3 cards-per-day">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Cards per day</h3>
        <h6 className="align-self-center">Average: {Math.floor(datumAvg(data[0].data))}</h6>
        <button className="btn btn-sm btn-primary">Study</button>
      </div>
      <div className="line-container">
        <CardsPerDayLine data={data} />
      </div>
    </div>
  );
};

interface DecksProgressP {
  deckProgresses: DeckProgressP[];
}

const DecksProgress = ({ deckProgresses }: DecksProgressP) => {
  return (
    <div className="col-5 me-3 decks-progress">
      <h3 className="overview__subheader">Decks progress</h3>
      <div className="progresses">
        {deckProgresses.map((e, i) => (
          <DeckProgress {...e} key={i} />
        ))}
      </div>
    </div>
  );
};
interface CardsTypesP {
  data: CardType[];
}
const CardsTypes = ({ data }: CardsTypesP) => {
  return (
    <div className="col-3 me-3 cards-types">
      <h3 className="overview__subheader">Cards types</h3>
      <div className="pie-container">
        <MyResponsivePie data={data} />
      </div>
    </div>
  );
};

interface LastEditedP {
  lastEditedCards: LastEditedCardP[];
}

const LastEdited = ({ lastEditedCards }: LastEditedP) => {
  return (
    <div className="col-3 me-3 last-edited">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Last edited</h3>
        <button className="btn btn-sm btn-secondary">See all</button>
      </div>
      <div className="cards">
        {lastEditedCards.map((e, i) => (
          <LastEditedCard {...e} key={i} />
        ))}
      </div>
    </div>
  );
};

interface TimeInAppP {
  data: Serie[];
}
const TimeInApp = ({ data }: TimeInAppP) => {
  return (
    <div className="col-9 me-3 time-in-app">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Time in application</h3>
        <h6 className="align-self-center">Average: 1.36</h6>
        <button className="btn btn-sm btn-primary">Schedule</button>
      </div>
      <div className="time-in-app-line-container">
        <TimeInAppLine data={data} />
      </div>
    </div>
  );
};

interface ReviewsP {
  lastReviews: LastReviewCardP[];
}
const Reviews = ({ lastReviews }: ReviewsP) => {
  return (
    <div className="col-2 reviews">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Reviews</h3>
        <button className="btn btn-sm btn-tertiary">See all</button>
      </div>
      <div className="cards">
        {lastReviews.map((e, i) => (
          <LastReviewCard {...e} key={i} />
        ))}
      </div>
    </div>
  );
};
export const Overview = () => {
  const info = useInfo();
  return (
    <div className="statistics container-fluid">
      <div className="row mb-3">
        <LastTrainings lastTrainings={info.overview.lastTrainings} />
        <CardsPerDay data={info.overview.cardsPerDayData} />
      </div>
      <div className="row mb-3">
        <DecksProgress deckProgresses={info.overview.deckProgresses} />
        <CardsTypes data={info.overview.cardsTypesData} />
        <LastEdited lastEditedCards={info.overview.lastEditedCards} />
      </div>
      <div className="row">
        <TimeInApp data={info.overview.timeInAppData} />
        <Reviews lastReviews={info.overview.lastReviews} />
      </div>
    </div>
  );
};

const Sandbox = () => {
  return (
    <>
      <NavBar />
      <main className="content-area">
        <Breadcrumb />
        <Overview />
        <Footer className="footer" />
      </main>
    </>
    // <div style={{ width: '100vw', height: '100vw', padding: '300px 300px', backgroundColor: 'white' }}>
    //
    // </div>
  );
};

export { Sandbox };
