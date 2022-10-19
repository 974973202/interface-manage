export interface moduleModalDataProps {
  moduleName: string;
  remarks: number;
  person: string;
}

export interface moduleByIdResponseResult extends moduleModalDataProps {
  _id: string;
  data: string;
}
