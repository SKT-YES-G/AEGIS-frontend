// types/auth.ts

export type LoginRequest = {
  name: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  fireStation: FireStationInfo;
};

export type FireStationInfo = {
  id?: number;
  name: string;
};

export type FireStationSearchItem = {
  id: number;
  name: string;
};
