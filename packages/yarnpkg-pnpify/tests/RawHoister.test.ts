import {RawHoister, PackageTree} from '../sources/RawHoister';

const toTree = (obj: Record<string, number[]>) => new Map(
  Object.entries(obj).map(
    tuple => [Number(tuple[0]), new Set(tuple[1])]
  )
);

const toObject = (tree: PackageTree): Record<string, number[]> =>
  [...tree.entries()].reduce((obj: Record<string, number[]>,
    [key, value]) => (obj[key] = [...value].sort(), obj), {});

describe('RawHoister', () => {
  const hoister = new RawHoister();

  it('should do very basic hoisting', () => {
    const tree = toTree({
      0: [1],
      1: [2],
    });
    const packageMap = new Map([
      [0, {name: 'app', weight: 1}],
      [1, {name: 'webpack', weight: 1}],
      [2, {name: 'watchpack', weight: 1}],
    ]);
    const result = hoister.hoist(tree, packageMap);
    expect(toObject(result)).toEqual({0: [1, 2]});
  });

  it('should not hoist different package with the same name', () => {
    const tree = toTree({
      0: [1, 3],
      1: [2],
    });
    const packageMap = new Map([
      [0, {name: 'app', weight: 1}],
      [1, {name: 'webpack', weight: 1}],
      [2, {name: 'watchpack', weight: 1}],
      [3, {name: 'watchpack', weight: 1}],
    ]);
    const result = hoister.hoist(tree, packageMap);
    expect(toObject(result)).toEqual({0: [1, 3], 1: [2]});
  });

  it('should not hoist package that has several versions on the same tree path', () => {
    // . → A → B@X → C → B@Y, B@Y should not be hoisted
    const tree = toTree({
      0: [1],
      1: [2],
      2: [3],
      3: [4],
    });
    const packageMap = new Map([
      [0, {name: 'R', weight: 1}],
      [1, {name: 'A', weight: 1}],
      [2, {name: 'B', weight: 1}],
      [3, {name: 'C', weight: 1}],
      [4, {name: 'B', weight: 100}],
    ]);
    const result = hoister.hoist(tree, packageMap);
    expect(toObject(result)).toEqual({0: [1, 2, 3], 3: [4]});
  });

  it('should perform deep hoisting', () => {
    const tree = toTree({
      0: [1, 3, 4],
      1: [2, 4],
      2: [5],
    });
    const packageMap = new Map([
      [0, {name: 'app', weight: 1}],
      [1, {name: 'webpack', weight: 1}],
      [2, {name: 'watchpack', weight: 1}],
      [3, {name: 'watchpack', weight: 1}],
      [4, {name: 'lodash', weight: 1}],
      [5, {name: 'lodash', weight: 1}],
    ]);
    const result = hoister.hoist(tree, packageMap);
    expect(toObject(result)).toEqual({0: [1, 3, 4], 1: [2, 5]});
  });

  it('should honor weight when hoisting', () => {
    const tree = toTree({
      0: [1],
      1: [2, 3, 5],
      2: [4],
      5: [4],
    });
    const packageMap = new Map([
      [0, {name: 'app', weight: 1}],
      [1, {name: 'webpack', weight: 1}],
      [2, {name: 'watchpack', weight: 1}],
      [3, {name: 'lodash', weight: 3}],
      [4, {name: 'lodash', weight: 1}],
      [5, {name: 'enhanced-resolve', weight: 1}],
    ]);
    const result = hoister.hoist(tree, packageMap);
    expect(toObject(result)).toEqual({0: [1, 2, 3, 5], 2: [4], 5: [4]});
  });
});