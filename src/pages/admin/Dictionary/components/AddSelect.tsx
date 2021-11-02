// import { Select, Spin } from 'antd';
import React from 'react';
import { queryDictionaryParentId } from '@/pages/admin/Dictionary/service'
import { ProFormSelect } from '@ant-design/pro-form'
import { OptionProps } from './ModalModifyForm'
interface SelectProps {
  name: string;
  label: string;
  option: OptionProps[];
  value: string;
  formRefCurrent: any;
  isControlType: boolean;
  onChange?: (value: string) => void;
  addSelect: any[];
  handleAddSelect: React.Dispatch<React.SetStateAction<any[]>>;
}
const AddSelect: React.FC<SelectProps> = (props) => {
  const { name, label, option, value, formRefCurrent, isControlType, addSelect, handleAddSelect } = props
  return (
    <ProFormSelect
      name={ name }
      label={ label }
      options={ option }
      placeholder={ `请选择${label}` }
      initialValue={ value }
      allowClear={ false }
      rules={ [
        {
          required: true,
          message: `请输入${label}`
        },
      ] }
      normalize={ (val, preVal, allVals) => {
        if (isControlType) {
          formRefCurrent.setFieldsValue({ "parentId": val });
        } else {
          handleAddSelect(addSelect.filter((item, index) => index === 0))
          queryDictionaryParentId(val).then(res => {
            let tmp = addSelect;
            tmp[ 1 ].option = res
            handleAddSelect(tmp);
            formRefCurrent.setFieldsValue({ "parentId": res[ 0 ] ? res[ 0 ].value : undefined, "addSelect-1": res[ 0 ] ? res[ 0 ].label : undefined });
          })
        }
        return val
      } }
    />
  )
};

export default AddSelect