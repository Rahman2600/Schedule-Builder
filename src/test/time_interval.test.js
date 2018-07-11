import TimeInterval from '../utilities/time_interval';
import Time from '../utilities/time';

test('constructs time interval properly', () => {
  let t1 = new Time(4, 0);
  let t2 = new Time(5, 0);
  let interval = new TimeInterval(t1, t2);
  expect(interval.startTime.compareTo(t1)).toBe(0);
  expect(interval.endTime.compareTo(t2)).toBe(0);
})

test("works when interval doesn't overlap", () => {
  let t1 = new Time(4, 0);
  let t2 = new Time(5, 0);
  let t3 = new Time(1, 30);
  let t4 = new Time(3, 30);

  let intA = new TimeInterval(t1, t2);
  let intB = new TimeInterval(t3, t4);

  expect(intA.intersectsWith(intB)).toBe(false);
  expect(intB.intersectsWith(intA)).toBe(false);
});

test("works when intervals intersect", () => {
  let t1 = new Time(4, 0);
  let t2 = new Time(5, 0);
  let t3 = new Time(4, 30);
  let t4 = new Time(5, 30);

  let intA = new TimeInterval(t1, t2);
  let intB = new TimeInterval(t3, t4);

  expect(intA.intersectsWith(intB)).toBe(true);
  expect(intB.intersectsWith(intA)).toBe(true);
});

test("length works correctly", () => {
  let t1 = new Time(4, 0);
  let t2 = new Time(5, 0);
  let t3 = new Time(4, 30);
  let t4 = new Time(5, 30);

  let intA = new TimeInterval(t1, t2);
  let intB = new TimeInterval(t3, t4);
  let intC = new TimeInterval(t1, t4);
  let intD = new TimeInterval(t3, t2);

  expect(intA.length()).toBe(60);
  expect(intB.length()).toBe(60);
  expect(intC.length()).toBe(90);
  expect(intD.length()).toBe(30);
})
