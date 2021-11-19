import { Popover } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './ErrorForm.less';
export interface ErrorField {
  name: (string | number)[];
  errors: string[];
}
const getErrorInfo = (errors: ErrorField[]) => {
  const errorCount = errors.filter((item) => item.errors.length > 0).length;
  if (!errors || errorCount === 0) {
    return null;
  }
  const scrollToField = (fieldKey: string) => {
    const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
    if (labelNode) {
      labelNode.scrollIntoView(true);
    }
  }
  const errorList = errors.map((err) => {
    if (!err || err.errors.length === 0) {
      return null;
    }
    const key = err.name[ 0 ] as string;
    return (
      <li key={ key } className={ styles.errorListItem } onClick={ () => scrollToField(key) }>
        <CloseCircleOutlined className={ styles.errorIcon } />
        <div className={ styles.errorMessage }>{ err.errors[ 0 ] }</div>
      </li>
    );
  })
  return (
    <span className={ styles.errorIcon }>
      <Popover
        title="表单校验信息"
        content={ errorList }
        overlayClassName={ styles.errorPopover }
        trigger="click"
        getPopupContainer={ (trigger: HTMLElement) => {
          if (trigger && trigger.parentNode) {
            return trigger.parentNode as HTMLElement;
          }
          return trigger;
        } }
      >
        <CloseCircleOutlined />
      </Popover>
      {errorCount }
    </span>
  );
}
export default getErrorInfo