import {increment, decrement, getNearestDate} from './App';

describe('getNearestDate', () => {
  const imageDates = [
    '2021-01-19',
    '2020-12-18',
    '2020-11-18',
    '2020-10-16',
    '2020-09-15',
    '2020-08-19',
    '2020-07-18',
    '2020-06-16',
    '2020-05-15',
    '2020-04-19',
    '2020-03-18',
    '2020-02-16',
    '2020-01-20',
  ];
  test('If exact match exists, return most recent birthday and empty string', () => {
    const birthdate = '1960-12-18';
    expect(getNearestDate(birthdate, imageDates)).toEqual(['2020-12-18', '']);
  })
  test('If exact match does not exist, return closest match after most recent birthday and human readable version of closest match', () => {
    const birthdate = '1960-12-25';
    expect(getNearestDate(birthdate, imageDates)).toEqual(['2021-01-19', '01-19-2021']);
  })
})

describe('increment and decrement', () => {
  const cycle = 3;
  test('increment from index 0', () => {
    expect(increment(0, cycle)).toBe(1);
  })
  test('increment from index 2', () => {
    expect(increment(2, cycle)).toBe(0);
  })
  test('decrement from index 0', () => {
    expect(decrement(0, cycle)).toBe(2);
  })
  test('decrement from index 2', () => {
    expect(decrement(2, cycle)).toBe(1);
  })

})

