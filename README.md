# FastAPI RBAC Vue 前端

这是 FastAPI RBAC Template 项目的 Vue 前端实现，除了实现基本的用户、角色管理功能，还配置了一些额外的实用工具。

## 从 OpenAPI 生成 SDK

根据 package.json 里面定义的 `openapi-ts` 命令可以用于从 OpenAPI 规范生成 SDK。

如果觉得麻烦的话也可以不用这个，自己用fetch或者axios什么的，但是那样的话要注意处理没登陆的情况还有登录身份失效的情况。

### openapi-ts 命令

`openapi-ts` 命令会读取 openapi-ts.config.ts 文件里的配置，根据里面的配置从指定的 OpenAPI 规范生成 SDK，生成后的代码会存到 app/api/v1_1 下面。

openapi-ts.config.ts 文件会从 .env[.development|production] 文件的 `OPENAPI_SPEC_URL` 读取 OpenAPI 规范地址。对于开发者来说，可以创建一个 .env.development 文件，然后填 `OPENAPI_SPEC_URL=(后端的 openapi.json 文件地址)`。

### SDK 调用

可以通过 app/composables/useApiV1Client.ts 文件里自动导出的 `useApiV1Client` 函数来调用生成的 SDK。在后端项目模板中，有一个用于创建用户的接口，他的 openapi operation id 是 user_create（具体的生成规则可以参考仓库里的 [id生成函数](https://github.com/wisetelecom/fastapi-rbac-template/blob/8456c3b9c71aff8cdb934bb71ac36aa0230320ef/src/main.py#L15)），经过 SDK 生成器时，snake 命名法会被转为驼峰命名法，因为此为 `userCreate`，调用方式如下：

```ts
const { userCreate } = useApiV1Client()

const {
  // 响应体
  data,
  // 响应异常内容(如400、401、403等响应码的响应体内容)
  error
} = await userCreate({ body: { 请求体 } })

console.log(data, error)
```

> [!WARNING]
> 值 `data` 和 `error` 通常只有一个值有效，当其中一个有值时，另一个通常是 `undefined`。

### 可能的问题

#### CORS ...？

生成 SDK 的过程是调用命令行程序访问 OpenAPI 规范，所以无需考虑跨域问题，但是调用 SDK 时所请求的后端接口地址，则需要考虑。

#### 修改请求的后端接口地址

考虑到调用时处于 nuxt 的运行时状态，所以在 app/composables/useApiV1Client.ts 中配置了请求的后端接口地址从 `useRuntimeConfig().config.public.apiV1Base` 获取。由于这是一个从环境变量获取的配置，所以也可以在 `.env[.development|production]` 中修改 `NUXT_PUBLIC_API_V1_BASE` 值。

#### OpenAPI 规范文件和后端接口地址不一致会怎么样？

不会怎么样，类似 调用函数与传给函数的参数 这种行为，typescript 提示参数异常，如果非要执行，后端接口应该也会报错。

## CORS 问题

当前端与后端不在同一 host 地址下时会出现这个问题，例如前端在 192.168.1.10:3000 这个页面上访问 192.168.1.11:8000 这个后端，那么就会出现跨域资源请求（CORS）的问题。要解决这个问题，nuxt 有一个给开发者准备的解决方案。

在 `nuxt.config.ts` 中，可以配置 `vite.server.proxy` 来代理后端地址，项目默认配置使用 `/api` 代理环境变量下 `NUXT_PUBLIC_API_PROXY_TARGET` 的值。

因此，假设你的前端运行在 `192.168.1.10:3000` 下，后端运行在 `192.168.1.11:8000`，那么可以像这样配置环境变量：

```
NUXT_PUBLIC_API_V1_BASE=/api
NUXT_PUBLIC_API_PROXY_TARGET=http://192.168.1.11:8000
OPENAPI_SPEC_URL=http://192.168.1.11:8000/openapi.json
```

前端此时调用 SDK 就会去访问 `/api`，而非 `192.168.1.11:8000`，因此也就避免了 CORS 的问题。

## 权限相关

### 可组合项

#### useHasAnyPermission

`useHasAnyPermission` 函数接收任意数量的权限参数，当前用户只要拥有参数中任意一项权限，函数即返回 `true`，否则 `false`。

#### useHasAllPermissions

`useHasAllPermissions` 函数接收任意数量的权限参数，如果当前用户同时拥有参数所指的权限，函数就返回 `true`，否则 `false`。

### 通过页面元数据验证用户权限

在页面元数据中定义页面所需的权限，可以实现页面级别的权限校验。当用户尝试请求自己无权限访问的页面时，将会跳转到 `/forbidden` 路由下。另外，菜单中的路由项，也会根据当前用户所具备的权限进行条件渲染。

#### 示例

创建一个需要 `demo:create` 权限才能访问的页面。

在 `app/pages` 目录下，创建 `demo-create.vue` 文件，填入如下内容：

```vue
<script>
definePageMeta({
  permissions: ['demo:create'],
})
</script>
```

如此便创建了一个需要 `demo:create` 权限才能访问的界面，此外，如果用户具有此权限的父权限，那么也同样可以访问此页面。例如，用户没有 `demo:create` 权限，但是有 `demo` 权限，也可以访问这个页面。

> [!WARNING]
> 如果在页面元数据中同时声明多个权限，那么用户只需具备其中任意一项权限即可访问该界面。

### 条件渲染组件

项目提供了两种方式来处理组件的权限检查，一种是组件，一种是指令。

#### 组件使用

提供了两种组件进行权限验证，分别是：

- `PermissionCheckAll`：当具备所有所需权限时渲染
- `PermissionCheckAny`：当具备任意所需权限时渲染

示例：

```vue
<div>
  <PermissionCheckAll :pass="['a', 'b', 'c']">
    当同时拥有 a b c 权限时，渲染这里的东西
  </PermissionCheckAll>

  <PermissionCheckAny :pass="['d', 'e', 'f']">
    当拥有 d e f 任意权限时，渲染这里的东西
  </PermissionCheckAny>
</div>
```

#### 指令使用

类似组件，指令也提供了两种，分别是：

- `v-all-permission`：当具备所有所需权限时渲染
- `v-any-permission`：当具备任意所需权限时渲染。因为这种更常用，所以也定义了更短实现 `v-permission`

示例：

```html
<div>
  <div v-all-permission="['a', 'b', 'c']">当同时拥有 a b c 权限时，显示这里的东西</div>

  <div v-any-permission="['d', 'e', 'f']">当拥有 d e f 任意权限时，显示这里的东西</div>
  <div v-permission="['d', 'e', 'f']">当拥有 d e f 任意权限时，显示这里的东西</div>
</div>

```

> [!WARNING]
> 如果组件会在挂载前就执行需要相应权限的操作，例如请求接口，那么应该使用组件方式，因为指令是在组件挂载之后才会执行。

## 菜单

要新增菜单项，需要在 `app/composables/useMenu.s` 中添加，当添加菜单项的是页面时，会在生成实际菜单时通过 `permissionFilter` 函数来过滤出用户实际有权限访问的菜单项。如果登录用户只有 `users` 权限，那么他是无法看到需要 `roles` 权限的菜单项的。

## 安装依赖

```sh
pnpm install
```

## 运行开发服务器

```sh
pnpm run dev
```

## 打包构建

```sh
pnpm run build
```

## 提交更新

```sh
git add {变更文件}
git commit

# 更新版本
git push
```

## 发布新版本

```sh
pnpm release
```

## 其他

package.json 中有个 `openapi` 命令，这个因为一些历史原因遗留下来的，具体功能已经弃用，不应再使用，会在后续版本中随时删除，不要使用。
