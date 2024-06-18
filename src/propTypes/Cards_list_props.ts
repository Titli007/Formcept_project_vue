export interface Data {
    fc_name: string;
    fc_ns: string;
    fc_ts: number;
}

export interface Filter{
  value: string; //search query
}

export interface Sort{
  sort: string; //asc or sec
  key : string //fc_ts or fc_name
}

export interface Group_by{
  key : string //fc_ts or fc_name
}
