/**
 * 基础 Action 组件, 主要实现了请求方式, 包含表单验证的方式
 * @Alex
 */

import React, {Component, PureComponent} from 'react';

import { Call, ToBasicUnitMoney, DebounceClass } from 'basic-helper';
import { getUrlParams } from 'uke-request';

import APIs from '../apis';
import { getFields, setFields, getFieldsConfig } from './fields';
import * as paginHelper from '../utils/pagination-helper';

export default class ActionBasic extends Component {
  getFields = getFields;
  setFields = setFields;
  getFieldsConfig = getFieldsConfig;
  defaultActingRef = 'loading';
  apis = APIs;
  getUrlParams = getUrlParams;
  paginHelper = paginHelper;
  routerParams = getUrlParams();
  constructor(props) {
    super(props);

    // const {defaultActingRef} = this;

    this.state = {
      loading: false,
      hasErr: false,
      resDesc: '',
      resData: {},
      records: [],
      pagingInfo: paginHelper.getDefPagin(),
    };
  }
  componentWillUnmount() {
    this.__unmount = true;
  }
  getStateBeforePost(params, actingRef) {
    return Object.assign({}, {
      [actingRef]: true,
    }, params);
  }
  getResDescInfo(resData = {}) {
    const resInfo = {
      hasErr: !!resData.err,
      resDesc: resData.err
    };
    return resInfo;
  }
  toBasicUnitMoney(money) {
    return ToBasicUnitMoney(money);
  }
  defaultStateAfterPost(resData, actingRef) {
    let records = resData.data || [];
    let pagingInfo = resData.paging || this.state.pagingInfo || paginHelper.getDefPagin();

    return Object.assign({}, this.getResDescInfo(resData), {
      [actingRef]: false,
      resData,
      records,
      pagingInfo,
    });
  }
  showResDesc() {
    /**
     * 可以通过重写此接口
     * @type {Object}
     */
  }
  delayExec(...args) {
    if(!this._delayExec) this._delayExec = new DebounceClass();
    return this._delayExec.exec(...args);
  }
  stateSetter(state) {
    if(!this.__unmount) this.setState(state);
  }
  async _sendData(options) {
    /**
     * 参数说明
     * method@String          请求的接口
     * ---------------------------------
     * data@Object            请求的 Data，一般由继承 Helper 组件包装成功后传入，
     *                        参见 action-form-basic || action-report-basic
     *                        action-form-basic 处理大部分表单的统一验证
     *                        action-report-basic 处理大部分报表的查询条件业务
     * ---------------------------------
     * stateBeforePost@Object  追加 state 到请求发起前的 setState
     * stateAfterPostHook@func 追加 state 到请求完成后的 setState，必须返回一个 Object
     * actingRef@String        请求状态的标记为，默认是 loading，兼容记录多个接口的请求状态
     * recordsRef@String       请求响应的数据存储字段标识，默认为 Results， 此默认字段为与服务端接口的约定，有服务端没有处理成 Results 的特殊情况
     * onSuccess@Func          业务请求成功的 callback
     * onRes@Func              发起的请求成功，包括业务错误
     */
    const {
      path, data = {}, onGetResInfo,
      stateBeforePost = {},
      stateAfterPostHook = (res) => {},
      actingRef = 'loading',
      onSuccess, onRes
    } = options;

    this.stateSetter(this.getStateBeforePost(stateBeforePost, actingRef));

    const sendData = {data};

    const sendDataRes = await window.$request.send({sendData, path, headers: {
      // 'Content-Type': 'application/json; charset=utf-8'
    }});

    if(sendDataRes) {
      Call(onRes, sendDataRes);
      Call(onSuccess, sendDataRes.data);
      Call(onGetResInfo, this.getResDescInfo(sendDataRes));
      this.stateSetter(
        Object.assign({},
          this.defaultStateAfterPost(sendDataRes, actingRef),
          Call(stateAfterPostHook, sendDataRes)
        )
      );
    } else {
      // 其他错误处理
      this.stateSetter({loading: false}); // 取消 loading 状态
    }
  }
}
