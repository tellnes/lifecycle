import { Disposer, DisposerSet } from '../';

type MaybeCounter = {
  count?: () => void;
};

describe('DisposerSet', () => {
  test('basics', () => {
    const disposables = new DisposerSet();

    let counter = 0;
    const funcs: MaybeCounter = {
      count: () => {
        counter += 1;
      },
    };

    const doCount = () => {
      if (funcs.count) {
        funcs.count();
      }
    };

    disposables.push(
      new Disposer(() => {
        delete funcs.count;
      }),
    );

    expect(disposables.disposed).toEqual(false);
    doCount();
    expect(counter).toEqual(1);
    doCount();
    expect(counter).toEqual(2);

    disposables.dispose();

    expect(disposables.disposed).toEqual(true);
    doCount();
    expect(counter).toEqual(2);
  });

  test('is removed from set if externally disposed', () => {
    const disposables = new DisposerSet();

    const disposer = new Disposer(() => void 0);

    disposables.push(disposer);
    expect(disposables.disposed).toEqual(false);

    disposer.dispose();
    expect(disposables.disposed).toEqual(true);
  });
});
