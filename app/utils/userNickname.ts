import type { BasicUserInfo } from '~/api/v1/common'

export default (data: any) => {
  if (data.id) {
    const data_ = data as BasicUserInfo['user']
    return data_?.nickname ? `${data_.nickname}(${data?.username})` : data?.username
  }

  return data?.user?.nickname ? `${data.user?.nickname}(${data.user?.username})` : data?.user?.username
}
