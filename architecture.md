---
id: digital-card-architecture
type: architecture-design
status: active
title: Архитектура цифровой визитки
parent: digital-business-card
---

# Архитектура цифровой визитки

## Overview

Backend-only приложение предоставляет публичный read-only GraphQL API одного профиля. NestJS отвечает за модульность и GraphQL-контракт, Prisma — за доступ к PostgreSQL и миграции. Apollo Sandbox — единственный пользовательский интерфейс; frontend, CRUD, CMS и аутентификация отсутствуют.

## GraphQL Contract

Схема описывается code-first через TypeScript-модели NestJS. Сгенерированный SDL не редактируется вручную.

```graphql
type Query {
  profile: Profile!
}

type Profile {
  name: String!
  description: String!
  links: [ProfileLink!]!
  skills: [Skill!]!
  experience: [Experience!]!
  projects: [Project!]!
}

type ProfileLink {
  label: String!
  url: String!
}

type Skill {
  name: String!
}

type Experience {
  company: String!
  position: String!
  startedAt: DateTime!
  endedAt: DateTime
  achievements: [String!]!
}

type Project {
  name: String!
  url: String!
}
```

`profile` возвращает единственную визитку без аргументов. `endedAt: null` обозначает текущее место работы. Публичные идентификаторы не нужны контракту и не раскрываются. Связи имеют детерминированный порядок: ссылки и навыки — по названию, проекты — по имени, опыт — по убыванию `startedAt`.

## Module Boundaries

- `ProfileResolver` владеет GraphQL-контрактом и преобразует selection set запроса в декларативный набор запрошенных связей, включая fragment-определения.
- `ProfileService` владеет чтением единственного профиля и ошибкой его отсутствия. Он не зависит от GraphQL или Prisma.
- `ProfileRepository` преобразует запрошенные связи в Prisma `include`, выполняет запрос и задаёт сортировку. Он не зависит от GraphQL.
- Инфраструктурный Prisma-модуль владеет подключением к базе; отдельные repository для каждой дочерней сущности не создаются.

## Nested Query Loading

Загружаются только связи, присутствующие в selection set. Для одиночного профиля запрос ограничен одним чтением профиля и числом выбранных типов связей; роста запросов по числу навыков, мест работы или проектов нет.

DataLoader не используется: батчить несколько профилей не требуется, а field resolvers добавили бы обращения к базе без выигрыша. Принудительный join всех связей также не используется, чтобы не создавать декартово произведение независимых списков. Оптимизация означает отсутствие N+1 и отказ от чтения невыбранных связей, а не обязательно один SQL-запрос.

## Persistence and Startup

PostgreSQL запускается через Docker Compose вместе с приложением. Prisma Migrate — единственный механизм изменения схемы; миграции входят в репозиторий и production-образ.

Профиль имеет стабильный внутренний идентификатор. Профессиональные ссылки — отдельная связь, чтобы не ограничивать владельца предопределёнными сервисами. Достижения хранятся как массив строк внутри записи опыта; отдельная сущность им не нужна.

Данные владельца находятся в TypeScript-файле seed. При каждом запуске одна транзакция обновляет профиль и синхронизирует его связи, поэтому повторный запуск не создаёт дублей и приводит базу к данным seed. Entrypoint выполняет последовательно `prisma migrate deploy`, seed и запуск NestJS. Ошибка миграции или seed останавливает старт: приложение не должно работать с неподготовленной или пустой визиткой.

## Generated Artifacts

GraphQL SDL и Prisma Client являются производными артефактами и не редактируются вручную. Их исходники — TypeScript-модели и `schema.prisma` — форматируются общими инструментами проекта. Это сохраняет единый источник контракта и исключает ручную синхронизацию generated-кода.

## Verification

Unit-тесты покрывают selection set с fragments и формирование Prisma `include`. Интеграционный GraphQL-тест проверяет вложенное чтение. Smoke-проверка Docker подтверждает чистый запуск, доступность Apollo Sandbox и отсутствие дублей после повторного запуска.
