export interface SplittableHierarchy {
  split: (root: string, subdeck: string) => void;
  merge: (root: string, subdeck: string) => void;
}
