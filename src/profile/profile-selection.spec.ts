import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  OperationDefinitionNode,
} from 'graphql';
import { Kind, parse } from 'graphql';
import { getProfileSelection } from './profile-selection.js';

function createInfo(
  source: string,
): Pick<GraphQLResolveInfo, 'fieldNodes' | 'fragments'> {
  const document = parse(source);
  const operation = document.definitions.find(
    (definition): definition is OperationDefinitionNode =>
      definition.kind === Kind.OPERATION_DEFINITION,
  );
  if (!operation) {
    throw new Error('Query operation is required');
  }

  const fragments = Object.fromEntries(
    document.definitions
      .filter(
        (definition): definition is FragmentDefinitionNode =>
          definition.kind === Kind.FRAGMENT_DEFINITION,
      )
      .map((fragment) => [fragment.name.value, fragment]),
  );

  return {
    fieldNodes: operation.selectionSet.selections as FieldNode[],
    fragments,
  };
}

describe('getProfileSelection', () => {
  it('selects only explicitly requested relations', () => {
    const selection = getProfileSelection(
      createInfo('{ profile { name skills { name } } }'),
    );

    expect(selection).toEqual({
      links: false,
      skills: true,
      experience: false,
      projects: false,
    });
  });

  it('reads aliases, inline fragments and named fragments', () => {
    const selection = getProfileSelection(
      createInfo(`
        query {
          profile {
            ...ProfileParts
            ... on Profile { experience { company } }
            projectsAlias: projects { name }
          }
        }
        fragment ProfileParts on Profile { links { label url } }
      `),
    );

    expect(selection).toEqual({
      links: true,
      skills: false,
      experience: true,
      projects: true,
    });
  });
});
