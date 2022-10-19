import { moduleByIdResponseResult } from '../module/type';
import { versionByIdResponseResult } from '../version/type';

export interface interfaceModalDataProps {
  interfaceAddress: string;
  interfaceUse: string;
  module: moduleByIdResponseResult[];
  parameter: string[];
  person?: string;
  remarks?: string;
  version: versionByIdResponseResult[];
}

export interface interfaceByIdResponseResult extends interfaceModalDataProps {
  _id: string;
  data: string;
}

/**
 * 规则库类型
 */
export interface rulesModalProps {
  editId?: string | undefined;
  visible: boolean;
  interfaceList?: Array<{
    _id: string;
    url: string;
  }>;
  setVisibleRules: (data: boolean) => void;
  onOk?: () => void;
}

export interface rulesModalDataProps {
  ruleName: string;
  interfaceList: Array<{
    _id: string;
    url: string;
  }>;
  remark?: string;
  person?: string;
}

export interface rulesByIdResponseResult extends rulesModalDataProps {
  _id: string;
  data: string;
}
