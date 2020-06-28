export interface Training {
  id: string;
  serviceName: string;
  serviceUrl: string;
  authType: string;
  requestContent: string;
  responseContent: string;
  creator: string;
}

export interface TrainedData {
  ServiceName: string;
  Priotize: string;
  Update: string;
  Delete: string;
}

export interface Rankers {
  operation: string;
  data: RankerData[];
}

export interface RankerData {
  name: string;
  rank: string;
  uniqueValues: string[];
}

export interface TrainingInfo {
  service: string;
  authorization: Authorization;
  request: Request;
  response: Response;
}

export interface ActionType {
  value: string;
  viewValue: string;
}

export interface Request {
  headers: Headers;
  raw_data: any;
}

export interface Response {
  headers: Headers;
  raw_data: any;
}

export interface Authorization {
  authType: string;
  username: string;
  password: string;
  tokenkey: string;
  tokenValue: string;
}

export interface Headers {
  actionType: string;
  soapAction: string;
  method: string;
}
