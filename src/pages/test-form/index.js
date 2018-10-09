import React, {Component} from 'react';

import { FormLayout, Loading } from 'ukelli-ui';
// import { ActionTestForm } from '../action-refs';
import { Services } from "../action-refs";

/**
 * 说明
 * submiting 是否提交中
 * querying  如果需要异步获取表单条件的，需要用 Loading 包装一层，并且 !querying 的时候渲染 FormLayout
 */
export default class TestForm extends Services {
  
  constructor(props) {
    super(props);

    this.formOptions = this.getForms('hideDemo', 'inputDemo', 'pwDemo', 'selectDemo', 'radioDemo');
  }
  btnConfig = [
    {
      action: async (formRef, actingRef) => {
        if(!this.checkForm(formRef)) return;

        let postData = {
          ...formRef.value,
        };
        const agentOptions = {
          actingRef
        };
        await this.reqAgent(this.apis.testSubmit, agentOptions)(postData);
      },
      text: '按钮1',
      actingRef: 'acting1',
      className: 'theme'
    },
    {
      action: async (formRef, actingRef) => {
        if(!this.checkForm(formRef)) return;

        let postData = {
          ...formRef.value,
        };
        const agentOptions = {
          actingRef
        };
        await this.reqAgent(this.apis.testSubmit, agentOptions)(postData);
      },
      text: '按钮2',
      actingRef: 'acting2',
      className: 'red'
    },
  ];
  render() {
    const { querying = false } = this.state;

    return (
      <div>
        <div className="card mb10">
          {/* 如果是异步获取表单初始化数据，需要 Loading */}
          <Loading loading={querying}>
            {
              querying ? null : (
                <FormLayout
                  tipInfo={{
                    title: '如果是异步获取表单初始化数据，需要 Loading'
                  }}
                  {...this.state}
                  btnConfig={this.btnConfig}
                  formOptions={this.formOptions}/>
              )
            }
          </Loading>
        </div>
        <div className="card">
          {/* 如果是已经定义好的数据，则不需要 Loading */}
          <FormLayout
            tipInfo={{
              title: '如果是已经定义好的数据，则不需要 Loading'
            }}
            {...this.state}
            formOptions={this.formOptions}
            btnConfig={this.btnConfig}/>
        </div>
      </div>
    );
  }
}
