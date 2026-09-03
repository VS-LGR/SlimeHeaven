export interface AmbientInterestProfile {
  water: number;
  farming: number;
  nature: number;
  social: number;
  exploration: number;
  rest: number;
}

export const DEFAULT_AMBIENT_INTEREST: AmbientInterestProfile = {
  water: 3,
  farming: 3,
  nature: 3,
  social: 3,
  exploration: 3,
  rest: 3,
};

export const PINGO_AMBIENT_INTEREST: AmbientInterestProfile = {
  water: 5,
  farming: 2,
  nature: 4,
  social: 2,
  exploration: 5,
  rest: 2,
};

export const MOMO_AMBIENT_INTEREST: AmbientInterestProfile = {
  water: 2,
  farming: 5,
  nature: 5,
  social: 3,
  exploration: 2,
  rest: 5,
};

export const TITO_AMBIENT_INTEREST: AmbientInterestProfile = {
  water: 2,
  farming: 2,
  nature: 4,
  social: 5,
  exploration: 5,
  rest: 1,
};
