/**
 * API Version 1 的响应状态码
 */
export enum ApiV1StatusCode {
  /**
   * 成功响应
   */
  success = 1,
  /**
   * 不支持的用户
   */
  unsupported_user = 2,
  /**
   * 不支持的充值方式
   */
  unsupported_payment_method = 3,
  /**
   * 请尝试重新发送请求
   */
  try_again = 4,
  /**
   * 失败的请求
   */
  failed = 5,
  /**
   * 操作正在执行，请等待
   */
  waiting = 6,
  /**
   * 资源已经存在
   */
  already_exist = 7,
  /**
   * 找不到请求的资源
   */
  not_found = 8,
}
/**
 * 阶段状态
 */
export enum ApiV1StageStatusCode {
  /**
   * 正在处理
   */
  PENDING = 0,
  /**
   * 已经完成
   */
  SUCCESS = 1,
  /**
   * 已经取消
   */
  CANCELED = 2,
}
/**
 * 用户状态
 */
export enum ApiV1UserStatus {
  /**
   * 已启用
   */
  enabled = 0,
  /**
   * 已禁用
   */
  disabled = 1,
}
/**
 * 用户角色
 */
export enum ApiV1UserRole {
  /**
   * 管理员
   */
  admin = 0,
  /**
   * API 用户
   */
  api = 1,
  /**
   * Telegram 用户
   */
  telegram = 2,
  /**
   * GOIP 用户
   */
  goip = 3,
  /**
   * 业务员
   */
  salesperson = 4,
}
/**
 * 接码时的异常状态码
 */
export enum ApiV1SMSStatusCode {
  /**
   * 暂时无号
   */
  TEMPORARY_NO_NUMBER = -1,
  /**
   * Token不存在
   */
  TOKEN_NOT_EXIST = -2,
  /**
   * 项目ID不存在
   */
  PROJECT_ID_NOT_EXIST = -3,
  /**
   * 国家代码有误
   */
  COUNTRY_CODE_ERROR = -4,
  /**
   * 项目未审核
   */
  PROJECT_UNAPPROVED = -5,
  /**
   * 项目已禁用
   */
  PROJECT_DISABLED = -6,
  /**
   * 用户已禁用
   */
  USER_DISABLED = -7,
  /**
   * 请充值
   */
  INSUFFICIENT_BALANCE = -8,
  /**
   * 占号过多, 请补充余额
   * 未收到验证码强烈建议主动调用释放接口,
   * 否则在余额不多的情况下会提示占号过多
   */
  TOO_MANY_NUMBERS_OCCUPIED = -9,
  /**
   * 项目不允许指定取号
   */
  PROJECT_CANNOT_SPECIFY_NUMBER = -10,
  /**
   * 一次申请的号码过多或过少(最低一次申请一个号码)
   */
  INVALID_NUMBER_OF_NUMBERS_REQUESTED = -11,
  /**
   * 申请的频率过快
   */
  REQUEST_RATE_TOO_HIGH = -12,
  /**
   * 服务器内部错误, 请重试
   */
  INTERNAL_SERVER_ERROR = -13,
  /**
   * 卡不足, 请等待片刻后重试
   */
  INSUFFICIENT_CARDS = -14,
  /**
   * 暂未找到可用的号码, 请马上重试
   */
  NO_AVAILABLE_NUMBERS = -15,
}

/**
 * 启用状态
 */
export enum ApiV1ResultStatus {
  /**
   * 所有的状态
   */
  ALL = -1,
  /**
   * 禁用的状态
   */
  DISABLED = 0,
  /**
   * 启用的状态
   */
  ENABLED = 1,
}
