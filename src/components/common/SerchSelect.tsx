import { Select, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { fetchDicTypeSelect, queryDictionaryParentId } from '@/pages/admin/Dictionary/service'
interface SelectOptionProps {
  state: {
    type: any;
  };
  value?: string;
  onChange?: (value: string | undefined) => void;
}
interface OptionProps {
  label: React.ReactNode;
  value: any;
}
const SearchSelect: React.FC<SelectOptionProps> = (props) => {
  const { state, value, onChange } = props;
  const [ innerOptions, setOptions ] = useState<OptionProps[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false)
  useEffect(() => {
    setLoading(true);
    onChange(undefined);
    const { type } = state || {};
    if (type) {
      queryDictionaryParentId(type).then(async (res: any) => {
        await setOptions([]);
        setOptions(res);
        setLoading(false);
      });
    } else {
      setOptions([]);
      setLoading(false);
    }

  }, [ JSON.stringify(state) ]);
  return (
    <Spin spinning={ loading }>
      <Select options={ innerOptions } value={ value } onChange={ onChange } />
    </Spin>
  )
};

export default SearchSelect