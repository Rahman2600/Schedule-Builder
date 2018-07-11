import Time from '../utilities/time';

test('constructs time properly', () => {
  let t = new Time(8, 30);
  expect(t.hour).toBe(8);
  expect(t.minute).toBe(30);
})

test("compareTo correct for same time", () => {
      let t1 = new Time(4, 0);
      let t2 = new Time(4, 0);
      let t3 = new Time(6, 0);
      let t4 = new Time(6, 0);
      expect(t1.compareTo(t2)).toBe(0);
      expect(t2.compareTo(t1)).toBe(0);
      expect(t3.compareTo(t4)).toBe(0);
      expect(t4.compareTo(t3)).toBe(0);
});

test("compareTo correct for same minute, different hours", () => {
      let t1 = new Time(4, 0);
      let t2 = new Time(5, 0);
      let t3 = new Time(10, 0);
      let t4 = new Time(11, 0);
      expect(t1.compareTo(t2)).toBe(-1);
      expect(t2.compareTo(t1)).toBe(1);
      expect(t3.compareTo(t4)).toBe(-1);
      expect(t4.compareTo(t3)).toBe(1);
    })

test("compareTo correct for same hour, different minutes", () => {
  let t1 = new Time(4, 0);
  let t2 = new Time(4, 30);
  let t3 = new Time(5, 0);
  let t4 = new Time(5, 30);
  expect(t1.compareTo(t2)).toBe(-1);
  expect(t2.compareTo(t1)).toBe(1);
  expect(t3.compareTo(t4)).toBe(-1);
  expect(t4.compareTo(t3)).toBe(1);
})

test("compareTo correct for different hour, different minutes", () => {
  let t1 = new Time(3, 30);
  let t2 = new Time(4, 30);
  let t3 = new Time(5, 0);
  let t4 = new Time(5, 30);
  expect(t1.compareTo(t2)).toBe(-1);
  expect(t2.compareTo(t1)).toBe(1);
  expect(t3.compareTo(t4)).toBe(-1);
  expect(t4.compareTo(t3)).toBe(1);
})

test("next returns right time when minute is 0", () => {
  let t1 = new Time(8, 0);
  let expected = new Time(8, 30);
  expect(t1.next().compareTo(expected)).toBe(0);
})

test("next returns right time when minute is 30", () => {
  let t1 = new Time(8, 30);
  let expected = new Time(9, 0);
  expect(t1.next().compareTo(expected)).toBe(0);
})
