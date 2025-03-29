# 伯乐招聘平台 (Bole Recruitment Platform)

## 项目介绍

伯乐招聘平台是一个连接求职者与招聘者的综合性招聘系统。平台旨在为求职者提供便捷的求职渠道，同时为企业提供高效的人才筛选工具。

## 技术栈

### 后端技术
- Java 11
- Spring Boot 2.7.5
- Spring Security
- Spring Data JPA
- MySQL 8.0
- Redis
- WebSocket
- JWT (JSON Web Token)

### 开发工具
- Maven
- IntelliJ IDEA/Eclipse (推荐)
- Git

## 功能模块

### 用户管理
- 用户注册与登录
- 用户角色管理（求职者、招聘者、管理员）
- 个人信息管理

### 简历管理
- 简历创建与编辑
- 简历上传与下载
- 简历分享

### 职位管理
- 职位发布与编辑
- 职位搜索与筛选
- 职位收藏

### 企业管理
- 企业信息管理
- 企业认证
- 企业招聘管理

### 应聘管理
- 职位申请
- 申请状态跟踪
- 面试安排

### 消息系统
- 实时消息通知
- 系统公告
- 面试邀请

## 安装指南

### 环境要求
- JDK 11+
- MySQL 8.0+
- Redis 6.0+
- Maven 3.6+

### 数据库配置
1. 创建MySQL数据库：`bole_recruitment`
2. 配置数据库连接信息：修改`src/main/resources/application.properties`中的数据库连接信息

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bole_recruitment?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Redis配置
修改`src/main/resources/application.properties`中的Redis连接信息：

```properties
spring.redis.host=localhost
spring.redis.port=6379
```

### 构建与运行

```bash
# 克隆项目
git clone https://github.com/your-username/bole-recruitment.git

# 进入项目目录
cd bole-recruitment

# 构建项目
mvn clean package

# 运行项目
java -jar target/recruitment-0.0.1-SNAPSHOT.jar
```

访问：http://localhost:8080

## API文档

项目启动后，可通过以下方式访问API文档：

- API接口文档：待添加

## 项目结构

```
src/main/java/com/bole/recruitment/
├── config/                # 配置类
├── controller/            # 控制器
├── model/                 # 实体类
├── payload/               # 请求/响应对象
│   ├── request/           # 请求对象
│   └── response/          # 响应对象
├── repository/            # 数据访问层
├── security/              # 安全相关
└── BoleRecruitmentApplication.java  # 应用入口
```

## 待完善功能

- 服务层实现（Service层）
- 单元测试
- 前端界面
- 文件上传服务
- 搜索优化

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

待添加
