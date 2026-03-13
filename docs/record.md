## 开发过程记录

### Session 1. 初始化项目（ulw）

提示词：
```text
我想要开发一个全新的前端项目，主要功能为AI知识问答及管理后台。
要求如下：
1. 技术栈为 Typescript + Vue3；
2. 组件库使用 Element Plus，其他组件均使用业界主流开源组件；
3. 采用生产级工程架构，结构清晰易拓展；
4. 需包含完整的测试代码，且所有测试代码均执行通过；
5. 支持i18n；

页面参考图：@登录页面示例.html、@问答页面示例.html
请按示例html实现页面，管理后台实现菜单切换逻辑即可，菜单项：Dashboard、知识库管理、智能问数、用户管理、模型配置。
```

操作：
/init -> 生成项目级Spec，手动添加测试代码要求：

> ### TDD Requirements
> For any new code or new features added, corresponding test code (including unit tests (UT) and end-to-end (E2E) tests) must be written simultaneously. Additionally, all test > code must be executed and pass successfully.

AI能力：
- 自动识别并部署开发环境
- 自动编译并处理编译错误、自动执行测试用例病修复错误

问题：
- 生成的页面与示例html样式有差异，需进一步调整；
- 初始化环境超时一直重试，导致任务卡死，需要人工排查干预。

### Session 2. 修复页面跳转错误、增加用户管理功能、提交代码至github

提示词1：
```text
输入用户名密码后点击登录，提示登录成功，页面未跳转，请修复该问题
```

提示词2：
```text
增加用户管理的增删改查功能。
```

提示词3：
```text
我创建了github仓库：https://github.com/cabbetlong/aidp。请帮我提交代码至远程仓库中。
```

AI能力：
- bug修复
- 基于 Session 1 中的规则，所有新增业务代码均生成相应的测试代码
- 自动执行git相关操作
