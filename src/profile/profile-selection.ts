import type {
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionSetNode,
} from 'graphql';
import { Kind } from 'graphql';

export const profileRelations = [
  'links',
  'skills',
  'experience',
  'projects',
] as const;

export type ProfileRelation = (typeof profileRelations)[number];
export type ProfileSelection = Record<ProfileRelation, boolean>;

function collectFields(
  selectionSet: SelectionSetNode | undefined,
  fragments: Record<string, FragmentDefinitionNode>,
  fields: Set<string>,
): void {
  for (const selection of selectionSet?.selections ?? []) {
    if (selection.kind === Kind.FIELD) {
      fields.add(selection.name.value);
    } else if (selection.kind === Kind.INLINE_FRAGMENT) {
      collectFields(selection.selectionSet, fragments, fields);
    } else {
      const fragment = fragments[selection.name.value];
      if (fragment) {
        collectFields(fragment.selectionSet, fragments, fields);
      }
    }
  }
}

export function getProfileSelection(
  info: Pick<GraphQLResolveInfo, 'fieldNodes' | 'fragments'>,
): ProfileSelection {
  const fields = new Set<string>();
  for (const node of info.fieldNodes) {
    collectFields(node.selectionSet, info.fragments, fields);
  }

  return Object.fromEntries(
    profileRelations.map((relation) => [relation, fields.has(relation)]),
  ) as ProfileSelection;
}
