import { moduleByIdResponseResult } from '../module/type';

export interface versionModalDataProps {
  version: string;
  module: Array<moduleByIdResponseResult>;
  person: string;
  remarks: string;
}

export interface versionByIdResponseResult extends versionModalDataProps {
  _id: string;
  data: string;
}
