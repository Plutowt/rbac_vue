# FastAPI RBAC Vue 前端

这是 FastAPI RBAC Template 项目的 Vue 前端实现，除了实现基本的用户、角色管理功能，还配置了一些额外的实用工具。

## 权限相关

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
  <div v-all-permission="['a', 'b', 'c']">当同时拥有 a b c 权限时，渲染这里的东西</div>

  <div v-any-permission="['d', 'e', 'f']">当拥有 d e f 任意权限时，渲染这里的东西</div>
  <div v-permission="['d', 'e', 'f']">当拥有 d e f 任意权限时，渲染这里的东西</div>
</div>
```

> [!WARNING]
> 如果组件会在挂载前就执行需要相应权限的操作，例如请求接口，那么应该使用组件方式，因为指令是在组件挂载之后才执行的。当指令执行时，组件内可能已经执行完相关权限的操作。

> [!TIP]
> 除了组件和指令，其实也可以通过可组合项函数 `useHasAnyPermission` 或 `useHasAllPermissions` 来检查当前用户是否具备相关的权限。

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
pnpm release
```
