# GraphQL Resources

## Knowledge

- [GraphQL: Introduction to GraphQL](https://graphql.org/learn/introduction/)
  Официальное определение GraphQL как языка запросов и server-side runtime, независимого от базы данных. Основной источник для первого урока.
- [GraphQL: Schemas and Types](https://graphql.org/learn/schema/)
  Object types, scalars, lists, Non-Null и корневые operation types. Использовать при чтении `src/schema.gql`.
- [GraphQL: Queries](https://graphql.org/learn/queries/)
  Поля, selection sets, аргументы, имена операций, variables и fragments. Использовать для практики запросов.
- [GraphQL: Execution](https://graphql.org/learn/execution/)
  Связь полей с resolver-функциями, асинхронное выполнение и формирование ответа. Использовать для трассировки запроса через проект.
- [GraphQL: Validation](https://graphql.org/learn/validation/)
  Проверка документа по схеме до начала выполнения. Использовать при разборе ошибок запросов.
- [NestJS: GraphQL + TypeScript](https://docs.nestjs.com/graphql/quick-start)
  Code-first, декораторы `@ObjectType`, `@Field`, `@Resolver`, `@Query` и генерация resolver map. Использовать для связи GraphQL с NestJS.
- [Apollo Server](https://www.apollographql.com/docs/apollo-server)
  Документация GraphQL-сервера, который проект подключает через NestJS. Нужна позже для HTTP, Sandbox, ошибок и production-настроек.

## Wisdom (Communities)

- [GraphQL Community](https://graphql.org/community/)
  Официальный каталог рабочих групп, Discord и других площадок. Использовать для вопросов о практиках и развитии спецификации.
- [Stack Overflow: graphql](https://stackoverflow.com/questions/tagged/graphql)
  Практические вопросы по реализациям GraphQL; ответы сверять с официальной документацией и версией библиотек.

## Gaps

- Для следующих уроков понадобятся официальные материалы по GraphQL over HTTP, безопасности запросов и диагностике N+1 применительно к используемым версиям NestJS/Apollo.
