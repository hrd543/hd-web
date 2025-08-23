import ts from 'typescript'
import url from 'url'

/**
 * Add static __file = ... to each class in the code.
 *
 * If filepath is provided, it will be used, otherwise
 * defaults to import.meta.url
 */
export const addFileToClass = (input: string, filepath?: string) => {
  return ts.transpileModule(input, {
    transformers: { before: [transformer(filepath)] },
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext
    }
  }).outputText
}

const buildImportMetaUrl = () =>
  ts.factory.createPropertyAccessExpression(
    ts.factory.createMetaProperty(
      ts.SyntaxKind.ImportKeyword,
      ts.factory.createIdentifier('meta')
    ),
    ts.factory.createIdentifier('url')
  )

const buildFilepath = (filepath: string) =>
  ts.factory.createStringLiteral(url.pathToFileURL(filepath).href)

const filepathKey = '__file'

const addToClassMembers = (
  members: ts.NodeArray<ts.ClassElement>,
  property: ts.PropertyDeclaration
) => {
  const existingIndex = members.findIndex(
    (member) =>
      ts.isPropertyDeclaration(member) &&
      member.name &&
      ts.isIdentifier(member.name) &&
      member.name.text === filepathKey &&
      member.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.StaticKeyword)
  )

  const membersCopy = [...members]

  if (existingIndex >= 0) {
    membersCopy[existingIndex] = property
  } else {
    membersCopy.push(property)
  }

  return membersCopy
}

const transformer =
  (filePath?: string): ts.TransformerFactory<ts.SourceFile> =>
  (context) => {
    return (sourceFile) => {
      const visitor = (node: ts.Node): ts.Node | undefined => {
        if (ts.isClassDeclaration(node)) {
          const staticProp = ts.factory.createPropertyDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
            filepathKey,
            undefined,
            undefined,
            filePath ? buildFilepath(filePath) : buildImportMetaUrl()
          )

          return ts.factory.updateClassDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            addToClassMembers(node.members, staticProp)
          )
        }

        return ts.visitEachChild(node, visitor, context)
      }

      const sourceFileVisitor = (sourceFile: ts.SourceFile): ts.SourceFile => {
        return ts.visitEachChild(sourceFile, visitor, context)
      }

      return ts.visitNode(sourceFile, sourceFileVisitor, ts.isSourceFile)
    }
  }
